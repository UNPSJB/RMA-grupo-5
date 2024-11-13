import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card, Container, Row, Col, Button} from "reactstrap";
import { useNavigate } from "react-router-dom";

import Header from "components/Headers/HeaderTarjeta.js";

// Eliminar el icono por defecto
delete L.Icon.Default.prototype._getIconUrl;

const polygonPositions = [
  [-43.52988218344, -66.07521091461],
  [-43.53386467976, -66.08207736969],
  [-43.53635360641, -66.08860050201],
  [-43.54182888344, -66.09546695709],
  [-43.54581059081, -66.09546695709],
  [-43.55004086674, -66.09409366608],
  [-43.55501728184, -66.09855686188],
  [-43.56049086384, -66.09821353912],
  [-43.56372501949, -66.10370670319],
  [-43.56646147713, -66.10405002594],
  [-43.56919781046, -66.10096012115],
  [-43.57367517868, -66.09958683014],
  [-43.58014190069, -66.09684024811],
  [-43.58586188357, -66.09272037506],
  [-43.58984068155, -66.08448062897],
  [-43.59083533995, -66.08001743317],
  [-43.58909467696, -66.07727085114],
  [-43.59133266298, -66.07486759186],
  [-43.59406786623, -66.07349430084],
  [-43.59829475400, -66.06868778229],
  [-43.60202411428, -66.06628452301],
  [-43.60823920105, -66.06491123199],
  [-43.61445364570, -66.06044803619],
  [-43.61992182582, -66.05358158112],
  [-43.62414689714, -66.05220829010],
  [-43.62588654609, -66.04843173981],
  [-43.62514098842, -66.04328189850],
  [-43.62837167154, -66.04087863922],
  [-43.62986269749, -66.03607212067],
  [-43.63135368645, -66.02371250153],
  [-43.63383858587, -66.01375614166],
  [-43.63806267907, -66.00791965485],
  [-43.63806267907, -66.00311313629],
  [-43.63980192526, -65.99487339020],
  [-43.64253492469, -65.99006687164],
  [-43.64626154175, -65.98766361237],
  [-43.65048476161, -65.98560367584],
  [-43.65321727506, -65.97942386627],
  [-43.65619805702, -65.97702060699],
  [-43.66215917708, -65.97736392975],
  [-43.66265591037, -65.97324405670],
  [-43.66066895255, -65.96912418365],
  [-43.66265591037, -65.96569095612],
  [-43.66613292832, -65.96809421539],
  [-43.66787136177, -65.96500431061],
  [-43.66638127904, -65.96191440582],
  [-43.66166243968, -65.95951114655],
  [-43.65843354640, -65.95470462799],
  [-43.65445928552, -65.95092807770],
  [-43.64626154175, -65.94818149567],
  [-43.64154112110, -65.94921146393],
  [-43.63483251686, -65.94509159088],
  [-43.63085669424, -65.94680820465],
  [-43.62762614469, -65.94543491364],
  [-43.62514098842, -65.94543491364],
  [-43.62265572941, -65.93994174957],
  [-43.62240719785, -65.93582187653],
  [-43.61843055329, -65.93238864899],
  [-43.61644213237, -65.92758213043],
  [-43.61221651960, -65.93135868073],
  [-43.61196794490, -65.93513523102],
  [-43.61470221013, -65.93891178131],
  [-43.61296223755, -65.94440494537],
  [-43.61147079241, -65.94989810944],
  [-43.60749342454, -65.95298801422],
  [-43.60276995859, -65.95367465973],
  [-43.59630566733, -65.94886814117],
  [-43.59431651490, -65.95127140045],
  [-43.59182998191, -65.95436130524],
  [-43.58834866313, -65.95436130524],
  [-43.58337500127, -65.95367465973],
  [-43.57665990591, -65.95951114655],
  [-43.56870030455, -65.96054111481],
  [-43.55999328602, -65.96397434235],
  [-43.55402203169, -65.96225772858],
  [-43.54879669875, -65.96088443756],
  [-43.54531289177, -65.96328769684],
  [-43.54257547361, -65.96878086090],
  [-43.53909130708, -65.97324405670],
  [-43.53510915592, -65.97461734772],
  [-43.53262017791, -65.97736392975],
  [-43.52838867952, -65.97702060699],
  [-43.52191640188, -65.97736392975],
  [-43.51967583628, -65.98148380280],
  [-43.51793311663, -65.98697696686],
  [-43.51444752632, -65.98869358063],
  [-43.50971676029, -65.99144016266],
  [-43.50548365530, -65.99178348541],
  [-43.50224637471, -65.99075351715],
  [-43.50000507876, -65.99487339020],
  [-43.49676750439, -65.99659000397],
  [-43.48979367767, -65.99350009918],
  [-43.48555917569, -65.99693332672],
  [-43.48755191948, -66.00173984528],
  [-43.48630646231, -66.00517307281],
  [-43.48306815350, -66.00757633209],
  [-43.48182260389, -66.01203952789],
  [-43.48555917569, -66.01684604645],
  [-43.48954459753, -66.02405582428],
  [-43.49377882012, -66.02371250153],
  [-43.49826179105, -66.02371250153],
  [-43.50349150318, -66.03195224762],
  [-43.50872076230, -66.03572879791],
  [-43.51145971723, -66.04122196198],
  [-43.51503910000, -66.04685960000],
  [-43.52116955592, -66.04705844879],
  [-43.52515262750, -66.04396854401],
  [-43.53162455794, -66.04808841705],
  [-43.53585582930, -66.04499851227],
  [-43.53859355256, -66.04843173981],
  [-43.53461136854, -66.05392490387],
  [-43.53635360641, -66.05804477692],
  [-43.53934018279, -66.06147800446],
  [-43.53834467377, -66.06559787750],
  [-43.53311798173, -66.07109104156],
  [-43.52988218344, -66.07521091461]
];


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
        const response = await fetch("http://localhost:8000/leer_nodos");
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
      zoom={11}
      minZoom={8}
      maxZoom={14}
      maxBounds={bounds}
      maxBoundsViscosity={1.0}
      style={{ height: "600px", width: "100%", borderRadius: "10px", border: "2px solid #ccc", padding: '100px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Polygon
        positions={polygonPositions}
        color="slategray"
        weight={1} // Grosor del borde
        opacity={0.5} // Opacidad del borde
        fillColor="slategray" // Color de relleno
        fillOpacity={0.3} // Opacidad del relleno
        lineCap="round" // Forma de los extremos de la línea
        lineJoin="round" // Unión de las líneas
      
      >

      </Polygon>
      

      {/* Configuracion del icono para que muestre el nro de nodo*/}
      {nodos.map((nodo) => {
        const colorEstado = nodo.estado === 1 ? "green" // Verde para nodos activos
          : nodo.estado === 2 
          ? "red" // Rojo para nodos inactivos
          : "orange"; // Naranja para mantenimiento

        const customIcon = L.divIcon({
          className: "custom-icon",
          html: `<div style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 25px;
                  height: 25px;
                  border-radius: 50%;
                  background-color: ${colorEstado};
                  color: white;
                  font-size: 15px;
                  font-weight: bold;
                  border: 2px solid #ccc;
                ">${nodo.numero}</div>`,
        });

        return (
          <Marker
            key={nodo.numero}
            position={[nodo.longitud, nodo.latitud]}

            icon={customIcon}
          >
            <Popup>
              <div style={{ textAlign: "center" }}>
                <b>Nodo: {nodo.numero}</b> <br />
                "{nodo.nombre}" <br />
              </div>
              <b>Latitud:</b> {parseFloat(nodo.latitud).toFixed(4)} <br />
              <b>Longitud:</b> {parseFloat(nodo.longitud).toFixed(4)} <br />
              <br />
              <button
                type="submit"
                className="button-style"
                onClick={() => navigate("/admin/tables", { state: { selectedNode: nodo.numero } })}
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
      <Container className="mt--7" fluid style={{ padding: '130px' }}>
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