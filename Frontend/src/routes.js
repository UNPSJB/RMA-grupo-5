import Index from "views/Index.js";
import Maps from "views/examples/Maps.js";
import Tables from "views/examples/Tables.js";

var routes = [
  
  {
    path: "/index",
    name: "Graficos",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
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
