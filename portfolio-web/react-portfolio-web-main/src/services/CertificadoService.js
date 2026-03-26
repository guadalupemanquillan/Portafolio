import axios from "axios";
import { unwrapSpringPage } from "../utils/springPage";
import { buildApiUrl } from "../config/api";

const API_URL = buildApiUrl("api/certificados");

const creds = { withCredentials: true };

export const getCertificados = async () => {
  const response = await axios.get(API_URL, creds);
  return unwrapSpringPage(response.data);
};

export const getCertificadoById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, creds);
  return response.data;
};

export const createCertificado = async (formData) => {
  const response = await axios.post(API_URL, formData, creds);
  return response.data;
};

export const updateCertificado = async (id, formData) => {
  const response = await axios.put(`${API_URL}/${id}`, formData, creds);
  return response.data;
};

export const deleteCertificado = async (id) => {
  await axios.delete(`${API_URL}/${id}`, creds);
};
