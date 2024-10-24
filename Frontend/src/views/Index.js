import { useState, useEffect } from "react";
import classnames from "classnames";
import Chart from "chart.js";
import { Line, Bar, Pie, Radar, Polar, Doughnut} from "react-chartjs-2";
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
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
  compuesto,
} from "variables/charts.js";
import Header from "components/Headers/Header.js";

  
const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [nodos, setNodos] = useState([]);
  const [medicionesDiarias, setMedicionesDiarias] = useState(null);
  const [medicionesSemanales, setMedicionesSemanales] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nodoSeleccionado, setNodoSeleccionado] = useState(0); // Nodo seleccionado por defecto en 0

  // Obtener todos los nodos para el desplegable
  useEffect(() => {
    const getNodos = async () => {
      setLoading(true); // Iniciar la carga
      try {
        const response = await fetch("http://localhost:8000/obtener_nodos");
        if (!response.ok) {
          throw new Error("Error al hacer el fetch de nodos");
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

  // Función para obtener el valor más cercano a una hora específica
  const obtenerValorMasCercano = (mediciones, horaObjetivo) => {
    let valorMasCercano = null;
    let diferenciaMinima = Infinity;

    mediciones.forEach((medicion) => {
      const diferencia = diferenciaEnMinutos(medicion.time, horaObjetivo);
      if (diferencia < diferenciaMinima) {
        diferenciaMinima = diferencia;
        valorMasCercano = medicion;
      }
    });

    return valorMasCercano;
  };

  
  // Función para obtener la fecha actual (año, mes, día)
  const esMismaFecha = (fechaMedicion) => {
    const hoy = new Date();
    const fecha = new Date(fechaMedicion);
    return (
      hoy.getFullYear() === fecha.getFullYear() &&
      hoy.getMonth() === fecha.getMonth() &&
      hoy.getDate() === fecha.getDate()
    );
  };

  useEffect(() => {
    const getMedicionesDiarias = async () => {
      if (nodoSeleccionado !== null) {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:8000/leer_mediciones_nodo/${nodoSeleccionado}`);
          if (!response.ok) {
            throw new Error("Error al hacer el fetch de mediciones");
          }
  
          const data = await response.json();
  
          // Filtrar mediciones del día actual
          const medicionesHoy = data.filter((medicion) => esMismaFecha(medicion.time));
  
          // Obtener la hora actual y establecer la hora objetivo a la hora anterior
          const fechaHoy = new Date();
          const horaObjetivo = new Date(fechaHoy.setHours(fechaHoy.getHours() - 1, 0, 0, 0));
  
          // Filtrar mediciones hasta la hora objetivo
          const medicionesFiltradas = medicionesHoy.filter((medicion) => {
            const fechaMedicion = new Date(medicion.time);
            return fechaMedicion <= horaObjetivo;
          });
  
          // Verificar si hay mediciones filtradas
          if (medicionesFiltradas.length === 0) {
            // Si no hay mediciones, obtener el valor más cercano
            const valorMasCercano = obtenerValorMasCercano(medicionesHoy, horaObjetivo);
            if (valorMasCercano) {
              setMedicionesDiarias([valorMasCercano]); // Puedes establecerlo como un array si es necesario
            }
          } else {
            setMedicionesDiarias(medicionesFiltradas);
          }
        } catch (error) {
          console.error("Error cargando los datos", error);
          setError(error);
        } finally {
          setLoading(false);
        }
      }
    };
  
    getMedicionesDiarias();
  }, [nodoSeleccionado]);
  

  useEffect(() => {
    const getMedicionesSemanales = async () => {
      if (nodoSeleccionado !== null) {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:8000/leer_mediciones_nodo/${nodoSeleccionado}`);
          if (!response.ok) {
            throw new Error("Error al hacer el fetch de mediciones");
          }
  
          const data = await response.json();
  
          // Obtener la fecha actual
          const hoy = new Date();
  
          // Calcular el último lunes
          const ultimoLunes = new Date(hoy);
          ultimoLunes.setDate(hoy.getDate() - (hoy.getDay() === 0 ? 6 : hoy.getDay() - 1));
  
          // Filtrar mediciones desde el último lunes hasta el día actual
          const medicionesFiltradas = data.filter((medicion) => {
            const fechaMedicion = new Date(medicion.time);
            return fechaMedicion >= ultimoLunes && fechaMedicion <= hoy;
          });
  
          // Agrupar mediciones por día de la semana
          const medicionesPorDia = {};
          medicionesFiltradas.forEach((medicion) => {
            const fecha = new Date(medicion.time);
            const dia = fecha.toISOString().split('T')[0]; // Usar solo la parte de la fecha (YYYY-MM-DD)
  
            // Asegúrate de que los datos estén dentro del rango esperado
            const valor = parseFloat(medicion.data);
            if (valor >= 0 && valor <= 1.8) {
              if (!medicionesPorDia[dia]) {
                medicionesPorDia[dia] = [];
              }
              medicionesPorDia[dia].push(valor); // Agregar solo valores válidos
            }
          });
  
          // Calcular el promedio de cada día y crear un nuevo arreglo de objetos
          const promedios = Object.keys(medicionesPorDia).map((dia) => {
            const mediciones = medicionesPorDia[dia];
            const suma = mediciones.reduce((acc, val) => acc + val, 0);
            const promedio = mediciones.length > 0 ? suma / mediciones.length : 0;
  
            // Usar el tipo de la primera medición para el nuevo objeto
            const tipo = medicionesFiltradas.find(m => new Date(m.time).toISOString().split('T')[0] === dia)?.type;
  
            return {
              type: tipo,
              data: promedio.toString(), // Convertir a string
              time: dia + "T00:00:00", // Mantener la fecha en el formato requerido
            };
          });
  
          // Guardar los promedios en el estado
          setMedicionesSemanales(promedios);
        } catch (error) {
          console.error("Error cargando los datos", error);
          setError(error);
        } finally {
          setLoading(false);
        }
      }
    };
    getMedicionesSemanales();
  }, [nodoSeleccionado]);
  

  // Manejo de carga y errores
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error cargando datos: {error.message}</p>;

  // Función para filtrar los datos segun tipo
  const filtrarDatosTipo = (data, tipo) => {
    return data
      ? data
          .filter((item) => item && (item.type) === tipo) // Verifica que item no sea null o undefined
          .map((item) => parseFloat(item.data)) // Convierte los valores a float
      : [];
  };

  // Filtrar los valores diarios y semanales
  const valoresNodosDiario = medicionesDiarias ? filtrarDatosTipo(medicionesDiarias, 23) : [];
  const valoresNodosSemanal = medicionesSemanales ? filtrarDatosTipo(medicionesSemanales, 23) : [];
  const valoresNodosTemp = filtrarDatosTipo(medicionesSemanales, 1);

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
      <Container className="mt--9" fluid>
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
        </Row>
          <Row>
            {/* GRAFICO LINEAL */}
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="bg-gradient-default shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-light ls-1 mb-1">
                        Red de Monitoreo - Cuenca Sagmata
                      </h6>
                      <h2 className="text-white mb-0">Altura del Río</h2>
                    </div>
                    <div className="col">
                      <Nav className="justify-content-end" pills>
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
                      </Nav>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart">
                    <Line
                      data={activeNav === 1 ? chartExample1.data1(valoresNodosDiario) : chartExample1.data2(valoresNodosSemanal)}
                      options={chartExample1.options}
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
                        Medición semanal
                      </h6>
                      <h2 className="mb-0">Temperatura del Agua</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart">
                    <Bar
                      data={chartExample2.data(valoresNodosTemp)}
                      options={chartExample2.options}
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
                      <h2 className="mb-0">Temperatura del Agua</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart">
                    <Radar
                      data={chartExample2.data(valoresNodosTemp)}
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
                      <h2 className="mb-0"> Ejemplo</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart">
                  <Bar data={compuesto.data} options={compuesto.options} />
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
                      <h2 className="mb-0">Temperatura del Agua</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart">
                    <Polar
                      data={chartExample2.data(valoresNodosTemp)}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            
          </Row>
          {/* MUESTRA DATOS PARA VERIFICAR Q LOS CONSIGUE*/}
          <Row className="mt-5">
            <Col>
              <h2>Valores de Nodos (Data)</h2>
              <ul>
                {valoresNodosSemanal.map((valor, index) => (
                  <li key={index}>Valor Nodo {index + 1}: {valor}</li>
                ))}
              </ul>
            </Col>
          </Row>

          <Row className="mt-5"> 
            <div>
              <h2>Datos JSON:</h2>
              <pre>{JSON.stringify(medicionesSemanales, null, 2)}</pre>
            </div>
          </Row>
        </Container>
    </>
  );
};

export default Index;

