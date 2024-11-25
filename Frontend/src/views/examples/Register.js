/*
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  //Row,
  Col,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../../assets/css/login.css";
import { message } from "antd";
import axios from "axios"; 
import React, { useState } from "react";

const Register = () => {

    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) => {
      e.preventDefault();

      // Validación simple para los campos de username y contraseña
      if (!nombreUsuario || !contrasena) {
        message.error("Por favor, complete todos los campos.");
        return;
      }
      const datosUsuario = {
        username: nombreUsuario,
        password: contrasena,
      };
      axios.post('http://localhost:8000/iniciar_sesion', datosUsuario)
        .then(response => {
          //message.success("Inicio de sesión exitoso");
         
          setNombreUsuario('');
          setContrasena('');
          
          navigate("/admin/maps");
        })
        .catch(error => {
          if (error.response && error.response.data) {
            message.error(error.response.data.detail || "Error en el inicio de sesión");
          } else {
            message.error("Error en el inicio de sesión, verifique sus datos");
          }
        });
    };

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-4">
              <h3>Inicie sesión para ingresar</h3>
            </div>
            
          </CardHeader>

          <CardBody className="px-lg-5 py-lg-5">
           
            <Form role="form" onSubmit={handleSubmit}>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fa fa-user" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input 
                    placeholder="Usuario" 
                    type="text"
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)} 
                    style={{ color: "black" }}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input 
                    placeholder="Contraseña" 
                    type="password" 
                    autoComplete="new-password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    style={{ color: "black" }} 
                  />
                </InputGroup>
              </FormGroup>
              
              <div className="text-center">
                <Button className="mt-4" color="primary" type="submit">
                Iniciar sesión
                </Button>
                </div>
            </Form>

          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;
*/

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  //Row,
  Col,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../../assets/css/login.css";
import { message } from "antd";
import axios from "axios"; 
import React, { useState } from "react";

const Register = () => {

  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación simple para los campos de username y contraseña
    if (!nombreUsuario || !contrasena) {
      message.error("Por favor, complete todos los campos.");
      return;
    }

    const datosUsuario = {
      username: nombreUsuario,
      password: contrasena,
    };

    try {
      // Realiza la solicitud POST al servidor para iniciar sesión
      const response = await axios.post('http://localhost:8000/iniciar_sesion', datosUsuario);

      // Si la solicitud es exitosa, guarda el token en localStorage
      const token = response.data.access_token;
      localStorage.setItem("access_token", token); // O usa sessionStorage si prefieres que se borre al cerrar sesión
      console.log('ACA SE LOGUEA')
      // Limpiar los campos del formulario
      setNombreUsuario('');
      setContrasena('');
      
      // Mensaje de éxito
      message.success("Inicio de sesión exitoso");

      // Redirigir a la página de administración
      navigate("/admin/maps");

    } catch (error) {
      // Manejo de errores si la solicitud falla
      if (error.response && error.response.data) {
        message.error(error.response.data.detail || "Error en el inicio de sesión");
      } else {
        message.error("Error en el inicio de sesión, verifique sus datos");
      }
    }
  };

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-4">
              <h3>Inicie sesión para ingresar</h3>
            </div>
          </CardHeader>

          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form" onSubmit={handleSubmit}>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fa fa-user" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input 
                    placeholder="Usuario" 
                    type="text"
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)} 
                    style={{ color: "black" }}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input 
                    placeholder="Contraseña" 
                    type="password" 
                    autoComplete="new-password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    style={{ color: "black" }} 
                  />
                </InputGroup>
              </FormGroup>
              
              <div className="text-center">
                <Button className="mt-4" color="primary" type="submit">
                  Iniciar sesión
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;