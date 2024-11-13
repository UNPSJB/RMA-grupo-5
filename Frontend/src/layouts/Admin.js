import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import { Container } from "reactstrap";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import routes from "routes.js";
import RegistrarNodo from "views/examples/RegistrarNodo";
import ModificarNodo from "views/examples/ModificarNodo";
import GestionNodo from "views/examples/GestionNodo";
// reactstrap components
// core components
//import AdminNavbar from "components/Navbars/AdminNavbar.js";

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  /*
  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
*/
  return (
    <>
      <Sidebar
        {...props}     
        routes={routes}

        logo={{
          innerLink: "/admin/maps",
          imgSrc: require("../assets/img/brand/rma-a.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        {/*
        <AdminNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />
        */}
        <Routes>
          {getRoutes(routes)}

          {/*<Route path="*" element={<Navigate to="/admin/index" replace />} /> */}
          <Route path="*" element={<Navigate to="/auth/register" replace />} />
          <Route path="/registrar_nodo" element={<RegistrarNodo />} />
          <Route path="/modificar_nodo/:id" element={<ModificarNodo />} />
          <Route path="/GestionNodo" element={<GestionNodo />} />
        </Routes>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
