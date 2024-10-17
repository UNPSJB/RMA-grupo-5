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
  Button,
} from "reactstrap";
import * as XLSX from "xlsx"; // Importar la librería XLSX
import Header from "components/Headers/Header.js";

const Tables = () => {
  const [nodos, setNodos] = useState([]);
  const [medicionData, setMedicionData] = useState([]);
  const [nodoSeleccionado, setNodoSeleccionado] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [cantidadExportar, setCantidadExportar] = useState(""); // Nueva variable para cantidad
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
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedMedicionData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedMedicionData.length / itemsPerPage);

  // Función para exportar todos los datos del nodo seleccionado
  const exportAllToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      sortedMedicionData.map((dato) => ({
        Nodo: dato.nodo_numero,
        Tipo: dato.type,
        Data: dato.data,
        "Fecha-Hora": new Date(dato.time).toLocaleString(),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Mediciones_${nodoSeleccionado || "todos"}`);
    XLSX.writeFile(wb, `mediciones_nodo_${nodoSeleccionado || "todos"}_completo.xlsx`);
  };

  // Función para exportar una cantidad específica de datos
  const exportSelectedToExcel = () => {
    const cantidad = parseInt(cantidadExportar) || sortedMedicionData.length; // Determinar cantidad a exportar
    const dataToExport = sortedMedicionData.slice(0, cantidad); // Obtener la cantidad seleccionada
    const ws = XLSX.utils.json_to_sheet(
      dataToExport.map((dato) => ({
        Nodo: dato.nodo_numero,
        Tipo: dato.type,
        Data: dato.data,
        "Fecha-Hora": new Date(dato.time).toLocaleString(),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Mediciones_${nodoSeleccionado || "todos"}`);
    XLSX.writeFile(wb, `mediciones_nodo_${nodoSeleccionado || "todos"}_${cantidad}.xlsx`);
  };

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
              <option value="">Nodo</option>
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
              <option value="">Tipo de Dato</option>
              <option value="TEMP_T">Temperatura</option>
              <option value="HUMIDITY_T">Humedad</option>
              <option value="PRESSURE_T">Presión</option>
              <option value="ALTITUDE_T">Altitud</option>
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

          {/* Campo para seleccionar la cantidad de datos a exportar */}
          <Col xl="2">
            <input
              type="number"
              className="form-control"
              placeholder="Cantidad a exportar"
              value={cantidadExportar}
              onChange={(e) => setCantidadExportar(e.target.value)}
            />
          </Col>

          {/* Botón para exportar cantidad seleccionada */}
          <Col xl="2">
            <Button color="primary" onClick={exportSelectedToExcel}>
              Exportar Cantidad
            </Button>
          </Col>

          {/* Botón para exportar todos los datos */}
          <Col xl="2">
            <Button color="primary" onClick={exportAllToExcel}>
              Exportar Todo
            </Button>
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
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((medicion, index) => (
                    <tr key={index}>
                      <td>{medicion.nodo_numero}</td>
                      <td>{medicion.type}</td>
                      <td>{medicion.data}</td>
                      <td>{new Date(medicion.time).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Paginación */}
              <div className="py-3">
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

                  {/* Botones de paginación */}
                  {(() => {
                    const pageButtons = [];
                    const maxButtons = 5;
                    const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
                    const endPage = Math.min(totalPages, startPage + maxButtons - 1);
                    for (let i = startPage; i <= endPage; i++) {
                      pageButtons.push(
                        <PaginationItem key={i} active={i === currentPage}>
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

                  {/* Botón para página siguiente */}
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

