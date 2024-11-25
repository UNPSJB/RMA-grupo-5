from pydantic import BaseModel, Field, constr
from typing import List, Optional
from datetime import datetime

# Clase base para TipoDato
class TipoDatoBase(BaseModel):
    nombre: str
    unidad: str
    rango_minimo: Optional[float] = None
    umbral_alerta_precaucion: Optional[float] = None
    umbral_alerta_peligro: Optional[float] = None
    rango_maximo: Optional[float] = None

    class Config:
        from_attributes = True

class TipoDatoCreate(TipoDatoBase):
    nombre: str 
    unidad: str
    rango_minimo: Optional[float] = None
    umbral_alerta_precaucion: Optional [float] = None
    umbral_alerta_peligro: Optional[float] = None
    rango_maximo: Optional[float] = None

class TipoDatoUpdate(TipoDatoBase):
    nombre: Optional[str] = None
    unidad: Optional[str] = None
    rango_minimo: Optional[float] = None
    umbral_alerta_precaucion: Optional[float] = None
    umbral_alerta_peligro: Optional[float] = None
    rango_maximo: Optional[float] = None

# Clase para representar un TipoDato
class TipoDato(TipoDatoBase):
    id: int

# Clase base Medicion
class MedicionBase(BaseModel):
    data: str
    time: datetime
    nodo_numero: int
    es_erroneo: bool
    tipo_dato_id: int

    class Config:
        from_attributes = True

# Clases de creación y actualización de Medicion
class MedicionCreate(MedicionBase):
    data: str
    time: datetime
    nodo_numero: int
    es_erroneo: bool=False
    tipo_dato_id: int

class MedicionUpdate(MedicionBase):
    pass

# Clase para representar una Medicion completa
class Medicion(MedicionBase):
    id: int
    data: str
    time: datetime
    nodo_numero: int
    es_erroneo: bool
    tipo_dato_id: int

# Clase base Nodo
class NodoBase(BaseModel):
    numero: int
    nombre: Optional[str] = None
    longitud: float
    latitud: float
    estado: int
    class Config:
        from_attributes = True

# Clases de creación y actualización de Nodo
class NodoCreate(NodoBase):
    numero: int
    nombre: str
    longitud: float
    latitud: float
    estado: int

class NodoUpdate(NodoBase):
    nombre: Optional[str] = None
    longitud: Optional[float] = None
    latitud: Optional[float] = None
    estado: Optional[int] = None

# Clase para representar un Nodo completo
class Nodo(NodoBase):
    numero: int

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

# Clase base para Alerta
class AlertaBase(BaseModel):
    tipo_alerta: int
    estado: bool = False
    valor_medicion: float
    tipo_dato_id: int
    nodo_numero: int

    class Config:
        from_attributes = True

class AlertaCreate(AlertaBase):
    tipo_alerta: int
    estado: bool = False
    valor_medicion: float
    tipo_dato_id: int
    nodo_numero: int

class AlertaUpdate(AlertaBase):
    pass

# Clase para representar una Alerta
class Alerta(AlertaBase):
    id: int
