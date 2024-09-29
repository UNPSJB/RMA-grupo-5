import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI, Request, WebSocket
from fastapi.responses import JSONResponse
from src.config_db import engine
from src.db_models import BaseModel
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# importamos los routers desde nuestros modulos
from src.nodo.router import router as example_router



ENV = os.getenv("ENV")
ROOT_PATH = os.getenv(f"ROOT_PATH_{ENV.upper()}")


@asynccontextmanager
async def db_creation_lifespan(app: FastAPI):
    BaseModel.metadata.create_all(bind=engine)
    yield


app = FastAPI(root_path=ROOT_PATH, lifespan=db_creation_lifespan)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Mensaje recibido: {data}")  # Agrega un print aquí para depuración
            await websocket.send_text(f"Mensaje recibido: {data}")
    except Exception as e:
        print(f"Error: {e}")

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

# asociamos los routers a nuestra app
app.include_router(example_router)



