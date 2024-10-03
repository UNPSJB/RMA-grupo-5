from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.config_db import get_db
from src.nodo import models, schemas, services
from src import exceptions

router = APIRouter()

@router.post("/crear_nodo", response_model=schemas.Medicion)
def create_nodo(nodo: schemas.MedicionCreate, db: Session = Depends(get_db)):
    return services.crear_nodo(db, nodo)

@router.get("/leer_nodos", response_model=list[schemas.Medicion])
def read_nodos(db: Session = Depends(get_db)):
    return services.listar_nodos(db)

@router.get("/leer_nodo/{nodo_id}", response_model=schemas.Medicion)
def read_nodo(nodo_id: int, db: Session = Depends(get_db)):
    return services.leer_nodo(db, nodo_id)

@router.put("/actualizar_nodo/{nodo_id}", response_model=schemas.Medicion)
def update_nodo(
    nodo_id: int, nodo: schemas.MedicionUpdate, db: Session = Depends(get_db)
):
    return services.modificar_nodo(db, nodo_id, nodo)

@router.delete("/eliminar_nodo/{nodo_id}", response_model=schemas.Medicion)
def delete_nodo(nodo_id: int, db: Session = Depends(get_db)):
    return services.eliminar_nodo(db, nodo_id)