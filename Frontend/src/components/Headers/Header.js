import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import './Header.css';

const Header = () => {
    const [temperature, setTemperature] = useState(null);  // Estado para la temperatura
    const [ultimoNodo, setUltimoNodo] = useState(null);    // Estado para el último nodo
    const [loading, setLoading] = useState(true);          // Estado de carga
    const [error, setError] = useState(null);              // Estado de error
    const lat = -43.5833;
    const lon = -66.0000;

    useEffect(() => {
        const fetchTemperature = async () => {
            try {
                const response = await axios.get(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`
                );
                setTemperature(response.data.current_weather.temperature);
                setError(null); // Resetear error
            } catch (error) {
                console.error("Error al obtener la temperatura:", error);
                setError("No se pudo obtener la temperatura. Inténtalo de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        // Petición para obtener el último nodo registrado
        const fetchUltimoNodo = async () => {
            try {
                const response = await axios.get("http://localhost:8000/leer_ultimo_nodo");
                setUltimoNodo(response.data); // Actualizar estado con el último nodo
            } catch (error) {
                console.error("Error al obtener el último nodo:", error);
                setError("No se pudo obtener el último nodo.");
            }
        };

        fetchTemperature(); // Llamar a la función al cargar el componente
        fetchUltimoNodo();  // Llamar a la función para obtener el nodo

        const interval = setInterval(fetchTemperature, 300000); // Actualizar temperatura cada 5 minutos
        return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
    }, []);

    return (
        <>
            <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
                <Container fluid>
                    <div className="header-body">
                        {/* Mostrar el error si lo hay */}
                        {error && <div className="error">{error}</div>}
                        
                        {/* Card stats */}
                        <Row>
                            <Col xs="6" sm="4" md="3" lg="3" xl="2">
                                <Card className="card-stats mb-4 mb-xl-0 equal-card">
                                    <CardBody>
                                        <Row>
                                            <div className="col">
                                                <CardTitle
                                                    tag="h5"
                                                    className="text-uppercase text-muted mb-0"
                                                >
                                                    Temperatura actual de la Cuenca Sagmata
                                                </CardTitle>
                                                <span className="h2 font-weight-bold mb-0">
                                                    {loading ? "Cargando..." : `${temperature}°C`}
                                                </span>
                                            </div>
                                            <Col className="col-auto">
                                                <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                                    <i className="ni ni-chart-bar-32" />
                                                </div>
                                            </Col>
                                        </Row>
                                        <p className="mt-3 mb-0 text-muted text-sm">
                                            <span className="text-success mr-2">
                                                <i className="ni ni-watch-time" /> 5
                                            </span>{" "}
                                            <span className="text-nowrap">Minutos</span>
                                        </p>
                                    </CardBody>
                                </Card>
                            </Col>

                            {/* Último nodo registrado */}
                            <Col xs="6" sm="4" md="3" lg="3" xl="2">
                                <Card className="card-stats mb-4 mb-xl-0 equal-card">
                                    <CardBody>
                                        <Row>
                                            <div className="col">
                                                <CardTitle
                                                    tag="h5"
                                                    className="text-uppercase text-muted mb-0"
                                                >
                                                    Último NODO registrado
                                                </CardTitle>
                                                {/* Mostrar ID o nombre del último nodo */}
                                                <span className="h2 font-weight-bold mb-0">
                                                    {ultimoNodo ? `ID: ${ultimoNodo.id}` : "Cargando..."}
                                                </span>
                                            </div>
                                            <Col className="col-auto">
                                                <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                                    <i className="ni ni-square-pin" />
                                                </div>
                                            </Col>
                                        </Row>
                                        <p className="mt-3 mb-0 text-muted text-sm">
                                            <span className="text-success mr-2">
                                                <i className="ni ni-watch-time" /> 5
                                            </span>{" "}
                                            <span className="text-nowrap">Minutos</span>
                                        </p>
                                    </CardBody>
                                </Card>
                            </Col>

                            {/* Otras tarjetas permanecen igual */}
                            <Col xs="6" sm="4" md="3" lg="3" xl="2">
                                <Card className="card-stats mb-4 mb-xl-0 equal-card">
                                    <CardBody>
                                        <Row>
                                            <div className="col">
                                                <CardTitle
                                                    tag="h5"
                                                    className="text-uppercase text-muted mb-0"
                                                >
                                                    Altura actual
                                                </CardTitle>
                                                <span className="h2 font-weight-bold mb-0">0,8</span>
                                            </div>
                                            <Col className="col-auto">
                                                <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                                                    <i className="ni ni-bold-up" />
                                                </div>
                                            </Col>
                                        </Row>
                                        <p className="mt-3 mb-0 text-muted text-sm">
                                            <span className="text-success mr-2">
                                                <i className="ni ni-watch-time" /> 5
                                            </span>{" "}
                                            <span className="text-nowrap">Minutos</span>
                                        </p>
                                    </CardBody>
                                </Card>
                            </Col>

                            {/* Resto de las tarjetas */}
                        </Row>
                    </div>
                </Container>
            </div>
        </>
    );
};

export default Header;
