import axios from "axios";
import { buildApiUrl } from "../config/api";

const API_URL = buildApiUrl("api/contact");

export const createContact = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};