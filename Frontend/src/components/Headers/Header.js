import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import './Header.css';

const Header = () => {
    const [temperature, setTemperature] = useState(null);  // Estado para la temperatura
    const [ultimaMedicion, setUltimaMedicion] = useState(null);    // Estado para la ultima medicion
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

        // Función de polling para obtener la ultima medicion registrada
        const fetchUltimaMedicion = async () => {
            try {
                const response = await axios.get("http://localhost:8000/leer_ultima_medicion");
                setUltimaMedicion(response.data); // Actualizar estado con el último nodo
            } catch (error) {
                console.error("Error al obtener la ultima medicion:", error);
                alert("No se pudo obtener la ultima medicion.");
            }
        };

        fetchTemperature(); // Llamar a la función para obtener la temperatura al cargar el componente
        fetchUltimaMedicion();  // Llamar a la función para obtener la medicion al cargar el componente

        // Polling para obtener el último nodo cada 5 segundos
        const interval = setInterval(fetchUltimaMedicion, 5000);
        const tempInterval = setInterval(fetchTemperature, 300000); // Actualizar temperatura cada 5 minutos

        return () => {
            clearInterval(interval); // Limpiar el intervalo de polling al desmontar el componente
            clearInterval(tempInterval); // Limpiar el intervalo de temperatura al desmontar
        };
    }, []);

    // Segun el tipo de medicion, muestra un mensaje distinto en las tarjetas
    const getMedicionLabel = (type) => {
        switch(type) {
            case 0:
                return "Estado";
            case 1:
                return "Temperatura";
            case 2:
                return "Temperatura #2";
            case 3:
                return "Humedad Relativa";
            case 4:
                return "Presión Atmosférica";
            case 5:
                return "Luz (lux)";
            case 6:
                return "Humedad del Suelo";
            case 7:
                return "Humedad del Suelo #2";
            case 8:
                return "Resistencia del Suelo";
            case 9:
                return "Resistencia del Suelo #2";
            case 10:
                return "Oxígeno";
            case 11:
                return "Dióxido de Carbono";
            case 12:
                return "Velocidad del Viento";
            case 13:
                return "Dirección del Viento";
            case 14:
                return "Precipitación";
            case 15:
                return "Movimiento";
            case 16:
                return "Voltaje";
            case 17:
                return "Voltaje #2";
            case 18:
                return "Corriente";
            case 19:
                return "Corriente #2";
            case 20:
                return "Iteraciones";
            case 21:
                return "Latitud GPS";
            case 22:
                return "Longitud GPS";
            case 23:
                return "Altitud GPS";
            case 24:
                return "HDOP GPS (Horizontal Dilution of Precision)";
            case 25:
                return "Nivel de Fluido";
            case 26:
                return "Radiación UV";
            case 27:
                return "Partículas 1";
            case 28:
                return "Partículas 2.5";
            case 29:
                return "Partículas 10";
            case 30:
                return "Potencia";
            case 31:
                return "Potencia #2";
            case 32:
                return "Energía";
            case 33:
                return "Energía #2";
            case 34:
                return "Peso";
            case 35:
                return "Peso #2";
            default:
                return "Medición desconocida";
        }
    };
    

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

                            {/* Última medición registrada */}
                            <Col xs="6" sm="4" md="3" lg="3" xl="2">
                                <Card className="card-stats mb-4 mb-xl-0 equal-card">
                                    <CardBody>
                                        <Row>
                                            <div className="col">
                                                <CardTitle
                                                    tag="h5"
                                                    className="text-uppercase text-muted mb-0"
                                                >
                                                    Última Medicion registrada
                                                </CardTitle>
                                                {/* Mostrar ID o nombre del último nodo */}
                                                <span className="h2 font-weight-bold mb-0">
                                                    {ultimaMedicion ? `Nodo: ${ultimaMedicion.nodo_numero}` : "Cargando..."}
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
                                            <span className="text-nowrap">Segundos</span>
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
                                                <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                                                    {ultimaMedicion ? getMedicionLabel(ultimaMedicion.type) : "Cargando..."}
                                                </CardTitle>
                                                <span className="h2 font-weight-bold mb-0">
                                                    {ultimaMedicion ? `${parseFloat(ultimaMedicion.data).toFixed(2)}` : "Cargando..."}
                                                </span>
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
                                            <span className="text-nowrap">Segundos</span>
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
