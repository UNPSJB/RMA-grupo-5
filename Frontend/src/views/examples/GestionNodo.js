import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "components/Headers/Header.js";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "reactstrap"; // Importa Tooltip
import "../../assets/css/Gestion_Nodo.css";

const GestionNodo = () => {
  const [nodos, setNodos] = useState([]);
  const [tooltipOpen, setTooltipOpen] = useState(false); // Estado para el Tooltip
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

  
  const [estados, setEstados] = useState([]);
  const [nombreEstado, setNombreEstado] = useState("");
  useEffect(() => {
    const fetchEstados = async () => {
      const response = await axios.get("http://localhost:8000/leer_estados_nodo/");
      setEstados(response.data);
    };

    fetchEstados();
  }, []);

  const getEstadoNodo = (id) => {
    const estado = estados.find(estado => estado.id === id);
    return estado ? estado.nombre : "Estado desconocido";
  }

  const handleEdit = (nodoId) => {
    navigate(`/admin/modificar_nodo/${nodoId}`);
  };

  const handleAddNodo = () => {
    navigate("/admin/registrar_nodo");
  };
{/*
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
*/}
  // Función para alternar el tooltip
  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  return (
    <>
      <Header />
      <header>  
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css"></link>
      </header>
      <div className="table-container">
        <h2 className="table-header">
          Lista de Nodos Registrados
          <i
            id="helpIcon" // ID para vincular el Tooltip
            className="bi bi-question-circle ml-2 text-info"
            style={{ cursor: "pointer" }}
          ></i>
          <Tooltip
            placement="right" // Posición del Tooltip
            isOpen={tooltipOpen}
            target="helpIcon"
            toggle={toggleTooltip}
          >
            El estado de los nodos es el siguiente:
              - Activo/Inactivo: es automatico (falta implementar), segun si le llega datos las ultimas 24hs
              - Mantenimiento: es manual, el usuario va a cambiarlo
          </Tooltip>
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
              <th>Estado</th>
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
                    <span className={getEstadoNodo(nodo.estado_nodo_id) === "activo" ? "text-success" : "text-danger"}>
                      {getEstadoNodo(nodo.estado_nodo_id)}
                    </span>
                    {/*  
                    <button
                      type="button"
                      onClick={() => toggleEstado(nodo.numero)} 
                    >
                      <i className={`bi ${nodo.is_activo ? "bi-x-circle text-danger" : "bi-check-circle text-success"}`}></i>
                    </button>
                    */}
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
