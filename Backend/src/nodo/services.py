from typing import List
from sqlalchemy.orm import Session
from src.nodo.models import Nodo, TipoDato
from src.nodo import schemas
from src import exceptions

def crear_nodo(db: Session, nodo: schemas.NodoCreate) -> Nodo:
    db_nodo = Nodo(
        type=nodo.type,
        data=nodo.data,
        time=nodo.time
    )
    db.add(db_nodo)
    db.commit()
    db.refresh(db_nodo)
    return db_nodo

def listar_nodos(db: Session) -> List[Nodo]:
    return db.query(Nodo).all()

def leer_nodo(db: Session, nodo_id: int) -> Nodo:
    db_nodo = db.query(Nodo).filter(Nodo.id == nodo_id).first()
    if db_nodo is None:
        raise exceptions.NodoNoEncontrado() 
    return db_nodo

def modificar_nodo(
    db: Session, nodo_id: int, nodo: schemas.NodoUpdate
) -> Nodo:
    db_nodo = leer_nodo(db, nodo_id)
    if nodo.type is not None:
        db_nodo.type = nodo.type
    if nodo.data is not None:
        db_nodo.data = nodo.data
    if nodo.time is not None:
        db_nodo.time = nodo.time
    db.commit()
    db.refresh(db_nodo)
    return db_nodo


def eliminar_nodo(db: Session, nodo_id: int) -> Nodo:
    db_nodo = leer_nodo(db, nodo_id)
    db.delete(db_nodo)
    db.commit()
    return db_nodo