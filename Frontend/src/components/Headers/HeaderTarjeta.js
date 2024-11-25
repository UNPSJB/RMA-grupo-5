import React from "react";
import { useState, useEffect } from "react";
import './Header.css';
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";


const Header = ({ title, subtitle }) => {
  const [medicion, setMedicion] = useState(null);
  const [tipoDato, setTipoDato] = useState(null);
  let socket;
  
  // Establecer la conexión WebSocket solo una vez
  useEffect(() => {
    socket = new WebSocket('ws://localhost:8000/ws');

    socket.onopen = () => {
      console.log("Conexión WebSocket abierta");
      const tipoCliente = "ultima_medicion";
      socket.send(tipoCliente); 
    };

    socket.onmessage = (event) => {
      const alerta = JSON.parse(event.data);
      setMedicion(alerta);
      console.log("Medición recibida:", alerta);
    };

    socket.onclose = () => {
      console.log("Conexión WebSocket cerrada");
    };

    // Limpiar la conexión al desmontar el componente
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  // Obtener la última medición la primera vez que se carga el componente por si no llegan nuevas mediciones
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
    HDOP_T: "HDOP GPS",
    LEVEL_T: "Nivel de Fluido", 
    UV_T: "Rayos UV",
    PM1_T: "Particulas PM1",
    PM2_5_T: "Particulas PM2.5",
    PM10_T: "Particulas PM10",
    POWER_T: "Potencia",
    POWER2_T: "Potencia 2",
    ENERGY_T: "Energía",
    ENERGY2_T: "Energía 2",
    WEIGHT_T: "Peso",
    WEIGHT2_T: "Peso 2"
  };

  const unidadesMedida = {
    1: "°C",       // Grados Celsius para temperatura
    2: "°C",       // Grados Celsius para temperatura 2
    3: "%",        // Porcentaje para humedad
    4: "hPa",      // Hectopascales para presión
    5: "Luz",
    6: "%",       // Humedad del suelo
    7: "%",       // Humedad del suelo 2
    8: "Ω.m2/m",       //Ohmios Resistencia del suelo
    9:"Ω.m2/m",        //Ohmios Resistencia del suelo 2
    10: "%",        //Porcentaje para el oxígeno
    11: "ppm", //Partes por millón (ppm) (Dióxido de Carbono)
    12: "m/s",  // Metros por segundo (Velocidad del Viento)
    13: "°",    // Grados (Dirección del Viento)
    14: "mm",   // Milímetros (Precipitación)
    15: "",     // Sin unidad específica (Movimiento)
    16: "V",    // Voltios (Voltaje)
    17: "V",    // Voltios (Voltaje #2)
    18: "A",    // Amperios (Corriente)
    19: "A",    // Amperios (Corriente #2)
    20: "",     // Sin unidad específica (Iteraciones)
    21: "°",    // Grados (Latitud GPS)
    22: "°",    // Grados (Longitud GPS)
    23: "m",    // Metros (Altitud GPS)
    24: "",     // Sin unidad específica (HDOP GPS)
    25: "m",    // Metros (Nivel de Fluido)
    26: "Índice UV",  // Índice UV (Radiación UV)
    27: "µg/m³",      // Microgramos por metro cúbico (Partículas 1)
    28: "µg/m³",      // Microgramos por metro cúbico (Partículas 2.5)
    29: "µg/m³",      // Microgramos por metro cúbico (Partículas 10)
    30: "W",    // Vatios (Potencia)
    31: "W",    // Vatios (Potencia #2)
    32: "Wh",   // Vatios-hora (Energía)
    33: "Wh",   // Vatios-hora (Energía #2)
    34: "kg",   // Kilogramos (Peso)
    35: "kg"    // Kilogramos (Peso #2)
    
    
  };
  const obtenerUnidad = (tipo) => {
    // Si el tipo existe devuelve la unidad, sino, devuelve una cadena vacía.
    return unidadesMedida[tipo] || "";
  };
  
  return (
      <>
          <div className="header bg-gradient-info pb-2  pt-7 "> 
              <Container fluid className="d-flex justify-content-center">
                  <div className="header-body" >
                      <Row className="justify-content-center">
                          <Col lg="6" xl="10" className="d-flex justify-content-center "  >
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
                                                          <span className="text-muted">Data:</span> {medicion.data ? parseFloat(medicion.data).toFixed(2) + obtenerUnidad(medicion.tipo_dato_id) : "Cargando..."}
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
