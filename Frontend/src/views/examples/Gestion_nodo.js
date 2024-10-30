import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "components/Headers/Header.js";
import { useNavigate } from "react-router-dom";

const GestionNodo = () => {
  const [nodos, setNodos] = useState([]);
  const navigate = useNavigate();

  // Función para obtener todos los nodos (activos e inactivos) desde el backend
  const fetchNodos = async () => {
    try {
      const [activosResponse, inactivosResponse] = await Promise.all([
        axios.get("http://localhost:8000/obtener_nodos_activos"),
        axios.get("http://localhost:8000/obtener_nodos_inactivos"),
      ]);

      // Combinar los nodos activos e inactivos en una sola lista
      const nodos = [...activosResponse.data, ...inactivosResponse.data];
      setNodos(nodos);
    } catch (error) {
      console.error("Error al obtener los nodos:", error);
    }
  };

  useEffect(() => {
    fetchNodos(); 
  }, []);

  const handleEdit = (nodoId) => {
    navigate(`/admin/modificar_nodo/${nodoId}`);
  };

  const handleAddNodo = () => {
    navigate("/admin/registrar_nodo");
  };

  const toggleEstado = async (numeroNodo) => {
    try {
      const response = await axios.put(`http://localhost:8000/toggle_estado/${numeroNodo}`);
      if (response.status === 200) {
        setNodos((prevNodos) =>
          prevNodos.map((nodo) =>
            nodo.numero === numeroNodo ? { ...nodo, is_activo: !nodo.is_activo } : nodo
          )
        );
      }
    } catch (error) {
      console.error("Error al cambiar el estado del nodo:", error);
    }
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
      <header>  
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css"></link>
      </header>
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
                    onClick={() => handleEdit(nodo.numero)} 
                  >
                    Modificar
                  </button>
                </td>
                
              <td style={tdStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span className={nodo.is_activo ? "text-success" : "text-danger"}>
                    {nodo.is_activo ? "Activo" : "Inactivo"}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleEstado(nodo.numero)}  // Llamada a la función para alternar el estado
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                  >
                    <i className={`bi ${nodo.is_activo ? "bi-x-circle text-danger" : "bi-check-circle text-success"}`}></i>
                  </button>
                </div>
              </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default GestionNodo;

