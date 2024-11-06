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
def create_medicion(nodo: schemas.MedicionCreate, db: Session = Depends(get_db)):
    return services.crear_medicion(db, nodo)

@router.get("/leer_mediciones", response_model=list[schemas.Medicion])
def read_mediciones(db: Session = Depends(get_db)):
    return services.listar_mediciones(db) 

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

@router.get("/obtener_nodo/{numero_nodo}", response_model=schemas.Nodo)
def obtener_nodo(numero_nodo: int, db: Session = Depends(get_db)):
    return services.obtener_nodo(db, numero_nodo)

@router.get("/obtener_nodos_activos/", response_model=List[schemas.Nodo])
def obtener_nodos(db: Session = Depends(get_db)):
    nodos = services.listar_nodos_activos(db)
    return nodos

@router.get("/obtener_nodos_inactivos/", response_model=List[schemas.Nodo])
def obtener_nodos(db: Session = Depends(get_db)):
    nodos = services.listar_nodos_inactivos(db)
    return nodos

@router.put("/actualizar_nodo/{numero_nodo}", response_model=schemas.Nodo)
def update_nodo(
    numero_nodo: int, nodo: schemas.NodoUpdate, db: Session = Depends(get_db)
):
    return services.modificar_nodo(db, numero_nodo, nodo)  

@router.put("/toggle_estado/{numero_nodo}", response_model=schemas.Nodo)
def toggle_estado_nodo(numero_nodo: int, db: Session = Depends(get_db)):
    nodo = services.obtener_nodo(db, numero_nodo)
    nodo.is_activo = not nodo.is_activo  # Cambia el estado
    db.commit()
    db.refresh(nodo)
    return nodo

@router.delete("/eliminar_nodo/{nodo_id}", response_model=schemas.Nodo)
def delete_nodo(nodo_id: int, db: Session = Depends(get_db)):
    return services.eliminar_nodo(db, nodo_id)

@router.get("/tipo_dato/{nombre}")
def get_tipo_dato(nombre: str, db: Session = Depends(get_db)):
    tipo_dato = getattr(models.TipoDato, nombre)
    if not tipo_dato:
        raise HTTPException(status_code=404, detail="Tipo de dato no encontrado")
    return {"tipo": tipo_dato.value}

<<<<<<< Updated upstream

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
=======
#/--- Rutas de clase Registro ---/
@router.post("/crear_usuario", response_model=schemas.Registro)
def crear_usuario(registro: schemas.RegistroCreate, db: Session = Depends(get_db)):
    return services.crear_usuario(db, registro)

@router.post("/iniciar_sesion", response_model=schemas.Registro)
def iniciar_sesion(registro: schemas.RegistroBase, db: Session = Depends(get_db)):
    return services.iniciar_sesion(registro, db)


>>>>>>> Stashed changes
