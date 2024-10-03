from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.config_db import get_db
from src.nodo import models, schemas, services
from src import exceptions

router = APIRouter()

#Rutas de clase Medicion
@router.post("/crear_medicion", response_model=schemas.Medicion)
def create_medicion(nodo: schemas.MedicionCreate, db: Session = Depends(get_db)):
    print('soy el docs')
    return services.crear_medicion(db, nodo)

@router.get("/leer_mediciones", response_model=list[schemas.Medicion])
def read_mediciones(db: Session = Depends(get_db)):
    return services.listar_mediciones(db)

@router.get("/leer_medicion/{medicion_id}", response_model=schemas.Medicion)
def read_medicion(medicion_id: int, db: Session = Depends(get_db)):
    return services.leer_medicion(db, medicion_id)

@router.put("/actualizar_medicion/{medicion_id}", response_model=schemas.Medicion)
def update_medicion(
    medicion_id: int, nodo: schemas.MedicionUpdate, db: Session = Depends(get_db)
):
    return services.modificar_medicion(db, medicion_id, nodo)

@router.delete("/eliminar_medicion/{medicion_id}", response_model=schemas.Medicion)
def delete_nodo(medicion_id: int, db: Session = Depends(get_db)):
    return services.eliminar_medicion(db, medicion_id)

#Rutas de clase Nodo