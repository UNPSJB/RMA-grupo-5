import React from "react";
import { useState, useEffect } from "react";
import './Header.css';
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";


const Header = ({ title, subtitle }) => {
    const [medicion, setMedicion] = useState(null);
    const [tipoDato, setTipoDato] = useState(null);
  
    // Obtener la última medición
    const fetchUltimaMedicion = async () => {
      try {
        const response = await fetch(`http://localhost:8000/leer_ultima_medicion`);
        const data = await response.json();
        setMedicion(data); 
      } catch (error) {
        console.error("Error al obtener la última medición:", error);
      }
    };
  
    useEffect(() => {
      fetchUltimaMedicion();
      // Ejecutar la solicitud cada cierto tiempo
      const intervalId = setInterval(() => {
        fetchUltimaMedicion();
      }, 1000); // 1 seg
  
      // Limpiar el intervalo cuando el componente se desmonte
      return () => clearInterval(intervalId);
    }, []);
  
    // Solo llamar a fetchTipoDato cuando medicion esté disponible
    useEffect(() => {
      if (medicion && medicion.tipo_dato_id) {
        const fetchTipoDato = async () => {
          try {
            const response = await fetch(`http://localhost:8000/leer_tipo_dato/${medicion.tipo_dato_id}`);
            const data = await response.json();
            const tipoDatoTraducido = tipoDatoMap[data.nombre] || data.nombre;
            setTipoDato(tipoDatoTraducido); 
          } catch (error) {
            console.error("Error al obtener el tipo de dato:", error);
          }
        };
        fetchTipoDato();
      }
    }, [medicion]);
  
    // Traducir el nombre del tipo para mostrarlo
    const tipoDatoMap = {
      TEMP_T: "Temperatura",
      TEMP2_T: "Temperatura #2",
      HUMIDITY_T: "Humedad Relativa",
      PRESSURE_T: "Presión Atmosférica",
      LIGHT_T: "Luz (lux)",
      SOIL_T: "Humedad del Suelo",
      SOIL2_T: "Humedad del Suelo #2",
      SOILR_T: "Resistencia del Suelo",
      SOILR2_T: "Resistencia del Suelo #2",
      OXYGEN_T: "Oxígeno",
      CO2_T: "Dióxido de Carbono",
      WINDSPD_T: "Velocidad del Viento",
      WINDHDG_T: "Dirección del Viento",
      RAINFALL_T: "Precipitación",
      MOTION_T: "Movimiento",
      VOLTAGE_T: "Voltaje",
      VOLTAGE2_T: "Voltaje #2",
      CURRENT_T: "Corriente",
      CURRENT2_T: "Corriente #2",
      IT_T: "Iteraciones",
      LATITUDE_T: "Latitud GPS",
      LONGITUDE_T: "Longitud GPS",
      ALTITUDE_T: "Altitud GPS",
      HDOP_T: "HDOP GPS"
    };
  
    return (
        <>
            <div className="header bg-gradient-info pb-150 pt-7 d-flex flex-column align-items-center">
                <h1 className="header-title" style={{ color: 'white', textAlign: 'center' }}>
                    {title}
                </h1>
                <p className="header-subtitle" style={{ color: 'white', textAlign: 'center' }}>
                    {subtitle}
                </p> 
                <Container fluid className="d-flex justify-content-center">
                    <div className="header-body">
                        <Row className="justify-content-center">
                            <Col lg="6" xl="10" className="d-flex justify-content-center">
                                <Card className="card-stats mb-1" style={{ height: '85px', width: '950px' }}> 
                                    <CardBody className="d-flex align-items-center" style={{ padding: '4px' }}>
                                        <Row className="w-100">
                                            <Col xs="20" sm="">
                                                <CardTitle
                                                    tag="h5"
                                                    className="text-uppercase text-muted mb-0"
                                                    style={{ fontSize: '1rem', textAlign: 'center', padding: '9px' }}
                                                >
                                                    {medicion ? `Última Medición - Nodo: ${medicion.nodo_numero}` : "Última Medición"}
                                                </CardTitle>
                                                {medicion ? (
                                                    <Row className="justify-content-center" style={{ fontSize: '1rem', wordBreak: 'break-word', padding: '1px'}}>
                                                        <Col xs="4" className="text-center">
                                                            <span className="text-muted">Data:</span> {medicion.data ? parseFloat(medicion.data).toFixed(2) : "Cargando..."}
                                                        </Col>
                                                        <Col xs="4" className="text-center">
                                                            <span className="text-muted">Fecha:</span> {new Date(medicion.time).toLocaleString()}
                                                        </Col>
                                                        <Col xl="4" className="text-center">
                                                            <span className="text-muted">Tipo:</span> {tipoDato || "Cargando..."}
                                                        </Col>
                                                    </Row>
                                                ) : (
                                                    <span style={{ fontSize: '0.8rem', textAlign: 'center' }}>Cargando...</span>
                                                )}
                                            </Col>
                                        </Row>
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
