from typing import List
from sqlalchemy.orm import Session
from src.nodo import schemas
from src.nodo import exceptions
from src.nodo.models import Medicion, Nodo, Registro, TipoDato, EstadoNodo
from src.nodo import schemas
from src.nodo import exceptions
import json
from datetime import datetime
from fastapi import HTTPException


#/--- Métodos de clase Medicion ---/

def crear_medicion(db: Session, medicion: schemas.MedicionCreate) -> Medicion:
    nodo_existente = db.query(Nodo).filter(Nodo.numero == medicion.nodo_numero).first()
    
    if nodo_existente is None:
        raise exceptions.NodoNoEncontrado()  # Lanza una excepción si el nodo no existe

    tipo_dato_existente = db.query(TipoDato).filter(TipoDato.nombre == medicion.tipo_dato_nombre).first()
    if tipo_dato_existente is None:
        raise exceptions.TipoDatoNoEncontrado()

    db_medicion = Medicion(
        tipo_dato_id=tipo_dato_existente.id,
        data=medicion.data,
        time=medicion.time,
        nodo_numero=medicion.nodo_numero,
        es_erroneo=medicion.es_erroneo,
    )
    db.add(db_medicion)
    db.commit()
    db.refresh(db_medicion)
    return db_medicion

def leer_mediciones(db: Session) -> List[Medicion]:
    return db.query(Medicion).all()

def leer_medicion(db: Session, medicion_id: int) -> Medicion:
    db_medicion = db.query(Medicion).filter(Medicion.id == medicion_id).first()
    if db_medicion is None:
        raise exceptions.MedicionNoEncontrada() 
    return db_medicion

def leer_mediciones_correctas_nodo(db: Session, numero_nodo: int) -> List[Medicion]:
    db_nodo = leer_nodo(db, numero_nodo)

    if db_nodo is not None:
        return db.query(Medicion).filter(Medicion.nodo_numero == numero_nodo, Medicion.es_erroneo == False).all()
    else:
        exceptions.NodoNoEncontrado()
    return []

def leer_mediciones_erroneas_nodo(db: Session, numero_nodo: int) -> List[Medicion]:
    db_nodo = leer_nodo(db, numero_nodo)

    if db_nodo is not None:
        return db.query(Medicion).filter(Medicion.nodo_numero == numero_nodo, Medicion.es_erroneo == True).all()
    else:
        exceptions.NodoNoEncontrado()
    return []

def modificar_medicion(
    db: Session, medicion_id: int, medicion_actualizada: schemas.MedicionUpdate
) -> Medicion:
    db_medicion = leer_medicion(db, medicion_id)
    if medicion_actualizada.tipo_dato is not None:
        tipo_dato = db.query(TipoDato).filter(TipoDato.nombre == medicion_actualizada.tipo_dato).first()
        if tipo_dato is None:
            raise exceptions.TipoDatoNoEncontrado()
        db_medicion.tipo_dato = medicion_actualizada.tipo_dato
    if medicion_actualizada.data is not None:
        db_medicion.data = medicion_actualizada.data
    if medicion_actualizada.time is not None:
        db_medicion.time = medicion_actualizada.time
    db.commit()
    db.refresh(db_medicion)
    return db_medicion

def eliminar_medicion(db: Session, medicion_id: int) -> Medicion:
    db_medicion = leer_medicion(db, medicion_id)
    db.delete(db_medicion)
    db.commit()
    return db_medicion

def leer_ultima_medicion(db: Session) -> Medicion:
    db_medicion = db.query(Medicion).order_by(Medicion.time.desc()).first()
    if db_medicion is None:
        raise exceptions.MedicionNoEncontrada()
    return db_medicion

#/--- Métodos de clase Nodo ---/

def crear_nodo(db: Session, nodo: schemas.NodoCreate) -> Nodo:
    # Buscar si el nodo ya existe según el número
    nodo_existente = db.query(Nodo).filter(Nodo.numero == nodo.numero).first()
    if nodo_existente is not None:
        raise exceptions.NodoDuplicado()
    
    estado_existente = db.query(EstadoNodo).filter(EstadoNodo.nombre == nodo.estado_nodo_nombre).first()
    if estado_existente is None:
        raise exceptions.EstadoNodoNoEncontrado()
    
    db_nodo = Nodo(
        numero=nodo.numero,
        nombre=nodo.nombre,
        longitud=nodo.longitud,
        latitud=nodo.latitud,
        estado_nodo_id=estado_existente.id
    )
    
    db.add(db_nodo)
    db.commit()
    db.refresh(db_nodo)
    return db_nodo

