import axios from "axios";
import { buildApiUrl } from "../config/api";

const API_URL = buildApiUrl("api/proyectos");

export const getProyectos = async () => {
  const response = await axios.get(API_URL, { withCredentials: true });
  return response.data;
};

export const getProyectoById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, { withCredentials: true });
  return response.data;
};

export const createProyecto = async (data) => {
  const response = await axios.post(API_URL, data, { withCredentials: true });
  return response.data;
};

export const updateProyecto = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, { withCredentials: true });
  return response.data;
};

export const deleteProyecto = async (id) => {
  await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
};
