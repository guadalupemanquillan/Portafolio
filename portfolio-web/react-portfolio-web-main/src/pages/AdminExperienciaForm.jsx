import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { createExperiencia, getExperienciaById, updateExperiencia } from "../services/ExperienciaService";
import { getApiErrorMessage } from "../utils/apiErrorMessage";

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

export default function AdminExperienciaForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const [loading, setLoading] = useState(!!id);
  const [formData, setFormData] = useState({
    puesto: "",
    empresa: "",
    descripcion: "",
    mesInicio: "",
    anoInicio: "",
    mesFin: "",
    anoFin: "",
    trabajoActivo: false,
  });

  useEffect(() => {
    if (!id) return;
    getExperienciaById(id)
      .then((exp) => {
        if (!exp) return;
        setFormData({
          puesto: exp.puesto || "",
          empresa: exp.empresa || "",
          descripcion: exp.descripcion || "",
          mesInicio: exp.mesInicio || "",
          anoInicio: exp.anoInicio ?? "",
          mesFin: exp.mesFin || "",
          anoFin: exp.anoFin ?? "",
          trabajoActivo: !!exp.trabajoActivo,
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
    if (!formData.puesto.trim()) issues.push("Indica el puesto.");
    if (!formData.empresa.trim()) issues.push("Indica la empresa.");
    if (!formData.descripcion.trim()) issues.push("Añade una descripción.");
    if (formData.descripcion.length > 500) {
      issues.push("La descripción no puede superar 500 caracteres (límite del servidor).");
    }
    if (formData.puesto.length > 100) issues.push("El puesto no puede superar 100 caracteres.");
    if (formData.empresa.length > 100) issues.push("La empresa no puede superar 100 caracteres.");
    if (!formData.mesInicio) issues.push("Selecciona mes de inicio.");
    if (!formData.anoInicio) issues.push("Indica año de inicio.");
    if (!formData.trabajoActivo) {
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
        puesto: formData.puesto.trim(),
        empresa: formData.empresa.trim(),
        descripcion: formData.descripcion.trim(),
        mesInicio: formData.mesInicio,
        anoInicio: Number(formData.anoInicio),
        mesFin: formData.trabajoActivo ? null : formData.mesFin,
        anoFin: formData.trabajoActivo ? null : (formData.anoFin ? Number(formData.anoFin) : null),
        trabajoActivo: !!formData.trabajoActivo,
      };
      if (editing) {
        await updateExperiencia(id, payload);
        await swal.fire({ icon: "success", title: "Experiencia actualizada" });
      } else {
        await createExperiencia(payload);
        await swal.fire({ icon: "success", title: "Experiencia creada" });
      }
      navigate("/", { replace: true });
      // opcional: anclar a la sección
      // setTimeout(() => document.querySelector('#experiencia')?.scrollIntoView({ behavior: 'smooth' }), 0);
    } catch (err) {
      console.error("Guardar experiencia", err);
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
        {editing ? "Editar experiencia" : "Nueva experiencia"}
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
              <label htmlFor="puesto" className="admin-label">Puesto</label>
              <input id="puesto" className="admin-input" name="puesto" placeholder="Puesto" maxLength={100} value={formData.puesto} onChange={handleChange} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
              <label htmlFor="empresa" className="admin-label">Empresa</label>
              <input id="empresa" className="admin-input" name="empresa" placeholder="Empresa" maxLength={100} value={formData.empresa} onChange={handleChange} />
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

            {!formData.trabajoActivo && (
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

            <div className="span-2" style={{ display: "flex", flexDirection: "column", gap: ".35rem", gridColumn: "1 / -1" }}>
              <label htmlFor="descripcion" className="admin-label">Descripción</label>
              <textarea
                id="descripcion"
                className="admin-input"
                name="descripcion"
                placeholder="Descripción (máx. 500 caracteres)"
                maxLength={500}
                value={formData.descripcion}
                onChange={handleChange}
              />
            </div>
          </div>
          <label className="toggle" style={{ marginTop: ".5rem" }}>
            <input type="checkbox" name="trabajoActivo" checked={formData.trabajoActivo} onChange={handleChange} />
            <span className="toggle-track"><span className="toggle-thumb" /></span>
            En activo
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
