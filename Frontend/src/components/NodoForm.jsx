import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const NodoForm = ({ onSubmit, initialData = {}, nodoId }) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: initialData,
  });

  const [isFetched, setIsFetched] = useState(false);
  const navigate = useNavigate(); // Hook para redirección

  useEffect(() => {
    if (nodoId && !isFetched) {
      fetch(`http://127.0.0.1:8000/nodos/${nodoId}`)
        .then(response => response.json())
        .then(data => {
          reset(data);
          setIsFetched(true);
        })
        .catch(error => {
          console.error('Error al cargar el nodo:', error);
        });
    }
  }, [nodoId, reset, isFetched]);

  const submitHandler = async (data) => {
    try {
      const payload = {
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        // Agrega más campos si es necesario para los nodos
      };

      const url = nodoId
        ? `http://127.0.0.1:8000/nodos/${nodoId}`
        : 'http://127.0.0.1:8000/nodos';

      const method = nodoId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Nodo guardado:', result);

        // Mostrar alerta de éxito
        alert('Nodo creado exitosamente');
        
        // Redirigir al menú principal
        navigate('/');
      } else {
        const errorData = await response.json();
        throw new Error(`Error en la respuesta del servidor: ${response.status} - ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error al guardar el nodo:', error);
      alert(`Hubo un error al guardar el nodo: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h2>{nodoId ? 'Modificar Nodo' : 'Crear Nodo'}</h2>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div>
          <label htmlFor="nombre">Nombre</label>
          <Controller
            name="nombre"
            control={control}
            rules={{ required: "El nombre es obligatorio" }}
            render={({ field }) => (
              <input
                id="nombre"
                type="text"
                {...field}
              />
            )}
          />
          {errors.nombre && <span className="message">{errors.nombre.message}</span>}
        </div>
  
        <div>
          <label htmlFor="descripcion">Descripción</label>
          <Controller
            name="descripcion"
            control={control}
            render={({ field }) => (
              <textarea
                id="descripcion"
                {...field}
              />
            )}
          />
        </div>
  
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default NodoForm;
