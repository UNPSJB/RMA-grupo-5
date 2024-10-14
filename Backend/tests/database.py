import os
from dotenv import load_dotenv
from fastapi.testclient import TestClient
from typing import Generator
from sqlalchemy import StaticPool, create_engine
from sqlalchemy.orm import sessionmaker, Session
from src.main import app
from src.db_models import get_db
from src.nodo.models import BaseModel
from src.nodo.schemas import MedicionCreate 
from src.nodo.models import Medicion

load_dotenv()

# creamos una db para testing
DATABASE_URL = os.getenv("DB_URL_TEST")
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    
    db = TestingSessionLocal()
    try:
        print("Using test DB!")
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db