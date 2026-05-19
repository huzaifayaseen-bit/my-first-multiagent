from datetime import datetime
from typing import List

from models import Agent, AgentLog, FinalOutput, TaskCreate

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


def create_final_output(task: TaskCreate, logs: List[AgentLog]) -> FinalOutput:
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
