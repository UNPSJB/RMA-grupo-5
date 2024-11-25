import React, { useState, useEffect } from "react";
import {
  Card,
  Label,
  FormText,
  Input,
  Form,
  FormGroup,
  CardHeader,
  Table,
  Container,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
} from "reactstrap";
import * as XLSX from "xlsx";
import Header from "components/Headers/Header.js";
import { CustomFileInput } from "components/Buttons/CustomFileInput";
import { useLocation } from "react-router-dom";
import { message } from "antd";
import {default as axios} from "./axiosConfig"; 
import { setTokenToCookie } from "./utils";
const Tables = () => {
  const [nodos, setNodos] = useState([]);
  const [medicionData, setMedicionData] = useState([]);
  const [nodoSeleccionado, setNodoSeleccionado] = useState(0);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(1);;
  const [tiposDatos, setTiposDatos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [cantidadExportar, setCantidadExportar] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [ordenamiento, setOrdenamiento] = useState("fecha");
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [umbralMin, setUmbralMin] = useState("");
  const [umbralMax, setUmbralMax] = useState("");
  const [showUmbrales, setShowUmbrales] = useState(false);
  const [showFecha, setShowFecha] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const location = useLocation();

  // Filtrar los datos por tipo y rango de fechas
  let filteredData;
  let sortedMedicionData;
  // Lógica de paginación
  let indexOfLastItem; 
  let indexOfFirstItem; 
  let currentItems = [];
  let totalPages;
  

  useEffect(() => {
    if (location.state && location.state.selectedNode !== undefined) {
      setNodoSeleccionado(location.state.selectedNode);
    }
  }, [location.state]);
  
  // Carga de nodos
  useEffect(() => {
    const getNodos = async () => {
      setLoading(true);
      setTokenToCookie()
      try {
        // Realizar la solicitud con Axios
        
        const response = await axios.get("/leer_nodos");
    
        // Extraer los datos de la respuesta
        const data = response.data;
        setNodos(data);
    
        // Solo establecer el nodo por defecto si no hay un nodo seleccionado
        if (data.length > 0 && nodoSeleccionado === null) {
          setNodoSeleccionado(data[0].numero); // Establece el primer nodo como seleccionado solo si nodoSeleccionado es null
        }
      } catch (error) {
        console.error("Error cargando los nodos", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    getNodos();
  }, [nodoSeleccionado]);


  useEffect(() => {
    if (nodoSeleccionado !== null && nodoSeleccionado !== undefined) {
        const getMedicionData = async () => {
            setLoading(true);
            try {
                
                //const response = await fetch(`http://localhost:8000/leer_mediciones_correctas_nodo/${nodoSeleccionado}`);
                const response = await axios.get(`http://localhost:8000/leer_mediciones_correctas_nodo/${nodoSeleccionado}`);
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
        };

        getMedicionData();
    }
}, [nodoSeleccionado]);

  
  useEffect(() => {
    const getTiposDatos = async () => {
      try {
        setTokenToCookie()
        //const response = await fetch("http://localhost:8000/leer_tipos_datos");
        const response = await axios.get("http://localhost:8000/leer_tipos_datos");
        if (!response.ok) {
          throw new Error("Error al obtener los tipos de datos");
        }
        const data = await response.json();
        const tiposValidos = data.filter(tipo => tipo.nombre !== 'DESCONOCIDO');
        
        setTiposDatos(tiposValidos);
      } catch (error) {
        console.error("Error cargando los tipos de datos", error);
        setError(error);
      }
    };
  
    getTiposDatos();
  }, []);
  
  // Traducir los nombres de los tipos para mostrarlos
  const tipoDatoMap = {
    "TEMP_T": "Temperatura",
    "TEMP2_T": "Temperatura #2",
    "HUMIDITY_T": "Humedad Relativa",
    "PRESSURE_T": "Presión Atmosférica",
    "LIGHT_T": "Luz (lux)",
    "SOIL_T": "Humedad del Suelo",
    "SOIL2_T": "Humedad del Suelo #2",
    "SOILR_T": "Resistencia del Suelo",
    "SOILR2_T": "Resistencia del Suelo #2",
    "OXYGEN_T": "Oxígeno",
    "CO2_T": "Dióxido de Carbono",
    "WINDSPD_T": "Velocidad del Viento",
    "WINDHDG_T": "Dirección del Viento",
    "RAINFALL_T": "Precipitación",
    "MOTION_T": "Movimiento",
    "VOLTAGE_T": "Voltaje",
    "VOLTAGE2_T": "Voltaje #2",
    "CURRENT_T": "Corriente",
    "CURRENT2_T": "Corriente #2",
    "IT_T": "Iteraciones",
    "LATITUDE_T": "Latitud GPS",
    "LONGITUDE_T": "Longitud GPS",
    "ALTITUDE_T": "Altitud GPS",
    "HDOP_T": "HDOP GPS",
    "LEVEL_T": "Nivel de Fluido",
    "UV_T": "UV",
    "PM1_T": "Partículas PM1",
    "PM2_5_T": "Partículas PM2.5",
    "PM10_T": "Partículas PM10",
    "POWER_T": "Potencia",
    "POWER2_T": "Potencia #2",
    "ENERGY_T": "Energía",
    "ENERGY2_T": "Energía #2",
    "WEIGHT_T": "Peso",
    "WEIGHT2_T": "Peso #2",
  };

  const filtrar_datos = () => {
    const fechaInicioDate = fechaInicio ? new Date(`${fechaInicio}T00:00:00`) : null;
    const fechaFinDate = fechaFin ? new Date(`${fechaFin}T23:59:59`) : null;
  
    // Filtrar los datos por tipo y rango de fechas
    filteredData = medicionData.filter((dato) => {
      const fechaMedicion = new Date(dato.time);
  
      const dentroRangoFecha =
        (fechaInicioDate ? fechaMedicion >= fechaInicioDate : true) &&
        (fechaFinDate ? fechaMedicion <= fechaFinDate : true);
  
      const tipoValido = tipoSeleccionado
        ? dato.tipo_dato_id === parseInt(tipoSeleccionado)
        : true;

      // Asegurarse de que los umbrales son numeros antes de comparar
      const umbralMinValue = parseFloat(umbralMin) || -Infinity;
      const umbralMaxValue = parseFloat(umbralMax) || Infinity;

      const dentroUmbral =
        dato.data >= umbralMinValue && dato.data <= umbralMaxValue;

      return dentroRangoFecha && tipoValido && dentroUmbral;
    });
  
    // Ordenar según el criterio seleccionado y la dirección de orden
    sortedMedicionData = [...filteredData].sort((a, b) => {
      let comparison = 0;
      switch (ordenamiento) {
        case "tipo":
          comparison = a.tipo_dato_id - b.tipo_dato_id;
          break;
        case "data":
          comparison = a.data - b.data;
          break;
        case "fecha":
        default:
          comparison = new Date(a.time) - new Date(b.time);
          break;
      }
      return ordenAscendente ? comparison : -comparison;
    });
  
    // Lógica de paginación
    indexOfLastItem = currentPage * itemsPerPage;
    indexOfFirstItem = indexOfLastItem - itemsPerPage;
    currentItems = sortedMedicionData.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(sortedMedicionData.length / itemsPerPage);
  };
  
  filtrar_datos();

  async function importData(e) {
    const files = Array.from(e.target.files);
    console.log("files:", files[0]);
  
    try {
      const formData = new FormData();
      formData.append('file', files[0]);
  
      const requestOptions = {
        method: 'POST',
        body: formData
      };
  
      const response = await fetch(`http://localhost:8000/importar_datos_csv`, requestOptions);
      if (!response.ok) {
        throw new Error("Error al hacer el fetch de importar datos");
      }
      message.success("Archivo cargado con exito")
  
      const data = await response.json();
      console.log("Data importada:", data);

      // Esperar un poco antes de recargar la página para dar tiempo al mensaje
      setTimeout(() => {
        window.location.reload(); // Recarga la página
      }, 1000); // 1 segundo para asegurarse de que el mensaje se muestre

    } catch (error) {
      console.error("Error importando los datos", error);
      setError(error);
    }
  }

  // Función para exportar todos los datos del nodo seleccionado
  const exportAllToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      sortedMedicionData.map((dato) => {
        // Buscar el tipo de dato por el id
        const tipo = tiposDatos.find((tipo) => tipo.id === dato.tipo_dato_id);
        const tipoNombre = tipoDatoMap[tipo.nombre];    
        return {
          Nodo: dato.nodo_numero,
          Tipo: tipoNombre,
          Data: dato.data,
          "Fecha-Hora": new Date(dato.time).toLocaleString(),
        };
      })
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
      dataToExport.map((dato) => {
        // Buscar el tipo de dato por el id
        const tipo = tiposDatos.find((tipo) => tipo.id === dato.tipo_dato_id);
        const tipoNombre = tipoDatoMap[tipo.nombre];      
        return {
          Nodo: dato.nodo_numero,
          Tipo: tipoNombre,
          Data: dato.data,
          "Fecha-Hora": new Date(dato.time).toLocaleString(),
        };
      })
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Mediciones_${nodoSeleccionado || "todos"}`);
    XLSX.writeFile(wb, `mediciones_nodo_${nodoSeleccionado || "todos"}_${cantidad}.xlsx`);
  };

  // Manejo de carga y errores
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error cargando datos: {error.message}</p>;
  
  return (
    <>
    <Header />
      <Container className="mt-5" fluid> {/* Ajuste del margen superior */}
        <Card className="shadow mb-4">
          <CardHeader className="border-0">
            {/* Título y Texto */}
            <h3 className="mb-0">Historial de Mediciones del Nodo {nodoSeleccionado}</h3>
            <p className="text-muted mt-2">Mostrando datos de más reciente a más antiguo.</p>
            
            {/* Selección de Nodo y Tipo de Dato */}
            <Row className="align-items-center">
              <Col xs="12" className="d-flex justify-content-start">
                <select
                  value={nodoSeleccionado}
                  onChange={(e) => {
                    setNodoSeleccionado(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="form-control mr-2"
                >
                  {nodos.map((nodo, index) => (
                    <option key={index} value={nodo.numero}>
                      Nodo {nodo.numero}
                    </option>
                  ))}
                </select>
  
                <select
                  value={tipoSeleccionado}
                  onChange={(e) => { 
                    setTipoSeleccionado(e.target.value); 
                    setCurrentPage(1);
                  }}
                  className="form-control mr-2"
                >
                  {tiposDatos.map((tipo, index) => {
                    const tipoTraducido = tipo && tipoDatoMap[tipo.nombre] ? tipoDatoMap[tipo.nombre] : (tipo ? tipo.nombre : "Sin tipo");
                    return (
                      <option key={index} value={tipo.id}>
                        {tipoTraducido}
                      </option>
                    );
                  })}
                </select>
              </Col>
              
              {/* Botones de Filtros, Exportación, Fecha, y Subir Archivo */}
              <Col xs="12" className="d-flex justify-content-start mt-2">
                <Button
                  color="secondary"
                  onClick={() => {
                    setShowUmbrales(!showUmbrales);
                    setShowFecha(false);
                    setShowExport(false);
                  }}
                  className="mr-2"
                >
                  Filtros de Umbrales
                </Button>
                <Button
                  color="secondary"
                  onClick={() => {
                    setShowExport(!showExport);
                    setShowUmbrales(false);
                    setShowFecha(false);
                  }}
                  className="mr-2"
                >
                  Exportar Datos y Subir Archivo
                </Button>
                <Button
                  color="secondary"
                  onClick={() => {
                    setShowFecha(!showFecha);
                    setShowUmbrales(false);
                    setShowExport(false);
                  }}
                  className="mr-2"
                >
                  Filtrar por Fecha
                </Button>
              </Col>
            </Row>
          </CardHeader>
  
            {/* Grupo de Filtros de Umbrales */}
            {showUmbrales && (
              <Row className="mb-4 ml-2 align-items-center">
                <Col md="3">
                  <FormGroup>
                    <Label>Umbral Mínimo</Label>
                    <Input
                      type="number"
                      value={umbralMin}
                      onChange={(e) => setUmbralMin(e.target.value)}
                      placeholder="Valor mínimo"
                    />
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup>
                    <Label>Umbral Máximo</Label>
                    <Input
                      type="number"
                      value={umbralMax}
                      onChange={(e) => setUmbralMax(e.target.value)}
                      placeholder="Valor máximo"
                    />
                  </FormGroup>
                </Col>
              </Row>
            )}

            {/* Grupo de Selección de Fechas */}
            {showFecha && (
              <Row className="mb-4 ml-2">
                <Col md="3">
                  <FormGroup>
                    <Label>Fecha Inicio</Label>
                    <Input
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup>
                    <Label>Fecha Fin</Label>
                    <Input
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
            )}
    
            {/* Grupo de Exportación */}
            {showExport && (
              <Row className="mb-4 ml-2 align-items-center">
                <Col md="3">
                  <FormGroup>
                    <Label>Cantidad a Exportar</Label>
                    <Input
                      type="number"
                      value={cantidadExportar}
                      onChange={(e) => setCantidadExportar(e.target.value)}
                      placeholder="Cantidad a exportar"
                    />
                  </FormGroup>
                </Col>
                <Col md="6" className="d-flex justify-content-start">
                  <Button className="edit-button mr-2" onClick={exportSelectedToExcel}>
                    Exportar Cantidad
                  </Button>
                  <Button className="edit-button mr-2" onClick={exportAllToExcel}>
                    Exportar Todo
                  </Button>
                  <Button className="edit-button mr-2">
                    <CustomFileInput className="edit-button" onChange={importData} />
                  </Button>
                  
                </Col>
              </Row>
            )}

            {/* Tabla de Datos */}
            <Row>
              <div className="col">
              <Card className="shadow mt-4 px-3 py-3"> {/* Añade márgenes en el Card */}
              <Table className="align-items-center" responsive> {/* Quita 'table-flush' */}
                <thead>
                  <tr>
                    <th scope="col">Nodo</th>
                    <th onClick={() => { setOrdenamiento("tipo"); setOrdenAscendente(!ordenAscendente); }}>
                      Tipo 
                      {ordenamiento === "tipo" && (
                        <span className={`arrow ${ordenAscendente ? "desc" : "asc"}`}></span>
                      )}
                    </th>
                    <th onClick={() => { setOrdenamiento("data"); setOrdenAscendente(!ordenAscendente); }}>
                      Valor 
                      {ordenamiento === "data" && (
                        <span className={`arrow ${ordenAscendente ? "desc" : "asc"}`}></span>
                      )}
                    </th>
                    <th onClick={() => { setOrdenamiento("fecha"); setOrdenAscendente(!ordenAscendente); }}>
                      Fecha-Hora 
                      {ordenamiento === "fecha" && (
                        <span className={`arrow ${ordenAscendente ? "desc" : "asc"}`}></span>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((medicion, index) => {
                    const tipoDato = tiposDatos.find(
                      (tipo) => tipo.id === medicion.tipo_dato_id
                    );

                    return (
                      <tr key={index}>
                        <td>{medicion.nodo_numero}</td>
                        <td>{tipoDato && tipoDatoMap[tipoDato.nombre]}</td>
                        <td>
                          {parseFloat(medicion.data).toFixed(2)}{" "}
                          {tipoDato ? tipoDato.unidad : ""}
                        </td>
                        <td>
                          {new Date(medicion.time).toLocaleString("es-AR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </td>
                      </tr>
                    );
                  })}
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
        </Card>
      </Container>
    </>
  );
};

export default Tables;