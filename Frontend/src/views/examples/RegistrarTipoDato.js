import React, { useState } from "react";
import axios from "axios"; 
import Header from "components/Headers/Header.js";
import { useNavigate } from "react-router-dom";
import "../../assets/css/RegistrarNodo.css"
import { message } from "antd";

const RegistrarTipoDato = () => {
  const [nodo, setNodo] = useState('');
  const [nombre, setNombre] = useState('');
  const [ubicacionX, setUbicacionX] = useState('');
  const [ubicacionY, setUbicacionY] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

  // Validar que los valores sean correctos
  if (
    !nodo || isNaN(nodo) || !Number.isInteger(parseFloat(nodo)) || /[^0-9-]/.test(nodo) ||
    !ubicacionX || isNaN(ubicacionX) || isNaN(parseFloat(ubicacionX)) || /[^0-9.-]/.test(ubicacionX) ||
    !ubicacionY || isNaN(ubicacionY) || isNaN(parseFloat(ubicacionY)) || /[^0-9.-]/.test(ubicacionY)
  ) {
    message.error("Ingresa un valor válido (solo números)");
    return;
  }
    

    const nuevoNodo = {
      numero: parseInt(nodo),
      nombre: String(nombre),
      ubicacion_x: parseFloat(ubicacionX),
      ubicacion_y: parseFloat(ubicacionY),
    };

    axios.post('http://localhost:8000/crear_nodo', nuevoNodo)
      .then(response => {
      message.success("Nodo registrado exitosamente"); 

        // Reiniciar los campos después de un registro exitoso
        setNodo('');
        setNombre('');
        setUbicacionX('');
        setUbicacionY('');
        
        // Redirigir a la página de gestión de nodos
        navigate("/admin/GestionNodo");
      })
      .catch(error => {
        message.error("Error al registrar el nodo, intente nuevamente"); 
      });
  }; 

  return (
    <>
      <Header />

      <div className="card-style">
        <div className="form-container">
          <h2 className="form-title">Registrar Nodo</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="label-style">Número de Nodo:</label>
              <input
                type="text"
                className="input-style"
                value={nodo}
                onChange={(e) => setNodo(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label-style"> Alias </label>
              <input
                type="text"
                className="input-style"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div>
              <label className="label-style"> Longitud (eje x)</label>
              <input
                type="text"
                className="input-style"
                value={ubicacionX}
                onChange={(e) => setUbicacionX(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label-style">Latitud (eje y)</label>
              <input
                type="text"
                className="input-style"
                value={ubicacionY}
                onChange={(e) => setUbicacionY(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="button-style">
              Guardar
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegistrarTipoDato;