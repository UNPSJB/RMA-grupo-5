from pydantic import BaseModel, Field, constr
from typing import List, Optional
from datetime import datetime

# Clase base para EstadoNodo
class EstadoNodoBase(BaseModel):
    nombre: str

    class Config:
        from_attributes = True

class EstadoNodoCreate(EstadoNodoBase):
    nombre: str 

class EstadoNodoUpdate(EstadoNodoBase):
    nombre: Optional[str] = None

# Clase para representar un EstadoNodo
class EstadoNodo(EstadoNodoBase):
    id: int
    nombre: str

# Clase base para TipoDato
class TipoDatoBase(BaseModel):
    nombre: str 
    unidad: str
    rango_minimo: float
    rango_maximo: float

    class Config:
        from_attributes = True

class TipoDatoCreate(TipoDatoBase):
    nombre: str 
    unidad: str
    rango_minimo: Optional[float] = None
    rango_maximo: Optional[float] = None

class TipoDatoUpdate(TipoDatoBase):
    pass

# Clase para representar un TipoDato
class TipoDato(TipoDatoBase):
    id: int

# Clase base Medicion
class MedicionBase(BaseModel):
    data: str
    time: datetime
    nodo_numero: int
    es_erroneo: bool

    class Config:
        from_attributes = True

# Clases de creación y actualización de Medicion
class MedicionCreate(MedicionBase):
    tipo_dato_nombre: str
    data: str
    time: datetime
    nodo_numero: int
    es_erroneo: bool

class MedicionUpdate(MedicionBase):
    pass

# Clase para representar una Medicion completa
class Medicion(MedicionBase):
    id: int
    tipo_dato_id: int
    data: str
    time: datetime
    nodo_numero: int
    es_erroneo: bool

# Clase base Nodo
class NodoBase(BaseModel):
    numero: int
    nombre: Optional[str] = None
    longitud: float
    latitud: float
    class Config:
        from_attributes = True

# Clases de creación y actualización de Nodo
class NodoCreate(NodoBase):
    numero: int
    nombre: str
    longitud: float
    latitud: float
    estado_nodo_nombre: str

class NodoUpdate(NodoBase):
    nombre: Optional[str] = None
    longitud: Optional[float] = None
    latitud: Optional[float] = None
    estado_nodo: Optional[int] = None

# Clase para representar un Nodo completo
class Nodo(NodoBase):
    numero: int
    estado_nodo_id: int

# Clase base para Registro
class RegistroBase(BaseModel):
    usuario: str 
    contrasenia: str

# Clase para crear un nuevo registro (sign up)
class RegistroCreate(RegistroBase):
    pass

# Clase para actualizar un registro existente (update)
class RegistroUpdate(BaseModel):
    contrasenia: Optional[str] 

# Clase para representar un registro completo (leer o mostrar datos)
class Registro(RegistroBase):
    contrasenia: str

    class Config:
       from_attributes = True