import axios from "axios";

// Crear una instancia de Axios
const apiClient = axios.create({
  baseURL: "http://localhost:8000", // Cambia según tu backend
  withCredentials: true, // Permite enviar cookies de sesión
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente devuélvela
    return response;
  },
  (error) => {
    // Verificar si el error tiene una respuesta
    if (error.response) {
      // Manejar errores con respuesta del servidor
      if (error.response.status === 401) {
        // Redirigir al login
        window.location.href = "http://localhost:3000/auth/register";
      }
    } else {
      // Manejar errores sin respuesta (por ejemplo, problemas de red)
      console.error("Error de red o sin respuesta del servidor:", error.message);
    }
    // Rechazar la promesa para manejar el error en el componente llamante
    return Promise.reject(error);
  }
);

export default apiClient;
