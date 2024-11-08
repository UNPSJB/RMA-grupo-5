from typing import List
from sqlalchemy import Boolean, Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from src.db_models import BaseModel

UTC = timezone.utc

# Modelo para la tabla EstadoNodo
class EstadoNodo(BaseModel):
    __tablename__ = 'estados_nodo'

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String,nullable=False, index=True)
    nodos = relationship("Nodo", back_populates="estado")
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    fecha_modificacion = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Modelo para la tabla TipoDato
class TipoDato(BaseModel):
    __tablename__ = 'tipos_dato'

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False, unique=True) 
    unidad = Column(String, nullable=False)     
    rango_minimo = Column(Float, nullable=True)          
    rango_maximo = Column(Float, nullable=True)     
    mediciones = relationship("Medicion", back_populates="tipo_dato")
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    fecha_modificacion = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Modelo base para nodos
class Nodo(BaseModel):
    __tablename__ = 'nodos'

    numero = Column(Integer, primary_key=True, index=True)
    nombre = Column(String) 
    longitud = Column(Float)
    latitud = Column(Float)
    estado_nodo_id = Column(String, ForeignKey('estados_nodo.id'), nullable=False)
    estado = relationship("EstadoNodo", back_populates="nodos")
    mediciones = relationship("Medicion", back_populates="nodo")
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    fecha_modificacion = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Modelo base para mediciones
class Medicion(BaseModel):
    __tablename__ = 'mediciones'

    id = Column(Integer, primary_key=True, index=True)
    data = Column(String, nullable=False)
    time = Column(DateTime, nullable=False)
    es_erroneo = Column(Boolean, default=False)
    nodo_numero = Column(Integer, ForeignKey('nodos.numero'), nullable=True)
    nodo = relationship("Nodo", back_populates="mediciones")  
    tipo_dato_id = Column(String, ForeignKey('tipos_dato.id'), nullable=False)
    tipo_dato = relationship("TipoDato", back_populates="mediciones")
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    fecha_modificacion = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Registro(BaseModel):
    __tablename__ = 'registros'

    usuario = Column(String(10), primary_key=True)
    contrasenia = Column(String(8), nullable=False)
