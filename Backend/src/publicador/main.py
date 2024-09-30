import sys
import argparse
import threading
import signal
import random
import paho.mqtt.client as paho
from mqtt import TipoMensaje
from mqtt.pub import Nodo


def signal_handler(sig, frame):
    print("Deteniendo nodos...")
    stop_event.set()


if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-n",
        "--nodos",
        type=int,
        default=1,
        help="Cantidad de nodos para la cual generar datos. (default=1)",
    )

    stop_event = threading.Event()
    signal.signal(signal.SIGINT, signal_handler)
    
    args = parser.parse_args()
    lista_nodos = [Nodo(i, frecuencia=random.randint(5, 10), stop_event=stop_event)for i in range(args.nodos)]
    print(f"{len(lista_nodos)} nodo/s creado/s. Publicando...")

    for nodo in lista_nodos:
        thread = threading.Thread(target=nodo.publicar,args=("test_topic", TipoMensaje.ALTITUDE_T),)
        thread.start()
