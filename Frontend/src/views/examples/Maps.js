import React, { useEffect, useState } from "react";
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
  const [nodos, setNodos] = useState([]);

  const position = [-43.583333, -66.000000];
  const bounds = [
    [-45.0, -67.5], // Esquina suroeste de los límites
    [-42.0, -64.0], // Esquina noreste de los límites
  ];

  useEffect(() => {
    const fetchNodos = async () => {
      try {
        const response = await fetch("http://localhost:8000/obtener_nodos_activos");
        const data = await response.json();
        const nodosActivos = data;
        setNodos(nodosActivos);
      } catch (error) {
        console.error("Error al obtener los nodos:", error);
      }
    };

    fetchNodos();
  }, []);

  return (
    <MapContainer
      center={position}
      zoom={8}
      minZoom={8}
      maxZoom={14}
      maxBounds={bounds}
      maxBoundsViscosity={1.0}
      style={{ height: "600px", width: "100%", borderRadius: "10px", border: "2px solid #ccc" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {nodos.map((nodo) => (
        <Marker
          key={nodo.numero}
          position={[nodo.ubicacion_x, nodo.ubicacion_y]}
        >
          <Popup>
            Nodo {nodo.numero} - "{nodo.nombre}"<br />
            Latitud: {parseFloat(nodo.ubicacion_x).toFixed(6)} <br />
            Longitud: {parseFloat(nodo.ubicacion_y).toFixed(6)} <br />
            Chubut
          </Popup>
        </Marker>
      ))}
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
                <h3 className="row justify-content-md-center">Cuenca Sagmata - Nodos Activos</h3>
              </Container>
              <MapWrapper />
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Maps;