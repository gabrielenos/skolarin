from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text

from database import Base, engine, DATABASE_URL
import stats  # Import ini mendaftarkan UserStats ke SQLAlchemy
import quiz  # Import ini mendaftarkan QuizAttempt ke SQLAlchemy
from routers.auth import router as auth_router
from routers.quiz import router as quiz_router


def create_database_if_not_exists():
    """Buat database kalau belum ada"""
    # Parse database name dari URL
    db_name = DATABASE_URL.rsplit('/', 1)[-1]
    # Buat URL untuk connect ke server MySQL (tanpa database name)
    server_url = DATABASE_URL.rsplit('/', 1)[0] + '/mysql'
    
    try:
        server_engine = create_engine(server_url)
        with server_engine.connect() as conn:
            conn.execute(text(f"CREATE DATABASE IF NOT EXISTS {db_name}"))
            conn.commit()
        server_engine.dispose()
    except Exception as e:
        print(f"Warning: Could not create database: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_database_if_not_exists()
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Skolarin API", lifespan=lifespan)

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)


@app.get("/")
def root():
  return {"status": "ok"}


app.include_router(auth_router)
app.include_router(quiz_router)