def leer_nodo(db: Session, numero_nodo: int) -> Nodo:
    # Buscar el nodo por su número
    db_nodo = db.query(Nodo).filter(Nodo.numero == numero_nodo).first()
    
    # Si no encuentra el nodo, lanza una excepción
    if db_nodo is None:
        raise exceptions.NodoNoEncontrado()
    return db_nodo

def modificar_nodo(db: Session, numero_nodo: int, nodo_actualizado: schemas.NodoUpdate) -> Nodo:
    db_nodo = leer_nodo(db, numero_nodo)
    if db_nodo is None:
        raise exceptions.NodoNoEncontrado()
    
    if nodo_actualizado.nombre is not None:
        db_nodo.nombre = nodo_actualizado.nombre
    if nodo_actualizado.longitud is not None:
        db_nodo.longitud = nodo_actualizado.longitud
    if nodo_actualizado.latitud is not None:
        db_nodo.latitud = nodo_actualizado.latitud
    if nodo_actualizado.estado_nodo is not None:
        db_nodo.estado_nodo_id = nodo_actualizado.estado_nodo
        
    db.add(db_nodo)
    db.commit()
    db.refresh(db_nodo)
    return db_nodo


def leer_nodos(db: Session) -> List[Nodo]:
    # Obtener todos los nodos
    return db.query(Nodo).all()

def leer_nodos_por_estado(db: Session, estado_nodo_id: int) -> List[Nodo]:
    # Obtener todos los nodos segun un
    return db.query(Nodo).filter(Nodo.estado_nodo_id== estado_nodo_id).all()

def eliminar_nodo(db: Session, numero_nodo: int) -> Nodo:
    nodo = db.query(Nodo).filter(Nodo.numero == numero_nodo).first()
    
    if nodo is None:
        raise exceptions.NodoNoEncontrado()
    elif len(nodo.mediciones) > 0:
        raise exceptions.NodoTieneMediciones()
    
    db.delete(nodo)
    db.commit()
    return nodo

#/--- Métodos de clase TipoDato ---/
def crear_tipo_dato(db: Session, tipoDato: schemas.TipoDatoCreate) -> Medicion:
    tipo_existente = db.query(TipoDato).filter(TipoDato.nombre == tipoDato.nombre).first()
    
    if tipo_existente is not None:
        raise exceptions.TipoDatoDuplicado()
    
    db_tipo_dato = TipoDato(
        nombre = tipoDato.nombre,
        unidad = tipoDato.unidad,
        rango_minimo = tipoDato.rango_minimo,
        rango_maximo = tipoDato.rango_maximo 
    )
    db.add(db_tipo_dato)
    db.commit()
    db.refresh(db_tipo_dato)
    return db_tipo_dato

def leer_tipos_datos(db: Session) -> List[TipoDato]:
    return db.query(TipoDato).all()

def leer_tipo_dato(db: Session, id_tipo: int) -> TipoDato:
    db_tipo_dato = db.query(TipoDato).filter(TipoDato.id == id_tipo).first()
    if db_tipo_dato is None:
        raise exceptions.TipoDatoNoEncontrado() 
    return db_tipo_dato

def modificar_tipo_dato(
    db: Session, id_tipo: int, tipo_dato_actualizado: schemas.TipoDatoUpdate) -> TipoDato:
    db_tipo_dato = leer_tipo_dato(db, id_tipo)

    db_tipo_dato.nombre = tipo_dato_actualizado.nombre
    db_tipo_dato.unidad = tipo_dato_actualizado.unidad
    db_tipo_dato.rango_minimo = tipo_dato_actualizado.rango_minimo
    db_tipo_dato.rango_maximo = tipo_dato_actualizado.rango_maximo
    db.commit()
    db.refresh(db_tipo_dato)
    return db_tipo_dato

def eliminar_tipo_dato(db: Session, id_tipo: int) -> TipoDato:
    db_tipo_dato = leer_tipo_dato(db, id_tipo)
    db.delete(db_tipo_dato)
    db.commit()
    return db_tipo_dato

