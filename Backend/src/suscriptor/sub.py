import sys
import logging
from config import config
import paho.mqtt.client as paho
from typing import Callable, Optional
from datetime import datetime
from dataclasses import dataclass


@dataclass
class Subscriptor:
    client: paho.Client
    message_counter: int = 0
    logger_enabled: bool = True
    on_message_callback: Optional[Callable[str, None]] = None

    def __post_init__(self) -> None:
        self.set_event_handlers()

    def set_event_handlers(self) -> None:

        def on_subscribe(_, userdata, mid, granted_qos) -> None:
            print(f"suscrito a {config.topic}!")

        def on_message(_, userdata, msg) -> None:
            message = msg.payload.decode()
            self.message_counter += 1
            if self.on_message_callback:
                self.on_message_callback(message)
            else:
                self.client.logger.warning(message)

        def on_connect(_, obj, flags, reason_code) -> None:
            if self.client.is_connected():
                print("Suscriptor conectado!")
                self.subscribe(config.topic, 1)

        def on_disconnect(_, userdata, rc) -> None:
            print(f"total messages received: {self.message_counter}")
            print("disconnected!")
            # print(f"{userdata=} - {rc=}")
            sys.exit(1)

        self.client.max_queued_messages_set(0)
        self.client.enable_logger()
        self.client.on_connect = on_connect
        self.client.on_subscribe = on_subscribe
        self.client.on_message = on_message
        self.client.on_disconnect = on_disconnect

    def subscribe(self, topic: str, qos: int) -> None:
        self.client.subscribe(topic=topic, qos=qos)

    def connect(self, host: str, port: int, keepalive: int) -> None:

        if self.client.connect(host, port, keepalive) != 0:
            print("Ha ocurrido un problema al conectar con el broker MQTT")
            sys.exit(1)

        try:
            print("Presione CTRL+C para salir...")
            self.client.loop_forever()
        except Exception as e:
            print("Algo malió sal...")
            print(e)
        finally:
            print("Desconectando del broker MQTT")
            self.disconnect()

    def disconnect(self):
        self.client.disconnect()

def custom_callback(msj: str) -> None:
    print(f"[Callback]: {msj}")

if __name__ == "__main__":
    
    sub = Subscriptor(client=paho.Client(), on_message_callback=custom_callback)
    sub.connect(config.host, config.port, config.keepalive)
