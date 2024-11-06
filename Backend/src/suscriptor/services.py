from sqlalchemy.orm import Session
import json
from datetime import datetime
from src.nodo.schemas import MedicionCreate
from src.nodo.services import crear_medicion, obtener_nodo
from src.nodo.models import TipoDato

def medicion_es_correcta(data: str, type_dt: TipoDato, time_dt: datetime) -> bool:
    # Intenta convertir data a un float
    try:
        data_float = float(data)
    except ValueError:
        return True  # Si no es convertible, es un error

    # Verifica si el tipo de dato es válido
    tipos_validos = {tipo.name for tipo in TipoDato}  # Obtiene todos los tipos válidos
    if type_dt.name not in tipos_validos:
        return True  # Si el tipo no es válido, marcar como erróneo

    # Definir los tipos de datos que no deben ser negativos
    tipos_con_negativo_no_permitido = {
        TipoDato.light_t, TipoDato.oxygen_t, TipoDato.rainfall_t, TipoDato.level_t,
        TipoDato.windspd_t, TipoDato.uv_t, TipoDato.pressure_t, TipoDato.co2_t,
        TipoDato.voltage_t, TipoDato.voltage2_t, TipoDato.current_t, TipoDato.current2_t,
        TipoDato.pm1_t, TipoDato.pm2_5_t, TipoDato.pm10_t, TipoDato.power_t, 
        TipoDato.power2_t, TipoDato.energy_t, TipoDato.energy2_t, TipoDato.weight_t, 
        TipoDato.weight2_t
    }
    
    # Validar valores no negativos para los tipos de datos
    if type_dt in tipos_con_negativo_no_permitido and data_float < 0:
        return True  # Error: valor negativo
    
    # Validar que la fecha no sea futura a la actual
    if time_dt > datetime.now():
        return True  # Error: fecha futura
    
    # Validar rangos específicos de tipos de datos
    if type_dt in {TipoDato.temp_t, TipoDato.temp2_t} and (data_float < -50 or data_float > 60):
        return True  # Error: temperatura fuera de rango
    elif type_dt == TipoDato.humidity_t and (data_float < 0 or data_float > 100):
        return True  # Error: humedad fuera de rango
    elif type_dt == TipoDato.latitude_t and (data_float < -90 or data_float > 90):
        return True  # Error: latitud fuera de rango
    elif type_dt == TipoDato.longitude_t and (data_float < -180 or data_float > 180):
        return True  # Error: longitud fuera de rango
    elif type_dt == TipoDato.hdop_t and (data_float < 0 or data_float > 50):
        return True  # Error: HDOP fuera de rango
    elif type_dt in {TipoDato.soil_t, TipoDato.soil2_t} and (data_float < 0 or data_float > 100):
        return True  # Error: humedad del suelo fuera de rango
    elif type_dt in {TipoDato.soilr_t, TipoDato.soilr2_t} and data_float < 0:
        return True  # Error: resistencia del suelo negativa
    elif type_dt == TipoDato.co2_t and (data_float < 0 or data_float > 5000):
        return True  # Error: CO2 fuera de rango
    elif type_dt == TipoDato.windhdg_t and (data_float < 0 or data_float > 360):
        return True  # Error: dirección del viento fuera de rango
    elif type_dt in {TipoDato.voltage_t, TipoDato.voltage2_t} and (data_float < 0 or data_float > 600):
        return True  # Error: voltaje fuera de rango
    elif type_dt in {TipoDato.current_t, TipoDato.current2_t} and (data_float < 0 or data_float > 100):
        return True  # Error: corriente fuera de rango
    elif type_dt == TipoDato.level_t and (data_float < 0 or data_float > 100):
        return True  # Error: nivel fuera de rango
    elif type_dt == TipoDato.uv_t and (data_float < 0 or data_float > 11):
        return True  # Error: índice UV fuera de rango
    elif type_dt in {TipoDato.pm1_t, TipoDato.pm2_5_t, TipoDato.pm10_t} and (data_float < 0 or data_float > 1000):
        return True  # Error: PM fuera de rango
    elif type_dt in {TipoDato.power_t, TipoDato.power2_t} and (data_float < 0 or data_float > 10000):
        return True  # Error: potencia fuera de rango
    elif type_dt in {TipoDato.energy_t, TipoDato.energy2_t} and data_float < 0:
        return True  # Error: energía negativa
    elif type_dt in {TipoDato.weight_t, TipoDato.weight2_t} and (data_float < 0 or data_float > 10000):
        return True  # Error: peso fuera de rango

    return False  # No hay errores

def procesar_mensaje(mensaje: str, db: Session) -> None:
    # Reemplazar comillas simples por comillas dobles para cumplir con el formato JSON
    mensaje = mensaje.replace("'", '"')
    mensaje_dict = json.loads(mensaje)

    # Comprobar si el nodo existe; si no, se ignora la medición
    nodo_numero = mensaje_dict['id']
    try:
        obtener_nodo(db, nodo_numero)
    except Exception as e:
        return  # Se puede agregar un log para el error si es necesario
    
    time_dt = datetime.fromisoformat(mensaje_dict['time'])
    tipo_str = mensaje_dict['type']  # Almacena el tipo de dato como una cadena
    valor_data = mensaje_dict['data']
    
    # Verifica si el tipo de dato es válido
    es_erroneo = False
    try:
        type_dt = TipoDato[tipo_str]  # Intenta convertir a TipoDato
    except KeyError:
        es_erroneo = True  # Si el tipo no está en la enumeración, marcar como erróneo
        type_dt = TipoDato.UNKNOWN  # Asigna un valor para tipos desconocidos
    
    # Validar la medición
    if not es_erroneo:
        es_erroneo = medicion_es_correcta(valor_data, type_dt, time_dt)

    medicion = MedicionCreate(
        type=type_dt,  # Se usa UNKNOWN si el tipo es erróneo
        data=valor_data,
        time=time_dt,
        nodo_numero=nodo_numero,
        es_erroneo=es_erroneo
    )
    
    crear_medicion(db, medicion)

