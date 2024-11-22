import { useState, useEffect } from "react";
import classnames from "classnames";
import Chart from "chart.js";
import { Line, Bar, Radar, Polar} from "react-chartjs-2";
import html2canvas from "html2canvas";
import "../assets/css/index.css";

import {
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  graficoLineal,
  graficoBarras,
  graficoCompuesto,
  graficoPolar,
  graficoRadar,
} from "variables/charts.js";
import Header from "components/Headers/Header.js";

  
const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [nodos, setNodos] = useState([]);

  const [medicionesDiarias, setMedicionesDiarias] = useState(null);
  const [medicionesDiarias2, setMedicionesDiarias2] = useState(null);

  const [medicionesSemanales, setMedicionesSemanales] = useState(null);
  const [medicionesSemanales2, setMedicionesSemanales2] = useState(null);

  const [medicionesSemanalesTemp, setMedicionesSemanalesTemp] = useState(null);
  const [medicionesSemanalesTemp2, setMedicionesSemanalesTemp2] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nodoSeleccionado, setNodoSeleccionado] = useState(0); // Nodo seleccionado por defecto en 0
  const [nodoSeleccionado2, setNodoSeleccionado2] = useState(0); // Nodo seleccionado por defecto en 0
  const [modal, setModal] = useState(false);
  const [expandedChart, setExpandedChart] = useState(null); 

  const toggleModal = (chart) => {
    setExpandedChart(chart);
    setModal(!modal);
  };

  //funcion para exportar graficos en JPEG
  const exportChartAsImage = (chartClass) => {
    const chartElement = document.querySelector(`#${chartClass}`); 
    if (chartElement) {
      html2canvas(chartElement).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/jpeg");
        link.download = `${chartClass}.jpg`; 
        link.click();
      });
    } else {
      console.error("No se encontró el gráfico para exportar.");
    }
  };

  // Obtener todos los nodos para el desplegable
  useEffect(() => {
    const getNodos = async () => {
      setLoading(true); // Iniciar la carga
      try {
        const response = await fetch("http://localhost:8000/leer_nodos");
        if (!response.ok) {
          throw new Error("Error al obtener nodos");
        }
        const data = await response.json();
        setNodos(data);

        // Si no hay nodos, el nodo seleccionado será 0
        if (data.length === 0) {
          setNodoSeleccionado(0);
        }
      } catch (error) {
        console.error("Error cargando los nodos", error);
        setError(error);
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };
    getNodos();
  }, []);


  // Función para obtener la diferencia en minutos entre dos fechas
  const diferenciaEnMinutos = (fecha1, fecha2) => {
    return Math.abs((new Date(fecha1) - new Date(fecha2)) / (1000 * 60));
  };

  // Modificación de la función para obtener el primer valor cercano con tipo
  const obtenerPrimerValorCercano = (mediciones, horaObjetivo, rangoEnMinutos, tipo) => {
    let valorMasCercano = null;
    let diferenciaMinima = Infinity;

    mediciones.forEach((medicion) => {
        // Solo considerar mediciones del tipo especificado
        if (medicion.tipo_dato_id === tipo) {
            const fechaMedicion = new Date(medicion.time);
            const diferencia = diferenciaEnMinutos(fechaMedicion, horaObjetivo);

            // Considerar solo mediciones dentro del rango de minutos definido
            if (diferencia <= rangoEnMinutos && diferencia < diferenciaMinima) {
                diferenciaMinima = diferencia;
                valorMasCercano = medicion;
            }
        }
    });

    return valorMasCercano;
  };

  
  const obtenerHorasObjetivoUltimas24Horas = () => {
    const ahora = new Date();
    const horasObjetivo = [];

    for (let i = 0; i <= 12; i++) { 
      const horaObjetivo = new Date(ahora.getTime() - i * 2 * 60 * 60 * 1000);
      horasObjetivo.push(horaObjetivo.getTime());
    }

    return horasObjetivo;
  };


  useEffect(() => {
    const getMedicionesDiarias = async (nodoSeleccionado, setMediciones) => {
      if (nodoSeleccionado !== null) {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:8000/leer_mediciones_correctas_nodo/${nodoSeleccionado}`);
          if (!response.ok) {
            throw new Error("Error al obtener las mediciones diarias");
          }

          const data = await response.json();


          const hace24Horas = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
          const medicionesUltimas24Horas = data.filter((medicion) => new Date(medicion.time) >= hace24Horas);

          const horasObjetivoUltimas24 = obtenerHorasObjetivoUltimas24Horas();

          const medicionesFiltradas = horasObjetivoUltimas24.map((horaObjetivo) =>obtenerPrimerValorCercano(medicionesUltimas24Horas, horaObjetivo, 60, 23));

          const medicionesValidas = medicionesFiltradas.filter((medicion) => medicion !== null);

          setMediciones(medicionesValidas);
        } catch (error) {
          console.error("Error cargando los datos", error);
          setError(error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    getMedicionesDiarias(nodoSeleccionado, setMedicionesDiarias);
  }, [nodoSeleccionado]);

  useEffect(() => {
    const getMedicionesDiarias = async (nodoSeleccionado, setMediciones) => {
      if (nodoSeleccionado !== null) {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:8000/leer_mediciones_correctas_nodo/${nodoSeleccionado}`);
          if (!response.ok) {
            throw new Error("Error al obtener las mediciones diarias");
          }

          const data = await response.json();

          // Filter the last 24 hours' measurements
          const hace24Horas = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
          const medicionesUltimas24Horas = data.filter((medicion) => new Date(medicion.time) >= hace24Horas);

          // Get target times for the last 24 hours
          const horasObjetivoUltimas24 = obtenerHorasObjetivoUltimas24Horas();

          // Get the closest measurement to each target time
          const medicionesFiltradas = horasObjetivoUltimas24.map((horaObjetivo) =>
            obtenerPrimerValorCercano(medicionesUltimas24Horas, horaObjetivo, 60, 23)
          );

          // Filter out null values when no measurement is close enough
          const medicionesValidas = medicionesFiltradas.filter((medicion) => medicion !== null);

          setMediciones(medicionesValidas);
        } catch (error) {
          console.error("Error cargando los datos", error);
          setError(error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    getMedicionesDiarias(nodoSeleccionado2, setMedicionesDiarias2);
  }, [nodoSeleccionado2]);
  

  const obtenerMedicionesSemanales = async (nodoSeleccionado, type, setMediciones, setLoading, setError) => { 
    if (nodoSeleccionado !== null) {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/leer_mediciones_correctas_nodo/${nodoSeleccionado}`);
            if (!response.ok) {
                throw new Error("Error al obtener las mediciones semanales");
            }

            const data = await response.json();
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);


            const sieteDiasAtras = new Date(hoy);
            sieteDiasAtras.setDate(hoy.getDate() - 6); 
            sieteDiasAtras.setHours(0, 0, 0, 0);

            const medicionesPorDia = {};
            const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            let diaActual = new Date(sieteDiasAtras);

            while (diaActual <= hoy) {
                const nombreDia = diasSemana[diaActual.getDay()];
                medicionesPorDia[nombreDia] = [];
                diaActual.setDate(diaActual.getDate() + 1);
            }

            data.forEach((medicion) => {
                const fechaMedicion = new Date(medicion.time);
                fechaMedicion.setHours(0, 0, 0, 0);

                if (fechaMedicion >= sieteDiasAtras && fechaMedicion <= hoy) {
                    const diaSemana = diasSemana[fechaMedicion.getDay()];
                    const valor = parseFloat(medicion.data);

                    if (!isNaN(valor) && medicion.tipo_dato_id === type) {
                        medicionesPorDia[diaSemana].push(medicion);
                    }
                }
            });


            const promedios = Object.keys(medicionesPorDia).map((dia) => {
                const mediciones = medicionesPorDia[dia];
                const suma = mediciones.reduce((acc, medicion) => acc + parseFloat(medicion.data), 0);
                const promedio = mediciones.length > 0 ? suma / mediciones.length : 0;

                return {
                    type: type,
                    data: promedio.toString(),
                };
            });

            setMediciones(promedios);
        } catch (error) {
            console.error("Error cargando los datos", error);
            setError(error);
        } finally {
            setLoading(false);
        }
      }
  };


  useEffect(() => {
    obtenerMedicionesSemanales(nodoSeleccionado, 23, setMedicionesSemanales, setLoading, setError);
  }, [nodoSeleccionado]);
  useEffect(() => {
    obtenerMedicionesSemanales(nodoSeleccionado, 1, setMedicionesSemanalesTemp, setLoading, setError);
  }, [nodoSeleccionado]);
  useEffect(() => {
    obtenerMedicionesSemanales(nodoSeleccionado2, 23, setMedicionesSemanales2, setLoading, setError);
  }, [nodoSeleccionado2]);
  useEffect(() => {
    obtenerMedicionesSemanales(nodoSeleccionado2, 1, setMedicionesSemanalesTemp2, setLoading, setError);
  }, [nodoSeleccionado2]);

  // Manejo de carga y errores
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error cargando datos: {error.message}</p>;

  // Función para filtrar los datos segun tipo
  const mapearDatos = (data) => {
    return data
      ? data
          .filter((item) => item) // Verifica que item no sea null o undefined
          .map((item) => parseFloat(item.data)) // Convierte los valores a float
      : [];
  };

  // Filtrar los valores diarios y semanales
  const valoresNodosDiario = medicionesDiarias ? mapearDatos(medicionesDiarias) : [];
  const valoresNodosDiario2 = medicionesDiarias2 ? mapearDatos(medicionesDiarias2) : [];

  const valoresNodosSemanal = medicionesSemanales ? mapearDatos(medicionesSemanales) : [];
  const valoresNodosSemanal2 = medicionesSemanales2 ? mapearDatos(medicionesSemanales2) : [];

  const valoresNodosTemp = medicionesSemanalesTemp ? mapearDatos(medicionesSemanalesTemp) : [];
  const valoresNodosTemp2 = medicionesSemanalesTemp2 ? mapearDatos(medicionesSemanalesTemp2) : [];

  // seteo los valores que despues voy a usar en los graficos
  const chartData = {
    diarioAlt: graficoLineal.data1(valoresNodosDiario, nodoSeleccionado, valoresNodosDiario2,  nodoSeleccionado2),
    semanalAlt: graficoLineal.data2(valoresNodosSemanal, nodoSeleccionado, valoresNodosSemanal2, nodoSeleccionado2),
    semanalTemp: graficoBarras.data(valoresNodosTemp, nodoSeleccionado , valoresNodosTemp2, nodoSeleccionado2),
  };

  const titulosGraficos = {
    line: "Altura del canal",
    bar: "Temperatura de la zona",
    comp: "Comparación de datos",
    rad: "Presion atmosférica",
    pol: "Radiación UV"
  };
  

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
  };

  return (
    <>
      <Header />
      <Container className="mt--9" fluid style={{padding: '135px'}} >
        
        <Row className="mt-5 mb-3">
          <Col xl="2">
            <select
              value={nodoSeleccionado}
              onChange={(e) => setNodoSeleccionado(parseInt(e.target.value))}
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
              value={nodoSeleccionado2}
              onChange={(e) => setNodoSeleccionado2(parseInt(e.target.value))}
              className="form-control"
            >
              {nodos.map((nodo, index) => (
                <option key={index} value={nodo.numero}>
                  Nodo {nodo.numero}
                </option>
              ))}
            </select>
          </Col>
        </Row>

          <Row>

            {/* GRAFICO LINEAL */}
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Red de Monitoreo - Cuenca Sagmata
                      </h6>
                      <h2 className="text-Black mb-0">Altura del canal</h2>
                    </div>

                    <div className="button-column">
                      <Nav className="button-group-horizontal " pills >
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", { active: activeNav === 1 })}
                            href="#pablo"
                            onClick={(e) => toggleNavs(e, 1)}
                          >
                            <span className="d-none d-md-block">Diario</span> 
                            <span className="d-md-none">D</span>
                          </NavLink>
                        </NavItem>

                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", { active: activeNav === 2 })}
                            data-toggle="tab"
                            href="#pablo"
                            onClick={(e) => toggleNavs(e, 2)}
                          >
                            <span className="d-none d-md-block">Semanal</span>
                            <span className="d-md-none">S</span>
                          </NavLink>
                        </NavItem>


                        <NavItem>
                          <Button
                            className="py-2 px-3"
                            
                            size="sm"
                            onClick={() => exportChartAsImage("chart-line")}
                          >
                            <span className="d-none d-md-block">Exportar</span>
                            <span className="d-md-none">E</span>
                          </Button>
                        </NavItem>

                        <NavItem>
                          <Button
                            className={classnames("py-0 px-2", "large-text")}
                            size="sm"
                            color="white"
                            onClick={() => toggleModal("line")}
                          >
                            ⤢
                          </Button>
                        </NavItem>
                      </Nav>
                    </div>
                  </Row>
                </CardHeader>
                
                <CardBody id='chart-line'>
                  <div className="chart" >
                    <Line
                      data={activeNav === 1 ? chartData.diarioAlt : chartData.semanalAlt}
                      options={graficoLineal.options}
                      getDatasetAtEvent={(e) => console.log(e)}
                      />
                  </div>
                </CardBody>
                
              </Card>
            </Col>

            {/* GRAFICO BARRAS */}
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Medición semanal (PROMEDIO)
                    </h6>
                    <h2 className="mb-0">Temperatura de la zona </h2>
                  </div>

                  <div className="button-column">
                    <Nav className="button-group-horizontal " pills >
                      <NavItem>
                        <Button
                          className="py-2 px-3"
                          size="sm"
                          href=""
                          onClick={() => exportChartAsImage("chart-bar")} // Exportar gráfico de barras
                        >
                          <span className="d-none d-md-block">Exportar</span>
                          <span className="d-md-none">E</span>
                        </Button>
                      </NavItem>
                      <NavItem>
                        <Button
                          className={classnames("py-0 px-2", "large-text")}
                          size="sm"
                          color="white"
                          onClick={() => toggleModal("bar")}
                        >
                          <span className="d-none d-md-block">⤢</span>
                        </Button>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
                
                </CardHeader>
                <CardBody id="chart-bar">
                  <div className="chart">
                    <Bar
                      data={chartData.semanalTemp}
                      options={graficoBarras.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4 mb-2">

            {/* GRAFICO RADAR */}
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Medición semanal
                      </h6>
                      <h2 className="mb-0">Presión atmosférica</h2>
                    </div>
                  
                    <Nav className="button-group-horizontal " pills >
                      <NavItem>  
                        <Button
                          className="py-2 px-3"
                          href=""
                          size="sm"
                          
                          onClick={() => exportChartAsImage("bar-graph")} 
                        >
                          <span className="d-none d-md-block">Exportar</span>
                          <span className="d-md-none">E</span>
                        </Button>
                      </NavItem>
                      <NavItem>
                        <Button
                          className={classnames("py-0 px-2", "large-text")}
                          size="sm"
                          color="white"
                          onClick={() => toggleModal("rad")}
                        >
                          <span className="d-none d-md-block">⤢</span>
                        </Button>
                      </NavItem>
                    </Nav>
                  </Row>
                </CardHeader>
                <CardBody id='bar-graph'>
                  <div className="chart">
                    <Radar
                      data={chartData.semanalTemp}
                      options={graficoRadar.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>

            {/* GRAFICO COMPUESTO */}
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Medición semanal
                      </h6>
                      <h2 className="mb-0"> Comparación de datos</h2>
                    </div>
                    <Nav className="button-group-horizontal " pills >
                      <NavItem>  
                        <Button
                          className="py-2 px-3"
                          size="sm"
                          href=""
                          onClick={() => exportChartAsImage("composite-graph")} 
                        >
                          <span className="d-none d-md-block">Exportar</span>
                          <span className="d-md-none">E</span>
                        </Button>
                      </NavItem>
                      <NavItem>  
                        <Button
                          className={classnames("py-0 px-2", "large-text")}
                          size="sm"
                          color="white"
                          onClick={() => toggleModal("comp")}>
                          ⤢
                        </Button>
                      </NavItem>
                    </Nav>
                  </Row>
                </CardHeader>
                <CardBody id='composite-graph'>
                  <div className="chart">
                  <Bar data={graficoCompuesto.data(valoresNodosTemp, 1, valoresNodosDiario, 4, valoresNodosSemanal, 23)} options={graficoCompuesto.options} />
                  </div>
                </CardBody>
              </Card>
            </Col>

          {/* GRAFICO POLAR */}
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Medición semanal
                      </h6>
                      <h2 className="mb-0">Radiación UV</h2>
                    </div>
                    <Nav className="button-group-horizontal " pills >
                      <NavItem>  
                        <Button
                          className="py-2 px-3"
                          size="sm"
                          onClick={() => exportChartAsImage("polar-graph")} 
                        >
                          <span className="d-none d-md-block">Exportar</span>
                          <span className="d-md-none">E</span>
                        </Button>
                      </NavItem>
                      <NavItem>
                        <Button
                          className={classnames("py-0 px-2", "large-text")}
                          size="sm"
                          color="white"
                          onClick={() => toggleModal("pol")}
                        >
                          ⤢
                        </Button>
                      </NavItem>  
                    </Nav>
                  </Row>
                </CardHeader>

                <CardBody id='polar-graph'>
                  <div className="chart">
                    <Polar
                      data={chartData.semanalTemp}
                      options={graficoPolar.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            
          </Row>
          <Modal isOpen={modal} toggle={() => toggleModal(null)} size="xl">
            <ModalHeader toggle={() => toggleModal(null)}>
              {titulosGraficos[expandedChart] || "Gráfico Expandido"}
            </ModalHeader>
            <ModalBody>
              <div style={{ width: "100%", height: "500px" }}> {/* Ajusta la altura */}
                {expandedChart === "line" && (
                  <Line
                    data={chartData[activeNav === 1 ? "diarioAlt" : "semanalAlt"]}
                    options={graficoLineal.options}
                  />
                )}
                {expandedChart === "bar" && (
                  <Bar data={chartData.semanalTemp} options={graficoBarras.options} />
                )}
                {expandedChart === "comp" && (
                  <Bar
                    data={graficoCompuesto.data(
                      valoresNodosTemp,
                      1,
                      valoresNodosDiario,
                      4,
                      valoresNodosSemanal,
                      23
                    )}
                    options={graficoCompuesto.options}
                  />
                )}
                {expandedChart === "rad" && <Radar data={chartData.semanalTemp} />}
                {expandedChart === "pol" && <Polar data={chartData.semanalTemp} />}
              </div>
            </ModalBody>
          </Modal>

          {/* MUESTRA DATOS PARA VERIFICAR Q LOS CONSIGUE
          <Row className="mt-5">
            <Col>
              <h2>Valores de Nodos (Data)</h2>
              <ul>
                {valoresNodosDiario.map((valor, index) => (
                  <li key={index}>Valor Nodo {index + 1}: {valor}</li>
                ))}
              </ul>
            </Col>
          </Row>

          <Row className="mt-5"> 
            <div>
              <h2>Datos JSON:</h2>
              <pre>{JSON.stringify(medicionesDiarias, null, 2)}</pre>
            </div>
          </Row>*/}
        </Container>
    </>
  );
};

export default Index;

