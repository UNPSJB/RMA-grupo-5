import os
import sys
import paho.mqtt.client as paho
from paho.mqtt.enums import MQTTProtocolVersion
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

TOPIC = os.getenv("MQTT_TOPIC")

def message_handling(client, userdata, msg):
    print(msg.payload.decode())


def on_connect(client: paho.Client, obj, flags, reason_code):
    if client.is_connected():
        print("Suscriptor conectado!")
        client.subscribe(TOPIC, qos=1)


def on_subscribe(client, userdata, mid, granted_qos):
    print(f"Suscrito a {TOPIC}!")


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


try:
    print("Presione CTRL+C para salir...")
    client.loop_forever()
except Exception as e:
    print("Algo malió sal...")
    print(e)
finally:
    print("Desconectando del broker MQTT")
    client.disconnect()
