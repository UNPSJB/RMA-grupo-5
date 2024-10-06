from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from src.nodo.models import TipoDato

# Clase base Medicion
class MedicionBase(BaseModel):
    type: TipoDato 
    data: str
    time: datetime 
    nodo_numero: int

    class Config:
        arbitrary_types_allowed = True  # Permitir tipos arbitrarios como Nodo
        from_attributes = True

# Clases de creación y actualización de Medicion
class MedicionCreate(MedicionBase):
    type: TipoDato
    data: str 
    time: datetime 
    nodo_numero: int

class MedicionUpdate(MedicionBase):
    pass

class Medicion(MedicionBase):
    id: int
    nodo_numero: int

# Clase Nodo
class NodoBase(BaseModel):
    numero: int
    ubicacion_x: float 
    ubicacion_y: float 

    class Config:
        from_attributes = True

# Clases de creación y actualización de Nodo
class NodoCreate(NodoBase):
    numero: int
    ubicacion_x: float 
    ubicacion_y: float 

class NodoUpdate(NodoBase):
    pass

class Nodo(NodoBase):
    numero: int