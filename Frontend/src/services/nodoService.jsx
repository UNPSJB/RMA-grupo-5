import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Cambia a la URL de tu API

export const getNodos = async () => {
  const response = await axios.get(`${API_URL}/nodos`);
  return response.data;
};

export const createNodo = async (nodo) => {
  const response = await axios.post(`${API_URL}/nodos`, nodo);
  return response.data;
};

export const updateNodo = async (id, nodo) => {
  const response = await axios.put(`${API_URL}/nodos/${id}`, nodo);
  return response.data;
};

export const deleteNodo = async (id) => {
  const response = await axios.delete(`${API_URL}/nodos/${id}`);
  return response.data;
};
