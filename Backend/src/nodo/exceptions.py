from typing import Dict, Any, List, Union
from src.nodo.constants import ErrorCode
from src.exceptions import NotFound, BadRequest, PermissionDenied

class NodoNoEncontrado(NotFound):
    DETAIL = ErrorCode.NODO_NO_ENCONTRADO

class MedicionNoEncontrada(NotFound):
    DETAIL = ErrorCode.MEDICION_NO_ENCONTRADA

class TipoDatoNoEncontrado(NotFound):
    DETAIL = ErrorCode.TIPO_DATO_NO_ENCONTRADO

class EstadoNodoNoEncontrado(NotFound):
    DETAIL = ErrorCode.ESTADO_NODO_NO_ENCONTRADO

class NodoDuplicado(BadRequest):
    DETAIL = ErrorCode.NODO_DUPLICADO

class TipoDatoDuplicado(BadRequest):
    DETAIL = ErrorCode.TIPO_DATO_DUPLICADO

class EstadoNodoDuplicado(BadRequest):
    DETAIL = ErrorCode.ESTADO_NODO_DUPLICADO

class NodoTieneMediciones(BadRequest):
    DETAIL = ErrorCode.NODO_TIENE_MEDICIONES