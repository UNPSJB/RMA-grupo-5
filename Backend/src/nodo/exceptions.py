from typing import Dict, Any, List, Union
from constants import ErrorCode
from src.exceptions import NotFound, BadRequest, PermissionDenied

class NodoNoEncontrado(NotFound):
    DETAIL = ErrorCode.NODO_NO_ENCONTRADO

class MedicionNoEncontrada(NotFound):
    DETAIL = ErrorCode.MEDICION_NO_ENCONTRADA

class NodoDuplicado(BadRequest):
    DETAIL = ErrorCode.NODO_DUPLICADO

class NodoTieneMediciones(BadRequest):
    DETAIL = ErrorCode.NODO_TIENE_MEDICIONES