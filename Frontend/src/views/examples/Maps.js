/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import { Card, Container, Row } from "reactstrap";

// core components
import Header from "components/Headers/Header.js";

const MapWrapper = () => {
  const mapRef = React.useRef(null);

  React.useEffect(() => {
    const loadGoogleMapsScript = (callback) => {
      const existingScript = document.getElementById("googleMaps");
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=TU_API_KEY&libraries=places`;
        script.id = "googleMaps";
        document.body.appendChild(script);
        script.onload = () => {
          if (callback) callback();
        };
      } else {
        if (callback) callback();
      }
    };

    const initMap = () => {
      let google = window.google;
      let map = mapRef.current;
      let lat = "-43.801578"; // Coordenadas de la provincia del Chubut
      let lng = "-67.517919"; // Coordenadas de la provincia del Chubut
      const myLatlng = new google.maps.LatLng(lat, lng);
      const mapOptions = {
        zoom: 6, // Nivel de zoom
        center: myLatlng,
        scrollwheel: false,
        zoomControl: true,
        styles: [
          {
            featureType: "administrative",
            elementType: "labels.text.fill",
            stylers: [{ color: "#444444" }],
          },
          {
            featureType: "landscape",
            elementType: "all",
            stylers: [{ color: "#f2f2f2" }],
          },
          {
            featureType: "poi",
            elementType: "all",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "road",
            elementType: "all",
            stylers: [{ saturation: -100 }, { lightness: 45 }],
          },
          {
            featureType: "road.highway",
            elementType: "all",
            stylers: [{ visibility: "simplified" }],
          },
          {
            featureType: "road.arterial",
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit",
            elementType: "all",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "water",
            elementType: "all",
            stylers: [{ color: "#5e72e4" }, { visibility: "on" }],
          },
        ],
      };

      map = new google.maps.Map(map, mapOptions);

      const marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        animation: google.maps.Animation.DROP,
        title: "Provincia del Chubut",
      });

      const contentString =
        '<div class="info-window-content"><h2>Provincia del Chubut</h2>' +
        "<p>Ubicada en la Patagonia Argentina.</p></div>";

      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });

      google.maps.event.addListener(marker, "click", function () {
        infowindow.open(map, marker);
      });
    };

    loadGoogleMapsScript(() => {
      initMap();
    });
  }, []);

  return (
    <>
      <div
        style={{ height: `600px` }}
        className="map-canvas"
        id="map-canvas"
        ref={mapRef}
      ></div>
    </>
  );
};

const Maps = () => {
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow border-0">
              {/* Aquí se añade la imagen */}
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <img
                  src="https://cuadernosdelcuriham.unr.edu.ar/index.php/CURIHAM/article/download/230/version/197/252/1114/image004.gif"
                  alt="Curva Hidrograma"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
              <MapWrapper />
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Maps;

