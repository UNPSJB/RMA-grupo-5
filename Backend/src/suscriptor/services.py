from sqlalchemy.orm import Session
import json
from datetime import datetime
from src.nodo.schemas import MedicionCreate
from src.nodo.services import crear_medicion, leer_nodo, leer_tipo_dato
from src.nodo.models import TipoDato, EstadoNodo

def medicion_es_erronea(data: str, type_dt: TipoDato, time_dt: datetime) -> bool:
    # Intenta convertir data a un float
    try:
        data_float = float(data)
    except ValueError:
        return True  # Si no es convertible, es un error
    # Verifica si el tipo de dato es válido
    if type_dt is None:
        return True  # Si el tipo no es válido, marcar como erróneo

    # Obtén los rangos de la base de datos para este tipo de dato
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

def procesar_mensaje(mensaje: str, db: Session) -> None:
    # Reemplazar comillas simples por comillas dobles para cumplir con el formato JSON
    mensaje = mensaje.replace("'", '"')
    mensaje_dict = json.loads(mensaje)

    # Comprobar si el nodo existe; si no, se ignora la medición
    nodo_numero = mensaje_dict['id']
    try:
        nodo_existente = leer_nodo(db, nodo_numero)
    except Exception as e:
        return
    
       # Verificar el estado del nodo
    estado_nodo = db.query(EstadoNodo).filter(EstadoNodo.id == nodo_existente.estado_nodo_id).first()
    if estado_nodo and estado_nodo.nombre == "Mantenimiento":
        return  # Si el nodo está en "Mantenimiento", se ignora la medición
    
    time_dt = datetime.fromisoformat(mensaje_dict['time'])
    tipo_str = mensaje_dict['type']  # Almacena el tipo de dato como una cadena
    valor_data = mensaje_dict['data']

    es_erroneo = False  # Por defecto, la medición no es errónea
    try:
        type_dt = leer_tipo_dato(db, tipo_str)
        # Validar la medición
        es_erroneo = medicion_es_erronea(valor_data, type_dt, time_dt)
    except Exception as e:
        es_erroneo = True
        tipo_str = "Desconocido"



    medicion = MedicionCreate(
        tipo_dato_nombre=tipo_str,  # Se usa None si el tipo es erróneo
        data=valor_data,
        time=time_dt,
        nodo_numero=nodo_numero,
        es_erroneo=es_erroneo
    )
    
    crear_medicion(db, medicion)

