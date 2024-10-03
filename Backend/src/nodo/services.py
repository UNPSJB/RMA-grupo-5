from typing import List
from sqlalchemy.orm import Session
from src.nodo.models import Medicion, TipoDato
from src.nodo import schemas
from src import exceptions

def crear_nodo(db: Session, nodo: schemas.MedicionCreate) -> Medicion:
    db_nodo = Medicion(
        type=nodo.type,
        data=nodo.data,
        time=nodo.time
    )
    db.add(db_nodo)
    db.commit()
    db.refresh(db_nodo)
    return db_nodo

def listar_nodos(db: Session) -> List[Medicion]:
    return db.query(Medicion).all()

def leer_nodo(db: Session, nodo_id: int) -> Medicion:
    db_nodo = db.query(Medicion).filter(Medicion.id == nodo_id).first()
    if db_nodo is None:
        raise exceptions.MedicionNoEncontrado() 
    return db_nodo

def modificar_nodo(
    db: Session, nodo_id: int, nodo: schemas.MedicionUpdate
) -> Medicion:
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


def eliminar_nodo(db: Session, nodo_id: int) -> Medicion:
    db_nodo = leer_nodo(db, nodo_id)
    db.delete(db_nodo)
    db.commit()
    return db_nodo