/**
 * Mensaje legible para errores al llamar a la API (axios).
 */
export function getApiErrorMessage(error, fallback = "No se pudo guardar") {
  if (!error?.response) {
    if (error?.code === "ERR_NETWORK" || error?.message?.includes("Network Error")) {
      return "No se pudo conectar con el servidor. Comprobá que la API esté en marcha y que CORS permita el origen del front.";
    }
    return fallback;
  }

  const { status, data } = error.response;

  if (status === 401) {
    return "Sesión caducada o no iniciada. Volvé a iniciar sesión.";
  }
  if (status === 403) {
    return "No tenés permiso para realizar esta acción.";
  }

  if (data && typeof data === "object") {
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
    if (Array.isArray(data.errors)) {
      const parts = data.errors.map((e) => e.defaultMessage || e.message || "").filter(Boolean);
      if (parts.length) return parts.join(" ");
    }
    if (Array.isArray(data.fieldErrors)) {
      const parts = data.fieldErrors.map((e) => e.defaultMessage || e.message || "").filter(Boolean);
      if (parts.length) return parts.join(" ");
    }
    if (typeof data.error === "string") {
      return data.error;
    }
  }

  if (status === 400) {
    return "Los datos no son válidos. Revisá fechas, textos demasiado largos (descripción máx. 500 caracteres) y campos obligatorios.";
  }

  return `${fallback} (HTTP ${status}).`;
}
