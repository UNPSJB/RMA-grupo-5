import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "components/Headers/Header.js";
import { useNavigate } from "react-router-dom";

const GestionNodo = () => {
  const [nodos, setNodos] = useState([]);
  const navigate = useNavigate();

  // Función para obtener los nodos desde el backend
  const fetchNodos = async () => {
    try {
      const response = await axios.get("http://localhost:8000/obtener_nodos");
      setNodos(response.data); 
    } catch (error) {
      console.error("Error al obtener los nodos:", error);
    }
  };

  useEffect(() => {
    fetchNodos(); 
  }, []);

  const handleEdit = (nodoId) => {
    alert(`Modificar nodo con ID: ${nodoId}`);
  };

  const handleAddNodo = () => {
    navigate("/admin/registrar_nodo");
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  };

  const thStyle = {
    borderBottom: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
    backgroundColor: "#f2f2f2",
  };

  const tdStyle = {
    borderBottom: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
  };

  const buttonStyle = {
    margin: "0 5px",
    padding: "5px 10px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
  };

  const addButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#008CBA",
    color: "white",
    marginBottom: "10px",
  };

  const editButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#4CAF50",
    color: "white",
  };

  return (
    <>
      <Header />

      <div style={{ padding: "20px", marginTop: "20px" }}>
        <h2 style={{ textAlign: "center", color: "#333" }}>Lista de Nodos Registrados</h2>
        
        <button style={addButtonStyle} onClick={handleAddNodo}>
          Registrar nuevo nodo
        </button>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Número de Nodo</th>  
              <th style={thStyle}>Alias</th> 
              <th style={thStyle}>Longitud</th>
              <th style={thStyle}>Latitud</th>
              <th style={thStyle}>Acciones</th>
              <th style={thStyle}>Estado</th>
            </tr>
          </thead>
          
        <tbody>
          {nodos.map((nodo) => (
            <tr key={nodo.numero}>
              <td style={tdStyle}>{nodo.numero}</td>
              <td style={tdStyle}>{nodo.nombre}</td>
              <td style={tdStyle}>{nodo.ubicacion_x}</td>
              <td style={tdStyle}>{nodo.ubicacion_y}</td>
              <td style={tdStyle}>
                <button 
                  style={editButtonStyle} 
                  onClick={() => handleEdit(nodo.numero)} // Cambia 'nodo.id' por 'nodo.numero'
                >
                  Modificar
                </button>
              </td>
              <td style={tdStyle}>{nodo.is_activo ? "Activo" : "Inactivo"}</td> {/* Muestra el estado en texto */}
            </tr>
          ))}
        </tbody>

        </table>
      </div>
    </>
  );
};

export default GestionNodo;

