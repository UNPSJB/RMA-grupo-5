import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
//import './styles.css'; // Asegúrate de que este archivo contenga todos los estilos necesarios

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
