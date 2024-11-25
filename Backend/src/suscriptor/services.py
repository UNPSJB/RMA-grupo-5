from sqlalchemy.orm import Session
import json
from datetime import datetime
from src.nodo.schemas import MedicionCreate, AlertaCreate
from src.nodo.services import crear_medicion, leer_nodo, leer_tipo_dato, crear_alerta
from src.nodo.models import TipoDato
from src.nodo import exceptions
from src.conexiones_websocket import clientes_alertas, clientes_ultima_medicion

async def enviar_alerta_a_clientes(alerta_data: dict):
    # Enviar la alerta a todos los clientes conectados a través del WebSocket
    for cliente in clientes_alertas:
        try:
            await cliente.send_json(alerta_data)
        except Exception as e:
            # Si ocurre un error eliminarlo de la lista
            clientes_alertas.remove(cliente)

async def enviar_medicion_a_clientes(medicion_data: dict):
    # Enviar la medición a todos los clientes de 'ultima_medicion'
    for cliente in clientes_ultima_medicion:
        try:
            medicion_data['time'] = medicion_data['time'].isoformat()
            await cliente.send_json(medicion_data)
        except Exception as e:
            clientes_ultima_medicion.remove(cliente)

def medicion_es_erronea(data: str, type_dt: TipoDato, time_dt: datetime) -> bool:
    # Intenta convertir data a un float
    try:
        data_float = float(data)
    except ValueError:  
        return True
    
    # Verificar si el tipo de dato es válido
    if type_dt is None:
        return True  # Si el tipo no es válido, marcar como erróneo

    rango_minimo = type_dt.rango_minimo
    rango_maximo = type_dt.rango_maximo

    # Verificar si los rangos están definidos en la base de datos
    if rango_minimo is not None and data_float < rango_minimo:
        return True  # Error: valor por debajo del rango mínimo
    
    if rango_maximo is not None and data_float > rango_maximo:
        return True  # Error: valor por encima del rango máximo

    # Validar que la fecha no sea futura a la actual
    if time_dt > datetime.now():
        return True  # Error: fecha futura
    
    return False  # No hay errores

def verificar_umbrales_medicion(data: str, type_dt: TipoDato, time_dt: datetime) -> int:
    data_float = float(data)
    umbral_alerta_precaucion = type_dt.umbral_alerta_precaucion
    umbral_alerta_peligro = type_dt.umbral_alerta_peligro
    rango_maximo = type_dt.rango_maximo

    if umbral_alerta_precaucion is not None and data_float < umbral_alerta_peligro and data_float >= umbral_alerta_precaucion:
        return 1  # Alerta de Precaucion
    
    if umbral_alerta_peligro is not None and data_float < rango_maximo and data_float >= umbral_alerta_peligro:
        return 2  # Alerta de Peligro
    
    return 0  # Es un valor normal


async def procesar_mensaje(mensaje: str, db: Session) -> None:
    # Reemplazar comillas simples por comillas dobles para cumplir con el formato JSON
    mensaje = mensaje.replace("'", '"')
    mensaje_dict = json.loads(mensaje)

    # Comprobar si el nodo existe; si no, se ignora la medición
    nodo_numero = mensaje_dict['id']
    try:
        nodo_existente = leer_nodo(db, nodo_numero)
    except Exception as e:
        print(f"Error al leer el nodo {nodo_numero}: {e}")
        return
    
    if nodo_existente.estado not in [1, 2]:
        return  # Si el nodo no está activo (1) o inactivo (2), se ignora la medición

    
    time_timestamp = float(mensaje_dict['time'])
    time_dt = datetime.fromtimestamp(time_timestamp)
    tipo_dt = mensaje_dict['type']
    valor_data = mensaje_dict['data']

    es_erroneo = False  # Por defecto, la medición no es errónea
    try:
        type_dt = leer_tipo_dato(db, tipo_dt)
        es_erroneo = medicion_es_erronea(valor_data, type_dt, time_dt)
    except exceptions.TipoDatoNoEncontrado:
        es_erroneo = True
        tipo_dt = 36

    medicion = MedicionCreate(
        tipo_dato_id=tipo_dt,
        data=valor_data,
        time=time_dt,
        nodo_numero=nodo_numero,
        es_erroneo=es_erroneo
    )
    
    crear_medicion(db, medicion)

    # Enviar la ultima medicion
    medicion_data = medicion.dict()
    await enviar_medicion_a_clientes(medicion_data)
    
    # Si es erroneo, no es necesario verificar si esta dentro de los rangos de alerta
    if es_erroneo == False:
        nro_tipo = verificar_umbrales_medicion(valor_data, type_dt, time_dt)
        if nro_tipo != 0:
            valor_estado = False    # True para Leido y False para No Leido
            alerta = AlertaCreate(
                tipo_dato_id=tipo_dt,
                valor_medicion=valor_data,
                nodo_numero=nodo_numero,
                tipo_alerta=nro_tipo,
                estado=valor_estado
            )
            crear_alerta(db, alerta)
            alerta_data = alerta.dict()  # Convertir a dict para enviar como JSON
            await enviar_alerta_a_clientes(alerta_data)
