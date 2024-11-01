import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card, Container, Row, Col, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

import Header from "components/Headers/Header.js";

// Eliminar el icono por defecto
delete L.Icon.Default.prototype._getIconUrl;


const ImageExpandButton = ({ showImage }) => {
  return (
    <div>
      {showImage && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <img 
            src={require("../../assets/img/maps/Cuenca-Sagmata-zona-de-estudio.jpg")}
            alt="Imagen expandida" 
            style={{ width: '80%', borderRadius: '10px', border: '2px solid #ccc' }}
          />
        </div>
      )}
    </div>
  );
};

const MapWrapper = () => {
  const [nodos, setNodos] = useState([]);
  const navigate = useNavigate();

  const position = [-43.583333, -66.0];
  const bounds = [
    [-45.0, -67.5], // Esquina suroeste de los límites
    [-42.0, -64.0], // Esquina noreste de los límites
  ];

  useEffect(() => {
    const fetchNodos = async () => {
      try {
        const response = await fetch("http://localhost:8000/obtener_nodos_activos");
        const data = await response.json();
        setNodos(data);
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

      {/* Configuracion del icono para que muestre el nro de nodo*/}
      {nodos.map((nodo) => {
        const customIcon = L.divIcon({
          className: "custom-icon",
          html: `<div style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 25px;
                  height: 25px;
                  border-radius: 50%;
                  background-color: #2E86C1;
                  color: white;
                  font-size: 15px;
                  font-weight: bold;
                  border: 2px solid #ccc;
                ">${nodo.numero}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        return (
          <Marker
            key={nodo.numero}
            position={[nodo.ubicacion_x, nodo.ubicacion_y]}
            // Agregar el icono nuevo
            icon={customIcon}
          >
            <Popup>
                Nodo {nodo.numero} - "{nodo.nombre}"<br />
                Latitud: {parseFloat(nodo.ubicacion_x).toFixed(6)} <br />
                Longitud: {parseFloat(nodo.ubicacion_y).toFixed(6)} <br />
                <br />
                <button
                  type="submit" className="button-style"
                  onClick={() => navigate("/admin/tables")}
                >
                  Ver Detalle
                </button>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

const Maps = () => {
  const [showImage, setShowImage] = useState(false);
  const toggleImage = () => {
    setShowImage(!showImage);
  };
  return (
    <>
      <Header />
      <Container className="mt--9" fluid>
        <Row>
          <Col lg="12">
            <Card
              className="shadow border-0"
              style={{ padding: "20px", borderRadius: "10px", border: "2px solid #ccc" }}
            >
              <Container>
                <h3 className="row justify-content-md-center">
                  Cuenca Sagmata - Nodos Activos
                </h3>
              </Container>
              <MapWrapper />
              <h3>
                <br></br>
                <div className="d-flex justify-content-center">
                  <Button size="sm" color="secondary" onClick={toggleImage}>
                    Mostrar Mapa de la Cuenca
                  </Button>
                </div>
                <ImageExpandButton showImage={showImage} />
              </h3>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Maps;
