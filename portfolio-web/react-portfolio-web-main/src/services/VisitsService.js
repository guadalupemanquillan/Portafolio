import axios from "axios";
import { buildApiUrl } from "../config/api";

const API_URL = buildApiUrl("api/visits");

export const getVisits = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const incrementVisits = async () => {
  const res = await axios.post(`${API_URL}/increment`);
  return res.data;
};
