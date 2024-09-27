import { Link } from 'react-router-dom';
import NodosList from './NodosList'; // Cambia el nombre del import si es necesario

const Home = () => {
    return (
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column"}}>
            <h1>Proyecto Base usando React</h1>
            <NodosList /> {/* Asegúrate de que NodosList sea el componente correcto */}
        </div>
    );
};

export default Home;
