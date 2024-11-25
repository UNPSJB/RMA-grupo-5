import React, { useState, useEffect } from "react";
import {default as axios} from "./axiosConfig"; 
import Header from "components/Headers/Header.js";
import {
  Card,
  CardHeader,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Container,
} from "reactstrap";
import { message, Modal as AntdModal } from "antd";
import { setTokenToCookie } from './utils';

const ConfiguracionSistema = () => {
  const [tiposDatos, setTiposDatos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [tipoDato, setTipoDato] = useState('');
  const [nombre, setNombre] = useState('');
  const [unidad, setUnidad] = useState('');
  const [rango_minimo, setRango_minimo] = useState('');
  const [rango_maximo, setRango_maximo] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const fetchTiposDatos = async () => {
    try {
      setTokenToCookie()
          
      // Configurar los headers, agregando el token si está presente
        const config = {
        withCredentials: true, // Si necesitas enviar cookies de sesión
        }

      const response = await axios.get(`http://localhost:8000/leer_tipos_datos`, config);
      setTiposDatos(response.data);
    } catch (error) {
      console.error("Error al obtener los tipos de datos:", error);
    }
  };

  useEffect(() => {
    fetchTiposDatos();
  }, []);

  const handleEdit = (tipoDatoId) => {
    const tipoDatoToEdit = tiposDatos.find(tipo => tipo.id === tipoDatoId);
    if (tipoDatoToEdit) {
      setTipoDato(tipoDatoToEdit.id);
      setNombre(tipoDatoToEdit.nombre);
      setUnidad(tipoDatoToEdit.unidad);
      setRango_minimo(tipoDatoToEdit.rango_minimo);
      setRango_maximo(tipoDatoToEdit.rango_maximo);
      setIsEditing(true);
      toggleModal();
    }
  };

  const handleCreate = () => {
    setTipoDato('');
    setNombre('');
    setUnidad('');
    setRango_minimo('');
    setRango_maximo('');
    setIsEditing(false);
    toggleModal();
  };

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleSave = async () => {
    const tipo = {
      nombre: String(nombre),
      unidad: String(unidad),
      rango_minimo: parseFloat(rango_minimo),
      rango_maximo: parseFloat(rango_maximo),
    };

    if (isEditing) {
      // Modificar tipo de dato
      axios
        .put(`http://localhost:8000/modificar_tipo_dato/${tipoDato}`, tipo)
        .then(response => {
          message.success("Tipo de dato modificado exitosamente");
          setIsEditing(false);
          clearForm();
          fetchTiposDatos();
        })
        .catch(error => {
          message.error("Error al modificar el tipo de dato, intente nuevamente");
        });
    } else {
      // Crear tipo de dato
      axios
        .post("http://localhost:8000/crear_tipo_dato", tipo)
        .then(response => {
          message.success("Tipo de dato registrado exitosamente");
          clearForm();
          fetchTiposDatos();
        })
        .catch(error => {
          message.error("Error al registrar el tipo de dato, intente nuevamente");
        });
    }

    toggleModal();
  };

  const clearForm = () => {
    setNombre('');
    setUnidad('');
    setRango_minimo('');
    setRango_maximo('');
  };

  const handleDelete = (tipoDatoId) => {
    AntdModal.confirm({
      title: "¿Esta seguro de que desea eliminar este tipo de dato?",
      content: "Esta acción no se puede deshacer.",
      okText: "Si, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:8000/eliminar_tipo_dato/${tipoDatoId}`);
          message.success("Tipo de dato eliminado exitosamente");
          fetchTiposDatos(); // Refrescar la lista de tipos de datos
        } catch (error) {
          message.error("Error al eliminar el tipo de dato, intente nuevamente");
        }
      },
    });
  };

  // Traducir los nombres de los tipos para mostrarlos
  const tipoDatoMap = {
    "TEMP_T": "Temperatura",
    "TEMP2_T": "Temperatura #2",
    "HUMIDITY_T": "Humedad Relativa",
    "PRESSURE_T": "Presión Atmosférica",
    "LIGHT_T": "Luz (lux)",
    "SOIL_T": "Humedad del Suelo",
    "SOIL2_T": "Humedad del Suelo #2",
    "SOILR_T": "Resistencia del Suelo",
    "SOILR2_T": "Resistencia del Suelo #2",
    "OXYGEN_T": "Oxígeno",
    "CO2_T": "Dióxido de Carbono",
    "WINDSPD_T": "Velocidad del Viento",
    "WINDHDG_T": "Dirección del Viento",
    "RAINFALL_T": "Precipitación",
    "MOTION_T": "Movimiento",
    "VOLTAGE_T": "Voltaje",
    "VOLTAGE2_T": "Voltaje #2",
    "CURRENT_T": "Corriente",
    "CURRENT2_T": "Corriente #2",
    "IT_T": "Iteraciones",
    "LATITUDE_T": "Latitud GPS",
    "LONGITUDE_T": "Longitud GPS",
    "ALTITUDE_T": "Altitud GPS",
    "HDOP_T": "HDOP GPS",
    "LEVEL_T": "Nivel de Fluido",
    "UV_T": "UV",
    "PM1_T": "Partículas PM1",
    "PM2_5_T": "Partículas PM2.5",
    "PM10_T": "Partículas PM10",
    "POWER_T": "Potencia",
    "POWER2_T": "Potencia #2",
    "ENERGY_T": "Energía",
    "ENERGY2_T": "Energía #2",
    "WEIGHT_T": "Peso",
    "WEIGHT2_T": "Peso #2",
    "DESCONOCIDO": "Desconocido",
  };

  // Filtrar los tipos de datos según el nombre
  const filteredTiposDatos = tiposDatos.filter((tipoDato) => {
    const nombreTraducido = tipoDatoMap[tipoDato.nombre] || tipoDato.nombre;
    return (
      nombreTraducido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tipoDato.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <Header  />
      <Container className="mt-5" fluid> {/* Ajuste del margen superior */}
        <Card className="shadow mb-4">
          <CardHeader className="border-0">
            <h3 className="mb-0">Tipos de datos registrados</h3>
            <p className="text-muted mt-2">Configuración de los tipos de datos (unidad de medida, rangos mínimos y máximos.).</p>


      {/*  <div className="table-container"> /*}
          {/*}
          <Button variant="primary" className="add-button mb-2" onClick={handleCreate}>
            Registrar nuevo tipo de dato
          </Button>*/}

          <Row className="align-items-center mt-4">
            <Col xs="12" className="d-flex justify-content-start">
              <FormGroup>
                <Input
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Filtrar por nombre"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          <Card className="shadow mt-3">
            <table className="table align-items-center table-flush">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nombre</th>
                  <th>Unidad de medida</th>
                  <th>Rango mínimo</th>
                  <th>Rango máximo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTiposDatos.map((tipoDato) => (
                  <tr key={tipoDato.id}>
                    <td>{tipoDato.id}</td>
                    <td>{tipoDatoMap[tipoDato.nombre] || tipoDato.nombre}</td>
                    <td>{tipoDato.unidad}</td>
                    <td>{tipoDato.rango_minimo}</td>
                    <td>{tipoDato.rango_maximo}</td>
                    <td>
                      <Button className="edit-button" onClick={() => handleEdit(tipoDato.id)}>
                        Modificar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>


        <Modal isOpen={modalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>
            {isEditing ? "Editar Tipo de Dato" : "Registrar Tipo de Dato"}
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="nombre">Nombre</Label>
                <Input
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={tipoDatoMap[nombre] || nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingrese el nombre del tipo de dato"
                  disabled={isEditing} // Desactiva el campo si está en modo de edición
                />
              </FormGroup>
              <FormGroup>
                <Label for="unidad">Unidad de Medida</Label>
                <Input
                  type="text"
                  name="unidad"
                  id="unidad"
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                  placeholder="Ingrese la unidad de medida"
                />
              </FormGroup>
              <FormGroup>
                <Label for="rangoMinimo">Rango Mínimo</Label>
                <Input
                  type="number"
                  name="rangoMinimo"
                  id="rangoMinimo"
                  value={rango_minimo}
                  onChange={(e) => setRango_minimo(e.target.value)}
                  placeholder="Ingrese el rango mínimo"
                />
              </FormGroup>
              <FormGroup>
                <Label for="rangoMaximo">Rango Máximo</Label>
                <Input
                  type="number"
                  name="rangoMaximo"
                  id="rangoMaximo"
                  value={rango_maximo}
                  onChange={(e) => setRango_maximo(e.target.value)}
                  placeholder="Ingrese el rango máximo"
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>
              Cancelar
            </Button>
            <Button color="primary" onClick={handleSave}>
              {isEditing ? "Guardar cambios" : "Guardar"}
            </Button>
          </ModalFooter>
        </Modal>
        </CardHeader>
        </Card>
      </Container>
    </>
  );
};

export default ConfiguracionSistema;



