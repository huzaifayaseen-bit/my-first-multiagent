from enum import Enum
from typing import List, Optional
from datetime import datetime

from pydantic import BaseModel
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from database import Base

class TaskStatus(str, Enum):
    queued = "queued"
    in_progress = "in_progress"
    completed = "completed"
    failed = "failed"

class Agent(BaseModel):
    id: str
    name: str
    description: str
    status: str
    progress: int

class AgentLog(BaseModel):
    agent: str
    step: str
    status: str
    output: str
    timestamp: datetime

class Section(BaseModel):
    heading: str
    content: str

class FinalOutput(BaseModel):
    title: str
    summary: str
    sections: List[Section]
    references: List[str]
    wordCount: int
    generatedAt: datetime

class TaskCreate(BaseModel):
    title: str
    description: str
    type: str
    subject: str
    due_date: Optional[str] = None

class TaskResponse(BaseModel):
    id: str
    title: str
    description: str
    type: str
    subject: str
    due_date: Optional[str] = None
    status: TaskStatus
    progress: int
    createdAt: datetime
    updatedAt: datetime
    agents: List[Agent]
    logs: List[AgentLog]
    final_output: FinalOutput


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    type = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    due_date = Column(String, nullable=True)
    status = Column(String, nullable=False)
    progress = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    agents = Column(JSON, nullable=False)
    final_output = Column(JSON, nullable=False)

    logs = relationship(
        "AgentLogRecord",
        back_populates="task",
        cascade="all, delete-orphan",
        order_by="AgentLogRecord.timestamp",
    )


class AgentLogRecord(Base):
    __tablename__ = "agent_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    task_id = Column(String, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    agent = Column(String, nullable=False)
    step = Column(Text, nullable=False)
    status = Column(String, nullable=False)
    output = Column(Text, nullable=False)
    timestamp = Column(DateTime, nullable=False, default=datetime.utcnow)

    task = relationship("Task", back_populates="logs")
