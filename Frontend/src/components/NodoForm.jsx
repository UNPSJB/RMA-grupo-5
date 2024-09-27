import React, { useState, useEffect } from 'react';
import { createNodo, updateNodo } from '../services/nodoServices';

const NodoForm = ({ nodoToEdit, onSave }) => {
  const [nodo, setNodo] = useState({
    type: nodoToEdit ? nodoToEdit.type : '',
    data: nodoToEdit ? nodoToEdit.data : '',
    time: nodoToEdit ? nodoToEdit.time : '',
  });

  useEffect(() => {
    if (nodoToEdit) {
      setNodo({
        type: nodoToEdit.type,
        data: nodoToEdit.data,
        time: nodoToEdit.time,
      });
    }
  }, [nodoToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nodoToEdit) {
      await updateNodo(nodoToEdit.id, nodo);
    } else {
      await createNodo(nodo);
    }
    onSave();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNodo({ ...nodo, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Tipo:
        <input
          type="text"
          name="type"
          value={nodo.type}
          onChange={handleChange}
        />
      </label>
      <label>
        Data:
        <input
          type="text"
          name="data"
          value={nodo.data}
          onChange={handleChange}
        />
      </label>
      <label>
        Tiempo:
        <input
          type="number"
          name="time"
          value={nodo.time}
          onChange={handleChange}
        />
      </label>
      <button type="submit">
        {nodoToEdit ? 'Actualizar Nodo' : 'Crear Nodo'}
      </button>
    </form>
  );
};

export default NodoForm;
