import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { createFormacion, getFormacionById, updateFormacion } from "../services/FormacionService";

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function AdminFormacionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const [loading, setLoading] = useState(!!id);
  const [formData, setFormData] = useState({
    nombre: "",
    centro: "",
    mesInicio: "",
    anoInicio: "",
    mesFin: "",
    anoFin: "",
    cursandoAhora: false,
  });

  useEffect(() => {
    if (!id) return;
    getFormacionById(id)
      .then((st) => {
        if (!st) return;
        setFormData({
          nombre: st.nombre || "",
          centro: st.centro || "",
          mesInicio: st.mesInicio || "",
          anoInicio: st.anoInicio ?? "",
          mesFin: st.mesFin || "",
          anoFin: st.anoFin ?? "",
          cursandoAhora: !!st.cursandoAhora,
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleYearInput = (name) => (e) => {
    const digits = (e.target.value || "").replace(/\D/g, "").slice(0, 4);
    setFormData((prev) => ({ ...prev, [name]: digits }));
  };

  const validate = () => {
    const issues = [];
    if (!formData.nombre.trim()) issues.push("Indica el nombre del estudio.");
    if (!formData.centro.trim()) issues.push("Indica el centro.");
    if (!formData.mesInicio) issues.push("Selecciona mes de inicio.");
    if (!formData.anoInicio) issues.push("Indica año de inicio.");
    if (!formData.cursandoAhora) {
      if (!formData.mesFin) issues.push("Selecciona mes de fin.");
      if (!formData.anoFin) issues.push("Indica año de fin.");
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
        html: `<ul style="text-align:left;margin:0;padding-left:18px;">${issues
          .map((m) => `<li>${m}</li>`)
          .join("")}</ul>`,
      });
      return;
    }

    try {
      const payload = {
        nombre: formData.nombre.trim(),
        centro: formData.centro.trim(),
        mesInicio: formData.mesInicio,
        anoInicio: Number(formData.anoInicio),
        mesFin: formData.cursandoAhora ? null : formData.mesFin,
        anoFin: formData.cursandoAhora ? null : (formData.anoFin ? Number(formData.anoFin) : null),
        cursandoAhora: !!formData.cursandoAhora,
      };
      if (editing) {
        await updateFormacion(id, payload);
        await swal.fire({ icon: "success", title: "Formación actualizada" });
      } else {
        await createFormacion(payload);
        await swal.fire({ icon: "success", title: "Formación creada" });
      }
      navigate("/", { replace: true });
      // setTimeout(() => document.querySelector('#formacion')?.scrollIntoView({ behavior: 'smooth' }), 0);
    } catch {
      await swal.fire({ icon: "error", title: "No se pudo guardar" });
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
        {editing ? "Editar formación" : "Nueva formación"}
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
          style={{ padding: "1.5rem 1.75rem", maxWidth: 800, margin: "0 auto" }}
        >
          <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
              <label htmlFor="nombre" className="admin-label">Nombre del estudio</label>
              <input id="nombre" className="admin-input" name="nombre" placeholder="Nombre del estudio" value={formData.nombre} onChange={handleChange} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
              <label htmlFor="centro" className="admin-label">Centro</label>
              <input id="centro" className="admin-input" name="centro" placeholder="Centro" value={formData.centro} onChange={handleChange} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
              <label htmlFor="mesInicio" className="admin-label">Mes de inicio</label>
              <select id="mesInicio" className="admin-input" name="mesInicio" value={formData.mesInicio} onChange={handleChange}>
                <option value="">Selecciona mes</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
              <label htmlFor="anoInicio" className="admin-label">Año de inicio</label>
              <input
                id="anoInicio"
                className="admin-input"
                name="anoInicio"
                placeholder="Año inicio"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.anoInicio}
                onChange={handleYearInput('anoInicio')}
              />
            </div>

            {!formData.cursandoAhora && (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
                  <label htmlFor="mesFin" className="admin-label">Mes de fin</label>
                  <select id="mesFin" className="admin-input" name="mesFin" value={formData.mesFin} onChange={handleChange}>
                    <option value="">Selecciona mes</option>
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
                  <label htmlFor="anoFin" className="admin-label">Año de fin</label>
                  <input
                    id="anoFin"
                    className="admin-input"
                    name="anoFin"
                    placeholder="Año fin"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.anoFin}
                    onChange={handleYearInput('anoFin')}
                  />
                </div>
              </>
            )}
          </div>
          <label className="toggle" style={{ marginTop: ".5rem" }}>
            <input type="checkbox" name="cursandoAhora" checked={formData.cursandoAhora} onChange={handleChange} />
            <span className="toggle-track"><span className="toggle-thumb" /></span>
            En curso
          </label>
          <div style={{ display: "flex", gap: ".5rem", marginTop: "0.9rem", justifyContent: "center" }}>
            <button type="submit" className="swal-portfolio-confirm" style={{ cursor: "pointer" }}>{editing ? "Guardar cambios" : "Crear"}</button>
            <button type="button" className="swal-portfolio-cancel" style={{ cursor: "pointer" }} onClick={() => navigate("/", { replace: true })}>Cancelar</button>
          </div>
        </motion.form>
      )}
    </motion.section>
  );
}
