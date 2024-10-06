from typing import List
from sqlalchemy.orm import Session
from src.nodo.models import Medicion, Nodo
from src.nodo import schemas
from src.nodo import exceptions

#/--- Metodos de clase Medicion ---/

def crear_medicion(db: Session, medicion: schemas.MedicionCreate) -> Medicion:

    nodo_existente = db.query(Nodo).filter(Nodo.numero == medicion.nodo_numero).first()
    
    if nodo_existente is None:
        raise exceptions.NodoNoEncontrado()  # Lanza una excepción si el nodo no existe

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
        raise exceptions.MedicionNoEncontrada() 
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

#/--- Metodos de clase Nodo ---/
def crear_nodo(db: Session, nodo: schemas.NodoCreate) -> Nodo:
    db_nodo = Nodo(
        numero = nodo.numero,
        ubicacion_x = nodo.ubicacion_x,
        ubicacion_y = nodo.ubicacion_y,
    )
    # Buscar si el nodo ya existe segun el numero
    nodo = db.query(Nodo).filter(Nodo.numero == db_nodo.numero).first()
    if nodo is not None:
        raise exceptions.NodoDuplicado()
    
    db.add(db_nodo)
    db.commit()
    db.refresh(db_nodo)
    return db_nodo

def obtener_nodo(db: Session, numero_nodo: int) -> Nodo:
    # Buscar el nodo por su número
    nodo = db.query(Nodo).filter(Nodo.numero == numero_nodo).first()
    
    # Si no encuentra el nodo, lanza una excepción
    if nodo is None:
        raise exceptions.NodoNoEncontrado()
    return nodo

def listar_nodos(db: Session) -> List[Nodo]:
    # Obtener todos los nodos de la base de datos
    nodos = db.query(Nodo).all()
    return nodos

def eliminar_nodo(db: Session, numero_nodo: int) -> Nodo:

    nodo = db.query(Nodo).filter(Nodo.numero == numero_nodo).first()
    
    if nodo is None:
        raise exceptions.NodoNoEncontrado()
    elif len(nodo.mediciones) > 0:
        raise exceptions.NodoTieneMediciones()
    
    db.delete(nodo)
    db.commit()
    return nodo


def leer_ultima_medicion(db: Session) -> Medicion:
    db_medicion = db.query(Medicion).order_by(Medicion.time.desc()).first()
    if db_medicion is None:
        raise exceptions.MedicionNoEncontrada()
    return db_medicion