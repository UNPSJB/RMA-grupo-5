// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";

const Login = () => {
  return (
    <>
      <footer className="py-5">
        <Container>
          <Row className="align-items-center justify-content-xl-between">
            <Col xl="6">
              <div className="copyright text-center text-xl-left text-muted">
                © {new Date().getFullYear()}{" "}
                <a
                  className="font-weight-bold ml-1"
                  href="https://github.com/UNPSJB/RMA-grupo-5/"
                  target="_blank"
                >
                  Grupo 5
                </a>
              </div>
            </Col>

        <Col xl="6" className="text-center text-xl-right">
          <img 
            src="https://raw.githubusercontent.com/UNPSJB/logos_tw/875c81601d5f2e9d6d9e6418db0a4e840c29c376/DIT/logo_mascara_ids_plano.svg" 
            alt="Logo DIT" 
            style={{ height: "50px", marginRight: "15px" }} // Ajustar tamaño y espacio entre imágenes
          />
          <img 
            src={require("../../assets/img/brand/escudo_tranparente_sinletras.png")}
            alt="Logo UNPSJB" 
            style={{ height: "65px" }} // Ajustar tamaño
          />
        </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Login;
