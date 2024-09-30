import os, sys, json, uvicorn
import paho.mqtt.client as paho
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from threading import Thread

from src.config_db import engine, SessionLocal
from src.db_models import BaseModel
from src.nodo.router import router as example_router
from src.nodo.services import crear_nodo
from src.nodo.models import Nodo, TipoDato

load_dotenv()

TOPIC = os.getenv("MQTT_TOPIC")
ENV = os.getenv("ENV")
ROOT_PATH = os.getenv(f"ROOT_PATH_{ENV.upper()}")

@asynccontextmanager
async def db_creation_lifespan(app: FastAPI):
    BaseModel.metadata.create_all(bind=engine)
    yield

app = FastAPI(root_path=ROOT_PATH, lifespan=db_creation_lifespan)

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

# Logica asociada al suscriptor
def message_handling(client, userdata, msg):
    # Crear la sesión de la base de datos
    db: Session = SessionLocal()

    # Decodifica el mensaje JSON
    mensaje_json = msg.payload.decode()
    
    # Convierte el JSON
    mensaje_dict = json.loads(mensaje_json)
    time_dt = datetime.fromisoformat(mensaje_dict['time'])
    type_dt = TipoDato[mensaje_dict['type']]
    
    # Crea el objeto Nodo
    nodo = Nodo(
        id=mensaje_dict['id'],
        type=mensaje_dict['type'],
        data=mensaje_dict['data'],
        time=time_dt
    )
    # Guardar el objeto en la base
    crear_nodo(db, nodo)

def on_connect(client, obj, flags, reason_code):
    if client.is_connected():
        print("Suscriptor conectado!")
        client.subscribe(TOPIC, qos=1)

def on_subscribe(client, userdata, mid, granted_qos):
    print(f"Suscrito a {TOPIC}!")

def run_mqtt():
    client = paho.Client()
    client.on_message = message_handling
    client.on_connect = on_connect
    client.on_subscribe = on_subscribe

    host = os.getenv("MQTT_HOST")
    port = int(os.getenv("MQTT_PORT"))
    keepalive = int(os.getenv("MQTT_KEEPALIVE"))

    if client.connect(host, port, keepalive) != 0:
        print("Ha ocurrido un problema al conectar con el broker MQTT")
        sys.exit(1)

    client.loop_forever()

# Inicia el hilo para el cliente MQTT
mqtt_thread = Thread(target=run_mqtt)
mqtt_thread.start()

# Asegúrate de que tu aplicación FastAPI siga ejecutándose
try:
    print("Presione CTRL+C para salir...")
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
except Exception as e:
    print("Algo malió sal...")
    print(e)
finally:
    print("Desconectando del broker MQTT")
    mqtt_thread.join()  # Espera a que el hilo de MQTT termine
