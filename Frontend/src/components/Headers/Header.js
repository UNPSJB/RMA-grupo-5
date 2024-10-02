import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import './Header.css'; // Asegúrate de que este archivo exista

const Header = () => {
    const [temperature, setTemperature] = useState(null);  // Estado para almacenar la temperatura
    const [loading, setLoading] = useState(true);          // Estado para manejar la carga de los datos
    const [error, setError] = useState(null);              // Estado para manejar errores
    const lat = -43.5833;                                  // Latitud de la ubicación
    const lon = -66.0000;                                  // Longitud de la ubicación

    useEffect(() => {
        const fetchTemperature = async () => {
            try {
                const response = await axios.get(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`
                );
                console.log("Respuesta de Open-Meteo:", response.data);
                setTemperature(response.data.current_weather.temperature); 
                setError(null); // Resetear el error
            } catch (error) {
                console.error("Error al obtener la temperatura:", error);
                setError("No se pudo obtener la temperatura. Inténtalo de nuevo más tarde.");
            } finally {
                setLoading(false); 
            }
        };

        fetchTemperature(); // Llamar a la función al cargar el componente
        const interval = setInterval(fetchTemperature, 300000); // 300000 ms = 5 min

        return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    }, []); 

    return (
        <>
            <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
                <Container fluid>
                    <div className="header-body">
                        {/* Mensaje de error */}
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
                                                <span className="h2 font-weight-bold mb-0">1</span>
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

                            <Col xs="6" sm="4" md="3" lg="3" xl="2">
                                <Card className="card-stats mb-4 mb-xl-0 equal-card">
                                    <CardBody>
                                        <Row>
                                            <div className="col">
                                                <CardTitle
                                                    tag="h5"
                                                    className="text-uppercase text-muted mb-0"
                                                >
                                                    Temperatura actual del agua
                                                </CardTitle>
                                                <span className="h2 font-weight-bold mb-0">14°C</span>
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

                            <Col xs="6" sm="4" md="3" lg="3" xl="2">
                                <Card className="card-stats mb-4 mb-xl-0 equal-card">
                                    <CardBody>
                                        <Row>
                                            <div className="col">
                                                <CardTitle
                                                    tag="h5"
                                                    className="text-uppercase text-muted mb-0"
                                                >
                                                    Riesgo
                                                </CardTitle>
                                                <span className="h2 font-weight-bold mb-0">Bajo</span>
                                            </div>
                                            <Col className="col-auto">
                                                <div className="icon icon-shape bg-green text-white rounded-circle shadow">
                                                    <i className="ni ni-check-bold" />
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
                        </Row>
                    </div>
                </Container>
            </div>
        </>
    );
};

export default Header;
