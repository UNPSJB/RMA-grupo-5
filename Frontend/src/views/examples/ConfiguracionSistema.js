import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "components/Headers/Header.js";
import { useNavigate } from "react-router-dom";
import {
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
  const navigate = useNavigate();

  const fetchTiposDatos = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/leer_tipos_datos`);
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

  // Filtrar los tipos de datos según el nombre
  const filteredTiposDatos = tiposDatos.filter((tipoDato) =>
    tipoDato.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header title="Tipos de Datos Registrados" />
      <Container className="mt--8" fluid>
        <div className="table-container">
          <Button variant="primary" className="add-button mb-2" onClick={handleCreate}>
            Registrar nuevo tipo de dato
          </Button>

          <Row>
            <Col md="2">
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

          <table className="table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Unidad de medida</th>
                <th>Rango minimo</th>
                <th>Rango maximo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTiposDatos.map((tipoDato) => (
                <tr key={tipoDato.id}>
                  <td>{tipoDato.id}</td>
                  <td>{tipoDato.nombre}</td>
                  <td>{tipoDato.unidad}</td>
                  <td>{tipoDato.rango_minimo}</td>
                  <td>{tipoDato.rango_maximo}</td>
                  <td>
                    <Button className="edit-button" onClick={() => handleEdit(tipoDato.id)}>
                      Modificar
                    </Button>{" "}
                    <Button className="delete-button" onClick={() => handleDelete(tipoDato.id)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal isOpen={modalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>
            {isEditing ? "Editar Tipo de Dato" : "Registrar Tipo de Dato"}
          </ModalHeader>
          <ModalBody>
            <Form>
              {/* Campo para mostrar el id, solo lectura */}
              {isEditing && (
                <FormGroup>
                  <Label for="id">Id</Label>
                  <Input
                    type="text"
                    name="id"
                    id="id"
                    value={tipoDato} // id del tipo de dato
                    disabled //campo sea de solo lectura
                  />
                </FormGroup>
              )}

              <FormGroup>
                <Label for="nombre">Nombre</Label>
                <Input
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingrese el nombre del tipo de dato"
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
      </Container>
    </>
  );
};

export default ConfiguracionSistema;



