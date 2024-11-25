from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter()

# Listas para almacenar conexiones activas
clientes_alertas: List[WebSocket] = []
clientes_ultima_medicion: List[WebSocket] = []

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        # Recibe el mensaje inicial para determinar el tipo de cliente
        mensaje_inicial = await websocket.receive_json()
        tipo_cliente = mensaje_inicial.get("tipo_cliente")
        
        # Agrega el WebSocket a la lista correspondiente
        if tipo_cliente == "alertas":
            clientes_alertas.append(websocket)
        elif tipo_cliente == "ultima_medicion":
            clientes_ultima_medicion.append(websocket)
        
        # Mantén la conexión abierta
        while True:
            await websocket.receive_text()  # Escucha mensajes (si es necesario)

    except WebSocketDisconnect:
        # Elimina el cliente al desconectarse
        if websocket in clientes_alertas:
            clientes_alertas.remove(websocket)
        elif websocket in clientes_ultima_medicion:
            clientes_ultima_medicion.remove(websocket)
    except Exception as e:
        print(f"Error en WebSocket: {e}")

# Función para enviar alertas a todos los clientes conectados
async def enviar_alertas(alerta):
    for cliente in clientes_alertas:
        try:
            await cliente.send_json(alerta)
        except WebSocketDisconnect:
            clientes_alertas.remove(cliente)

# Endpoint para probar enviar una alerta
@router.post("/enviar-alerta/")
async def enviar_alerta_manual():
    alerta = {
        "tipo_alerta": 2,
        "estado": True,
        "valor_medicion": 1.20,
        "tipo_dato_id": 1,
        "nodo_numero": 0
    }
    await enviar_alertas(alerta)
    return {"status": "Alerta enviada"}
