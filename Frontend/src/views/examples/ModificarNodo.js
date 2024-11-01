import React, { useState, useEffect } from "react";
import axios from "axios"; 
import Header from "components/Headers/Header.js";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/css/ModificarNodo.css";

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
        console.error("Error al obtener el nodo:", error);
        alert("Error al cargar los datos del nodo");
      }
    };

    if (id) {
      fetchNodo();
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    console.log("Valores antes de enviar:", { nodo, ubicacionX, ubicacionY });
    
    // Validar que los valores sean correctos y que sean enteros
    if (
      !nodo || isNaN(nodo) || !Number.isInteger(Number(nodo)) ||
      !ubicacionX || isNaN(ubicacionX) || !Number.isInteger(Number(ubicacionX)) ||
      !ubicacionY || isNaN(ubicacionY) || !Number.isInteger(Number(ubicacionY))
    ) {
      alert("Ingresa valores enteros válidos para el nodo y las ubicaciones");
      return;
    }
  
    const nodoActualizado = {
      numero: Number(nodo),
      nombre: String(nombre),
      ubicacion_x: Number(ubicacionX),
      ubicacion_y: Number(ubicacionY),
    };

    console.log("Datos a enviar:", nodoActualizado);

    // Realiza una solicitud PUT para modificar el nodo existente
    axios.put(`http://localhost:8000/actualizar_nodo/${id}`, nodoActualizado)
      .then(response => {
        console.log("Nodo modificado:", response.data);
        alert("Nodo modificado exitosamente");
        console.log("Redirigiendo a /admin/GestionNodo");
        // Redirigir a la página de gestión de nodos
        
        navigate("/admin/GestionNodo");
        
      })
      .catch(error => {
        console.error("Hubo un error modificando el nodo:", error.response?.data || error);
        alert("Error al modificar el nodo");
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

