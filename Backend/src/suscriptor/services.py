from sqlalchemy.orm import Session
import json
from datetime import datetime
from src.nodo.schemas import MedicionCreate
from src.nodo.services import crear_medicion
from src.nodo.models import TipoDato
from src.nodo import exceptions

def procesar_mensaje(mensaje: str, db: Session) -> None:
    # Reemplazar comillas simples por comillas dobles para cumplir con el formato JSON
    mensaje = mensaje.replace("'", '"')
    mensaje_dict = json.loads(mensaje)

    time_dt = datetime.fromisoformat(mensaje_dict['time'])
    type_dt = TipoDato[mensaje_dict['type']]

    medicion = MedicionCreate(
        nodo = mensaje_dict['id'],
        type = type_dt,
        data = mensaje_dict['data'],
        time = time_dt
    )

    try:
        crear_medicion(db, medicion)
    except exceptions.NodoNoEncontrado:
        return # Tal vez conviene informar en el front que el nodo no existe y se ignoran mediciones
    except Exception as e:
        return # Cualquier otra excepcion inesperada
