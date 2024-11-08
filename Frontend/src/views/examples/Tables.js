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
import * as XLSX from "xlsx"; // Importar la librería XLSX
import Header from "components/Headers/Header.js";
import { CustomFileInput } from "components/Buttons/CustomFileInput";

const Tables = () => {
  const [nodos, setNodos] = useState([]);
  const [medicionData, setMedicionData] = useState([]);
  const [nodoSeleccionado, setNodoSeleccionado] = useState(0);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [tipoIdSeleccionado, setTipoIdSeleccionado] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [cantidadExportar, setCantidadExportar] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [ordenamiento, setOrdenamiento] = useState("fecha"); // Nuevo estado para ordenamiento
  const [ordenAscendente, setOrdenAscendente] = useState(true); // Estado para dirección de orden

  // Filtrar los datos por tipo y rango de fechas
  let filteredData;
  let sortedMedicionData;
  // Lógica de paginación
  let indexOfLastItem; 
  let indexOfFirstItem; 
  let currentItems = [];
  let totalPages;
  

  // Carga de nodos
  useEffect(() => {
    const getNodos = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/leer_nodos");
        if (!response.ok) {
          throw new Error("Error al hacer el fetch de nodos");
        }
        const data = await response.json();
        setNodos(data);

        // Establecer el nodo por defecto si hay nodos disponibles
        if (data.length > 0) {
          setNodoSeleccionado(data[0].numero); // Establece el primer nodo como seleccionado
        }
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
      if (nodoSeleccionado !== null) {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:8000/leer_mediciones_correctas_nodo/${nodoSeleccionado}`);
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

    // Llamar a getMedicionData al montar el componente o cuando nodoSeleccionado cambie
    getMedicionData();
  }, [nodoSeleccionado]);


  const unidadesMedida = {
    1: "°C",       // Grados Celsius para temperatura
    2: "°C",       // Grados Celsius para temperatura 2
    3: "%",        // Porcentaje para humedad
    4: "hPa",      // Hectopascales para presión
    5: "Luz",
    6: "%",       // Humedad del suelo
    7: "%",       // Humedad del suelo 2
    8: "Ω.m2/m",       //Ohmios Resistencia del suelo
    9:"Ω.m2/m",        //Ohmios Resistencia del suelo 2
    10: "%",        //Porcentaje para el oxígeno
    11: "ppm", //Partes por millón (ppm) (Dióxido de Carbono)
    12: "m/s",  // Metros por segundo (Velocidad del Viento)
    13: "°",    // Grados (Dirección del Viento)
    14: "mm",   // Milímetros (Precipitación)
    15: "",     // Sin unidad específica (Movimiento)
    16: "V",    // Voltios (Voltaje)
    17: "V",    // Voltios (Voltaje #2)
    18: "A",    // Amperios (Corriente)
    19: "A",    // Amperios (Corriente #2)
    20: "",     // Sin unidad específica (Iteraciones)
    21: "°",    // Grados (Latitud GPS)
    22: "°",    // Grados (Longitud GPS)
    23: "m",    // Metros (Altitud GPS)
    24: "",     // Sin unidad específica (HDOP GPS)
    25: "m",    // Metros (Nivel de Fluido)
    26: "Índice UV",  // Índice UV (Radiación UV)
    27: "µg/m³",      // Microgramos por metro cúbico (Partículas 1)
    28: "µg/m³",      // Microgramos por metro cúbico (Partículas 2.5)
    29: "µg/m³",      // Microgramos por metro cúbico (Partículas 10)
    30: "W",    // Vatios (Potencia)
    31: "W",    // Vatios (Potencia #2)
    32: "Wh",   // Vatios-hora (Energía)
    33: "Wh",   // Vatios-hora (Energía #2)
    34: "kg",   // Kilogramos (Peso)
    35: "kg"    // Kilogramos (Peso #2)
    
    
  };
  const obtenerUnidad = (tipo) => {
    // Si el tipo existe devuelve la unidad, sino, devuelve una cadena vacía.
    return unidadesMedida[tipo] || "";
  };

  const nombreTipo = {
    1: "Temperatura",
    2: "Temperatura",       
    3: "Humedad",        
    4: "Presión atmosférica",
    5: "Luz",  
    6: "Humedad del suelo",  
    7: "Humedad del suelo 2",
    8: "Resistencia del suelo",
    9: "Resistencia del suelo 2",
    10: "Oxígeno",
    11: "Dióxido de Carbono",
    12: "Velocidad del viento",
    13: "Dirección del Viento",
    14: "Precipitación",
    15: "Movimiento",
    16: "Voltaje",
    17: "Voltaje #2",
    18: "Corriente",
    19: "Corriente #2",
    20: "Iteraciones",
    21: "Latitud GPS",
    22: "Longitud GPS",
    23: "Altura del Agua",
    24: "HDOP GPS (Dilución Horizontal de Precisión)",
    25: "Nivel de Fluido",
    26: "Radiación UV",
    27: "Partículas 1",
    28: "Partículas 2.5",
    29: "Partículas 10",
    30: "Potencia",
    31: "Potencia #2",
    32: "Energía",
    33: "Energía #2",
    34: "Peso",
    35: "Peso #2"         
  };
  const obtenerNombreTipo = (data) => {
    return nombreTipo[data] || "";
  };

  useEffect(() => {
    const getTipoDato = async () => {
      if (tipoSeleccionado) {
        try {
          const response = await fetch(`http://localhost:8000/tipo_dato/${tipoSeleccionado}`);
          if (!response.ok) {
            throw new Error("Error al hacer el fetch de mediciones");
          }
          const data = await response.json();
          console.log(`el tipo es ${data.tipo}`)
          setTipoIdSeleccionado(data.tipo);
        } catch (error) {
          console.error("Error cargando los datos", error);
          setError(error);
        } 
      }else{
        setTipoIdSeleccionado(null);
      }
      
    };

    // Llamar a getMedicionData al montar el componente o cuando nodoSeleccionado cambie
    getTipoDato();
  }, [tipoSeleccionado]);

  // Filtrar datos según el criterio seleccionado
  const filtrar_datos = () => {
    const fechaInicioDate = fechaInicio ? new Date(`${fechaInicio}T00:00:00`) : null; // Inicio del día
    const fechaFinDate = fechaFin ? new Date(`${fechaFin}T23:59:59`) : null; // Fin del día
  
    // Filtrar los datos por tipo y rango de fechas
    filteredData = medicionData.filter((dato) => {
      const fechaMedicion = new Date(dato.time);
  
      const dentroRango = 
        (fechaInicioDate ? fechaMedicion >= fechaInicioDate : true) && 
        (fechaFinDate ? fechaMedicion <= fechaFinDate : true);
  
      // Filtrar también por tipo si es necesario
      const tipoValido = (tipoIdSeleccionado === null || dato.type === tipoIdSeleccionado);
      
      return dentroRango && tipoValido;
    });

    // Ordenar según el criterio seleccionado y la dirección de orden
    sortedMedicionData = [...filteredData].sort((a, b) => {
      let comparison = 0;
      switch (ordenamiento) {
        case "tipo":
          comparison = a.type - b.type; 
          break;
        case "data":
          comparison = a.data - b.data; 
          break;
        case "fecha":
        default:
          comparison = new Date(a.time) - new Date(b.time); 
          break;
      }
      return ordenAscendente ? comparison : -comparison; // Invertir el resultado si es descendente
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
  
      const data = await response.json();
      console.log("Data importada:", data);
    } catch (error) {
      console.error("Error importando los datos", error);
      setError(error);
    }
  }
  

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

  // Manejo de carga y errores
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error cargando datos: {error.message}</p>;
  
  return (
    <>
      <Header />
      <Container className="mt--9" fluid>
      <Row className="mt-5 mb-3">
          <Col xl="2">
            <select
              value={nodoSeleccionado}
              onChange={(e) => {
                setNodoSeleccionado(e.target.value);
                setCurrentPage(1);
              }}
              className="form-control"
            >
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
              onChange={(e) => {setTipoSeleccionado(e.target.value); filtrar_datos(); setCurrentPage(1)}}
              className="form-control"
            >
              <option value="">Tipo de Dato</option>
              <option value="temp_t ">Temperatura</option>
              
              <option value="temp2_t">Temperatura #2</option>
              <option value="humidity_t">Humedad Relativa</option>
              <option value="pressure_t">Presión Atmosférica</option>
              <option value="light_t">Luz (lux)</option>
              <option value="soil_t">Humedad del Suelo</option>
              <option value="soil2_t">Humedad del Suelo #2</option>
              <option value="soilr_t">Resistencia del Suelo</option>
              <option value="soilr2_t">Resistencia del Suelo #2</option>
              <option value="oxygen_t">Oxígeno</option>
              <option value="co2_t">Dióxido de Carbono</option>
              <option value="windspd_t">Velocidad del Viento</option>
              <option value="windhdg_t">Dirección del Viento</option>
              <option value="rainfall_t">Precipitación</option>
              <option value="motion_t">Movimiento</option>
              
              <option value="voltage_t">Voltaje Batería</option>
              
              <option value="voltage2_t">Voltaje #2</option>
              <option value="current_t">Corriente</option>
              <option value="current2_t">Corriente #2</option>
              <option value="it_t">Iteraciones</option>
              <option value="latitude_t">Latitud GPS</option>
              <option value="longitude_t">Longitud GPS</option>
              
              <option value="altitude_t">Altura del Agua</option>
              
              <option value="hdop_t">HDOP GPS (Horizontal Dilution of Precision)</option>
              <option value="level_t">Nivel de Fluido</option>
              <option value="uv_t">Radiación UV</option>
              <option value="pm1_t">Partículas 1</option>
              <option value="pm2_5_t">Partículas 2.5</option>
              <option value="pm10_t">Partículas 10</option>
              <option value="power_t">Potencia</option>
              <option value="power2_t">Potencia #2</option>
              <option value="energy_t">Energía</option>
              <option value="energy2_t">Energía #2</option>
              <option value="weight_t">Peso</option>
              <option value="weight2_t">Peso #2</option>
              
            </select>
          </Col>
        </Row>
        
        <Row className="mb-3">
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
          <Col xl="2">
            <CustomFileInput onChange={importData} />
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
                      Data 
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
                  {currentItems.map((medicion, index) => (
                    <tr key={index}>
                      <td>{medicion.nodo_numero}</td>
                      <td>{obtenerNombreTipo(medicion.type)}</td>
                      <td>
                        {parseFloat(medicion.data).toFixed(2)}{" "}
                        {obtenerUnidad(medicion.type)} 
                      </td> 
                      <td>
                        {new Date(medicion.time).toLocaleString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false 
                        })}
                      </td>
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

