import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { createProyecto, getProyectoById, updateProyecto, getProyectos } from "../services/ProyectoService";
import { buildApiUrl } from "../config/api";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const getImageSrc = (image) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return encodeURI(image);
  let path = String(image).trim().replace(/\\/g, "/").replace(/^\.?\/+/, "");
  if (path.startsWith("uploads/")) return encodeURI(buildApiUrl(path));
  if (path.startsWith("proyectos/")) return encodeURI(buildApiUrl(`uploads/${path}`));
  return encodeURI(buildApiUrl(`uploads/proyectos/${path}`));
};

export default function AdminProyectoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const [loading, setLoading] = useState(!!id);
  const [totalProjects, setTotalProjects] = useState(0);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    enlaceGithub: "",
    enlaceDespliegue: "",
    tecnologiasText: "",
    posicion: "",
    imagen: null, // File | null
  });
  const [currentImage, setCurrentImage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!id) return;
    getProyectoById(id)
      .then((p) => {
        if (!p) return;
        setFormData((prev) => ({
          ...prev,
          nombre: p.nombre || "",
          descripcion: p.descripcion || "",
          enlaceGithub: p.enlaceGithub || p.enlace || "",
          enlaceDespliegue: p.enlaceDespliegue || "",
          tecnologiasText: (p.tecnologias || []).join(", "),
          posicion: Number.isInteger(p.posicion) ? String(p.posicion) : "",
          imagen: null,
        }));
        setCurrentImage(p.imagen || "");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    // contar proyectos para calcular el rango permitido de posición
    getProyectos()
      .then((list) => setTotalProjects(Array.isArray(list) ? list.length : 0))
      .catch(() => setTotalProjects(0));
  }, []);

  const swal = Swal.mixin({
    customClass: {
      popup: "swal-portfolio-popup",
      title: "swal-portfolio-title",
      htmlContainer: "swal-portfolio-html",
      actions: "swal-portfolio-actions",
      confirmButton: "swal-portfolio-confirm",
      cancelButton: "swal-portfolio-cancel",
    },
    buttonsStyling: false,
    background: "var(--card-bg)",
    color: "var(--text-color)",
    iconColor: "var(--accent-color)",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setFormData((prev) => ({ ...prev, imagen: file }));
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  };

  const tecnologiasArray = useMemo(() =>
    (formData.tecnologiasText || "")
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0),
  [formData.tecnologiasText]);

  const validate = () => {
    const issues = [];
    if (!formData.nombre.trim()) issues.push("Indica el nombre del proyecto.");
    if (!formData.descripcion.trim()) issues.push("Añade una breve descripción.");
    if (!formData.enlaceGithub.trim()) issues.push("Añade el enlace de GitHub.");
    if (tecnologiasArray.length < 1 || tecnologiasArray.length > 3)
      issues.push("Indica entre 1 y 3 tecnologías separadas por coma.");
    tecnologiasArray.forEach((t) => {
      if (t.length > 50) issues.push(`Tecnología demasiado larga: ${t}`);
    });
    if (!editing && !formData.imagen) issues.push("Selecciona una imagen.");
    return issues;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const issues = validate();
    if (issues.length) {
      await swal.fire({
        icon: "warning",
        title: "Revisa el formulario",
        html: `<ul style="text-align:left;margin:0;padding-left:18px;">${issues
          .map((m) => `<li>${m}</li>`)
          .join("")}</ul>`,
      });
      return;
    }

    try {
      const fd = new FormData();
      fd.append("nombre", formData.nombre.trim());
      fd.append("descripcion", formData.descripcion.trim());
      fd.append("enlaceGithub", formData.enlaceGithub.trim());
      if (formData.enlaceDespliegue.trim()) {
        fd.append("enlaceDespliegue", formData.enlaceDespliegue.trim());
      }
      tecnologiasArray.forEach((t) => fd.append("tecnologias", t));
      const posNum = parseInt(formData.posicion, 10);
      if (!Number.isNaN(posNum) && posNum > 0) {
        fd.append("posicion", String(posNum));
      }
      if (formData.imagen) fd.append("imagen", formData.imagen);

      if (editing) {
        await updateProyecto(id, fd);
        await swal.fire({ icon: "success", title: "Proyecto actualizado" });
      } else {
        await createProyecto(fd);
        await swal.fire({ icon: "success", title: "Proyecto creado" });
      }
      navigate("/", { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      const isAuthError = status === 401 || status === 403;
      const details =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Error inesperado";

      await swal.fire({
        icon: "error",
        title: "No se pudo guardar",
        text: isAuthError
          ? "Tu sesion de admin no es valida. Volve a iniciar sesion."
          : `Detalle: ${details}`,
      });
    }
  };

  return (
    <motion.section className="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <motion.h2 variants={fadeInUp} initial="initial" animate="animate" style={{ textAlign: "center" }}>
        {editing ? "Editar proyecto" : "Nuevo proyecto"}
      </motion.h2>

      {loading ? (
        <p style={{ textAlign: "center", color: "var(--light-text)" }}>Cargando...</p>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="experience-card admin-form"
          style={{ padding: "1.5rem 1.75rem", maxWidth: 900, margin: "0 auto" }}
        >
          <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 1fr" }}>
            {(currentImage || previewUrl) && (
              <div className="span-2" style={{ gridColumn: "1 / -1" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
                  <img
                    src={previewUrl || getImageSrc(currentImage)}
                    alt="Vista previa"
                    style={{ maxHeight: 160, borderRadius: 12, border: "1px solid var(--card-border)", background: "#0b1220" }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
              <label htmlFor="nombre" className="admin-label">Nombre</label>
              <input id="nombre" className="admin-input" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
              <label htmlFor="enlaceGithub" className="admin-label">Enlace GitHub</label>
              <input id="enlaceGithub" className="admin-input" name="enlaceGithub" placeholder="Enlace GitHub" value={formData.enlaceGithub} onChange={handleChange} />
            </div>

            <div className="span-2" style={{ display: "flex", flexDirection: "column", gap: ".35rem", gridColumn: "1 / -1" }}>
              <label htmlFor="descripcion" className="admin-label">Descripción</label>
              <textarea id="descripcion" className="admin-input" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} />
            </div>

            <div className="span-2" style={{ display: "flex", flexDirection: "column", gap: ".35rem", gridColumn: "1 / -1" }}>
              <label htmlFor="enlaceDespliegue" className="admin-label">Enlace de despliegue (opcional)</label>
              <input id="enlaceDespliegue" className="admin-input" name="enlaceDespliegue" placeholder="Enlace de despliegue (opcional)" value={formData.enlaceDespliegue} onChange={handleChange} />
            </div>

            <div className="span-2" style={{ display: "flex", flexDirection: "column", gap: ".35rem", gridColumn: "1 / -1" }}>
              <label htmlFor="tecnologiasText" className="admin-label">Tecnologías (entre 1 y 3, separadas por coma)</label>
              <input
                id="tecnologiasText"
                className="admin-input"
                name="tecnologiasText"
                placeholder="Tecnologías (entre 1 y 3, separadas por coma)"
                value={formData.tecnologiasText}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
              <label htmlFor="posicion" className="admin-label">Posición (opcional)</label>
              <input
                id="posicion"
                className="admin-input"
                name="posicion"
                type="number"
                min={1}
                max={editing ? Math.max(1, totalProjects) : Math.max(1, totalProjects + 1)}
                step={1}
                placeholder={`Entre 1 y ${editing ? Math.max(1, totalProjects) : Math.max(1, totalProjects + 1)}`}
                value={formData.posicion}
                onChange={handleChange}
              />
            </div>

            <div className="span-2" style={{ display: "flex", flexDirection: "column", gap: ".35rem", gridColumn: "1 / -1" }}>
              <label htmlFor="imagen" className="admin-label">Imagen</label>
              <input id="imagen" className="admin-input" type="file" accept="image/*" name="imagen" onChange={handleFileChange} />
            </div>
          </div>

          <div style={{ display: "flex", gap: ".5rem", marginTop: "0.9rem", justifyContent: "center" }}>
            <button type="submit" className="swal-portfolio-confirm" style={{ cursor: "pointer" }}>{editing ? "Guardar cambios" : "Crear"}</button>
            <button type="button" className="swal-portfolio-cancel" style={{ cursor: "pointer" }} onClick={() => navigate("/", { replace: true })}>Cancelar</button>
          </div>
        </motion.form>
      )}
    </motion.section>
  );
}
