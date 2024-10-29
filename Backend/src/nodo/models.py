from typing import List
from sqlalchemy import Boolean, Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from src.db_models import BaseModel
from enum import IntEnum

UTC = timezone.utc

# Definimos el Enum para los tipos de dato
class TipoDato(IntEnum):
    status_t = 0      # Estado
    temp_t = 1        # Temperatura
    temp2_t = 2       # Temperatura #2
    humidity_t = 3    # Humedad Relativa
    pressure_t = 4    # Presión Atmosférica
    light_t = 5       # Luz (lux)
    soil_t = 6        # Humedad del Suelo
    soil2_t = 7       # Humedad del Suelo #2
    soilr_t = 8       # Resistencia del Suelo
    soilr2_t = 9      # Resistencia del Suelo #2
    oxygen_t = 10     # Oxígeno
    co2_t = 11        # Dióxido de Carbono
    windspd_t = 12    # Velocidad del Viento
    windhdg_t = 13    # Dirección del Viento
    rainfall_t = 14   # Precipitación
    motion_t = 15     # Movimiento
    voltage_t = 16    # Voltaje
    voltage2_t = 17   # Voltaje #2
    current_t = 18    # Corriente
    current2_t = 19   # Corriente #2
    it_t = 20         # Iteraciones
    latitude_t = 21   # Latitud GPS
    longitude_t = 22  # Longitud GPS
    altitude_t = 23   # Altitud GPS
    hdop_t = 24       # HDOP GPS (Horizontal Dilution of Precision)
    level_t = 25      # Nivel de Fluido
    uv_t = 26         # Radiación UV
    pm1_t = 27        # Partículas 1 
    pm2_5_t = 28      # Partículas 2.5
    pm10_t = 29       # Partículas 10 
    power_t = 30      # Potencia
    power2_t = 31     # Potencia #2
    energy_t = 32     # Energía
    energy2_t = 33    # Energía #2
    weight_t = 34     # Peso
    weight2_t = 35    # Peso #2


#Modelo base para nodos
class Nodo(BaseModel):
    __tablename__ = 'nodos'

    numero = Column(Integer, primary_key=True, index=True)
    nombre = Column(String) 
    ubicacion_x = Column(Float)
    ubicacion_y = Column(Float)
    is_activo = Column(Boolean, default=True)
    mediciones = relationship("Medicion", back_populates="nodo")

    

# Modelo base para mediciones
class Medicion(BaseModel):
    __tablename__ = 'mediciones'

    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(TipoDato), nullable=False)
    data = Column(String, nullable=False)
    time = Column(DateTime, nullable=False)
    es_erroneo = Column(Boolean, default=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    fecha_modificacion = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    nodo_numero = Column(Integer, ForeignKey('nodos.numero'), nullable=True)  # Clave foránea
    nodo = relationship("Nodo", back_populates="mediciones")  # Relación con la tabla Nodo