#/--- Métodos de clase Estado ---/
def crear_estado_nodo(db: Session, estado: schemas.EstadoNodoCreate) -> EstadoNodo:
    estado_existente = db.query(EstadoNodo).filter(EstadoNodo.nombre == estado.nombre).first()
    
    if estado_existente is not None:
        raise exceptions.EstadoNodoDuplicado()

    db_estado_nodo = EstadoNodo(
        nombre = estado.nombre,
    )
    db.add(db_estado_nodo)
    db.commit()
    db.refresh(db_estado_nodo)
    return db_estado_nodo

def leer_estados_nodo(db: Session) -> List[EstadoNodo]:
    return db.query(EstadoNodo).all()

def leer_estado_nodo(db: Session, nombre: str) -> EstadoNodo:
    db_estado_nodo = db.query(EstadoNodo).filter(EstadoNodo.nombre == nombre).first()
    if db_estado_nodo is None:
        raise exceptions.EstadoNodoNoEncontrado() 
    return db_estado_nodo

def modificar_estado_nodo(
    db: Session, nombre: str, estado_actualizado: schemas.EstadoNodoUpdate) -> EstadoNodo:
    db_estado_nodo = leer_estado_nodo(db, nombre)
    if estado_actualizado.nombre is not None:
        estado_nodo = db.query(EstadoNodo).filter(EstadoNodo.nombre == estado_actualizado.nombre).first()
        if estado_nodo is None:
            raise exceptions.EstadoNodoNoEncontrado()
        db_estado_nodo.nombre = estado_actualizado.nombre
    db.commit()
    db.refresh(db_estado_nodo)
    return db_estado_nodo

def eliminar_estado_nodo(db: Session, nombre: str) -> EstadoNodo:
    db_estado_nodo = leer_estado_nodo(db, nombre)

    if db_estado_nodo is None:
            raise exceptions.EstadoNodoNoEncontrado()
    db.delete(db_estado_nodo)
    db.commit()
    return db_estado_nodo
def importar_datos_json(db: Session, data: List[dict]) -> List[Medicion]:
    mediciones_importadas = []
    
    for item in data:
        medicion = schemas.MedicionCreate(
            type=item['type'],
            data=item['data'],
            time=item['time'],
            nodo_numero=int(item['nodo_numero']),
            es_erroneo=bool(item['es_erroneo'])
        )
        try:
            medicion_creada = crear_medicion(db, medicion)
            mediciones_importadas.append(medicion_creada)
        except exceptions.NodoNoEncontrado:
            continue
    return mediciones_importadas

def importar_datos_csv(db: Session, data: List[dict]) -> List[Medicion]:
    mediciones_importadas = []

    for item in data:
        medicion = schemas.MedicionCreate(
            type=int(item['type']), 
            data=item['data'],
            time=item['time'],
            nodo_numero=int(item['nodo_numero']),
            es_erroneo=bool(item['es_erroneo'])
        )
        try:
            medicion_creada = crear_medicion(db, medicion) 
            mediciones_importadas.append(medicion_creada)
        except exceptions.NodoNoEncontrado:
            continue

    return mediciones_importadas
#/--- Metodos de clase Registro ---/
def crear_usuario(db: Session, registro: schemas.RegistroCreate):
   
    db_usuario_existente = db.query(Registro).filter(Registro.usuario == registro.usuario).first()
    
    if db_usuario_existente:
        raise HTTPException(status_code=400, detail="El usuario ya está registrado")
    
    db_usuario = Registro(
        usuario=registro.usuario,
        contrasenia=registro.contrasenia
    )
    
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    
    return db_usuario

def iniciar_sesion(datos_usuario: schemas.RegistroBase, db: Session):
    # Buscar al usuario en la base de datos
    db_usuario = db.query(Registro).filter(Registro.usuario == datos_usuario.usuario).first()

    # Verificar si el usuario existe
    if db_usuario is None:
        raise HTTPException(status_code=400, detail="Usuario no encontrado")
    
    # Verificar si la contraseña es correcta
    if db_usuario.contrasenia != datos_usuario.contrasenia:
        raise HTTPException(status_code=400, detail="Contraseña incorrecta")

    # Si el usuario y la contraseña son correctos, devolver un mensaje de éxito
    return db_usuario