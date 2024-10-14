import Index from "views/Index.js";
import Maps from "views/examples/Maps.js";
import Tables from "views/examples/Tables.js";
import Registrar_nodo from "views/examples/Registrar_nodo.js";

var routes = [
  
  {
    path: "/index",
    name: "Graficos",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  
  {
    path: "/registrar_nodo",
    name: "Registrar nodo",
    icon: "ni ni-tv-2 text-primary",
    component: <Registrar_nodo />,
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
    path: "/maps",
    name: "Mapa",
    icon: "ni ni-pin-3 text-orange",
    component: <Maps />,
    layout: "/admin",
  }, 
];
export default routes;
