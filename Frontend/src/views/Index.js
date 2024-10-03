import { useState, useEffect } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  //button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  //Progress,
  //Table,
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
  //const [chartExample1Data, setChartExample1Data] = useState("data1");
  
  const [nodoData, setNodoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getNodoData = async () => {
      try {
        const response = await fetch("http://localhost:8000/leer_nodos");
        if (!response.ok) {
          throw new Error("Error al hacer el fetch");
        }
        const data = await response.json(); // Asumiendo que la respuesta es JSON
        setNodoData(data);  // Almacena los datos en el estado
        setLoading(false);
      } catch (error) {
        console.error("Error cargando los datos", error);
        setError(error);
        setLoading(false);
      }
    };
    getNodoData();
  }, []);

  // Manejo de carga y errores
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;
  
  // Extraer los valores de "data" del nodoData y redondear a 1 decimal
  const valoresNodos = nodoData.map(item => parseFloat(parseFloat(item.data).toFixed(1)));

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setNodoData("data" + index);
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
                    data={chartExample1.data1(valoresNodos)}
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

        <Row className="mt-5">
        {/* Nueva sección para mostrar los valores de los nodos */}
        <Col>
          <h2>Valores de Nodos (Data)</h2>
          <ul>
            {valoresNodos.map((valor, index) => (
              <li key={index}>Valor Nodo {index + 1}: {valor}</li>
            ))}
          </ul>
        </Col>
      </Row>

      <Row className="mt-5">
        {/* Mostrar los datos JSON formateados */}
        <div>
          <h2>Datos JSON:</h2>
          <pre>{JSON.stringify(nodoData, null, 2)}</pre> {/* Mostrar el JSON formateado */}
        </div>
      </Row>
      
      </Container>
    </>
  );
};

export default Index;
