# src/nodo/auth/jwt.py
from datetime import datetime, timedelta
from jose import JWTError, jwt
from src.config_db import get_db
from src.nodo.auth.crud import get_user_by_username
from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer

SECRET_KEY = "mi_clave_secreta"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

'''def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload if "exp" in payload and payload["exp"] >= datetime.utcnow().timestamp() else None
    except JWTError:
        return None
    
def get_cookie_token(request: Request):
    token = request.cookies.get("access_token")
    print (request.cookies)
    if not token:
        print("No se encontró token en las cookies, utilizando uno de prueba...")
        token = "<tu_token_de_prueba>"
    return token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="iniciar_sesion")
def get_current_user(db: Session = Depends(get_db), token: str = Depends(get_cookie_token)):
    try:
        print(token)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No se pudo validar el usuario",
                headers={"WWW-Authenticate": "Bearer"},
            )
        # Obtener el usuario de la base de datos
        user = get_user_by_username(db, username=username)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario no encontrado",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )'''


def verify_token(token: str):
    """
    Verifica el token JWT y retorna el payload si es válido.
    """
    try:
        # Configura para verificar automáticamente la expiración del token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_exp": True})
        return payload
    except JWTError:
        return None

def get_cookie_token(request: Request):
    token = request.cookies.get("access_token")
    print('TOKEN:')
    print(token)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No se encontró un token de acceso en las cookies.",
        )
    if token.startswith("Bearer "):
        token = token[len("Bearer "):]
    print("Token limpio:", token)  # Debug
    return token

def get_current_user(db: Session = Depends(get_db), token: str = Depends(get_cookie_token)):
    """
    Valida el token JWT y retorna el usuario actual.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No se pudo validar el usuario",
                headers={"WWW-Authenticate": "Bearer"},
            )
        # Obtener el usuario de la base de datos
        user = get_user_by_username(db, username=username)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario no encontrado",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )