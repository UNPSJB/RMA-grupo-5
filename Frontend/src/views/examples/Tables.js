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
// core components
import Header from "components/Headers/Header.js";

const Tables = () => {
  const [nodos, setNodos] = useState([]);
  const [medicionData, setMedicionData] = useState([]);
  const [nodoSeleccionado, setNodoSeleccionado] = useState("");
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

  // Ordenar mediciones de más reciente a más antiguo
  const sortedMedicionData = [...medicionData].sort((a, b) => new Date(b.time) - new Date(a.time));

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
                setCurrentPage(1); // Resetear a la primera página al cambiar nodo
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
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()} // Falta implementar
                            >
                              Ver nodo
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()} // Falta implementar
                            >
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
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem active={index + 1 === currentPage} key={index}>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(index + 1);
                        }}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
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

