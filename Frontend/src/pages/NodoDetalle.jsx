import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const NodoDetalle = () => {
  const { id } = useParams();
  const [nodo, setNodo] = useState(null);

  useEffect(() => {
    const cargarNodo = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/nodos/${id}`); // Cambia la URL si es necesario
        const data = await response.json();
        setNodo(data);
      } catch (error) {
        console.error('Error al cargar el nodo:', error);
      }
    };

    cargarNodo();
  }, [id]);

  if (!nodo) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h2>Detalles del Nodo</h2>
      <p><strong>Nombre:</strong> {nodo.nombre}</p>
      <p><strong>Precio:</strong> $ {nodo.precio}</p>
      <p><strong>Descripción:</strong> {nodo.descripcion}</p>
      <Link to="/">Volver a la lista</Link>
    </div>
  );
};

export default NodoDetalle;
