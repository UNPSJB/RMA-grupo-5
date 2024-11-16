import Index from "views/Index.js";
import Maps from "views/examples/Maps.js";
import Tables from "views/examples/Tables.js";
import TablesError from "views/examples/TablesError.js";
import GestionNodo from "views/examples/GestionNodo.js";
import Register from "views/examples/Register.js";
import ConfiguracionSistema from "views/examples/ConfiguracionSistema";
//import Icons from "views/examples/Icons.js";

var routes = [
  {
    path: "/maps",
    name: "Mapa",
    icon: "ni ni-pin-3 text-orange",
    component: <Maps />,
    layout: "/admin",
  }, 

  {
    path: "/tables",
    name: "Tablas",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Tables />,
    layout: "/admin",
  },

  {
    path: "/tables-error",
    name: "Tablas con errores",
    icon: "ni ni-settings-gear-65 text-blue",
    component: <TablesError />,
    layout: "/admin",
  },

  {
    path: "/index",
    name: "Graficos",
    icon: "ni ni-chart-bar-32 text-blue",
    component: <Index />,
    layout: "/admin",
  },

  {
    path: "/gestion-nodo",
    name: "Gestion nodo",
    icon: "ni ni-tv-2 text-primary",
    component: <GestionNodo />,
    layout: "/admin",
  },

  {
    path: "/register",
    component: <Register />,
    layout: "/auth",
    showInMenu: false, 
  },

  {
    path: "/configuracion-sistema",
    name: "Configuracion de Limites",
    icon: "ni ni-settings-gear-65 text-blue",
    component: <ConfiguracionSistema />,
    layout: "/admin",
    showInFooter: true,
  },

/*
  {
    path: "/Icons",
    name: "Icons",
    icon: "ni ni-tv-2 text-primary",
    component: <Icons />,
    layout: "/admin",
  },
  */



];
export default routes;
