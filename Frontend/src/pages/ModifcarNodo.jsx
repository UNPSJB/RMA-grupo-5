import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NodoForm from '../components/NodoForm'; // Cambia a NodoForm si tienes un nuevo componente

const ModificarNodo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/nodos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Nodo modificado con éxito');
        console.log('Nodo modificado:', result);
        navigate('/');
      } else {
        const errorData = await response.json();
        throw new Error(`Error al modificar el nodo: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error al modificar el nodo:', error);
      alert(`Hubo un error al modificar el nodo: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Modificar Nodo</h2>
      <NodoForm onSubmit={handleSubmit} productId={id} /> {/* Cambia productId a nodoId si es necesario */}
    </div>
  );
};

export default ModificarNodo;
