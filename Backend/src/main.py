import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import threading
from src.config_db import engine
from src.db_models import BaseModel
# Importa el router
from src.nodo.router import router as example_router
# Importa la función de suscripción
from src.generador import sub  # Asegúrate de que esta es la ruta correcta

load_dotenv()

ENV = os.getenv("ENV")
ROOT_PATH = os.getenv(f"ROOT_PATH_{ENV.upper()}")

@asynccontextmanager
async def db_creation_lifespan(app: FastAPI):
    BaseModel.metadata.create_all(bind=engine)
    yield

app = FastAPI(root_path=ROOT_PATH, lifespan=db_creation_lifespan)

<<<<<<< Updated upstream
=======
# Configuración de CORS
>>>>>>> Stashed changes
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

# Función para iniciar el suscriptor en un hilo
def start_mqtt_subscriber():
    sub()

@app.on_event("startup")
async def startup_event():
    # Inicia el suscriptor en un hilo separado
    threading.Thread(target=start_mqtt_subscriber, daemon=True).start()

@app.on_event("shutdown")
async def shutdown_event():
    # Aquí puedes agregar la lógica para detener el cliente MQTT, si es necesario
    pass  # Implementa esto según tu necesidad
