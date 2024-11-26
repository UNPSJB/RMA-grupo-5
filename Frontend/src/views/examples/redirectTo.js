/*
import { useNavigate } from "react-router-dom";
import apiClient from "./axiosConfig"; // Tu configuración de Axios
import {setTokenToCookie} from "./utils"; // Asegúrate de importar esta función correctamente

const useRedirectTo = () => {
  const navigate = useNavigate();

  const redirectTo = async (url, validationUrl) => {
    try {
      // Setear el token como cookie
      setTokenToCookie();

      // Validar la autenticidad del token usando Axios
      await apiClient.get(validationUrl, {
        withCredentials: true, // Enviar cookies de sesión si es necesario
      });

      // Redirigir usando navigate si está disponible
      if (navigate) {
        navigate(url);
      } else {
        window.location.href = url; // Fallback a window.location.href
      }
    } catch (error) {
      console.error("Error en redirectTo:", error);

      // Verificar si el error es debido a autenticación
      if (error.response && error.response.status === 401) {
        console.warn("Token inválido o sesión expirada. Redirigiendo al login...");
      }

      // Redirigir al login en cualquier caso de error
      window.location.href = "http://localhost:3000/auth/register";
    }
  };

  return redirectTo;
};

export default useRedirectTo;

const useRedirectTo = () => {
  const navigate = useNavigate();

  const redirectTo = (url) => {
    try {
      // Validar si el usuario está autenticado
      const token = localStorage.getItem("access_token"); // Cambia según cómo guardes el token
      if (!token) {
        console.warn("Usuario no autenticado. Redirigiendo al login...");
        window.location.href = "http://localhost:3000/auth/register"; // Cambia esta URL si es necesario
        return;
      }

      // Usar navigate para redirigir si está disponible
      if (navigate) {
        navigate(url);
      } else {
        // Fallback a window.location.href
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error en redirectTo:", error);
      // Redirigir al login si ocurre un error inesperado
      window.location.href = "http://localhost:3000/auth/register";
    }
  };

  return redirectTo;
};

export default useRedirectTo;
*/
import { useNavigate } from "react-router-dom";
import apiClient from "./axiosConfig";  // Tu configuración de axios
import { setTokenToCookie } from "./utils";  // Asegúrate de que esta función esté configurada

const useRedirectTo = () => {
  const navigate = useNavigate();

  const redirectTo = async (url, validationUrl = "http://localhost:8000/validar_token") => {
    try {
      setTokenToCookie();  // Asegúrate de que esta función esté agregando el token correctamente en las cookies

      // Hacer una petición a la ruta de validación del token
      await apiClient.get(validationUrl, { withCredentials: true });

      // Si la validación es exitosa, redirigir a la URL deseada
      navigate(url);
    } catch (error) {
      console.error("Error al validar el token:", error);

      // Si el token no es válido, redirigir al login
      navigate("/auth/login");
    }
  };

  return redirectTo;
};

export default useRedirectTo;