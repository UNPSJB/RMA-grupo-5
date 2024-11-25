from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Función para agregar CORS a la app
def add_cors(app):
    origins = [
        "http://localhost:3000",  # Frontend en React
        "http://localhost:8000",  # Backend en FastAPI
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins="http://localhost:3000",  # Especifica los orígenes permitidos
        allow_credentials=True,  # Permite el envío de cookies con las solicitudes
        allow_methods=["*"],  # Permite todos los métodos HTTP
        allow_headers=["*"],  # Permite todos los encabezados
    )

add_cors(app)
