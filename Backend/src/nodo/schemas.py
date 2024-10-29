from pydantic import BaseModel, Field
from typing import List, Optional
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
    nombre: Optional [str] = None
    ubicacion_x: float 
    ubicacion_y: float 
    is_activo: bool = True 

    class Config:
        from_attributes = True
        
    def estado(self):
        return ('<span class="text-success badge badge-success text-white"> Activo </span>'
                if self.is_activo
                else
                '<span class="text-success badge badge-danger text-white"> Inactivo </span>')

# Clases de creación y actualización de Nodo
class NodoCreate(NodoBase):
    numero: int
    nombre: str
    ubicacion_x: float 
    ubicacion_y: float 
    is_activo: bool = True 

class NodoUpdate(NodoBase):
    nombre: Optional[str] = None
    ubicacion_x: Optional[float] = None
    ubicacion_y: Optional[float] = None
    is_activo: Optional[bool] = None

class Nodo(NodoBase):
    numero: int