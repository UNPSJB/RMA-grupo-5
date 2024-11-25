from typing import List
from src.nodo.auth import crud, hashing, jwt
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile,status, Response,Request
from sqlalchemy.orm import Session
from src.config_db import get_db
from src.nodo import models, schemas, services
import json, csv
from io import StringIO

router = APIRouter()

#/--- Rutas de clase Medicion ---/
@router.post("/crear_medicion", response_model=schemas.Medicion)
def create_medicion(medicion: schemas.MedicionCreate, request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db)):
    return services.crear_medicion(db, medicion)

@router.get("/leer_mediciones", response_model=list[schemas.Medicion])
def read_mediciones(request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db)):
    return services.leer_mediciones(db) 

@router.get("/leer_medicion/{medicion_id}", response_model=schemas.Medicion)
def read_medicion(medicion_id: int, request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db)):
    return services.leer_medicion(db, medicion_id)

@router.get("/leer_ultima_medicion", response_model=schemas.Medicion)
def read_ultimo_nodo(request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db)):
    return services.leer_ultima_medicion(db)

@router.get("/<", response_model=schemas.Medicion)
def read_ultimo_nodo(request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db)):
    return services.leer_ultima_medicion(db)

@router.get("/leer_mediciones_correctas_nodo/{numero_nodo}", response_model=List[schemas.Medicion])
def read_mediciones_nodo(numero_nodo: int, request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db)):
    return services.leer_mediciones_correctas_nodo(db, numero_nodo)

@router.get("/leer_mediciones_erroneas_nodo/{numero_nodo}", response_model=List[schemas.Medicion])
def read_mediciones_nodo(numero_nodo: int, request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db)):
    return services.leer_mediciones_erroneas_nodo(db, numero_nodo)

@router.put("/actualizar_medicion/{medicion_id}", response_model=schemas.Medicion)
def update_medicion(
    medicion_id: int, nodo: schemas.MedicionUpdate, request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db)
):
    return services.modificar_medicion(db, medicion_id, nodo)

@router.delete("/eliminar_medicion/{medicion_id}", response_model=schemas.Medicion)
def delete_nodo(medicion_id: int, request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db)):
    return services.eliminar_medicion(db, medicion_id)

#/--- Rutas de clase Nodo ---/
@router.post("/crear_nodo", response_model=schemas.Nodo)
def create_nodo(nodo: schemas.NodoCreate, request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db)):
    return services.crear_nodo(db, nodo)

@router.get("/leer_nodo/{numero_nodo}", response_model=schemas.Nodo)
def leer_nodo(numero_nodo: int, request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db)):
    return services.leer_nodo(db, numero_nodo)

@router.get("/leer_nodos", response_model=List[schemas.Nodo])
def leer_nodos(request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db)):
    
    print('COOKIES:',request.cookies)
    
    nodos = services.leer_nodos(db)

    print('LEEER NODOS')
    return nodos

@router.get("/leer_nodos_activos", response_model=List[schemas.Nodo])
def leer_nodos(request: Request,current_user: str = Depends(jwt.get_current_user),db: Session = Depends(get_db)):
    print(request.cookies)
    nodos = services.leer_nodos_activos(db)
    return nodos

@router.get("/leer_nodos_inactivos", response_model=List[schemas.Nodo])
def leer_nodos(request: Request,current_user: str = Depends(jwt.get_current_user),db: Session = Depends(get_db)):
    print(request.cookies)
    nodos = services.leer_nodos_inactivos(db)
    return nodos

@router.get("/leer_nodos_de_baja", response_model=List[schemas.Nodo])
def leer_nodos(request: Request,current_user: str = Depends(jwt.get_current_user),db: Session = Depends(get_db)):
    print(request.cookies)
    nodos = services.leer_nodos_de_baja(db)
    return nodos

@router.put("/modificar_nodo/{numero_nodo}", response_model=schemas.Nodo)
def update_nodo(numero_nodo: int, nodo: schemas.NodoUpdate, request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db), ):
    return services.modificar_nodo(db, numero_nodo, nodo)  

