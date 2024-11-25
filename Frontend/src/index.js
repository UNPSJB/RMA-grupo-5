// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import Register from "views/examples/Register.js";
import PrivateRoute from "./privateRouter"; // Importa el componente de ruta protegida

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      {/* Ruta de inicio (redirige al registro por defecto) */}
      <Route path="/*" element={<Navigate to="/auth/register" replace />} />

      {/* Rutas para la parte de autenticación */}
      <Route path="/auth/*" element={<AuthLayout />} />

      {/* Rutas protegidas para la parte administrativa */}
      <Route path="/admin/*" element={<PrivateRoute element={AdminLayout} />} />
    </Routes>
  </BrowserRouter>
);