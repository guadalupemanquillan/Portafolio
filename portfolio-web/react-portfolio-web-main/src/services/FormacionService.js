import axios from "axios";
import { unwrapSpringPage } from "../utils/springPage";
import { buildApiUrl } from "../config/api";

const API_URL = buildApiUrl("api/formaciones");

/** Incluir cookie de sesión (mismo origen / CORS) para POST/PUT/DELETE como ADMIN */
const creds = { withCredentials: true };

export const getFormaciones = async () => {
  const response = await axios.get(API_URL, creds);
  return unwrapSpringPage(response.data);
};

export const getFormacionById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, creds);
  return response.data;
};

export const createFormacion = async (data) => {
  const response = await axios.post(API_URL, data, creds);
  return response.data;
};

export const updateFormacion = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, creds);
  return response.data;
};

export const deleteFormacion = async (id) => {
  await axios.delete(`${API_URL}/${id}`, creds);
};
