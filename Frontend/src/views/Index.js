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
import { chartOptions, parseOptions, chartExample1, chartExample2 } from "variables/charts.js";
import Header from "components/Headers/Header.js";

const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [nodoData, setNodoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averagesList, setAveragesList] = useState([]); // Lista de promedios

  // Función para obtener el día de la semana a partir de la fecha
  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return days[date.getDay()];
  };

  useEffect(() => {
    const getNodoData = async () => {
      try {
        const response = await fetch("http://localhost:8000/leer_nodos");
        if (!response.ok) {
          throw new Error("Error al hacer el fetch");
        }
        const data = await response.json(); 
        setNodoData(data); 

        // Agrupar valores por día
        const groupedByDay = data.reduce((acc, nodo) => {
          const dayOfWeek = getDayOfWeek(nodo.time);
          if (!acc[dayOfWeek]) {
            acc[dayOfWeek] = [];
          }
          acc[dayOfWeek].push(parseFloat(nodo.data));
          return acc;
        }, {});

        // Calcular promedios
        const averages = Object.keys(groupedByDay).map((day) => {
          const values = groupedByDay[day];
          const sum = values.reduce((a, b) => a + b, 0);
          const avg = (sum / values.length).toFixed(1);
          return parseFloat(avg); // Solo el promedio como número
        });

        setAveragesList(averages); // Actualizar el estado con la lista de promedios
        setLoading(false);
      } catch (error) {
        console.error("Error cargando los datos", error);
        setError(error);
        setLoading(false);
      }
    };
    getNodoData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

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
      {/* Page content */}
      <Container className="mt--7" fluid>
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
                          className={classnames("py-2 px-3", {
                            active: activeNav === 1,
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Diario</span>
                          <span className="d-md-none">D</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 2,
                          })}
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
                {/* Chart */}
                <div className="chart">
                  <Line
                    data={activeNav === 1 ? chartExample1.data1(averagesList) : chartExample1.data2(averagesList)}
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
                {/* Chart */}
                <div className="chart">
                  <Bar
                    data={chartExample2.data}
                    options={chartExample2.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Nueva sección para mostrar los promedios por día */}
        <Row className="mt-5">
          <Col>
            <h2>Promedios por Día</h2>
            <ul>
              {averagesList.map((avg, index) => (
                <li key={index}>Día {index + 1}: {avg}</li>
              ))}
            </ul>
          </Col>
        </Row>

        {/* Mostrar los datos JSON formateados */}
        <Row className="mt-5">
          <Col>
            <h2>Datos JSON:</h2>
            <pre>{JSON.stringify(nodoData, null, 2)}</pre>
          </Col>
        </Row>
      </Container>
    </>

