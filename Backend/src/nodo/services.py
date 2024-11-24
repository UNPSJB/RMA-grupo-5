from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func
from src.nodo import schemas
from src.nodo import exceptions
from src.nodo.models import Medicion, Nodo, Registro, TipoDato, Alerta
from src.nodo import schemas
from src.nodo import exceptions
import time, json
from datetime import datetime, timedelta
from fastapi import HTTPException



#/--- Métodos de clase Medicion ---/
def crear_medicion(db: Session, medicion: schemas.MedicionCreate) -> Medicion:
    nodo_existente = db.query(Nodo).filter(Nodo.numero == medicion.nodo_numero).first()
    
    if nodo_existente is None:
        raise exceptions.NodoNoEncontrado()  # Lanzar una excepción si el nodo no existe

    tipo_dato_existente = leer_tipo_dato(db, medicion.tipo_dato_id) 

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

    db_nodo = Nodo(
        numero=nodo.numero,
        nombre=nodo.nombre,
        longitud=nodo.longitud,
        latitud=nodo.latitud,
        estado= nodo.estado
    )
    
    db.add(db_nodo)
    db.commit()
    db.refresh(db_nodo)
    return db_nodo

def leer_nodo(db: Session, numero_nodo: int) -> Nodo:
    # Buscar el nodo por su número
    db_nodo = db.query(Nodo).filter(Nodo.numero == numero_nodo).first()
    if db_nodo is None:
        raise exceptions.NodoNoEncontrado()
    
    return db_nodo

def modificar_nodo(db: Session, numero_nodo: int, nodo_actualizado: schemas.NodoUpdate) -> Nodo:
    db_nodo = leer_nodo(db, numero_nodo)
    
    if nodo_actualizado.nombre is not None:
        db_nodo.nombre = nodo_actualizado.nombre
    if nodo_actualizado.longitud is not None:
        db_nodo.longitud = nodo_actualizado.longitud
    if nodo_actualizado.latitud is not None:
        db_nodo.latitud = nodo_actualizado.latitud
    if nodo_actualizado.estado is not None:
        db_nodo.estado = nodo_actualizado.estado

    db.add(db_nodo)
    db.commit()
    db.refresh(db_nodo)
    return db_nodo


def leer_nodos(db: Session) -> List[Nodo]:
    # Obtener todos los nodos
    return db.query(Nodo).order_by(Nodo.numero.asc()).all()
    
def leer_nodos_activos(db: Session) -> List[Nodo]:
    # Obtener todos los nodos activos
    return db.query(Nodo).filter(Nodo.numero == 1).all()

def leer_nodos_inactivos(db: Session) -> List[Nodo]:
    # Obtener todos los nodos inactivos
    return db.query(Nodo).filter(Nodo.numero == 2).all()

def leer_nodos_de_baja(db: Session) -> List[Nodo]:
    # Obtener todos los nodos en mantenimiento/dados de baja
    return db.query(Nodo).filter(Nodo.numero == 3).all()

# Verificar periodicamente si el nodo recibio mediciones en las ultimas 24hs para saber si esta activo
def verificar_mediciones_nodo(db: Session):
    while True:
        # Llamar a tu función de actualización del estado de los nodos aquí
        for nodo in db.query(Nodo).all():
            # Verificar si no esta en mantenimiento el nodo
            if nodo.estado != 3:
                ultima_medicion = db.query(Medicion).filter(Medicion.nodo_numero == nodo.numero).order_by(Medicion.time.desc()).first()
                
                if ultima_medicion is not None:
                    # Si la última medición es mayor a 24 horas, poner el nodo en estado Inactivo
                    if ultima_medicion.time < datetime.now() - timedelta(hours=24):
                        nodo.estado = 2  # Estado Inactivo
                    else:
                        nodo.estado = 1  # Estado Activo
                else:
                    # Si no hay mediciones
                    nodo.estado = 2  # Estado Inactivo

                db.commit()
        # Esperar 60 segundos antes de ejecutar nuevamente
        time.sleep(10)

def eliminar_nodo(db: Session, numero_nodo: int) -> Nodo:
    nodo = leer_nodo(db, numero_nodo)
    
    if len(nodo.mediciones) > 0:
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
        umbral_alerta_precaucion = tipoDato.umbral_alerta_precaucion,
        umbral_alerta_peligro = tipoDato.umbral_alerta_peligro,
        rango_maximo = tipoDato.rango_maximo 
    )
    db.add(db_tipo_dato)
    db.commit()
    db.refresh(db_tipo_dato)
    return db_tipo_dato

