import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card, Container, Row, Col } from "reactstrap";

import Header from "components/Headers/Header.js";

// Configurar el icono del marcador de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapWrapper = () => {
  const position = [-43.583333, -66.000000]; 
  const position2 = [-43.683333, -66.10000]; 

  const bounds = [
    [-45.0, -67.5], // Esquina suroeste de los límites
    [-42.0, -64.0]  // Esquina noreste de los límites
  ];

  return (
    <MapContainer
      center={position}
      zoom={8}
      minZoom={8}  // Zoom mínimo permitido
      maxZoom={14} // Zoom máximo permitido
      maxBounds={bounds} // Establecer los límites de desplazamiento
      maxBoundsViscosity={1.0} // Mantiene al usuario dentro de los límites
      style={{ height: "600px", width: "100%", borderRadius: "10px", border: "2px solid #ccc" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          Nodo 1 - "Canal norte"<br />
          Latitud: {parseFloat(position[0]).toFixed(6)} <br/>
          Longitud: {parseFloat(position[1]).toFixed(6)} <br />
          Patagonia Argentina.
        </Popup>
      </Marker>
      <Marker position={position2}>
        <Popup>
          Nodo 2 - "Desemboque oeste"<br />
          Latitud: {parseFloat(position2[0]).toFixed(6)} <br/>
          Longitud: {parseFloat(position2[1]).toFixed(6)} <br />
          Patagonia Argentina.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

const Maps = () => {
  return (
    <>
      
      <Header />

      <Container className="mt--9" fluid>
        
        <Row>
          <Col lg="12">
            
            <Card className="shadow border-0" style={{ padding: "20px", borderRadius: "10px", border: "2px solid #ccc" }}>
              <Container>
                <h3 lg="12" class="row justify-content-md-center">Cuenca Sagmata - Nodos Activos</h3>
              </Container>
              
              {/*
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <img
                  src={require("../../assets/img/maps/Cuenca-Sagmata-zona-de-estudio.jpg")}
                  alt="Curva Hidrograma"
                  style={{ maxWidth: "80%", height: "auto", borderRadius: "10px", border: "2px solid #ccc" }} // Imagen más grande y con borde
                />
              </div>
              */}
              <MapWrapper />
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Maps;