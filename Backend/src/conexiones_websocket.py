from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter()

# Lista para almacenar conexiones activas
clientes_alertas: List[WebSocket] = []
clientes_ultima_medicion: List[WebSocket] = []

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    tipo_cliente = await websocket.receive_text()  # Recibir tipo_cliente como mensaje
    # Agregar a la lista correspondiente
    if tipo_cliente == "alertas":
        clientes_alertas.append(websocket)
    elif tipo_cliente == "ultima_medicion":
        clientes_ultima_medicion.append(websocket)
    
    try:
        while True:
            await websocket.receive_text()  # Espera mensajes
    except WebSocketDisconnect:
        # Eliminar el cliente de la lista correcta al desconectarse
        if tipo_cliente == "alertas":
            clientes_alertas.remove(websocket)
        elif tipo_cliente == "ultima_medicion":
            clientes_ultima_medicion.remove(websocket)
