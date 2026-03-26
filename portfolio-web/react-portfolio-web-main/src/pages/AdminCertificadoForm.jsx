import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { createCertificado, getCertificadoById, updateCertificado, getCertificados } from "../services/CertificadoService";
import { getApiErrorMessage } from "../utils/apiErrorMessage";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function AdminCertificadoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const [loading, setLoading] = useState(!!id);
  const [totalCount, setTotalCount] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    issuedDate: "",
    credentialUrl: "",
    posicion: "",
    visible: true,
    featured: false,
    file: null,
  });
  const [currentFileLabel, setCurrentFileLabel] = useState("");

  useEffect(() => {
    getCertificados()
      .then((list) => setTotalCount(Array.isArray(list) ? list.length : 0))
      .catch(() => setTotalCount(0));
  }, []);

  useEffect(() => {
    if (!id) return;
    getCertificadoById(id)
      .then((c) => {
        if (!c) return;
        setFormData({
          title: c.title || "",
          issuer: c.issuer || "",
          issuedDate: (c.issuedDate || "").toString().slice(0, 10),
          credentialUrl: c.credentialUrl || "",
          posicion: c.posicion != null ? String(c.posicion) : "",
          visible: c.visible !== false,
          featured: !!c.featured,
          file: null,
        });
        setCurrentFileLabel(c.fileUrl ? String(c.fileUrl).split("/").pop() : "");
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

  const handleFile = (e) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({ ...prev, file }));
  };

  const validate = () => {
    const issues = [];
    if (!formData.title.trim()) issues.push("Indica el título del certificado.");
    if (!formData.issuer.trim()) issues.push("Indica la institución.");
    if (!formData.issuedDate.trim()) issues.push("Indica la fecha (o aproximada).");
    if (!editing && !formData.file) issues.push("Subí una imagen o un PDF del diploma.");
    const maxPos = editing ? Math.max(1, totalCount) : Math.max(1, totalCount + 1);
    if (String(formData.posicion).trim() !== "") {
      const pos = parseInt(formData.posicion, 10);
      if (Number.isNaN(pos) || pos < 1) issues.push("La posición debe ser ≥ 1.");
      else if (pos > maxPos) issues.push(`La posición máxima permitida es ${maxPos}.`);
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

    const fd = new FormData();
    fd.append("title", formData.title.trim());
    fd.append("issuer", formData.issuer.trim());
    fd.append("issuedDate", formData.issuedDate.trim());
    if (formData.credentialUrl.trim()) fd.append("credentialUrl", formData.credentialUrl.trim());
    if (String(formData.posicion).trim() !== "") {
      fd.append("posicion", String(parseInt(formData.posicion, 10)));
    }
    fd.append("visible", formData.visible ? "true" : "false");
    fd.append("featured", formData.featured ? "true" : "false");
    if (formData.file) fd.append("file", formData.file);

    try {
      if (editing) {
        await updateCertificado(id, fd);
        await swal.fire({ icon: "success", title: "Certificado actualizado" });
      } else {
        await createCertificado(fd);
        await swal.fire({ icon: "success", title: "Certificado creado" });
      }
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      await swal.fire({ icon: "error", title: "No se pudo guardar", text: getApiErrorMessage(err) });
    }
  };

  return (
    <motion.section className="experience" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <motion.h2 variants={fadeInUp} initial="initial" animate="animate" style={{ textAlign: "center" }}>
        {editing ? "Editar certificado" : "Nuevo certificado"}
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
            <div style={{ display: "flex", flexDirection: "column", gap: ".35rem", gridColumn: "1 / -1" }}>
              <label htmlFor="title" className="admin-label">Título</label>
              <input id="title" className="admin-input" name="title" value={formData.title} onChange={handleChange} placeholder="Ej. Power BI + IA" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
              <label htmlFor="issuer" className="admin-label">Institución</label>
              <input id="issuer" className="admin-input" name="issuer" value={formData.issuer} onChange={handleChange} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
              <label htmlFor="issuedDate" className="admin-label">Fecha (YYYY-MM-DD)</label>
              <input id="issuedDate" className="admin-input" name="issuedDate" type="date" value={formData.issuedDate} onChange={handleChange} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".35rem", gridColumn: "1 / -1" }}>
              <label htmlFor="credentialUrl" className="admin-label">URL de verificación (opcional)</label>
              <input id="credentialUrl" className="admin-input" name="credentialUrl" value={formData.credentialUrl} onChange={handleChange} placeholder="https://..." />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
              <label htmlFor="posicion" className="admin-label">Orden (opcional)</label>
              <input
                id="posicion"
                className="admin-input"
                name="posicion"
                type="number"
                min={1}
                value={formData.posicion}
                onChange={handleChange}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".35rem", gridColumn: "1 / -1" }}>
              <label htmlFor="file" className="admin-label">{editing ? "Nuevo archivo (opcional)" : "Imagen o PDF"}</label>
              <input id="file" className="admin-input" name="file" type="file" accept="image/*,application/pdf" onChange={handleFile} />
              {editing && currentFileLabel ? (
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--light-text)" }}>Actual: {currentFileLabel}</p>
              ) : null}
            </div>
          </div>
          <label className="toggle" style={{ marginTop: ".5rem" }}>
            <input type="checkbox" name="visible" checked={formData.visible} onChange={handleChange} />
            <span className="toggle-track"><span className="toggle-thumb" /></span>
            Visible en el portafolio
          </label>
          <label className="toggle" style={{ marginTop: ".35rem" }}>
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
            <span className="toggle-track"><span className="toggle-thumb" /></span>
            Destacado
          </label>
          <div style={{ display: "flex", gap: ".5rem", marginTop: "0.9rem", justifyContent: "center" }}>
            <button type="submit" className="swal-portfolio-confirm" style={{ cursor: "pointer" }}>
              {editing ? "Guardar" : "Crear"}
            </button>
            <button type="button" className="swal-portfolio-cancel" style={{ cursor: "pointer" }} onClick={() => navigate("/", { replace: true })}>
              Cancelar
            </button>
          </div>
        </motion.form>
      )}
    </motion.section>
  );
}
