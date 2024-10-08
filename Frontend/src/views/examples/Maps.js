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

  return (
    <MapContainer
      center={position}
      zoom={8}
      style={{ height: "600px", width: "100%", borderRadius: "10px", border: "2px solid #ccc" }} 
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          Ubicación: 43°35'00.0"S 66°00'00.0"W <br /> Patagonia Argentina.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

const Maps = () => {
  return (
    <>
      
      <Header />

      <Container className="mt--7" fluid>
        <Row>
          <Col lg="12">
            <Card className="shadow border-0" style={{ padding: "20px", borderRadius: "10px", border: "2px solid #ccc" }}>

              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <img
                  src={require("../../assets/img/maps/Cuenca-Sagmata-zona-de-estudio.jpg")}
                  alt="Curva Hidrograma"
                  style={{ maxWidth: "80%", height: "auto", borderRadius: "10px", border: "2px solid #ccc" }} // Imagen más grande y con borde
                />
              </div>

              <MapWrapper />
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Maps;