import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const getNodos = async () => {
  const response = await axios.get(`${API_URL}/leer_nodos`);
  return response.data;
};

export const createNodo = async (nodo) => {
  const response = await axios.post(`${API_URL}/crear_nodo`, nodo);
  return response.data;
};

export const updateNodo = async (id, nodo) => {
  const response = await axios.put(`${API_URL}/actualizar_nodo/${id}`, nodo);
  return response.data;
};

export const deleteNodo = async (id) => {
  const response = await axios.delete(`${API_URL}/eliminar_nodo/${id}`);
  return response.data;
};
