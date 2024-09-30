# rma-generador
Generador de datos sintéticos para Red de Monitoreo Ambiental

### Cómo ejecutar:
0. Renombrar .env.template a .env y añadir:
    MQTT_TOPIC="test_topic"
    MQTT_HOST="localhost"
    MQTT_PORT=1883
    MQTT_KEEPALIVE=60
1. Crear un entorno virtual con [venv](https://docs.python.org/3/library/venv.html): `python -m venv Envs/rma-generador`. La carpeta `Envs` debiera existir mientras que `rma-generador` será creada por venv.
2. Activar el entorno virtual, ver cómo activarlo según nuestro SO en la [tabla](https://docs.python.org/3/library/venv.html#how-venvs-work). 
3. Instalar las dependencias con: `pip install -r requirements.txt` .
4. En una terminal ejecutar el script `main.py`: `python main.py`
5. En otra terminal, ejecutar el suscriptor `sub.py`: `python mqtt/sub.py`, si estamos en la carpeta raíz del proyecto. 

**Observaciones:**
Para que el proyecto funcione se necesita tener `mosquitto` instalado en el sistema. Se puede descargar desde el siguiente enlace: [https://mosquitto.org/download/](https://mosquitto.org/download/). 
Una vez instalado, verificar que el servicio de mosquitto ha iniciado. Caso contrario, iniciar manualmente.
La conexión por defecto se hará en `localhost:1883` con el topic `test_topic` tal como lo indica el archivo `.env`. 

