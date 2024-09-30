import os, json
import sys
import time
import random
import threading
import paho.mqtt.client as paho
from typing import Optional
from datetime import datetime
from dataclasses import dataclass
from pydantic import BaseModel
from mqtt import TipoMensaje
from dotenv import load_dotenv

load_dotenv()


class Mensaje(BaseModel):
    id: int
    type: str
    data: str
    time: str


@dataclass
class Nodo:
    id: int
    stop_event: threading.Event
    cliente: paho.Client = paho.Client()
    frecuencia: int = 10  # cada cuantos segundos publica mensajes?

    def publicar(
        self,
        topic: str,
        tipo: TipoMensaje,
        message: str = "",
        qos: int = 1,
    ) -> None:
        if not self.cliente.is_connected():
            host = os.getenv("MQTT_HOST")
            port = int(os.getenv("MQTT_PORT"))
            keepalive = int(os.getenv("MQTT_KEEPALIVE"))
            self.conectar(host, port, keepalive)

        while not self.stop_event.is_set():
            if len(message) == 0:
                message = str(random.uniform(22.0, 25.0))

            mensaje = self.formatear_mensaje(
                topic,
                tipo,
                message,
            )

            self.cliente.publish(
                topic,
                mensaje,
                qos,
            )

            print(mensaje)
            time.sleep(self.frecuencia)
            message = ""

        self.desconectar()

    def conectar(self, host: str, port: int = 1883, keepalive: int = 60) -> None:
        if self.cliente.connect(host, port, keepalive) != 0:
            print("Ha ocurrido un error al conectar al broker MQTT")
        print("Conectado al broker MQTT!")

    def desconectar(self):
        self.cliente.disconnect()

    def formatear_mensaje(self, topic: str, tipo: TipoMensaje, mensaje: str) -> str:
        mensaje_dict = Mensaje(
            id=self.id, type=tipo, data=str(mensaje), time=str(datetime.now())
        ).model_dump()  # Cambiar a dict
        return json.dumps(mensaje_dict)  # Convertir el diccionario a formato JSON
