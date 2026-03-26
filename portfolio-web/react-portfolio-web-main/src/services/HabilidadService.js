import axios from "axios";
import { unwrapSpringPage } from "../utils/springPage";
import { buildApiUrl } from "../config/api";

const API_URL = buildApiUrl("api/habilidades");

const creds = { withCredentials: true };

export const getHabilidades = async () => {
  const response = await axios.get(API_URL, creds);
  return unwrapSpringPage(response.data);
};

export const getHabilidadById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, creds);
  return response.data;
};

export const createHabilidad = async (data) => {
  const response = await axios.post(API_URL, data, creds);
  return response.data;
};

export const updateHabilidad = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, creds);
  return response.data;
};

export const deleteHabilidad = async (id) => {
  await axios.delete(`${API_URL}/${id}`, creds);
};
