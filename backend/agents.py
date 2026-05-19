from datetime import datetime
import json
import os
from pathlib import Path
from typing import List
from urllib.parse import urlparse

from dotenv import load_dotenv
from openai import APIConnectionError, APIError, APITimeoutError, OpenAI

from models import Agent, AgentLog, FinalOutput, TaskCreate

BACKEND_DIR = Path(__file__).resolve().parent
load_dotenv(dotenv_path=BACKEND_DIR / ".env", override=True)

AGENT_SEQUENCE = [
    "Planner Agent",
    "Research Agent",
    "Writer Agent",
    "Reviewer Agent",
    "Formatter Agent",
    "Summary Agent",
]

AGENT_STEPS = {
    "Planner Agent": "Create a study plan and task structure.",
    "Research Agent": "Gather relevant academic references and sources.",
    "Writer Agent": "Draft the main academic content for the task.",
    "Reviewer Agent": "Review the content for accuracy and quality.",
    "Formatter Agent": "Format the output according to academic style.",
    "Summary Agent": "Summarize the final results into a concise conclusion.",
}

AGENT_OUTPUTS = {
    "Planner Agent": "Outlined milestones, resources, and deadlines for the project.",
    "Research Agent": "Collected key references, citations, and topic insights.",
    "Writer Agent": "Produced an academic draft with structured sections.",
    "Reviewer Agent": "Checked the draft for clarity, coherence, and errors.",
    "Formatter Agent": "Applied consistent academic formatting and citation style.",
    "Summary Agent": "Generated a concise summary of the completed task.",
}

AGENT_DESCRIPTIONS = {
    "Planner Agent": "Breaks the task into structured steps and outlines the deliverable.",
    "Research Agent": "Gathers references, citations, and supporting material.",
    "Writer Agent": "Drafts the full content based on the plan and research.",
    "Reviewer Agent": "Checks grammar, logic, plagiarism risk, and academic tone.",
    "Formatter Agent": "Applies academic formatting, headings, and citations style.",
    "Summary Agent": "Produces a concise abstract and key takeaways.",
}

DEFAULT_AI_BASE_URL = "https://llm.atxp.ai/v1"
DEFAULT_AI_MODEL = "atxp/claude-opus-4-7"


def _ai_model() -> str:
    return os.getenv("AI_MODEL", DEFAULT_AI_MODEL)


def _ai_base_url() -> str:
    return os.getenv("AI_BASE_URL", DEFAULT_AI_BASE_URL)


def _atxp_connection() -> str | None:
    return os.getenv("ATXP_CONNECTION")


def _create_openai_client() -> OpenAI:
    atxp_connection = _atxp_connection()
    if not atxp_connection:
        raise RuntimeError("ATXP_CONNECTION is not configured")

    return OpenAI(
        api_key=atxp_connection,
        base_url=_ai_base_url(),
        timeout=45,
    )


def _base_host_from_client(client: OpenAI) -> str:
    return urlparse(str(client.base_url)).hostname or "unknown"


def _log_ai_mode_enabled(client: OpenAI) -> None:
    print("Provider: ATXP")
    print(f"AI base host: {_base_host_from_client(client)}")
    print(f"Model: {_ai_model()}")
    print(f"ATXP connection exists: {_atxp_connection() is not None}")


def _task_context(task: TaskCreate) -> str:
    return (
        f"Title: {task.title}\n"
        f"Type: {task.type}\n"
        f"Subject: {task.subject}\n"
        f"Description: {task.description}\n"
        f"Due date: {task.due_date or 'Not provided'}"
    )


def _call_ai(prompt: str, *, temperature: float = 0.4) -> str:
    client = _create_openai_client()
    response = client.chat.completions.create(
        model=_ai_model(),
        temperature=temperature,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an academic multi-agent assistant. Generate useful, "
                    "specific academic text. Do not mention that you are an AI model."
                ),
            },
            {"role": "user", "content": prompt},
        ],
    )

    content = response.choices[0].message.content
    if not content:
        raise RuntimeError("AI response did not include message content")
    return content.strip()


def _redact_secret(value: str) -> str:
    atxp_connection = _atxp_connection()
    if atxp_connection:
        return value.replace(atxp_connection, "[REDACTED_ATXP_CONNECTION]")
    return value


def _log_ai_request_error(error: Exception) -> None:
    print(f"AI request failed: {_redact_secret(str(error))}")


def _safe_call_ai(prompt: str, *, temperature: float = 0.4) -> str | None:
    try:
        content = _call_ai(prompt, temperature=temperature)
        print("AI request success")
        return content
    except (
        RuntimeError,
        APIConnectionError,
        APIError,
        APITimeoutError,
        TimeoutError,
        KeyError,
        json.JSONDecodeError,
    ) as error:
        _log_ai_request_error(error)
        return None


