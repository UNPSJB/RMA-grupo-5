from sqlalchemy import update
from sqlalchemy.orm import Session, declarative_base

Base = declarative_base()


# autor original: https://stackoverflow.com/a/54034230
def keyvalgen(obj):
    """Genera pares nombre/valor, quitando/filtrando los atributos de SQLAlchemy."""
    excl = ("_sa_adapter", "_sa_instance_state")
    for k, v in vars(obj).items():
        if not k.startswith("_") and not any(hasattr(v, a) for a in excl):
            yield k, v


class BaseModel(Base):
    """Modelo base para los módulos de nuestra app."""

    __abstract__ = True

    def save(self, db: Session, commit: bool = True):
        db.add(self)
        if commit:
            db.commit()
            db.refresh(self)
        return self

    def delete(self, db: Session, commit: bool = True):
        db.delete(self)
        db.commit()
        return self

    def update(self, db: Session, **kwargs):
        # identificamos la instancia en la db
        primary_key = self.id
        # creamos la sentencia de update filtrando al objeto.
        stmt = (
            update(self.__class__)
            .where(self.__class__.id == primary_key)
            .values(**kwargs)
        )

        db.execute(stmt)
        return self.save(db)

    @classmethod
    def create(cls, db: Session, commit: bool = True, **kwargs):
        instance = cls(**kwargs)
        return instance.save(db, commit=commit)

    @classmethod
    def get(cls, db: Session, id: int):
        return db.query(cls).filter(cls.id == id).first()

    @classmethod
    def get_all(cls, db: Session):
        return db.query(cls).all()

    @classmethod
    def filter(cls, db: Session, **kwargs):
        query = db.query(cls)
        for key, value in kwargs.items():
            if hasattr(cls, key):
                query = query.filter(getattr(cls, key) == value)
        return query.all()

    def __repr__(self):
        # Define un formato de representacion como cadena para el modelo base.
        params = ", ".join(f"{k}={v}" for k, v in keyvalgen(self))
        return f"{self.__class__.__name__}({params})"
