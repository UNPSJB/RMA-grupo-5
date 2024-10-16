import React, { useState, useEffect } from "react";
import {
  Badge,
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Header from "components/Headers/Header.js";

const Tables = () => {
  const [nodos, setNodos] = useState([]);
  const [medicionData, setMedicionData] = useState([]);
  const [nodoSeleccionado, setNodoSeleccionado] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState(""); 
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  // Carga de nodos
  useEffect(() => {
    const getNodos = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/obtener_nodos");
        if (!response.ok) {
          throw new Error("Error al hacer el fetch de nodos");
        }
        const data = await response.json();
        setNodos(data);
      } catch (error) {
        console.error("Error cargando los nodos", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    getNodos();
  }, []);

  // Carga de mediciones según el nodo seleccionado
  useEffect(() => {
    const getMedicionData = async () => {
      if (nodoSeleccionado) {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:8000/leer_mediciones_nodo/${nodoSeleccionado}`);
          if (!response.ok) {
            throw new Error("Error al hacer el fetch de mediciones");
          }
          const data = await response.json();
          setMedicionData(data);
        } catch (error) {
          console.error("Error cargando los datos", error);
          setError(error);
        } finally {
          setLoading(false);
        }
      }
    };
    getMedicionData();
  }, [nodoSeleccionado]);

  // Manejo de carga y errores
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error cargando datos: {error.message}</p>;

  // Filtrar los datos por tipo y rango de fechas
  const filteredData = medicionData.filter((dato) => {
    const fechaMedicion = new Date(dato.time);
    const dentroRango =
      (!fechaInicio || fechaMedicion >= new Date(fechaInicio)) &&
      (!fechaFin || fechaMedicion <= new Date(fechaFin));
    const tipoCoincide = !tipoSeleccionado || dato.type === tipoSeleccionado;
    return dentroRango && tipoCoincide;
  });

  // Ordenar mediciones de más reciente a más antiguo
  const sortedMedicionData = [...filteredData].sort((a, b) => new Date(b.time) - new Date(a.time));

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage; // Último índice de los elementos
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // Primer índice de los elementos
  const currentItems = sortedMedicionData.slice(indexOfFirstItem, indexOfLastItem); // Elementos actuales a mostrar
  const totalPages = Math.ceil(sortedMedicionData.length / itemsPerPage); // Total de páginas

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mb-3">
          <Col xl="2">
            <select
              value={nodoSeleccionado || ""}
              onChange={(e) => {
                setNodoSeleccionado(e.target.value);
                setCurrentPage(1); 
              }}
              className="form-control"
            >
              <option value="">Seleccione un Nodo</option>
              {nodos.map((nodo, index) => (
                <option key={index} value={nodo.numero}>
                  Nodo {nodo.numero}
                </option>
              ))}
            </select>
          </Col>

          <Col xl="2">
            <select
              value={tipoSeleccionado}
              onChange={(e) => setTipoSeleccionado(e.target.value)}
              className="form-control"
            >
              <option value="">Seleccione Tipo de Dato</option>
              <option value="TEMP_T">Temperatura</option>
              <option value="HUMIDITY_T">Humedad</option>
              <option value="PRESSURE_T">Presión</option>
              <option value="ALTITUDE_T">23</option>
            </select>
          </Col>

          <Col xl="2">
            <input
              type="date"
              className="form-control"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </Col>
          <Col xl="2">
            <input
              type="date"
              className="form-control"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </Col>
        </Row>

        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Historial de Mediciones del Nodo {nodoSeleccionado || "Todos"}</h3>
                <p className="text-muted">
                  Mostrando datos de más reciente a más antiguo.
                </p>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Nodo</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Data</th>
                    <th scope="col">Fecha-Hora</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((dato) => (
                    <tr key={dato.id}>
                      <th scope="row">{dato.nodo_numero}</th>
                      <td>{dato.type}</td>
                      <td>{dato.data}</td>
                      <td>{new Date(dato.time).toLocaleString()}</td>
                      <td className="text-right">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                              Ver nodo
                            </DropdownItem>
                            <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                              Ir a ubicación
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="d-flex justify-content-between">
              <Pagination className="pagination justify-content-end mb-0">
              {/* Botón para página anterior */}
              <PaginationItem disabled={currentPage === 1}>
                <PaginationLink
                  href="#pablo"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(currentPage - 1);
                  }}
                >
                  <i className="fas fa-angle-left" />
                  <span className="sr-only">Previous</span>
                </PaginationLink>
              </PaginationItem>

              {/* Lógica para limitar la cantidad de botones */}
              {(() => {
                const pageButtons = [];
                const maxButtons = 5; // Cambia este valor si deseas más/menos botones
                let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
                let endPage = Math.min(totalPages, startPage + maxButtons - 1);

                // Ajusta la posición de las páginas si está al principio o final
                if (endPage - startPage < maxButtons - 1) {
                  startPage = Math.max(1, endPage - maxButtons + 1);
                }

                for (let i = startPage; i <= endPage; i++) {
                  pageButtons.push(
                    <PaginationItem active={i === currentPage} key={i}>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(i);
                        }}
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                return pageButtons;
              })()}

              {/* Botón para la página siguiente */}
              <PaginationItem disabled={currentPage === totalPages}>
                <PaginationLink
                  href="#pablo"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(currentPage + 1);
                  }}
                >
                  <i className="fas fa-angle-right" />
                  <span className="sr-only">Next</span>
                </PaginationLink>
              </PaginationItem>
            </Pagination>

              </div>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Tables;
