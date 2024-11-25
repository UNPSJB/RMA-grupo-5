import React, { useEffect, useState, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faTimes, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import './Header.css';

const Header = ({ title, subtitle }) => {
    const [alertas, setAlertas] = useState(() => {
        const savedAlertas = localStorage.getItem('alertas');
        return savedAlertas ? JSON.parse(savedAlertas) : [];
    });
    const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
    const notificacionesRef = useRef(null);

    const maxAlertas = 5;

    const agregarAlerta = useCallback((nuevaAlerta) => {
        setAlertas((prevAlertas) => {
            const hora = new Date().toLocaleTimeString();
            const nuevasAlertas = [
                ...prevAlertas,
                { ...nuevaAlerta, leida: false, hora: hora }
            ];
            localStorage.setItem('alertas', JSON.stringify(nuevasAlertas));
            return nuevasAlertas;
        });
    }, []);

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
                    if (
                        nuevaAlerta.tipo_alerta !== undefined &&
                        nuevaAlerta.valor_medicion !== undefined &&
                        nuevaAlerta.nodo_numero !== undefined
                    ) {
                        agregarAlerta(nuevaAlerta);
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
    }, [agregarAlerta]);

  
    useEffect(() => {
        if (notificacionesRef.current && alertas.length > maxAlertas) {
            notificacionesRef.current.scrollTop = notificacionesRef.current.scrollHeight;
        }
    }, [alertas]);

    const marcarComoLeida = (index) => {
        setAlertas((prevAlertas) => {
            const nuevasAlertas = prevAlertas.map((alerta, i) =>
                i === index ? { ...alerta, leida: !alerta.leida } : alerta
            );
            localStorage.setItem('alertas', JSON.stringify(nuevasAlertas));
            return nuevasAlertas;
        });
    };

    const borrarAlerta = (index) => {
        setAlertas((prevAlertas) => {
            const nuevasAlertas = prevAlertas.filter((_, i) => i !== index);
            localStorage.setItem('alertas', JSON.stringify(nuevasAlertas));
            return nuevasAlertas;
        });
    };

    return (
        <div className="header bg-gradient-info pb-50 pt-7">
            <div className="header-content">
                <div>
                    <h1 className="header-title" style={{ color: 'white' }}>{title}</h1>
                    <p className="header-subtitle" style={{ color: 'white' }}>{subtitle}</p>
                </div>

                <div className="notificaciones-icono">
                    <FontAwesomeIcon 
                        icon={faBell} 
                        size="2x" 
                        color="white" 
                        style={{ cursor: "pointer" }}
                        onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
                    />
                    {alertas.length > 0 && <span className="badge">{alertas.length}</span>}
                </div>
            </div>

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
                    <div 
                        className="notificaciones-body notificaciones-scrollable" 
                        ref={notificacionesRef}
                    >
                        {alertas.map((alerta, index) => (
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
                                <div className="hora-alerta">
                                    <small>{alerta.hora}</small>
                                </div>
                                <button 
                                    className="borrar-boton" 
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        borrarAlerta(index);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTimes} color="red" />
                                </button>
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
