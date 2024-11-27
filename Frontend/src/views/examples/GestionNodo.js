import React, { useState, useEffect } from "react";
import Header from "components/Headers/Header.js";
import { Tooltip } from "reactstrap";
import "../../assets/css/Gestion_Nodo.css";
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {Card, CardHeader,Container, Row, Col, Table, Modal, ModalBody, ModalFooter, ModalHeader, Form} from "reactstrap";
import { message } from "antd";
import { setTokenToCookie } from './utils';
import {default as axios} from "./axiosConfig"; 

const polygonPositions = [
  [-43.52988218344, -66.07521091461],
  [-43.53386467976, -66.08207736969],
  [-43.53635360641, -66.08860050201],
  [-43.54182888344, -66.09546695709],
  [-43.54581059081, -66.09546695709],
  [-43.55004086674, -66.09409366608],
  [-43.55501728184, -66.09855686188],
  [-43.56049086384, -66.09821353912],
  [-43.56372501949, -66.10370670319],
  [-43.56646147713, -66.10405002594],
  [-43.56919781046, -66.10096012115],
  [-43.57367517868, -66.09958683014],
  [-43.58014190069, -66.09684024811],
  [-43.58586188357, -66.09272037506],
  [-43.58984068155, -66.08448062897],
  [-43.59083533995, -66.08001743317],
  [-43.58909467696, -66.07727085114],
  [-43.59133266298, -66.07486759186],
  [-43.59406786623, -66.07349430084],
  [-43.59829475400, -66.06868778229],
  [-43.60202411428, -66.06628452301],
  [-43.60823920105, -66.06491123199],
  [-43.61445364570, -66.06044803619],
  [-43.61992182582, -66.05358158112],
  [-43.62414689714, -66.05220829010],
  [-43.62588654609, -66.04843173981],
  [-43.62514098842, -66.04328189850],
  [-43.62837167154, -66.04087863922],
  [-43.62986269749, -66.03607212067],
  [-43.63135368645, -66.02371250153],
  [-43.63383858587, -66.01375614166],
  [-43.63806267907, -66.00791965485],
  [-43.63806267907, -66.00311313629],
  [-43.63980192526, -65.99487339020],
  [-43.64253492469, -65.99006687164],
  [-43.64626154175, -65.98766361237],
  [-43.65048476161, -65.98560367584],
  [-43.65321727506, -65.97942386627],
  [-43.65619805702, -65.97702060699],
  [-43.66215917708, -65.97736392975],
  [-43.66265591037, -65.97324405670],
  [-43.66066895255, -65.96912418365],
  [-43.66265591037, -65.96569095612],
  [-43.66613292832, -65.96809421539],
  [-43.66787136177, -65.96500431061],
  [-43.66638127904, -65.96191440582],
  [-43.66166243968, -65.95951114655],
  [-43.65843354640, -65.95470462799],
  [-43.65445928552, -65.95092807770],
  [-43.64626154175, -65.94818149567],
  [-43.64154112110, -65.94921146393],
  [-43.63483251686, -65.94509159088],
  [-43.63085669424, -65.94680820465],
  [-43.62762614469, -65.94543491364],
  [-43.62514098842, -65.94543491364],
  [-43.62265572941, -65.93994174957],
  [-43.62240719785, -65.93582187653],
  [-43.61843055329, -65.93238864899],
  [-43.61644213237, -65.92758213043],
  [-43.61221651960, -65.93135868073],
  [-43.61196794490, -65.93513523102],
  [-43.61470221013, -65.93891178131],
  [-43.61296223755, -65.94440494537],
  [-43.61147079241, -65.94989810944],
  [-43.60749342454, -65.95298801422],
  [-43.60276995859, -65.95367465973],
  [-43.59630566733, -65.94886814117],
  [-43.59431651490, -65.95127140045],
  [-43.59182998191, -65.95436130524],
  [-43.58834866313, -65.95436130524],
  [-43.58337500127, -65.95367465973],
  [-43.57665990591, -65.95951114655],
  [-43.56870030455, -65.96054111481],
  [-43.55999328602, -65.96397434235],
  [-43.55402203169, -65.96225772858],
  [-43.54879669875, -65.96088443756],
  [-43.54531289177, -65.96328769684],
  [-43.54257547361, -65.96878086090],
  [-43.53909130708, -65.97324405670],
  [-43.53510915592, -65.97461734772],
  [-43.53262017791, -65.97736392975],
  [-43.52838867952, -65.97702060699],
  [-43.52191640188, -65.97736392975],
  [-43.51967583628, -65.98148380280],
  [-43.51793311663, -65.98697696686],
  [-43.51444752632, -65.98869358063],
  [-43.50971676029, -65.99144016266],
  [-43.50548365530, -65.99178348541],
  [-43.50224637471, -65.99075351715],
  [-43.50000507876, -65.99487339020],
  [-43.49676750439, -65.99659000397],
  [-43.48979367767, -65.99350009918],
  [-43.48555917569, -65.99693332672],
  [-43.48755191948, -66.00173984528],
  [-43.48630646231, -66.00517307281],
  [-43.48306815350, -66.00757633209],
  [-43.48182260389, -66.01203952789],
  [-43.48555917569, -66.01684604645],
  [-43.48954459753, -66.02405582428],
  [-43.49377882012, -66.02371250153],
  [-43.49826179105, -66.02371250153],
  [-43.50349150318, -66.03195224762],
  [-43.50872076230, -66.03572879791],
  [-43.51145971723, -66.04122196198],
  [-43.51503910000, -66.04685960000],
  [-43.52116955592, -66.04705844879],
  [-43.52515262750, -66.04396854401],
  [-43.53162455794, -66.04808841705],
  [-43.53585582930, -66.04499851227],
  [-43.53859355256, -66.04843173981],
  [-43.53461136854, -66.05392490387],
  [-43.53635360641, -66.05804477692],
  [-43.53934018279, -66.06147800446],
  [-43.53834467377, -66.06559787750],
  [-43.53311798173, -66.07109104156],
  [-43.52988218344, -66.07521091461]
];

