import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faTimes, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import './Header.css';

const Header = ({ title, subtitle }) => {
    const [alertas, setAlertas] = useState([]);
    const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

    useEffect(() => {
        let ws;

        const conectarWebSocket = () => {
            ws = new WebSocket("ws://localhost:8000/ws");

            ws.onopen = () => {
                console.log("Conectado al WebSocket");
                ws.send(JSON.stringify({ tipo_cliente: "alertas" }));
            };

            ws.onmessage = (event) => {
                try {
                    const nuevaAlerta = JSON.parse(event.data);
                    console.log("Mensaje recibido del WebSocket:", nuevaAlerta);

                    if (
                        nuevaAlerta.tipo_alerta !== undefined &&
                        nuevaAlerta.valor_medicion !== undefined &&
                        nuevaAlerta.nodo_numero !== undefined
                    ) {
                        setAlertas((prevAlertas) => [
                            ...prevAlertas,
                            { ...nuevaAlerta, leida: false }
                        ]);
                    } else {
                        console.error("Mensaje con formato inválido:", nuevaAlerta);
                    }
                } catch (error) {
                    console.error("Error procesando mensaje del WebSocket:", error);
                }
            };

            ws.onclose = () => {
                console.log("WebSocket cerrado, reconectando...");
                setTimeout(conectarWebSocket, 3000);
            };
        };

        conectarWebSocket();

        return () => {
            if (ws) ws.close();
        };
    }, []);

    const marcarComoLeida = (index) => {
        setAlertas((prevAlertas) =>
            prevAlertas.map((alerta, i) =>
                i === index ? { ...alerta, leida: true } : alerta
            )
        );
    };

    return (
        <div className="header bg-gradient-info pb-50 pt-7">
            <div className="header-content">
                <div>
                    <h1 className="header-title" style={{ color: 'white' }}>
                        {title}
                    </h1>
                    <p className="header-subtitle" style={{ color: 'white' }}>
                        {subtitle}
                    </p>
                </div>

                {/* Ícono de campana */}
                <div className="notificaciones-icono">
                    <FontAwesomeIcon 
                        icon={faBell} 
                        size="2x" 
                        color="white" 
                        style={{ cursor: "pointer" }}
                        onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
                    />
                    {alertas.length > 0 && (
                        <span className="badge">{alertas.length}</span>
                    )}
                </div>
            </div>

            {/* Dropdown de notificaciones */}
            {mostrarNotificaciones && (
                <div className="notificaciones-dropdown">
                    <div className="notificaciones-header">
                        <h4>Notificaciones</h4>
                        <button
                            className="cerrar-boton"
                            onClick={() => setMostrarNotificaciones(false)}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    <div className="notificaciones-body">
                        {alertas.slice(-5).map((alerta, index) => (
                            <div
                                key={index}
                                className={`alerta ${alerta.leida ? "leida" : ""}`}
                                onClick={() => marcarComoLeida(index)}
                            >
                                {alerta.leida && (
                                    <FontAwesomeIcon 
                                        icon={faCheckCircle} 
                                        color="green" 
                                        className="checkmark-icon" 
                                    />
                                )}
                                {`Alerta ${alerta.tipo_alerta}: Valor ${alerta.valor_medicion} en nodo ${alerta.nodo_numero}`}
                            </div>
                        ))}
                        {alertas.length === 0 && <p>No hay notificaciones</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
