from sqlalchemy.orm import Session
import json
from datetime import datetime
from src.nodo.schemas import MedicionCreate
from src.nodo.services import crear_medicion, obtener_nodo
from src.nodo.models import TipoDato

def procesar_mensaje(mensaje: str, db: Session) -> None:
    # Reemplazar comillas simples por comillas dobles para cumplir con el formato JSON
    mensaje = mensaje.replace("'", '"')
    mensaje_dict = json.loads(mensaje)

    # Comprobar si el nodo existe, sino, se ignora la medicion
    nodo_numero = mensaje_dict['id'] 
    try:
        obtener_nodo(db, nodo_numero) 
    except:
        return

    time_dt = datetime.fromisoformat(mensaje_dict['time'])
    type_dt = TipoDato[mensaje_dict['type']] 

    # Crear una instancia de medicion
    medicion = MedicionCreate(
        nodo_numero=nodo_numero,
        type=type_dt,
        data=mensaje_dict['data'],
        time=time_dt,
        es_erroneo=False
    )
    
    crear_medicion(db, medicion)

