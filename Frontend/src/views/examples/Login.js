import React, { useState } from "react";
import axios from "axios"; 
import Header from "components/Headers/Header.js";
import { useNavigate } from "react-router-dom";
import "../../assets/css/login.css";
import { message } from "antd";

const IniciarSesion = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación simple para los campos de username y contraseña
    if (!nombreUsuario || !contrasena) {
      message.error("Por favor, complete todos los campos.");
      return;
    }

    const datosUsuario = {
      username: nombreUsuario,
      password: contrasena,
    };

    axios.post('http://localhost:8000/iniciar_sesion', datosUsuario, {
      withCredentials: true  
    })
      .then(response => {
        message.success("Inicio de sesión exitoso");

        // Reiniciar los campos después de un inicio de sesión exitoso
        setNombreUsuario('');
        setContrasena('');
        
        // Redirigir a la página principal o de administración
        navigate("/admin/home");
      })
      .catch(error => {
        if (error.response && error.response.data) {
          message.error(error.response.data.detail || "Error en el inicio de sesión");
        } else {
          message.error("Error en el inicio de sesión, verifique sus datos");
        }
      });
  }; 

  return (
    <>
      <Header />

      <div className="card-style">
        <div className="form-container">
          <h2 className="form-title">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="label-style">Nombre de Usuario:</label>
              <input
                type="text"
                className="input-style"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label-style">Contraseña:</label>
              <input
                type="password"
                className="input-style"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="button-style">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default IniciarSesion;

