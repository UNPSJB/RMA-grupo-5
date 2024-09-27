import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NodosList from '../pages/NodoList';
import CrearNodo from '../pages/CrearNodo';
import ModificarNodo from '../pages/ModifcarNodo';
import NodoDetalle from '../pages/NodoDetalle';
import Layout from '../components/Layout';

const AppRouter = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<NodosList />} />
        <Route path="/crear" element={<CrearNodo />} />
        <Route path="/modificar/:id" element={<ModificarNodo />} />
        <Route path="/nodo/:id" element={<NodoDetalle />} />
      </Routes>
    </Layout>
  );
};

export default AppRouter;
