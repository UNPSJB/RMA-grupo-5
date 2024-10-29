import React, { useState, useEffect } from "react";
import axios from "axios"; 
import Header from "components/Headers/Header.js";
import { useNavigate, useParams } from "react-router-dom";

const ModificarNodo = () => {
  const [nodo, setNodo] = useState('');
  const [nombre, setNombre] = useState('');
  const [ubicacionX, setUbicacionX] = useState('');
  const [ubicacionY, setUbicacionY] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // Obtiene el ID del nodo de la URL

  // Cargar los datos del nodo existente al montar el componente
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

    // Validar que los valores sean correctos y que sean enteros
    if (
      !nodo || isNaN(nodo) || !Number.isInteger(parseFloat(nodo)) ||
      !ubicacionX || isNaN(ubicacionX) || !Number.isInteger(parseFloat(ubicacionX)) ||
      !ubicacionY || isNaN(ubicacionY) || !Number.isInteger(parseFloat(ubicacionY))
    ) {
      alert("Ingresa valores enteros válidos para el nodo y las ubicaciones");
      return;
    }

    const nodoActualizado = {
      numero: parseInt(nodo),
      nombre: String(nombre),
      ubicacion_x: parseInt(ubicacionX),
      ubicacion_y: parseInt(ubicacionY),
    };

    // Realiza una solicitud PUT para modificar el nodo existente
    axios.put(`http://localhost:8000/modificar_nodo/${id}`, nodoActualizado)
      .then(response => {
        console.log("Nodo modificado:", response.data);
        alert("Nodo modificado exitosamente");

        // Redirigir a la página de gestión de nodos
        navigate("/admin/GestionNodo");
      })
      .catch(error => {
        console.error("Hubo un error modificando el nodo:", error.response?.data || error);
        alert("Error al modificar el nodo");
      });
  }; 

  // Estilos para el formulario
  const formStyle = {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f1f1f9",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
  };

  const labelStyle = {
    marginBottom: "1px",
    display: "block",
    color: "#333",
  };

  const cardStyle = {
    padding: "20px",
    marginTop: "20px",
  };

  return (
    <>
      <Header />

      <div style={cardStyle}>
        <div style={formStyle}>
          <h2 style={{ textAlign: "center", color: "#333" }}>Modificar Nodo</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label style={labelStyle}>Número de Nodo:</label>
              <input
                type="text"
                style={inputStyle}
                value={nodo}
                onChange={(e) => setNodo(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Alias:</label>
              <input
                type="text"
                style={inputStyle}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div>
              <label style={labelStyle}>Longitud (eje x):</label>
              <input
                type="text"
                style={inputStyle}
                value={ubicacionX}
                onChange={(e) => setUbicacionX(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Latitud (eje y):</label>
              <input
                type="text"
                style={inputStyle}
                value={ubicacionY}
                onChange={(e) => setUbicacionY(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" style={buttonStyle}>
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ModificarNodo;
