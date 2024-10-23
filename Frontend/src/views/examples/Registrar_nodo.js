
  import React, { useState } from "react";
  import axios from "axios"; 
  import Header from "components/Headers/Header.js";
  
  const RegistrarNodo = () => {
    const [nodo, setNodo] = useState('');
    const [ubicacionX, setUbicacionX] = useState('');
    const [ubicacionY, setUbicacionY] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      // Validar que los valores sean correctos
      if (!nodo || isNaN(nodo) || !ubicacionX || isNaN(ubicacionX) || !ubicacionY || isNaN(ubicacionY)) {
        alert("Ingresa valores válidos para el nodo y la ubicacion");
        return;
      }
  
      const nuevoNodo = {
        numero: parseInt(nodo),  
        ubicacion_x: parseFloat(ubicacionX),  
        ubicacion_y: parseFloat(ubicacionY),  
      };
     
      axios.post('http://localhost:8000/crear_nodo', nuevoNodo)
        .then(response => {
          console.log("Nodo registrado:", response.data);
          alert("Nodo registrado exitosamente");
          // Reiniciar los campos después de un registro exitoso
          setNodo('');
          setUbicacionX('');
          setUbicacionY('');
        })
        .catch(error => {
          console.error("Hubo un error registrando el nodo:", error.response?.data || error);
          alert("Error al registrar el nodo: " + (error.response?.data?.detail || "error desconocido"));
        });
    }; 

  const formStyle = {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f1f1f9",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
  };

  const labelStyle = {
    marginBottom: "8px",
    display: "block",
    color: "#333",
  };

  const cardStyle = {
    padding: "20px",
    marginTop: "20px",
  };

  return (
    <>
    <Header />

    <div style={cardStyle}>
      <div style={formStyle}>
        <h2 style={{ textAlign: "center", color: "#333" }}>Registrar Nodo</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Número de Nodo:</label>
            <input
              type="text"
              style={inputStyle}
              value={nodo}
              onChange={(e) => setNodo(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Ubicación X:</label>
            <input
              type="text"
              style={inputStyle}
              value={ubicacionX}
              onChange={(e) => setUbicacionX(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Ubicación Y:</label>
            <input
              type="text"
              style={inputStyle}
              value={ubicacionY}
              onChange={(e) => setUbicacionY(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" style={buttonStyle}>
            Guardar
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default RegistrarNodo;
