/**
 * Convierte la respuesta de Spring Data Page en un array de ítems.
 * GET /api/experiencias (y similares) devuelve { content: [...], totalElements, ... }.
 */
export function unwrapSpringPage(data) {
  if (data == null) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.content)) return data.content;
  return [];
}
