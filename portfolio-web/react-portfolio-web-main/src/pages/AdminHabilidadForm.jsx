import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { createHabilidad, getHabilidadById, updateHabilidad, getHabilidades } from "../services/HabilidadService";
import { getApiErrorMessage } from "../utils/apiErrorMessage";
import { buildApiUrl } from "../config/api";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const CATEGORY_OPTIONS = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "database", label: "Base de datos" },
  { value: "tools", label: "Herramientas" },
  { value: "other", label: "Otros" },
];

const getImageSrc = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  if (image.startsWith("/uploads")) return buildApiUrl(image);
  return image;
};

const getImageFileName = (image) => {
  if (!image) return "";
  try {
    const url = new URL(image, buildApiUrl("/"));
    const name = (url.pathname || image).split("/").pop();
    return name || image;
  } catch {
    const parts = image.split("/");
    return parts[parts.length - 1] || image;
  }
};

export default function AdminHabilidadForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const [loading, setLoading] = useState(!!id);
  const [formData, setFormData] = useState({
    name: "",
    image: null, // File | null
    category: "",
    posicion: "",
  });
  const [currentImage, setCurrentImage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [totalSkills, setTotalSkills] = useState(0);

  useEffect(() => {
    if (!id) return;
    getHabilidadById(id)
      .then((sk) => {
        if (!sk) return;
        setFormData((prev) => ({
          ...prev,
          name: sk.name || "",
          // no precargamos archivo; la imagen actual se mantiene si no se sube una nueva
          image: null,
          category: (sk.category || "").toString().toLowerCase(),
          posicion: sk.posicion != null ? String(sk.posicion) : "",
        }));
        setCurrentImage(sk.image || "");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    getHabilidades()
      .then((list) => setTotalSkills(Array.isArray(list) ? list.length : 0))
      .catch(() => setTotalSkills(0));
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
    setFormData((prev) => ({ ...prev, image: file }));
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  };

  const validate = () => {
    const issues = [];
    if (!formData.name.trim()) issues.push("Indica el nombre de la habilidad.");
    if (!editing && !formData.image) issues.push("Selecciona una imagen.");
    if (!formData.category) issues.push("Selecciona una categoría.");
    const maxAllowed = editing ? Math.max(1, totalSkills) : Math.max(1, totalSkills + 1);
    if (String(formData.posicion).trim() !== "") {
      const pos = parseInt(formData.posicion, 10);
      if (Number.isNaN(pos) || pos < 1) issues.push("La posición debe ser un número mayor o igual a 1.");
      else if (pos > maxAllowed) issues.push(`La posición máxima permitida es ${maxAllowed}.`);
    }
    return issues;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const issues = validate();
    if (issues.length) {
      await swal.fire({
        icon: "warning",
        title: "Revisa el formulario",
        html: `<ul style="text-align:left;margin:0;padding-left:18px;">${issues.map((m) => `<li>${m}</li>`).join("")}</ul>`,
      });
      return;
    }

    try {
      const fd = new FormData();
      fd.append("name", formData.name.trim());
      fd.append("category", formData.category);
      if (formData.image) {
        fd.append("image", formData.image);
      }
      if (String(formData.posicion).trim() !== "") {
        fd.append("posicion", String(parseInt(formData.posicion, 10)));
      }
      if (editing) {
        await updateHabilidad(id, fd);
        await swal.fire({ icon: "success", title: "Habilidad actualizada" });
      } else {
        await createHabilidad(fd);
        await swal.fire({ icon: "success", title: "Habilidad creada" });
      }
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Guardar habilidad", err);
      const msg = getApiErrorMessage(err);
      await swal.fire({ icon: "error", title: "No se pudo guardar", text: msg });
    }
  };

  return (
    <motion.section
      className="experience"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2 variants={fadeInUp} initial="initial" animate="animate" style={{ textAlign: "center" }}>
        {editing ? "Editar habilidad" : "Nueva habilidad"}
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
          style={{ padding: "1.5rem 1.75rem", maxWidth: 720, margin: "0 auto" }}
        >
          <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 1fr" }}>
            {(currentImage || previewUrl) && (
              <div className="span-2" style={{ gridColumn: "1 / -1" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
                  <img
                    src={previewUrl || getImageSrc(currentImage)}
                    alt="Vista previa"
                    style={{ maxHeight: 120, borderRadius: 12, border: "1px solid var(--card-border)", background: "#0b1220" }}
                  />
                </div>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
              <label htmlFor="name" className="admin-label">Nombre</label>
              <input
                id="name"
                className="admin-input"
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
              <label htmlFor="category" className="admin-label">Categoría</label>
              <select id="category" className="admin-input" name="category" value={formData.category} onChange={handleChange}>
                <option value="">Selecciona categoría</option>
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
              <label htmlFor="posicion" className="admin-label">Posición (opcional)</label>
              <input
                id="posicion"
                className="admin-input"
                name="posicion"
                type="number"
                min={1}
                max={editing ? Math.max(1, totalSkills) : Math.max(1, totalSkills + 1)}
                step={1}
                placeholder={`Entre 1 y ${editing ? Math.max(1, totalSkills) : Math.max(1, totalSkills + 1)}`}
                value={formData.posicion}
                onChange={handleChange}
              />
            </div>
            <div className="span-2" style={{ display: "flex", flexDirection: "column", gap: ".35rem", gridColumn: "1 / -1" }}>
              <label htmlFor="image" className="admin-label">Imagen</label>
              <input
                id="image"
                className="admin-input"
                type="file"
                accept="image/*"
                name="image"
                onChange={handleFileChange}
              />
            </div>
            {editing && currentImage && !previewUrl && (
              <div className="span-2" style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--light-text)", fontSize: ".9rem" }}>
                Actual: {getImageFileName(currentImage)} (se mantendrá si no seleccionas una nueva)
              </div>
            )}
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
