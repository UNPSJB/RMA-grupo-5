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
from src.nodo.services import crear_tipo_dato, verificar_mediciones_nodo
from src.suscriptor.sub import Subscriptor
from src.suscriptor.config import config
from src.suscriptor.services import procesar_mensaje
from src import config_cors

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated
from fastapi.exceptions import HTTPException
import jwt
import time

load_dotenv()

TOPIC = os.getenv("MQTT_TOPIC")
ENV = os.getenv("ENV")
ROOT_PATH = os.getenv(f"ROOT_PATH_{ENV.upper()}")

# FastAPI configuration
app = FastAPI(root_path=ROOT_PATH)

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"


# Configuracion de CORS
config_cors.add_cors(app)

# Asociar los routers a nuestra app
app.include_router(example_router)

# esta dependencia nos genera un token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Usuarios simulados en un diccionario
users = {
    "user1": {"username": "yami", "password": "123"},
    "user2": {"username": "user2", "password": "user2"},
}

# Generar el token con una expiración
def encode_token(payload: dict) -> str:
    payload["exp"] = time.time() + 600  # El token expira en 10 minutos
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

# Decodificar el token para obtener el usuario
def decode_token(token: Annotated[str, Depends(oauth2_scheme)]) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("username")
        user = users.get(username)
        if not user:
            raise HTTPException(status_code=401, detail="Usuario no autorizado")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")

@app.post("/token")
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = users.get(form_data.username)
    if not user or user["password"] != form_data.password:
        raise HTTPException(status_code=400, detail="Usuario o contraseña incorrectos")
    token = encode_token({"username": user["username"]})
    return {"access_token": token, "token_type": "bearer"}

# Endpoint protegido para obtener datos del usuario
@app.get("/users/profile")
def profile(my_user: Annotated[dict, Depends(decode_token)]):
    return my_user

'''#PARA HACER LA REDIRECCION
@app.get("/protected-route")
def check_auth():
    raise HTTPException(
        status_code=401,
        detail="Usuario no autenticado. Redirigir al login."
    )'''


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

# Iniciar el hilo que ejecutará la función cada 1 minuto
def start_revisar_estado_thread():
    db = SessionLocal()
    thread = Thread(target=verificar_mediciones_nodo, args=(db,), daemon=True)
    thread.start()

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

    # Iniciar el hilo que revisa el estado de los nodos cada minuto
    start_revisar_estado_thread()

    # Iniciar el suscriptor MQTT
    start_mqtt_thread()

if __name__ == "__main__":
    # Ejecutar la aplicación FastAPI con Uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)