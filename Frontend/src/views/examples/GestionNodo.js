import React, { useState, useEffect } from "react";
import Header from "components/Headers/Header.js";
import { Tooltip } from "reactstrap";
import "../../assets/css/Gestion_Nodo.css";
import {Card, CardHeader,Container, Row, Col, Table, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import { message } from "antd";

import { useNavigate } from "react-router-dom";
import GenericMap from "./GenericMap";
import L from "leaflet";
import { setTokenToCookie } from './utils';
import {default as axios} from "./axiosConfig"; 


const GestionNodo = () => {
  const [nodos, setNodos] = useState([]);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // Estado para el modal
  const [nuevoNodo, setNuevoNodo] = useState({ numero: '', nombre: '', longitud: '', latitud: '' });
  const [esEdicion, setEsEdicion] = useState(false); // Si el modal está en modo edición
  const [nodoActual, setNodoActual] = useState(null); // Nodo actual a modificar
  const [markerPos, setMarkerPos] = useState(null);
  
  const fetchNodos = async () => {
    try {
      setTokenToCookie()

      const config = {
          withCredentials: true,
      }  
      const response = await axios.get(`http://localhost:8000/leer_nodos`, config);
      const nodos = response.data;
      setNodos(nodos);
    } catch (error) {
      console.error("Error al obtener los nodos:", error);
    }
  };


  const [ubicacionX, setUbicacionX] = useState('');
  const [ubicacionY, setUbicacionY] = useState('');

  const onClickPin = (lat, lng) => {
    setMarkerPos({ lat, lng });
    setNuevoNodo((prev) => ({
      ...prev,
      latitud: lat.toFixed(6),
      longitud: lng.toFixed(6),
    }));
  };
  const setPos = () => {
    return {ubicacionX, ubicacionY};
  }

  useEffect(() => {
    fetchNodos();
  }, []);

  useEffect(() => {
    if (!modalOpen) {
      setEsEdicion(false); // Restablecer a false cuando el modal se cierra
    }
  }, [modalOpen]);
  
  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);
  const toggleModal = () => setModalOpen(!modalOpen);
  
  const handleModificarNodo = (nodo) => {
    setEsEdicion(true);
    setNodoActual(nodo);
    setNuevoNodo({
      numero: nodo.numero.toString(),
      nombre: nodo.nombre,
      longitud: nodo.longitud.toString(),
      latitud: nodo.latitud.toString(),
    });
    toggleModal();
  };
  
  const handleNuevoNodoChange = (e) => {
    const { name, value } = e.target;
    setNuevoNodo((prev) => ({ ...prev, [name]: value }));

    if (name === 'longitud' || name === 'latitud') {
      setMarkerPos((prev) => ({
        ...prev,
        [name === 'latitud' ? 'lng' : 'lat']: parseFloat(value),
      }));
    }
  };
  const handleActualizarNodo = async () => {
    try {
      const nodoData = {
        numero: parseInt(nuevoNodo.numero),
        nombre: nuevoNodo.nombre,
        longitud: parseFloat(nuevoNodo.longitud),
        latitud: parseFloat(nuevoNodo.latitud),
      };
      setTokenToCookie()

      const config = {
          withCredentials: true,
      }
  
      await axios.put(`http://localhost:8000/modificar_nodo/${nodoActual.numero}`, nodoData, config);
      message.success("Nodo actualizado exitosamente");
      toggleModal();
      setEsEdicion(false);
      fetchNodos(); // Refrescar la lista de nodos
    } catch (error) {
      message.error("Error al actualizar el nodo, intente nuevamente");
    }
  };
  
  const handleRegistrarNodo = async () => {
    toggleModal();
    setEsEdicion(false);
    console.log("akfdsadsfadfsa");
    const { numero, nombre, longitud, latitud } = nuevoNodo;

    // Validar los campos
    if (!numero || isNaN(numero) || !longitud || !latitud) {
      message.error("Por favor ingresa valores válidos.");
      return;
    }

    try {
      const nodoData = {
        numero: parseInt(numero),
        nombre,
        longitud: parseFloat(longitud),
        latitud: parseFloat(latitud),
        estado: 1,
      };

      setTokenToCookie()

      const config = {
          withCredentials: true,
      }

      await axios.post('http://localhost:8000/crear_nodo', nodoData, config);
      message.success("Nodo registrado exitosamente");
      toggleModal(); // Cerrar el modal
      fetchNodos(); // Refrescar la lista
      setNuevoNodo({ numero: '', nombre: '', longitud: '', latitud: '' }); // Limpiar el formulario
    } catch (error) {
      message.error("Error al registrar el nodo, intente nuevamente");
    }
  };

  const toggleEstado = async (numeroNodo) => {
    try {
      setTokenToCookie()

      const config = {
          withCredentials: true,
      }
  
      const response = await axios.put(`http://localhost:8000/toggle_estado/${numeroNodo}`, config);
      
      if (response.status === 200) {
        const nuevoEstado = response.data.estado;  // Estado actualizado del nodo
        setNodos((prevNodos) =>
          prevNodos.map((nodo) =>
            nodo.numero === numeroNodo ? { ...nodo, estado: nuevoEstado } : nodo
          )
        );
      }
    } catch (error) {
      message.error("Error al cambiar el estado del nodo:", error);
    }
  };

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
      <Container className="mt-5" fluid>
        <Card className="shadow mb-4">
          <CardHeader className="border-0">
            {/* Título y Texto */}
            <h3 className="mb-0">Lista de Nodos Registrados</h3>
            <p className="text-muted mt-2">Gestión de los nodos registrados en el sistema.</p>
            
            {/* Botón de Registro */}
            <Row className="align-items-center">
              <Col xs="12" className="d-flex justify-content-start ms-3">
                <button className="add-button" onClick={toggleModal}>
                  Registrar nuevo nodo
                </button>
              </Col>
            </Row>

            {/* Tabla de Nodos */}
            <Row>
              <div className="col">
                <Card className="shadow mt-4">
                  <Table className="align-items-center table-flush" responsive>
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
                            <p>- <span className="inactivo">Sin mediciones</span>: El nodo no ha enviado mediciones en las últimas 24 horas.</p>
                            <p>- <span className="mantenimiento">Mantenimiento</span>: El nodo está en mantenimiento y no registrará mediciones.</p>
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
                            onClick={() => handleModificarNodo(nodo)}
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
                  </Table>
                </Card>
              </div>
            </Row>
          </CardHeader>
        </Card>
      </Container>
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>
          {esEdicion ? "Modificar Nodo" : "Registrar Nuevo Nodo"}
        </ModalHeader>
        <ModalBody>
          <form>
            <Container>
              <Row>
                <Col md={4}>

                  <div className="form-group">
                    <label htmlFor="numeroNodo">Número de Nodo:</label>
                    <input
                      type="text"
                      id="numeroNodo"
                      name="numero"
                      className="form-control"
                      value={nuevoNodo.numero}
                      onChange={handleNuevoNodoChange}
                      required
                      readOnly={esEdicion} // Solo lectura si estás editando
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="aliasNodo">Alias:</label>
                    <input
                      type="text"
                      id="aliasNodo"
                      name="nombre"
                      className="form-control"
                      value={nuevoNodo.nombre}
                      onChange={handleNuevoNodoChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="longitudNodo">Longitud:</label>
                    <input
                      type="text"
                      id="longitudNodo"
                      name="longitud"
                      className="form-control"
                      value={nuevoNodo.longitud}
                      onChange={handleNuevoNodoChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="latitudNodo">Latitud:</label>
                    <input
                      type="text"
                      id="latitudNodo"
                      name="latitud"
                      className="form-control"
                      value={nuevoNodo.latitud}
                      onChange={handleNuevoNodoChange}
                      required
                    />
                  </div>


                </Col>
                <Col md={8}>
                    <GenericMap nodos={[]} isCRUD={true} onClickPin={onClickPin} setPos={setPos} />
                </Col>

              </Row>


            </Container>
            
            
          </form>
        </ModalBody>
        <ModalFooter>
          {esEdicion ? (
            <button className="btn btn-primary" onClick={handleActualizarNodo}>
              Actualizar
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleRegistrarNodo}>
              Guardar
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={() => {
              toggleModal();
              setEsEdicion(false); // Restablecer el modo edición
              setNuevoNodo({ numero: "", nombre: "", longitud: "", latitud: "" }); // Limpiar
            }}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
}
export default GestionNodo;
