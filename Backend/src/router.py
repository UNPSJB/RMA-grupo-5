from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.config_db import get_db
from src import models, schemas, exceptions, services

router = APIRouter()

@router.post("/crear_nodo", response_model=schemas.Nodo)
def create_nodo(nodo: schemas.NodoCreate, db: Session = Depends(get_db)):
    return services.crear_nodo(db, nodo)

@router.get("/leer_nodos", response_model=list[schemas.Nodo])
def read_nodos(db: Session = Depends(get_db)):
    return services.listar_nodos(db)

@router.get("/leer_nodo/{nodo_id}", response_model=schemas.Nodo)
def read_nodo(nodo_id: int, db: Session = Depends(get_db)):
    return services.leer_nodo(db, nodo_id)

@router.put("/actualizar_nodo/{nodo_id}", response_model=schemas.Nodo)
def update_nodo(
    nodo_id: int, nodo: schemas.NodoUpdate, db: Session = Depends(get_db)
):
    return services.modificar_nodo(db, nodo_id, nodo)

@router.delete("/eliminar_nodo/{nodo_id}", response_model=schemas.Nodo)
def delete_nodo(nodo_id: int, db: Session = Depends(get_db)):
    return services.eliminar_nodo(db, nodo_id)