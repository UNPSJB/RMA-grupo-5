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
  const [nodoData, setMedicionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nodos, setNodos] = useState([]);
  const [nodoSeleccionado, setNodoSeleccionado] = useState(null);

  useEffect(() => {
    const getNodos = async () => {
      setLoading(true); // Asegúrate de iniciar la carga
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
        setLoading(false); // Finaliza la carga
      }
    };
    getNodos();
  }, []);

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
  
          setMedicionData(medicionesPorIntervalo);
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

  const valoresNodos = nodoData ? nodoData.map(item => parseFloat(parseFloat(item.data).toFixed(1))) : [];
  
  // Función para filtrar los datos cuyo type es 1
  const filtrarDatosType1 = (data) => {
    return data
      ? data
          .filter((item) => item.type === 1) // Filtra los datos con type 1
          .map((item) => parseFloat(parseFloat(item.data).toFixed(1))) // Convierte los valores a float y redondea
      : [];
  };

  const valoresNodosTemp = filtrarDatosType1(nodoData);

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
   // setMedicionData("data" + index);
  };

  return (
    <>
      <Header />
        <Container className="mt--9" fluid>
          <Row className="mt-5 mb-2">
            <Col xl="2">     
            <select
              value={nodoSeleccionado || ""}
              onChange={(e) => setNodoSeleccionado(e.target.value)}
              className="form-control"
            >
              <option value="" disabled>
                Seleccionar nodo
              </option>
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
                      data={activeNav === 1 ? chartExample1.data1(valoresNodos) : chartExample1.data2(valoresNodos)}
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

          <Row className="mt-5">
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
            <div>
              <h2>Datos JSON:</h2>
              <pre>{JSON.stringify(nodoData, null, 2)}</pre>
            </div>
          </Row>
        </Container>
    </>
  );
};

export default Index;