@router.put("/toggle_estado/{numero_nodo}", response_model=schemas.Nodo)
def toggle_estado_nodo(numero_nodo: int, request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db)):
    nodo = services.leer_nodo(db, numero_nodo)
    if nodo.estado != 3:
        nodo.estado = 3
    else:    
        nodo.estado = 1

    db.commit()
    db.refresh(nodo)
    return nodo

@router.delete("/eliminar_nodo/{nodo_id}", response_model=schemas.Nodo)
def delete_nodo(nodo_id: int, request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db)):
    return services.eliminar_nodo(db, nodo_id)


#/--- Rutas de clase TipoDato ---/
@router.post("/crear_tipo_dato", response_model=schemas.TipoDato)
def create_tipo_dato(tipo_dato: schemas.TipoDatoCreate, request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db)):
    return services.crear_tipo_dato(db, tipo_dato)

@router.get("/leer_tipo_dato/{id_tipo}", response_model=schemas.TipoDato)
def read_tipo_dato(id_tipo: int, request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db)):
    return services.leer_tipo_dato(db, id_tipo)

@router.get("/leer_tipo_dato_por_nombre/{nombre_tipo}", response_model=schemas.TipoDato)
def read_tipo_dato(nombre_tipo: str, request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db)):
    return services.leer_tipo_dato_por_nombre(db, nombre_tipo)

@router.get("/leer_tipos_datos", response_model=List[schemas.TipoDato])
def read_tipos_datos(request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db)):
    tipos = services.leer_tipos_datos(db)
    return tipos

@router.put("/modificar_tipo_dato/{id_tipo}", response_model=schemas.TipoDato)
def update_tipo_dato(id_tipo: int, tipo: schemas.TipoDatoUpdate, request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db)):
    return services.modificar_tipo_dato(db, id_tipo, tipo)  

@router.delete("/eliminar_tipo_dato/{id_tipo}", response_model=schemas.TipoDato)
def delete_tipo_dato(id_tipo: int, request: Request,current_user: str = Depends(jwt.get_current_user), db: Session = Depends(get_db)):
    return services.eliminar_tipo_dato(db, id_tipo)

@router.post("/importar_datos_json")
async def importar_datos_json(file: UploadFile = File(...), db: Session = Depends(get_db)):
    contents = await file.read()
    data = json.loads(contents)
    mediciones = services.importar_datos_json(db, data)
    
    return {"message": f"{len(mediciones)} mediciones importadas correctamente"}

@router.post("/importar_datos_csv")
async def importar_datos_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    contents = await file.read()
    decoded_content = contents.decode("utf-8")
    csv_reader = csv.DictReader(StringIO(decoded_content))
    data = [row for row in csv_reader]
    mediciones = services.importar_datos_csv(db, data)

    return {"message": f"{len(mediciones)} mediciones importadas correctamente"}


#/--- Rutas de clase Registro ---/
@router.post("/crear_usuario", response_model=schemas.Registro)
def crear_usuario(registro: schemas.RegistroCreate, db: Session = Depends(get_db)):
    return services.crear_usuario(db, registro)

#/--- Rutas Validacion---/
@router.post("/iniciar_sesion", response_model=schemas.Token)
def iniciar_sesion(
    registro: schemas.RegistroBase, 
    response: Response, 
    db: Session = Depends(get_db)
):
    # Buscar al usuario en la base de datos
    user = crud.get_user_by_username(db=db, username=registro.username)
    
    # Si no se encuentra el usuario o la contraseña no coincide, retornar error
    if not user or not hashing.verify_password(registro.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Si las credenciales son correctas, generar el token
    access_token = jwt.create_access_token(data={"sub": user.username})
    
    # Guardar el token en una cookie segura
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=False,  # Establecer en True en producción
        samesite="None",  
        path='/'
    )
    
    # Devolver también el token como respuesta JSON (opcional)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/validar_token")
async def validar_token(request: Request):
    token = request.cookies.get("auth_token")
    if not token or not jwt.verify_token(token): 
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    return {"message": "Token válido"}