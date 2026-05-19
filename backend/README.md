# Agentic Academic Assistant Backend

FastAPI backend for the Multi-Agent University Project Assistant.

Tasks, agent logs, agent states, and final outputs are persisted in PostgreSQL using SQLAlchemy.

## Files

- `backend/app.py` - FastAPI app and routes
- `backend/models.py` - Pydantic schemas and SQLAlchemy tables
- `backend/database.py` - PostgreSQL connection/session setup
- `backend/agents.py` - dummy multi-agent workflow
- `backend/data.py` - database-backed task persistence
- `backend/.env` - `DATABASE_URL`
- `backend/requirements.txt` - Python dependencies

## Windows Setup

1. Install PostgreSQL for Windows.

2. Open SQL Shell or pgAdmin and create the database:

```sql
CREATE DATABASE agentic_assistant;
```

3. Open PowerShell in the project backend folder:

```powershell
cd C:\Users\huzaifa\Desktop\ecommerce\backend
```

4. Create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, run:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
.\.venv\Scripts\Activate.ps1
```

5. Install dependencies:

```powershell
pip install -r requirements.txt
```

6. Edit `.env` if your PostgreSQL user, password, host, port, or database name is different:

```env
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/agentic_assistant
```

7. Start the backend:

```powershell
uvicorn app:app --reload --host 0.0.0.0 --port 8001
```

SQLAlchemy creates the required tables on startup.

## API Endpoints

- `GET /health`
- `POST /tasks`
- `GET /tasks`
- `GET /tasks/{task_id}`
