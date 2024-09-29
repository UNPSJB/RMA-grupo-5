from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from src.nodo.models import TipoDato

# Clase base Nodo
class NodoBase(BaseModel):
    type: TipoDato 
    data: str
    time: float 

    class Config:
        from_attributes = True

# Clases de creación y actualización de Nodo
class NodoCreate(NodoBase):
    type: TipoDato
    data: str 
    time: float 

class NodoUpdate(NodoBase):
    pass

class Nodo(NodoBase):
    id: int

# Para validar que el tipo sea uno de los permitidos
def validate_type(value: int) -> int:
    valid_types = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 
        11, 12, 13, 14, 15, 16, 17, 18, 
        19, 20, 21, 22, 23, 24, 25, 26, 
        27, 28, 29, 30, 31, 32, 33, 34, 
        35
    ]
    if value not in TipoDato:
        raise ValueError(f"Tipo de dato invalido: {value}. Debe ser un: {TipoDato}.")
    return value
