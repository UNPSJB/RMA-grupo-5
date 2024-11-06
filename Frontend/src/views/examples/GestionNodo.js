import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "components/Headers/Header.js";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Gestion_Nodo.css";

const GestionNodo = () => {
  const [nodos, setNodos] = useState([]);
  const navigate = useNavigate();

  const fetchNodos = async () => {
    try {
      const [activosResponse, inactivosResponse] = await Promise.all([
        axios.get("http://localhost:8000/obtener_nodos_activos"),
        axios.get("http://localhost:8000/obtener_nodos_inactivos"),
      ]);
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

  return (
    <>
      <Header />
      <header>  
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css"></link>
      </header>
      <div className="table-container">
        <h2 className="table-header">Lista de Nodos Registrados</h2>
        
        <button className="add-button" onClick={handleAddNodo}>
          Registrar nuevo nodo
        </button>

        <table className="table">
          <thead>
            <tr>
              <th>Número de Nodo</th>  
              <th>Alias</th> 
              <th>Longitud</th>
              <th>Latitud</th>
              <th>Acciones</th>
              <th>Estado</th>
            </tr>
          </thead>
          
          <tbody>
            {nodos.map((nodo) => (
              <tr key={nodo.numero}>
                <td>{nodo.numero}</td>
                <td>{nodo.nombre}</td>
                <td>{nodo.ubicacion_x}</td>
                <td>{nodo.ubicacion_y}</td>
                <td>
                  <button 
                    className="edit-button" 
                    onClick={() => handleEdit(nodo.numero)} 
                  >
                    Modificar
                  </button>
                </td>
                
              <td>
                <div className="status-indicator">
                  <span className={nodo.is_activo ? "text-success" : "text-danger"}>
                    {nodo.is_activo ? "Activo" : "Inactivo"}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleEstado(nodo.numero)} 
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
