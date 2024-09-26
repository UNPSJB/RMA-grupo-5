from typing import List, Optional
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, UTC, time
from src.db_models import BaseModel
from enum import IntEnum


# Definimos el Enum para los tipos de dato
class TipoDato(IntEnum):
    STATUS_T = 0      # Estado
    TEMP_T = 1        # Temperatura
    TEMP2_T = 2       # Temperatura #2
    HUMIDITY_T = 3    # Humedad Relativa
    PRESSURE_T = 4    # Presión Atmosférica
    LIGHT_T = 5       # Luz (lux)
    SOIL_T = 6        # Humedad del Suelo
    SOIL2_T = 7       # Humedad del Suelo #2
    SOILR_T = 8       # Resistencia del Suelo
    SOILR2_T = 9      # Resistencia del Suelo #2
    OXYGEN_T = 10     # Oxígeno
    CO2_T = 11        # Dióxido de Carbono
    WINDSPD_T = 12    # Velocidad del Viento
    WINDHDG_T = 13    # Dirección del Viento
    RAINFALL_T = 14   # Precipitación
    MOTION_T = 15     # Movimiento
    VOLTAGE_T = 16    # Voltaje
    VOLTAGE2_T = 17   # Voltaje #2
    CURRENT_T = 18    # Corriente
    CURRENT2_T = 19   # Corriente #2
    IT_T = 20         # Iteraciones
    LATITUDE_T = 21   # Latitud GPS
    LONGITUDE_T = 22  # Longitud GPS
    ALTITUDE_T = 23   # Altitud GPS
    HDOP_T = 24       # HDOP GPS (Horizontal Dilution of Precision)
    LEVEL_T = 25      # Nivel de Fluido
    UV_T = 26         # Radiación UV
    PM1_T = 27        # Partículas 1 
    PM2_5_T = 28      # Partículas 2.5
    PM10_T = 29       # Partículas 10 
    POWER_T = 30      # Potencia
    POWER2_T = 31     # Potencia #2
    ENERGY_T = 32     # Energía
    ENERGY2_T = 33    # Energía #2
    WEIGHT_T = 34     # Peso
    WEIGHT2_T = 35    # Peso #2


# Modelo base para nodos
class Nodo(BaseModel):
    __tablename__ = 'nodos'

    id = Column(Integer, primary_key=True, index=True)
    type = Column(Integer, nullable=False)
    data = Column(String, nullable=False)  # Asegúrate de que este campo sea de tipo String
    time = Column(Float, nullable=False)  # Este campo debe ser de tipo Float
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    fecha_modificacion = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