def leer_tipos_datos(db: Session) -> List[TipoDato]:
    tipos_datos = db.query(TipoDato).all()
    return tipos_datos

def leer_tipo_dato(db: Session, id_tipo: int) -> TipoDato:
    db_tipo_dato = db.query(TipoDato).filter(TipoDato.id == id_tipo).first()
    if db_tipo_dato is None:
        raise exceptions.TipoDatoNoEncontrado() 
    return db_tipo_dato

def leer_tipo_dato_por_nombre(db: Session, nombre_tipo: str) -> TipoDato:
    db_tipo_dato = db.query(TipoDato).filter(func.lower(TipoDato.nombre) == nombre_tipo.lower()).first()
    if db_tipo_dato is None:
        raise exceptions.TipoDatoNoEncontrado() 
    return db_tipo_dato

def modificar_tipo_dato(
    db: Session, id_tipo: int, tipo_dato_actualizado: schemas.TipoDatoUpdate) -> TipoDato:
    db_tipo_dato = leer_tipo_dato(db, id_tipo)

    db_tipo_dato.nombre = tipo_dato_actualizado.nombre
    db_tipo_dato.unidad = tipo_dato_actualizado.unidad
    db_tipo_dato.rango_minimo = tipo_dato_actualizado.rango_minimo
    db_tipo_dato.umbral_alerta_precaucion = tipo_dato_actualizado.umbral_alerta_precaucion
    db_tipo_dato.umbral_alerta_peligro = tipo_dato_actualizado.umbral_alerta_peligro
    db_tipo_dato.rango_maximo = tipo_dato_actualizado.rango_maximo
    db.commit()
    db.refresh(db_tipo_dato)
    return db_tipo_dato

def eliminar_tipo_dato(db: Session, id_tipo: int) -> TipoDato:
    db_tipo_dato = leer_tipo_dato(db, id_tipo)
    if len(db_tipo_dato.mediciones) > 0:
        raise exceptions.TipoDatoTieneMediciones()
    db.delete(db_tipo_dato)
    db.commit()
    return db_tipo_dato

def importar_datos_json(db: Session, data: List[dict]) -> List[Medicion]:
    mediciones_importadas = []
    
    for item in data:
        medicion = schemas.MedicionCreate(
            tipo_dato_id=item['type'],
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

from datetime import datetime

def importar_datos_csv(db: Session, data: List[dict]) -> List[Medicion]:
    mediciones_importadas = []

    for item in data:
        # Convertir 'data' a string, si es necesario
        data_str = str(item['data'])
        
        tipo_dato_id = item.get('tipo_dato_id')

        # Convertir 'time' a datetime, si es necesario
        try:
            time = datetime.fromisoformat(item['time'])
        except ValueError:
            # Si el formato de 'time' no es correcto, asigna la fecha y hora actual
            time = datetime.now()

        medicion = schemas.MedicionCreate(
            tipo_dato_id=tipo_dato_id,
            data=data_str,  # Convertir a string
            time=time,  # Asegúrate de que sea un datetime
            nodo_numero=int(item['nodo_numero']),
            es_erroneo=bool(int(item['es_erroneo'])),
        )

        try:
            medicion_creada = crear_medicion(db, medicion)
            mediciones_importadas.append(medicion_creada)
        except exceptions.NodoNoEncontrado:
            continue
        except Exception as e:
            print(f"Error al crear la medición: {e}")
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


#/--- Métodos de clase Alerta ---/
def crear_alerta(db: Session, alerta: schemas.AlertaCreate) -> Medicion:
    db_alerta = Alerta(
        tipo_dato_id=alerta.tipo_dato_id,
        valor_medicion=alerta.valor_medicion,
        nodo_numero=alerta.nodo_numero,
        tipo_alerta=alerta.tipo_alerta,
        estado=alerta.estado
    )
    db.add(db_alerta)
    db.commit()
    db.refresh(db_alerta)
    return db_alerta

def leer_alertas(db: Session) -> List[Alerta]:
    return db.query(Alerta).all()

def leer_alerta(db: Session, alerta_id: int) -> Alerta:
    db_alerta = db.query(Alerta).filter(Alerta.id_medicion == alerta_id).first()
    if db_alerta is None:
        raise exceptions.AlertaNoEncontrada() 
    return db_alerta

def eliminar_alerta(db: Session, alerta_id: int) -> Alerta:
    db_alerta = leer_medicion(db, alerta_id)
    db.delete(db_alerta)
    db.commit()
    return db_alerta 