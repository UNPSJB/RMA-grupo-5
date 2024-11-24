from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter()

# Lista para almacenar conexiones activas
connected_clients: List[WebSocket] = []

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()  # Aceptar la conexión websocket
    connected_clients.append(websocket)  # Añadir el websocket a la lista de conexiones activas

    try:
        while True:
            await websocket.receive_text()  # Esperar a recibir mensajes
    except WebSocketDisconnect:
        connected_clients.remove(websocket) 
