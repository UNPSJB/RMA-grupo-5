import os, sys, json
from dotenv import load_dotenv
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from threading import Thread
import uvicorn
from paho.mqtt.client import Client

from src.config_db import engine, SessionLocal
from src.db_models import BaseModel
from src.nodo.router import router as example_router
from src.nodo.services import crear_nodo
from src.nodo.schemas import NodoCreate
from src.nodo.models import TipoDato
from src.suscriptor import sub, config

load_dotenv()

TOPIC = os.getenv("MQTT_TOPIC")
ENV = os.getenv("ENV")
ROOT_PATH = os.getenv(f"ROOT_PATH_{ENV.upper()}")

# FastAPI configuration
app = FastAPI(root_path=ROOT_PATH)

# Configuración de CORS
origins = [
    "http://localhost:8000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Asociar los routers a nuestra app
app.include_router(example_router)

# Callback function to handle incoming messages
def mi_callback(mensaje: str) -> None:
    print(f"Mensaje recibido: {mensaje}")

    # Crear la sesión de la base de datos
    db: Session = SessionLocal()

    try:
        # Decodificar el mensaje JSON
        mensaje_dict = json.loads(mensaje)
        time_dt = datetime.fromisoformat(mensaje_dict['time'])
        type_dt = TipoDato[mensaje_dict['type']]

        # Crear un objeto NodoCreate
        nodo = NodoCreate(
            id=mensaje_dict['id'],
            type=type_dt,
            data=mensaje_dict['data'],
            time=time_dt
        )

        # Guardar el nodo en la base de datos
        crear_nodo(db, nodo)
        print(f"Nodo creado y guardado: {nodo}")

    except Exception as e:
        print(f"Error al procesar el mensaje: {e}")
    finally:
        db.close()

# Start the MQTT subscriber in a separate thread
def run_mqtt_subscriber():
    sub = sub(client=Client(), on_message_callback=mi_callback)
    
    # Conectar al broker MQTT usando la configuración
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
    start_mqtt_thread()

if __name__ == "__main__":
    # Ejecutar la aplicación FastAPI con Uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

