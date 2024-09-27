import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NodosList = () => {
  const [nodos, setNodos] = useState([]);

  useEffect(() => {
    cargarNodos();
  }, []);

  const cargarNodos = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/nodos'); // Cambia la URL si es necesario
      const data = await response.json();
      setNodos(data);
    } catch (error) {
      console.error('Error al cargar los nodos:', error);
    }
  };

  const eliminarNodo = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este nodo?')) {
      return;
    }

    try {
      await fetch(`http://127.0.0.1:8000/nodos/${id}`, { method: 'DELETE' });
      alert('Nodo eliminado con éxito');
      cargarNodos();
    } catch (error) {
      console.error('Error al eliminar el nodo:', error);
      alert('Hubo un error al eliminar el nodo.');
    }
  };

  return (
    <div>
      <h2>Lista de Nodos</h2>
      <Link to="/crear">Crear Nuevo Nodo</Link>
      <ul>
        {nodos.map(nodo => (
          <li key={nodo.id}>
            {nodo.nombre} - $ {nodo.precio} - {nodo.descripcion}
            <Link to={`/modificar/${nodo.id}`}> Modificar</Link>
            <Link to={`/nodo/${nodo.id}`}> Ver Detalles</Link>
            <button onClick={() => eliminarNodo(nodo.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NodosList;
