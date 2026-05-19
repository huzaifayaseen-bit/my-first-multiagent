from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from database import init_db
from models import TaskCreate, TaskResponse
from data import create_task, get_all_tasks, get_task_by_id


app = FastAPI(
    title="Agentic Academic Assistant API",
    description="Backend service for the Multi-Agent University Project Assistant.",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Deployment ke baad isko frontend URL se restrict kar sakte ho
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


@app.get("/")
def root():
    return {
        "message": "Agentic Academic Assistant API is running",
        "docs": "/docs",
        "health": "/health",
        "tasks": "/tasks",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "message": "Backend is running",
    }


@app.post("/tasks", response_model=TaskResponse)
def create_task_endpoint(task: TaskCreate):
    return create_task(task)


@app.get("/tasks", response_model=List[TaskResponse])
def list_tasks():
    return get_all_tasks()


@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: str):
    task = get_task_by_id(task_id)

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    return task