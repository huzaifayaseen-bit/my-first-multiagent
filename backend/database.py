import os
from contextlib import contextmanager
from typing import Generator

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

load_dotenv()

Base = declarative_base()

_engine = None
_SessionLocal = None


def get_database_url() -> str:
    database_url = (
        os.getenv("DATABASE_URL")
        or os.getenv("DATABASE_POSTGRES_URL")
        or os.getenv("DATABASE_URL_UNPOOLED")
        or os.getenv("DATABASE_POSTGRES_URL_NON_POOLING")
        or os.getenv("DATABASE_POSTGRES_PRISMA_URL")
    )

    if not database_url:
        raise RuntimeError(
            "DATABASE_URL is missing. Add DATABASE_URL in Vercel backend Environment Variables."
        )

    # Neon/Vercel sometimes gives postgres://
    if database_url.startswith("postgres://"):
        database_url = database_url.replace(
            "postgres://",
            "postgresql+psycopg://",
            1,
        )

    # Neon/Vercel sometimes gives postgresql://
    if database_url.startswith("postgresql://"):
        database_url = database_url.replace(
            "postgresql://",
            "postgresql+psycopg://",
            1,
        )

    return database_url


def get_engine():
    global _engine

    if _engine is None:
        _engine = create_engine(
            get_database_url(),
            pool_pre_ping=True,
        )

    return _engine


def get_session_local():
    global _SessionLocal

    if _SessionLocal is None:
        _SessionLocal = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=get_engine(),
        )

    return _SessionLocal


@contextmanager
def get_db_session() -> Generator[Session, None, None]:
    SessionLocal = get_session_local()
    db = SessionLocal()

    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def init_db() -> None:
    import models  # noqa: F401

    Base.metadata.create_all(bind=get_engine())