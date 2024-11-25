import React from 'react';
import { Navigate } from 'react-router-dom';
import { message } from 'antd';  // Importa el componente message de Ant Design
import Cookies from 'js-cookie';

const PrivateRoute = ({ element: Element }) => {
  // Verifica si el usuario está autenticado (por ejemplo, chequeando el token en localStorage)
  const isAuthenticated = localStorage.getItem('access_token') !== null;

  //const isAuthenticated = Cookies.get('access_token') !== undefined; 
  
  if (!isAuthenticated) {
    message.error('Acceso restringido: El contenido solicitado requiere Inicio de sesión.', 5);  

    // Si no está autenticado, redirige al login
    return <Navigate to="/auth/login" />;
  }

  // Si está autenticado, renderiza el componente
  return <Element />;
};

export default PrivateRoute;