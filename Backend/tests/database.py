import os
import pytest
from dotenv import load_dotenv
from fastapi.testclient import TestClient
from typing import Generator
from sqlalchemy import StaticPool, create_engine
from sqlalchemy.orm import sessionmaker, Session
from src.main import app
from src.db_models import get_db
from src.nodo.models import BaseModel
from src.nodo.services import crear_nodo
from src.nodo.schemas import NodoCreate 
from src.nodo.models import Nodo

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
    # utilizaremos esta funcion para "pisar" la que definimos en src/database.py.
    db = TestingSessionLocal()
    try:
        print("Using test DB!")
        yield db
    finally:
        db.close()

# forzamos a fastapi para que utilice la db para testing.
app.dependency_overrides[get_db] = override_get_db