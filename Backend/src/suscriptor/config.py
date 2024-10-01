import os
from collections import namedtuple
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()

Config = namedtuple('Config', ['topic', 'host', 'port', 'keepalive'])
config = Config(
    topic = os.getenv("MQTT_TOPIC"),
    host = os.getenv("MQTT_HOST"), 
    port = int(os.getenv("MQTT_PORT")), 
    keepalive = int(os.getenv("MQTT_KEEPALIVE"))
)
