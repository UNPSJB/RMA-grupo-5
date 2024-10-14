/*eslint-disable*/
import { useState, useEffect } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
import axios from "axios";
import './Sidebar.css';
// nodejs library to set properties for components
import { PropTypes } from "prop-types";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

var ps;

const Sidebar = (props) => {
  const [temperature, setTemperature] = useState(null);  // Estado para la temperatura
  const [ultimaMedicion, setUltimaMedicion] = useState(null);    // Estado para la ultima medicion
  const [loading, setLoading] = useState(true);          // Estado de carga
  const [error, setError] = useState(null);              // Estado de error
  const lat = -43.5833;
  const lon = -66.0000;

  useEffect(() => {
    const fetchTemperature = async () => {
        try {
            const response = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`
            );
            setTemperature(response.data.current_weather.temperature);
            setError(null); // Resetear error
        } catch (error) {
            console.error("Error al obtener la temperatura:", error);
            setError("No se pudo obtener la temperatura. Inténtalo de nuevo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    // Función de polling para obtener la ultima medicion registrada
    const fetchUltimaMedicion = async () => {
        try {
            const response = await axios.get("http://localhost:8000/leer_ultima_medicion");
            setUltimaMedicion(response.data); // Actualizar estado con el último nodo
        } catch (error) {
            console.error("Error al obtener la ultima medicion:", error);
            alert("No se pudo obtener la ultima medicion.");
        }
    };

    fetchTemperature(); // Llamar a la función para obtener la temperatura al cargar el componente
    fetchUltimaMedicion();  // Llamar a la función para obtener la medicion al cargar el componente

    // Polling para obtener el último nodo cada 5 segundos
    const interval = setInterval(fetchUltimaMedicion, 5000);
    const tempInterval = setInterval(fetchTemperature, 300000); // Actualizar temperatura cada 5 minutos

    return () => {
        clearInterval(interval); // Limpiar el intervalo de polling al desmontar el componente
        clearInterval(tempInterval); // Limpiar el intervalo de temperatura al desmontar
    };
  }, []);

    // Segun el tipo de medicion, muestra un mensaje distinto en las tarjetas
    const getMedicionLabel = (type) => {
      switch(type) {
          case 0:
              return "Estado";
          case 1:
              return "Temperatura";
          case 2:
              return "Temperatura #2";
          case 3:
              return "Humedad Relativa";
          case 4:
              return "Presión Atmosférica";
          case 5:
              return "Luz (lux)";
          case 6:
              return "Humedad del Suelo";
          case 7:
              return "Humedad del Suelo #2";
          case 8:
              return "Resistencia del Suelo";
          case 9:
              return "Resistencia del Suelo #2";
          case 10:
              return "Oxígeno";
          case 11:
              return "Dióxido de Carbono";
          case 12:
              return "Velocidad del Viento";
          case 13:
              return "Dirección del Viento";
          case 14:
              return "Precipitación";
          case 15:
              return "Movimiento";
          case 16:
              return "Voltaje";
          case 17:
              return "Voltaje #2";
          case 18:
              return "Corriente";
          case 19:
              return "Corriente #2";
          case 20:
              return "Iteraciones";
          case 21:
              return "Latitud GPS";
          case 22:
              return "Longitud GPS";
          case 23:
              return "Altitud GPS";
          case 24:
              return "HDOP GPS (Horizontal Dilution of Precision)";
          case 25:
              return "Nivel de Fluido";
          case 26:
              return "Radiación UV";
          case 27:
              return "Partículas 1";
          case 28:
              return "Partículas 2.5";
          case 29:
              return "Partículas 10";
          case 30:
              return "Potencia";
          case 31:
              return "Potencia #2";
          case 32:
              return "Energía";
          case 33:
              return "Energía #2";
          case 34:
              return "Peso";
          case 35:
              return "Peso #2";
          default:
              return "Medición desconocida";
      }
  };
  

  const [collapseOpen, setCollapseOpen] = useState();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  // toggles collapse between opened and closed (true/false)
  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };
  // closes the collapse
  const closeCollapse = () => {
    setCollapseOpen(false);
  };
  // creates the links that appear in the left menu / Sidebar
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      return (
        <NavItem key={key}>
          <NavLink
            to={prop.layout + prop.path}
            tag={NavLinkRRD}
            onClick={closeCollapse}
          >
            <i className={prop.icon} />
            {prop.name}
          </NavLink>
        </NavItem>
      );
    });
  };

  const { bgColor, routes, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}
        {logo ? (
          <NavbarBrand className="pt-0" {...navbarBrandProps}>
            <img
              alt={logo.imgAlt}
              className="navbar-brand-img"
              src={logo.imgSrc}
            />
          </NavbarBrand>
        ) : null}
        {/* User */}
        <Nav className="align-items-center d-md-none">
          <UncontrolledDropdown nav>
            <DropdownToggle nav className="nav-link-icon">
              <i className="ni ni-bell-55" />
            </DropdownToggle>
            <DropdownMenu
              aria-labelledby="navbar-default_dropdown_1"
              className="dropdown-menu-arrow"
              right
            >
              <DropdownItem>Action</DropdownItem>
              <DropdownItem>Another action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Something else here</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown nav>
            <DropdownToggle nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                  <img
                    alt="..."
                    src={require("../../assets/img/theme/team-1-800x800.jpg")}
                  />
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Bienvenido!</h6>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-single-02" />
                <span>My profile</span>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-settings-gear-65" />
                <span>Settings</span>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-calendar-grid-58" />
                <span>Activity</span>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-support-16" />
                <span>Support</span>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                <i className="ni ni-user-run" />
                <span>Salir</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header */}
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          {/* Form */}
          <Form className="mt-4 mb-3 d-md-none">
            <InputGroup className="input-group-rounded input-group-merge">
              <Input
                aria-label="Search"
                className="form-control-rounded form-control-prepended"
                placeholder="Search"
                type="search"
              />
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <span className="fa fa-search" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Form>
          {/* Navigation */}
          <Nav navbar>{createLinks(routes)}
            <CardBody className="card-body-temp">
                <Row>
                    <div className="col">
                    <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Temp. Cuenca Sagmata
                    </CardTitle>
                    <span className="h2 font-weight-bold mb-0">
                        {loading ? "Cargando..." : `${temperature}°C`}
                    </span>
                    </div>
                  <Col className="col-auto">
                      <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="ni ni-chart-bar-32" />
                      </div>
                  </Col>
                </Row>
                <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-success mr-2">
                    <i className="ni ni-watch-time" /> 5
                    </span>{" "}
                    <span className="text-nowrap">Minutos</span>
                </p>
            </CardBody>
            <CardBody className="card-body-temp">
              <Row>
                  <div className="col">
                      <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                      >
                          Última Medicion registrada
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                          {ultimaMedicion ? `Nodo: ${ultimaMedicion.nodo_numero}` : "Cargando..."}
                      </span>
                  </div>
                  <Col className="col-auto">
                      <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="ni ni-square-pin" />
                      </div>
                  </Col>
              </Row>
              <br/>
              <Row>
                <div className="col">
                    <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        {ultimaMedicion ? getMedicionLabel(ultimaMedicion.type) : "Cargando..."}
                    </CardTitle>
                    <span className="h2 font-weight-bold mb-0">
                        {ultimaMedicion ? `${parseFloat(ultimaMedicion.data).toFixed(2)}` : "Cargando..."}
                    </span>
                </div>
                <Col className="col-auto">
                    <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                        <i className="ni ni-bold-up" />
                    </div>
                </Col>
            </Row>
            <p className="mt-3 mb-0 text-muted text-sm">
                <span className="text-success mr-2">
                    <i className="ni ni-watch-time" /> 5
                </span>{" "}
                <span className="text-nowrap">Segundos</span>
            </p>
          </CardBody>        
          </Nav>
          {/* Divider 
          <hr className="my-3" />
          */}

        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
