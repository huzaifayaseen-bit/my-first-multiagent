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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    try:
        init_db()
        print("Database initialized successfully")
    except Exception as e:
        print("Database initialization failed:", str(e))


@app.get("/")
def root():
    return {
        "message": "Agentic Academic Assistant API is running",
        "docs": "/docs",
        "health": "/health",
        "tasks": "/tasks",
        "debug_env": "/debug-env",
        "debug_db": "/debug-db",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "message": "Backend is running",
    }


@app.get("/debug-env")
def debug_env():
    import os

    return {
        "has_database_url": bool(os.getenv("DATABASE_URL")),
        "has_database_postgres_url": bool(os.getenv("DATABASE_POSTGRES_URL")),
        "has_database_url_unpooled": bool(os.getenv("DATABASE_URL_UNPOOLED")),
        "has_database_postgres_prisma_url": bool(os.getenv("DATABASE_POSTGRES_PRISMA_URL")),
    }


@app.get("/debug-db")
def debug_db():
    try:
        from database import get_engine

        with get_engine().connect() as connection:
            result = connection.exec_driver_sql("SELECT 1").scalar()

        return {
            "database": "connected",
            "result": result,
        }

    except Exception as e:
        return {
            "database": "failed",
            "error": str(e),
        }


@app.post("/tasks", response_model=TaskResponse)
def create_task_endpoint(task: TaskCreate):
    try:
        return create_task(task)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/tasks", response_model=List[TaskResponse])
def list_tasks():
    try:
        return get_all_tasks()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: str):
    try:
        task = get_task_by_id(task_id)

        if task is None:
            raise HTTPException(status_code=404, detail="Task not found")

        return task

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))