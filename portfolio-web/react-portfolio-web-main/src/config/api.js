const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL = String(rawBaseUrl ?? "").trim().replace(/\/+$/, "");

const normalizePath = (path) => String(path ?? "").replace(/^\/+/, "");

export const buildApiUrl = (path = "") => {
  const cleanPath = normalizePath(path);
  if (!API_BASE_URL) return `/${cleanPath}`;
  return cleanPath ? `${API_BASE_URL}/${cleanPath}` : API_BASE_URL;
};

export const buildUploadsUrl = (path = "") => {
  const cleanPath = normalizePath(path).replace(/^uploads\/+/, "");
  return buildApiUrl(cleanPath ? `uploads/${cleanPath}` : "uploads");
};
