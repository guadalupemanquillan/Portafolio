import axios from "axios";
import { buildApiUrl } from "../config/api";

const API = buildApiUrl("api/cv");

export const uploadCv = async (file) => {
  const form = new FormData();
  form.append("file", file);
  const res = await axios.post(`${API}/upload`, form, {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data; // expected: public path like /uploads/cv/cv.pdf
};
