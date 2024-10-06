from sqlalchemy.orm import Session
import json
from datetime import datetime
from src.nodo.schemas import MedicionCreate
from src.nodo.services import crear_medicion
from src.nodo.models import TipoDato

def procesar_mensaje(mensaje: str, db: Session) -> None:
    # Reemplazar comillas simples por comillas dobles para cumplir con el formato JSON
    mensaje = mensaje.replace("'", '"')

    mensaje_dict = json.loads(mensaje)
    time_dt = datetime.fromisoformat(mensaje_dict['time'])
    type_dt = TipoDato[mensaje_dict['type']]

    # Crear un objeto MedicionCreate
    medicion = MedicionCreate(
        nodo_numero=mensaje_dict['id'],
        type=type_dt,
        data=mensaje_dict['data'],
        time=time_dt
    )
    crear_medicion(db, medicion)
