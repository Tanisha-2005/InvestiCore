from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

Base = declarative_base()

# Primary Async Engine (PostgreSQL)
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    future=True,
    pool_pre_ping=True,
)

# Fallback Async Engine (SQLite for offline / standalone dev mode)
fallback_engine = create_async_engine(
    "sqlite+aiosqlite:///./investicore_dev.db",
    echo=False,
    future=True,
)

active_engine = engine

AsyncSessionLocal = async_sessionmaker(
    bind=active_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

async def init_db():
    global active_engine, AsyncSessionLocal
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("[Database] Successfully connected to PostgreSQL Database.")
    except Exception as e:
        print(f"[Database] PostgreSQL connection offline ({e}). Falling back to SQLite local database.")
        active_engine = fallback_engine
        AsyncSessionLocal.configure(bind=fallback_engine)
        async with fallback_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