const GestionNodo = () => {
  const [nodos, setNodos] = useState([]);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // Estado para el modal
  const [nuevoNodo, setNuevoNodo] = useState({ numero: '', nombre: '', longitud: '', latitud: '' });
  const [esEdicion, setEsEdicion] = useState(false); // Si el modal está en modo edición
  const [nodoActual, setNodoActual] = useState(null); // Nodo actual a modificar

  const [mapCenter, setMapCenter] = useState([-43.529882, -66.075211]); // Coordenadas iniciales del mapa
  const bounds = [
    [-45.0, -67.5], // Esquina suroeste de los límites
    [-42.0, -64.0], // Esquina noreste de los límites
  ];
  const fetchNodos = async () => {
    try {
      setTokenToCookie();
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

  useEffect(() => {
    fetchNodos();
  }, []);

  useEffect(() => {
    if (!modalOpen) {
      setEsEdicion(false);
      setNuevoNodo({ numero: '', nombre: '', longitud: '', latitud: '' }); // Limpiar el formulario
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
    setMapCenter([parseFloat(nodo.latitud), parseFloat(nodo.longitud)]); // Centra el mapa en las coordenadas del nodo
    toggleModal();
  };
  

  const handleNuevoNodoChange = (e) => {
    const { name, value } = e.target;
    setNuevoNodo({ ...nuevoNodo, [name]: value });
  };

  const handleActualizarNodo = async () => {
    try {
      setTokenToCookie();
      const config = {
        withCredentials: true,
      }
      const nodoData = {
        numero: parseInt(nuevoNodo.numero),
        nombre: nuevoNodo.nombre,
        longitud: parseFloat(nuevoNodo.longitud),
        latitud: parseFloat(nuevoNodo.latitud),
      };

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
    const { numero, nombre, longitud, latitud } = nuevoNodo;

    // Validar los campos
    if (!numero) {
      message.error("El número de nodo es obligatorio.");
      return;
    }
    if (!longitud || isNaN(parseFloat(longitud))) {
      message.error("La longitud es obligatoria y debe ser un número válido.");
      return;
    }
    if (!latitud || isNaN(parseFloat(latitud))) {
      message.error("La latitud es obligatoria debe ser un número válido.");
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
      setTokenToCookie();
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
  
  const actualizarCoordenadasDesdeMapa = (lat, lng) => {
    setNuevoNodo((prev) => ({ ...prev, latitud: lat.toFixed(6), longitud: lng.toFixed(6) }));
  };

  const MapEventHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        actualizarCoordenadasDesdeMapa(lat, lng);
      },
    });
    return null;
  };

  const customIcon = L.divIcon({
    className: "custom-icon",
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background-color: blue;
        color: white;
        font-size: 14px;
        font-weight: bold;
        border: 2px solid #ccc;
      ">
        ${esEdicion ? nodoActual.numero : "N"}
      </div>`,
  });

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
      <Modal isOpen={modalOpen} toggle={toggleModal} size="xl">
      <ModalHeader toggle={toggleModal}>
        {esEdicion ? "Modificar Nodo" : "Registrar Nuevo Nodo"}
      </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => {
            e.preventDefault(); 
            handleRegistrarNodo(); 
          }}>
            <Container>
              <Row>
                <Col md={4}>
                  <div className="form-group">
                    <label htmlFor="numeroNodo">Número de Nodo *</label>
                    <input
                      type="number"
                      id="numeroNodo"
                      name="numero"
                      className="form-control"
                      value={nuevoNodo.numero}
                      pattern="[0-9]+"
                      onChange={handleNuevoNodoChange}
                      readOnly={esEdicion}
                      required
                      
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="aliasNodo">Alias</label>
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
                    <label htmlFor="longitudNodo">Longitud *</label>
                    <input
                      type="number"
                      id="longitudNodo"
                      name="longitud"
                      className="form-control"
                      value={nuevoNodo.longitud}
                      pattern="^-?\d+(\.\d+)?$"
                      onChange={handleNuevoNodoChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="latitudNodo">Latitud *</label>
                    <input
                      type="number"
                      id="latitudNodo"
                      name="latitud"
                      className="form-control"
                      value={nuevoNodo.latitud}
                      pattern="^-?\d+(\.\d+)?$"
                      onChange={handleNuevoNodoChange}
                      required
                    />
                  </div>
                </Col>
                <Col>
                  <MapContainer
                    center={mapCenter}
                    zoom={11}
                    minZoom={8}
                    maxZoom={14}
                    maxBounds={bounds}
                    maxBoundsViscosity={1.0}
                    style={{ height: "600px", width: "100%", borderRadius: "10px", border: "2px solid #ccc", padding: '100px' }}
                  >
                    <Polygon
                        positions={polygonPositions}
                        color="slategray"
                        weight={1} // Grosor del borde
                        opacity={0.5} // Opacidad del borde
                        fillColor="slategray" // Color de relleno
                        fillOpacity={0.3} // Opacidad del relleno
                        lineCap="round" // Forma de los extremos de la línea
                        lineJoin="round" // Unión de las líneas
                    />
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapEventHandler />
                    {nuevoNodo.latitud && nuevoNodo.longitud && (
                      <Marker
                        position={[parseFloat(nuevoNodo.latitud), parseFloat(nuevoNodo.longitud)]}
                        icon={customIcon}
                      >
                      </Marker>
                    )}
                  </MapContainer>
                </Col>
              </Row>
            </Container>
          </Form>
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