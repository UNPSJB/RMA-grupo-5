import Index from "views/Index.js";
import Maps from "views/examples/Maps.js";
import Tables from "views/examples/Tables.js";
import TablesError from "views/examples/TablesError.js";
import GestionNodo from "views/examples/GestionNodo.js";
import Login from "views/examples/Login.js";
//import Icons from "views/examples/Icons.js";

var routes = [
  
  {
    path: "/index",
    name: "Graficos",
    icon: "ni ni-chart-bar-32",
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
    path: "/Login",
    name: "Login",
    icon: "ni ni-tv-2 text-primary",
    component: <Login />,
    layout: "/admin",
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
    icon: "ni ni-bullet-list-67 text-red",
    component: <TablesError />,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Mapa",
    icon: "ni ni-pin-3 text-orange",
    component: <Maps />,
    layout: "/admin",
  }, 
];
export default routes;
