from typing import List
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from src.config_db import get_db
from src.nodo import models, schemas, services
import json, csv
from io import StringIO


router = APIRouter()

#/--- Rutas de clase Medicion ---/
@router.post("/crear_medicion", response_model=schemas.Medicion)
def create_medicion(medicion: schemas.MedicionCreate, db: Session = Depends(get_db)):
    return services.crear_medicion(db, medicion)

@router.get("/leer_mediciones", response_model=list[schemas.Medicion])
def read_mediciones(db: Session = Depends(get_db)):
    return services.leer_mediciones(db) 

@router.get("/leer_medicion/{medicion_id}", response_model=schemas.Medicion)
def read_medicion(medicion_id: int, db: Session = Depends(get_db)):
    return services.leer_medicion(db, medicion_id)

@router.get("/leer_ultima_medicion", response_model=schemas.Medicion)
def read_ultimo_nodo(db: Session = Depends(get_db)):
    return services.leer_ultima_medicion(db)

@router.get("/leer_mediciones_correctas_nodo/{numero_nodo}", response_model=List[schemas.Medicion])
def read_mediciones_nodo(numero_nodo: int, db: Session = Depends(get_db)):
    return services.leer_mediciones_correctas_nodo(db, numero_nodo)

@router.get("/leer_mediciones_erroneas_nodo/{numero_nodo}", response_model=List[schemas.Medicion])
def read_mediciones_nodo(numero_nodo: int, db: Session = Depends(get_db)):
    return services.leer_mediciones_erroneas_nodo(db, numero_nodo)

@router.put("/actualizar_medicion/{medicion_id}", response_model=schemas.Medicion)
def update_medicion(
    medicion_id: int, nodo: schemas.MedicionUpdate, db: Session = Depends(get_db)
):
    return services.modificar_medicion(db, medicion_id, nodo)

@router.delete("/eliminar_medicion/{medicion_id}", response_model=schemas.Medicion)
def delete_nodo(medicion_id: int, db: Session = Depends(get_db)):
    return services.eliminar_medicion(db, medicion_id)

#/--- Rutas de clase Nodo ---/
@router.post("/crear_nodo", response_model=schemas.Nodo)
def create_nodo(nodo: schemas.NodoCreate, db: Session = Depends(get_db)):
    return services.crear_nodo(db, nodo)

@router.get("/leer_nodo/{numero_nodo}", response_model=schemas.Nodo)
def leer_nodo(numero_nodo: int, db: Session = Depends(get_db)):
    return services.leer_nodo(db, numero_nodo)

@router.get("/leer_nodos/", response_model=List[schemas.Nodo])
def leer_nodos(db: Session = Depends(get_db)):
    nodos = services.leer_nodos(db)
    return nodos

@router.get("/leer_nodos_por_estado/{estado_nodo_id}", response_model=List[schemas.Nodo])
def leer_nodos(estado_nodo_id: int, db: Session = Depends(get_db)):
    nodos = services.leer_nodos_por_estado(db, estado_nodo_id)
    return nodos

@router.put("/modificar_nodo/{numero_nodo}", response_model=schemas.Nodo)
def update_nodo(numero_nodo: int, nodo: schemas.NodoUpdate, db: Session = Depends(get_db)):
    return services.modificar_nodo(db, numero_nodo, nodo)  

@router.delete("/eliminar_nodo/{nodo_id}", response_model=schemas.Nodo)
def delete_nodo(nodo_id: int, db: Session = Depends(get_db)):
    return services.eliminar_nodo(db, nodo_id)


#/--- Rutas de clase TipoDato ---/
@router.post("/crear_tipo_dato", response_model=schemas.TipoDato)
def create_tipo_dato(tipo_dato: schemas.TipoDatoCreate, db: Session = Depends(get_db)):
    return services.crear_tipo_dato(db, tipo_dato)

@router.get("/leer_tipo_dato/{nombre_tipo}", response_model=schemas.TipoDato)
def read_tipo_dato(nombre_tipo: str, db: Session = Depends(get_db)):
    return services.leer_tipo_dato(db, nombre_tipo)

@router.get("/leer_tipos_datos/", response_model=List[schemas.TipoDato])
def read_tipos_datos(db: Session = Depends(get_db)):
    tipos = services.leer_tipos_datos(db)
    return tipos

@router.put("/modificar_tipo_dato/{nombre_tipo}", response_model=schemas.TipoDato)
def update_tipo_dato(nombre_tipo: str, nodo: schemas.TipoDatoUpdate, db: Session = Depends(get_db)):
    return services.modificar_tipo_dato(db, nombre_tipo, nodo)  

@router.delete("/eliminar_tipo_dato/{nombre_tipo}", response_model=schemas.TipoDato)
def delete_tipo_dato(nombre_tipo: str, db: Session = Depends(get_db)):
    return services.eliminar_tipo_dato(db, nombre_tipo)

#/--- Rutas de clase Estado Nodo ---/
@router.post("/crear_estado_nodo", response_model=schemas.EstadoNodo)
def create_estado_nodo(estado: schemas.EstadoNodoCreate, db: Session = Depends(get_db)):
    return services.crear_estado_nodo(db, estado)

@router.get("/leer_estados_nodo", response_model=list[schemas.EstadoNodo])
def read_estados_nodo(db: Session = Depends(get_db)):
    return services.leer_estados_nodo(db) 

@router.get("/leer_estado_nodo/{estado_nombre}", response_model=schemas.EstadoNodo)
def read_estado_nodo(estado_nombre: str, db: Session = Depends(get_db)):
    return services.leer_estado_nodo(db, estado_nombre)


@router.put("/modificar_estado_nodo/{estado_nombre}", response_model=schemas.EstadoNodo)
def update_estado_nodo(
    estado_nombre: str, estado: schemas.EstadoNodoUpdate, db: Session = Depends(get_db)
):
    return services.modificar_estado_nodo(db, estado_nombre, estado)

@router.delete("/eliminar_estado_nodo/{estado_nombre}", response_model=schemas.EstadoNodo)
def delete_nodo(estado_nombre: str, db: Session = Depends(get_db)):
    return services.eliminar_estado_nodo(db, estado_nombre)

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

@router.post("/iniciar_sesion", response_model=schemas.Registro)
def iniciar_sesion(registro: schemas.RegistroBase, db: Session = Depends(get_db)):
    return services.iniciar_sesion(registro, db)


