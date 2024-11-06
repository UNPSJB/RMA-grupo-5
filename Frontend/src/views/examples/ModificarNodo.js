import React, { useState, useEffect } from "react";
import axios from "axios"; 
import Header from "components/Headers/Header.js";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/css/ModificarNodo.css";
import { message } from "antd";

const ModificarNodo = () => {
  const [nodo, setNodo] = useState('');
  const [nombre, setNombre] = useState('');
  const [ubicacionX, setUbicacionX] = useState('');
  const [ubicacionY, setUbicacionY] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); 

  
  useEffect(() => {
    const fetchNodo = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/obtener_nodo/${id}`);
        const { numero, nombre, ubicacion_x, ubicacion_y } = response.data;
        setNodo(numero);
        setNombre(nombre);
        setUbicacionX(ubicacion_x);
        setUbicacionY(ubicacion_y);
      } catch (error) {
        message.error("Error al cargar los datos"); 
      }
    };

    if (id) {
      fetchNodo();
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
   // Validar que los valores sean correctos

  if (
    (nodo === null || nodo === undefined || isNaN(nodo) || !Number.isInteger(parseFloat(nodo)) || /[^0-9-]/.test(nodo)) ||
    (ubicacionX === null || ubicacionX === undefined || isNaN(ubicacionX) || isNaN(parseFloat(ubicacionX)) || /[^0-9.-]/.test(ubicacionX)) ||
    (ubicacionY === null || ubicacionY === undefined || isNaN(ubicacionY) || isNaN(parseFloat(ubicacionY)) || /[^0-9.-]/.test(ubicacionY))
  ) {
    message.error("Ingresa un valor válido (solo números)");
    return;
  }
    
    const nodoActualizado = {
      numero: Number(nodo),
      nombre: String(nombre),
      ubicacion_x: Number(ubicacionX),
      ubicacion_y: Number(ubicacionY),
    };

    // Realiza una solicitud PUT para modificar el nodo existente
    axios.put(`http://localhost:8000/actualizar_nodo/${id}`, nodoActualizado)
      .then(response => {
        message.success("Nodo modificado exitosamente"); 
        
        // Redirigir a la página de gestión de nodos
        navigate("/admin/GestionNodo");
        
      })
      .catch(error => {
        message.error("Error al modificar nodo, intente nuevamente");
      });
  }; 

  return (
    <>
      <Header />

      <div className="card-style">
        <div className="form-container">
          <h2 style={{ textAlign: "center", color: "#333" }}>Modificar Nodo</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="label-style">Número de Nodo:</label>
              <input
                type="text"
                disabled
                className="input-style"
                value={nodo}
                onChange={(e) => setNodo(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label-style">Alias:</label>
              <input
                type="text"
                className="input-style"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div>
              <label className="label-style">Longitud (eje x):</label>
              <input
                type="text"
                className="input-style"
                value={ubicacionX}
                onChange={(e) => setUbicacionX(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label-style">Latitud (eje y):</label>
              <input
                type="text"
                className="input-style"
                value={ubicacionY}
                onChange={(e) => setUbicacionY(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="button-style">
              Guardar cambios
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ModificarNodo;

