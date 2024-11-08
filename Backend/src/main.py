import os, sys, json
from dotenv import load_dotenv
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from threading import Thread
import uvicorn
from paho.mqtt.client import Client
from src.constants import TIPOS_DE_DATOS_INICIALES
from src.config_db import engine, SessionLocal
from src.db_models import BaseModel
from src.nodo.router import router as example_router
from src.nodo.schemas import TipoDatoCreate
from src.nodo.services import crear_tipo_dato
from src.suscriptor.sub import Subscriptor
from src.suscriptor.config import config
from src.suscriptor.services import procesar_mensaje
from src import config_cors

load_dotenv()

TOPIC = os.getenv("MQTT_TOPIC")
ENV = os.getenv("ENV")
ROOT_PATH = os.getenv(f"ROOT_PATH_{ENV.upper()}")

# FastAPI configuration
app = FastAPI(root_path=ROOT_PATH)

# Configuracion de CORS
config_cors.add_cors(app)

# Asociar los routers a nuestra app
app.include_router(example_router)
 
def mi_callback(mensaje: str) -> None:
    db: Session = SessionLocal()

    try:
        procesar_mensaje(mensaje, db)
    except Exception as e:
        print(f"Error al procesar el mensaje: {e}")
    finally:
        db.close()

def run_mqtt_subscriber():
    sub  = Subscriptor(client=Client(), on_message_callback=mi_callback)
    
    # Conectar al broker MQTT
    sub.connect(config.host, config.port, config.keepalive)

    # Suscribirse al tópico
    sub.subscribe(TOPIC, qos=1)

# Iniciar el hilo del suscriptor MQTT
def start_mqtt_thread():
    mqtt_thread = Thread(target=run_mqtt_subscriber, daemon=True)
    mqtt_thread.start()
    return mqtt_thread

# Ejecutar el suscriptor MQTT al iniciar FastAPI
@app.on_event("startup")
async def startup_event():
    # Crear las tablas en la base de datos si no existen
    BaseModel.metadata.create_all(bind=engine)

    # Crear tipos de datos iniciales
    db: Session = SessionLocal()
    try:
        for tipo in TIPOS_DE_DATOS_INICIALES:
            tipo_dato = TipoDatoCreate(
                nombre=tipo["nombre"],
                unidad=tipo["unidad"],
                rango_minimo=tipo["rango_minimo"],
                rango_maximo=tipo["rango_maximo"]
            )
            try:
                crear_tipo_dato(db, tipo_dato)
            except Exception as e:
                pass
    finally:
        db.close()

    # Iniciar el suscriptor MQTT
    start_mqtt_thread()

if __name__ == "__main__":
    # Ejecutar la aplicación FastAPI con Uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
