import React, { useState } from 'react';
import NodoList from './components/NodoForm';
import NodoForm from './components/NodoLIst';

const App = () => {
  const [nodoToEdit, setNodoToEdit] = useState(null);

  const handleSelectNodo = (nodo) => {
    setNodoToEdit(nodo);
  };

  const handleSave = () => {
    setNodoToEdit(null);
  };

  return (
    <div>
      <h1>Gestión de Nodos</h1>
      <NodoForm nodoToEdit={nodoToEdit} onSave={handleSave} />
      <NodoList onSelectNodo={handleSelectNodo} />
    </div>
  );
};

export default App;
