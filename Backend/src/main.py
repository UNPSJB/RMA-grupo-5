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
from src.nodo.services import crear_medicion
from src.nodo.schemas import MedicionCreate
from src.nodo.models import Medicion, TipoDato
from src.suscriptor.sub import Subscriptor
from src.suscriptor.config import config

load_dotenv()

TOPIC = os.getenv("MQTT_TOPIC")
ENV = os.getenv("ENV")
ROOT_PATH = os.getenv(f"ROOT_PATH_{ENV.upper()}")

# FastAPI configuration
app = FastAPI(root_path=ROOT_PATH)

# Configuración de CORS
origins = [
    "http://localhost:8000",
    "http://localhost:3000"
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
 
# Callback
def mi_callback(mensaje: str) -> None:
    db: Session = SessionLocal()

    try:
        # Reemplazar comillas simples por comillas dobles para cumplir con el formato JSON
        mensaje = mensaje.replace("'", '"')

        mensaje_dict = json.loads(mensaje)
        time_dt = datetime.fromisoformat(mensaje_dict['time'])
        type_dt = TipoDato[mensaje_dict['type']]

        # Crear un objeto MedicionCreate
        medicion = MedicionCreate(
            nodo_numero= mensaje_dict['id'],
            type=type_dt,
            data=mensaje_dict['data'],
            time=time_dt
        )
        crear_medicion(db, medicion)
        
        
        # Enviar el nodo a través de WebSocket a los clientes conectados
        for client in connected_clients:
            asyncio.create_task(client.send_text(json.dumps(mensaje_dict)))

    except Exception as e:
        print(f"Error al procesar el mensaje: {e}")
    finally:
        db.close()

# Start the MQTT subscriber in a separate thread
def run_mqtt_subscriber():
    sub  = Subscriptor(client=Client(), on_message_callback=mi_callback)
    
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
    # Crear las tablas en la base de datos si no existen
    from src.db_models import Base
    Base.metadata.create_all(bind=engine)
    
    start_mqtt_thread()

if __name__ == "__main__":
    # Ejecutar la aplicación FastAPI con Uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
