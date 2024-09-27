import React, { useEffect, useState } from 'react';
import { getNodos, deleteNodo } from '../services/nodoServices'

const NodoList = ({ onSelectNodo }) => {
  const [nodos, setNodos] = useState([]);

  useEffect(() => {
    fetchNodos();
  }, []);

  const fetchNodos = async () => {
    const data = await getNodos();
    setNodos(data);
  };

  const handleDelete = async (id) => {
    await deleteNodo(id);
    fetchNodos();
  };

  return (
    <div>
      <h2>Lista de Nodos</h2>
      <ul>
        {nodos.map((nodo) => (
          <li key={nodo.id}>
            <p>Tipo: {nodo.type}</p>
            <p>Data: {nodo.data}</p>
            <p>Tiempo: {nodo.time}</p>
            <button onClick={() => onSelectNodo(nodo)}>Editar</button>
            <button onClick={() => handleDelete(nodo.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NodoList;
