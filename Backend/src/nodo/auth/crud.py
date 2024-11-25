# src/nodo/auth/crud.py
from sqlalchemy.orm import Session
from src.nodo import models
from . import  hashing

def get_user_by_username(db: Session, username: str):
    return db.query(models.Registro).filter(models.Registro.username == username).first()

def create_user(db: Session, username: str, password: str):
    hashed_password = hashing.hash_password(password)
    db_user = models.Registro(username=username, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user