def run_dummy_agents(task: TaskCreate) -> List[AgentLog]:
    logs: List[AgentLog] = []
    for agent_name in AGENT_SEQUENCE:
        output = f"{AGENT_OUTPUTS[agent_name]} (Task: {task.title})"
        log = AgentLog(
            agent=agent_name,
            step=AGENT_STEPS[agent_name],
            status="completed",
            output=output,
            timestamp=datetime.utcnow(),
        )
        logs.append(log)
    return logs


def run_ai_agents(task: TaskCreate) -> List[AgentLog] | None:
    if not _atxp_connection():
        return None

    _log_ai_mode_enabled(_create_openai_client())

    logs: List[AgentLog] = []
    previous_outputs: List[str] = []
    for agent_name in AGENT_SEQUENCE:
        prompt = (
            f"Task context:\n{_task_context(task)}\n\n"
            f"Agent: {agent_name}\n"
            f"Agent responsibility: {AGENT_STEPS[agent_name]}\n"
            f"Previous agent outputs:\n{chr(10).join(previous_outputs) or 'None yet.'}\n\n"
            "Write the output this agent should produce. Keep it concise, concrete, "
            "and directly useful for completing the task. Return plain text only."
        )
        output = _safe_call_ai(prompt)
        if output is None:
            return None

        logs.append(
            AgentLog(
                agent=agent_name,
                step=AGENT_STEPS[agent_name],
                status="completed",
                output=output,
                timestamp=datetime.utcnow(),
            )
        )
        previous_outputs.append(f"{agent_name}: {output}")

    return logs


def run_agents(task: TaskCreate) -> List[AgentLog]:
    return run_ai_agents(task) or run_dummy_agents(task)


def build_agent_states() -> List[Agent]:
    return [
        Agent(
            id=agent_name.lower().replace(" ", "-"),
            name=agent_name,
            description=AGENT_DESCRIPTIONS[agent_name],
            status="completed",
            progress=100,
        )
        for agent_name in AGENT_SEQUENCE
    ]


def create_dummy_final_output(task: TaskCreate, logs: List[AgentLog]) -> FinalOutput:
    return FinalOutput(
        title=task.title,
        summary=(
            f"This academic assistant completed the task in six stages, producing a polished deliverable for {task.subject}."
        ),
        sections=[
            {
                "heading": "1. Task Overview",
                "content": (
                    f"{task.title} is processed with a structured plan, research, writing, review, formatting, and summarization."
                ),
            },
            {
                "heading": "2. Key Contributions",
                "content": (
                    f"The task includes a clear academic structure for {task.subject} and a professionally formatted final output."
                ),
            },
            {
                "heading": "3. Output Summary",
                "content": (
                    f"This assistant generated an academic-ready deliverable for the topic: {task.title}."
                ),
            },
        ],
        references=[
            "Agentic Academic Assistant generated content using internal reasoning steps.",
            "Dummy multi-agent workflow persisted through the configured PostgreSQL database.",
        ],
        wordCount=1500,
        generatedAt=datetime.utcnow(),
    )


def _parse_final_output(content: str) -> dict:
    content = content.strip()
    if content.startswith("```"):
        lines = content.splitlines()
        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        content = "\n".join(lines).strip()

    data = json.loads(content)
    if not isinstance(data.get("sections"), list) or not isinstance(data.get("references"), list):
        raise ValueError("Invalid final output shape")
    return data


def create_ai_final_output(task: TaskCreate, logs: List[AgentLog]) -> FinalOutput | None:
    if not _atxp_connection():
        return None

    agent_outputs = "\n\n".join(f"{log.agent}: {log.output}" for log in logs)
    prompt = (
        f"Task context:\n{_task_context(task)}\n\n"
        f"Agent outputs:\n{agent_outputs}\n\n"
        "Create the final academic deliverable as strict JSON with this exact shape:\n"
        "{\n"
        '  "title": "string",\n'
        '  "summary": "string",\n'
        '  "sections": [{"heading": "string", "content": "string"}],\n'
        '  "references": ["string"],\n'
        '  "wordCount": 0\n'
        "}\n"
        "Use 3 to 5 substantive sections. References may include suggested credible "
        "source types or citations relevant to the subject. Return JSON only."
    )
    content = _safe_call_ai(prompt, temperature=0.3)
    if content is None:
        return None

    try:
        data = _parse_final_output(content)
        return FinalOutput(
            title=str(data["title"]),
            summary=str(data["summary"]),
            sections=data["sections"],
            references=[str(reference) for reference in data["references"]],
            wordCount=int(data["wordCount"]),
            generatedAt=datetime.utcnow(),
        )
    except (KeyError, TypeError, ValueError, json.JSONDecodeError):
        return None


def create_final_output(task: TaskCreate, logs: List[AgentLog]) -> FinalOutput:
    return create_ai_final_output(task, logs) or create_dummy_final_output(task, logs)
