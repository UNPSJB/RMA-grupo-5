import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "components/Headers/Header.js";
import { Tooltip, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { message } from "antd"; // Para notificaciones
import "../../assets/css/Gestion_Nodo.css";
import { Card, CardHeader, Container, Row, Col, Table } from "reactstrap";

const GestionNodo = () => {
  const [nodos, setNodos] = useState([]);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // Estado para el modal
  const [nuevoNodo, setNuevoNodo] = useState({ numero: '', nombre: '', longitud: '', latitud: '' });

  const fetchNodos = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/leer_nodos`);
      setNodos(response.data);
    } catch (error) {
      console.error("Error al obtener los nodos:", error);
    }
  };

  useEffect(() => {
    fetchNodos();
  }, []);

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);
  const toggleModal = () => setModalOpen(!modalOpen);

  const handleNuevoNodoChange = (e) => {
    const { name, value } = e.target;
    setNuevoNodo({ ...nuevoNodo, [name]: value });
  };

  const handleRegistrarNodo = async () => {
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

      await axios.post('http://localhost:8000/crear_nodo', nodoData);
      message.success("Nodo registrado exitosamente");
      toggleModal(); // Cerrar el modal
      fetchNodos(); // Refrescar la lista
      setNuevoNodo({ numero: '', nombre: '', longitud: '', latitud: '' }); // Limpiar el formulario
    } catch (error) {
      message.error("Error al registrar el nodo, intente nuevamente");
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
      default:
        return "Desconocido";
    }
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case 1:
        return "text-success"; // Activo
      case 2:
        return "text-danger"; // Inactivo
      case 3:
        return "text-warning"; // Mantenimiento
      default:
        return "text-muted"; // Desconocido
    }
  };

  return (
    <>
      <Header />
      <Container className="mt-5" fluid>
        <Card className="shadow mb-4">
          <CardHeader className="border-0">
            <h3 className="mb-0">Lista de Nodos Registrados</h3>
            <p className="text-muted mt-2">Gestión de los nodos registrados en el sistema.</p>

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
                          <td className={getEstadoClass(nodo.estado)}>
                            {getEstadoTexto(nodo.estado)}
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

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Registrar Nuevo Nodo</ModalHeader>
        <ModalBody>
          <form>
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
          </form>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={handleRegistrarNodo}>
            Guardar
          </button>
          <button className="btn btn-secondary" onClick={toggleModal}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default GestionNodo;


