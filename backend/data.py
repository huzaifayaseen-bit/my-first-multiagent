from datetime import datetime
from typing import List, Optional
from uuid import uuid4

from agents import build_agent_states, create_final_output, run_agents
from database import get_db_session
from models import (
    Agent,
    AgentLog,
    AgentLogRecord,
    FinalOutput,
    Section,
    Task,
    TaskCreate,
    TaskResponse,
    TaskStatus,
)


def _task_to_response(task: Task) -> TaskResponse:
    final_output = task.final_output or {}
    generated_at = final_output["generatedAt"]
    if isinstance(generated_at, str):
        generated_at = datetime.fromisoformat(generated_at)

    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        type=task.type,
        subject=task.subject,
        due_date=task.due_date,
        status=TaskStatus(task.status),
        progress=task.progress,
        createdAt=task.created_at,
        updatedAt=task.updated_at,
        agents=[Agent(**agent) for agent in task.agents],
        logs=[
            AgentLog(
                agent=log.agent,
                step=log.step,
                status=log.status,
                output=log.output,
                timestamp=log.timestamp,
            )
            for log in task.logs
        ],
        final_output=FinalOutput(
            title=final_output["title"],
            summary=final_output["summary"],
            sections=[Section(**section) for section in final_output["sections"]],
            references=final_output["references"],
            wordCount=final_output["wordCount"],
            generatedAt=generated_at,
        ),
    )


def get_all_tasks() -> List[TaskResponse]:
    with get_db_session() as db:
        tasks = db.query(Task).order_by(Task.created_at.desc()).all()
        return [_task_to_response(task) for task in tasks]


def get_task_by_id(task_id: str) -> Optional[TaskResponse]:
    with get_db_session() as db:
        task = db.query(Task).filter(Task.id == task_id).first()
        if task is None:
            return None
        return _task_to_response(task)


def create_task(payload: TaskCreate) -> TaskResponse:
    created_at = datetime.utcnow()
    logs = run_agents(payload)
    agents = build_agent_states()
    final_output = create_final_output(payload, logs)
    task_id = str(uuid4())
    updated_at = datetime.utcnow()

    task = Task(
        id=task_id,
        title=payload.title,
        description=payload.description,
        type=payload.type,
        subject=payload.subject,
        due_date=payload.due_date,
        status=TaskStatus.completed.value,
        progress=100,
        created_at=created_at,
        updated_at=updated_at,
        agents=[agent.dict() for agent in agents],
        final_output={
            **final_output.dict(),
            "generatedAt": final_output.generatedAt.isoformat(),
        },
    )
    task.logs = [
        AgentLogRecord(
            task_id=task_id,
            agent=log.agent,
            step=log.step,
            status=log.status,
            output=log.output,
            timestamp=log.timestamp,
        )
        for log in logs
    ]

    with get_db_session() as db:
        db.add(task)
        db.flush()
        db.refresh(task)
        return _task_to_response(task)
