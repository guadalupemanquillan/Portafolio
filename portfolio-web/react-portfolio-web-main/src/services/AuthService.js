import axios from "axios";
import { buildApiUrl } from "../config/api";

const API = buildApiUrl("api/auth");

export const login = async (username, password) => {
  const res = await axios.post(
    `${API}/login`,
    { username, password },
    { withCredentials: true }
  );
  return res.data;
};

export const logout = async () => {
  const res = await axios.post(`${API}/logout`, null, { withCredentials: true });
  return res.data;
};

export const getStatus = async () => {
  const res = await axios.get(`${API}/status`, { withCredentials: true });
  return res.data;
};
