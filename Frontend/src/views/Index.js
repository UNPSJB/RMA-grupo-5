import { useState, useEffect } from "react";
import classnames from "classnames";
import Chart from "chart.js";
import { Line, Bar } from "react-chartjs-2";
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

  // Según el nodo seleccionado, obtener sus mediciones del dia
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

          // Obtener la fecha actual
          const today = new Date().toISOString().split('T')[0];

          // Filtrar las mediciones del día actual
          const medicionesFiltradas = data.filter(medicion => medicion.time.startsWith(today));

          // Dividir el día en intervalos de 2 horas
          const medicionesPorIntervalo = [];
          for (let hour = 0; hour < 24; hour += 2) {
            const startTime = new Date(`${today}T${String(hour).padStart(2, '0')}:00:00`);
            const endTime = new Date(`${today}T${String(hour + 2).padStart(2, '0')}:00:00`);

            // Buscar la medición más cercana al final del intervalo
            const medicionEnIntervalo = medicionesFiltradas
              .filter(medicion => {
                const time = new Date(medicion.time);
                return time >= startTime && time < endTime;
              })
              .sort((a, b) => new Date(b.time) - new Date(a.time)); // Ordena por la más cercana al final del intervalo

            // Si hay al menos una medición en este intervalo, tomar la más reciente
            if (medicionEnIntervalo.length > 0) {
              medicionesPorIntervalo.push(medicionEnIntervalo[0]);
            }
          }
          // Guardar solo las mediciones filtradas por el día actual
          setMedicionesDiarias(medicionesPorIntervalo); // Guardar las mediciones por intervalo en vez de todas las mediciones
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

  // Según el nodo seleccionado, obtener sus mediciones de la semana
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

          // Obtener la fecha actual y calcular el inicio de la semana (lunes)
          const today = new Date();
          const firstDayOfWeek = new Date(today);
          firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1); // Ajuste para lunes

          // Filtrar las mediciones de la semana actual
          const medicionesFiltradas = data.filter(medicion => {
            const fechaMedicion = new Date(medicion.time);
            return fechaMedicion >= firstDayOfWeek && fechaMedicion <= today;
          });

          // Agrupar las mediciones por día de la semana
          const medicionesPorDia = Array(7).fill(null).map(() => []);
          medicionesFiltradas.forEach(medicion => {
            const fechaMedicion = new Date(medicion.time);
            const diaDeLaSemana = fechaMedicion.getDay(); // 0 para domingo, 1 para lunes, etc.
            medicionesPorDia[diaDeLaSemana].push(medicion);
          });

          // Guardar las mediciones filtradas y agrupadas en el estado
          setMedicionesSemanales(medicionesFiltradas);
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

  // Función para filtrar los datos cuyo type es 1-Temperatura
  const filtrarDatosTipo = (data, tipo) => {
    return data
      ? data
          .filter((item) => item.type === tipo) // Filtra los datos con el tipo proporcionado
          .map((item) => parseFloat(parseFloat(item.data).toFixed(1))) // Convierte los valores a float y redondea
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
        <Row className="mt-5 mb-2">
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
        </Container>
    </>
  );
};

export default Index;

