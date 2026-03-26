import axios from "axios";
import { unwrapSpringPage } from "../utils/springPage";
import { buildApiUrl } from "../config/api";

const API_URL = buildApiUrl("api/experiencias");

const creds = { withCredentials: true };

export const getExperiencias = async () => {
  const response = await axios.get(API_URL, creds);
  return unwrapSpringPage(response.data);
};

export const getExperienciaById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, creds);
  return response.data;
};

export const createExperiencia = async (data) => {
  const response = await axios.post(API_URL, data, creds);
  return response.data;
};

export const updateExperiencia = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, creds);
  return response.data;
};

export const deleteExperiencia = async (id) => {
  await axios.delete(`${API_URL}/${id}`, creds);
};
