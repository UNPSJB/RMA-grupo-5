import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "components/Headers/Header.js";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "reactstrap";
import "../../assets/css/Gestion_Nodo.css";

const GestionNodo = () => {
  const [nodos, setNodos] = useState([]);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const navigate = useNavigate();

  const fetchNodos = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/leer_nodos`);
      const nodos = response.data;
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
        const nuevoEstado = response.data.estado;  // Estado actualizado del nodo
        setNodos((prevNodos) =>
          prevNodos.map((nodo) =>
            nodo.numero === numeroNodo ? { ...nodo, estado: nuevoEstado } : nodo
          )
        );
      }
    } catch (error) {
      console.error("Error al cambiar el estado del nodo:", error);
    }
  };
  

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 1:
        return "Activo";
      case 2:
        return "Inactivo";
      case 3:
        return "Mantenimiento";
    }
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case 1:
        return "text-success"; // Activo
      case 2:
        return "text-danger"; // Inactivo
      case 3:
        return "mantenimiento"; // Mantenimiento
      default:
        return "text-muted"; // Desconocido
    }
  };

  return (
    <>
      <Header />
      <header>  
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css"></link>
      </header>
      <div className="table-container">
        <h2 className="table-header">
          Lista de Nodos Registrados
        </h2>

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
              <th>
                Estado
                <i
                  id="helpIcon"
                  className="bi bi-question-circle ml-2 text-info"
                  style={{ cursor: "pointer", display: "inline-block", verticalAlign: "middle" }}
                ></i>
                <Tooltip
                  placement="right"
                  isOpen={tooltipOpen}
                  target="helpIcon"
                  toggle={toggleTooltip}
                >
                   <p>- <span className="activo">Activo</span>: El nodo está funcionando y enviando datos.</p>
                   <p>- <span className="inactivo">Sin mediciones </span>: El nodo no ha enviado mediciones en las últimas 24 horas.</p>
                   <p>- <span className="mantenimiento">Mantenimiento </span>: El nodo está en mantenimiento y no registrarán mediciones.</p>
                </Tooltip>
              </th>
            </tr>
          </thead>

          <tbody>
            {nodos.map((nodo) => (
              <tr key={nodo.numero}>
                <td>{nodo.numero}</td>
                <td>{nodo.nombre}</td>
                <td>{nodo.longitud}</td>
                <td>{nodo.latitud}</td>
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
                    <span className={getEstadoClass(nodo.estado)}>
                      {getEstadoTexto(nodo.estado)}
                    </span>
                    {(nodo.estado === 1 || nodo.estado === 2 || nodo.estado === 3) && (
                      <button
                        type="button"
                        onClick={() => toggleEstado(nodo.numero)} 
                      >
                        <i className="bi bi-wrench text-warning"></i> {/* Icono de mantenimiento */}
                      </button>
                    )}
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

