import Index from "views/Index.js";
import Maps from "views/examples/Maps.js";
import Tables from "views/examples/Tables.js";
import TablesError from "views/examples/TablesError.js";

import GestionNodo from "views/examples/Gestion_nodo.js";
//import ModificarNodo from "views/examples/ModificarNodo.js";

var routes = [
  
  {
    path: "/index",
    name: "Graficos",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },

  {
    path: "/GestionNodo",
    name: "Gestion nodo",
    icon: "ni ni-tv-2 text-primary",
    component: <GestionNodo />,
    layout: "/admin",
  },

  /*
  {
    path: "/ModificarNodo",
    name: "Modificar Nodo",
    icon: "ni ni-tv-2 text-primary",
    component: <ModificarNodo />,
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
