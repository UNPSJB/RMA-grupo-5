from typing import List
from sqlalchemy.orm import Session
from src.nodo.models import Medicion
from src.nodo import schemas
from src import exceptions

def crear_medicion(db: Session, medicion: schemas.MedicionCreate) -> Medicion:
    db_medicion = Medicion(
        type=medicion.type,
        data=medicion.data,
        time=medicion.time,
        nodo_numero=medicion.nodo_numero,
    )
    db.add(db_medicion)
    db.commit()
    db.refresh(db_medicion)
    return db_medicion

def listar_mediciones(db: Session) -> List[Medicion]:
    return db.query(Medicion).all()

def leer_medicion(db: Session, medicion_id: int) -> Medicion:
    db_medicion = db.query(Medicion).filter(Medicion.id == medicion_id).first()
    if db_medicion is None:
        raise exceptions.MedicionNoEncontrado() 
    return db_medicion

def modificar_medicion(
    db: Session, medicion_id: int, nodo: schemas.MedicionUpdate
) -> Medicion:
    db_medicion = leer_medicion(db, medicion_id)
    if nodo.type is not None:
        db_medicion.type = nodo.type
    if nodo.data is not None:
        db_medicion.data = nodo.data
    if nodo.time is not None:
        db_medicion.time = nodo.time
    db.commit()
    db.refresh(db_medicion)
    return db_medicion

def eliminar_medicion(db: Session, medicion_id: int) -> Medicion:
    db_medicion = leer_medicion(db, medicion_id)
    db.delete(db_medicion)
    db.commit()
    return db_medicion