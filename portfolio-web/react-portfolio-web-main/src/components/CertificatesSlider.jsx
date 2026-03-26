import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getCertificados, deleteCertificado } from "../services/CertificadoService";
import { useAuth } from "../context/AuthContext.jsx";
import { MOCK_CERTIFICATES } from "../data/portfolioMockData";
import "./CertificatesSlider.css";
import { buildUploadsUrl } from "../config/api";

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

function filePublicUrl(fileUrl) {
  if (!fileUrl || !String(fileUrl).trim()) return "";
  const path = String(fileUrl).trim().replace(/^\/+/, "");
  if (path.startsWith("http")) return path;
  return buildUploadsUrl(path);
}

function cardHref(cert) {
  const cred = cert.credentialUrl && cert.credentialUrl.trim();
  if (cred) return cred;
  return filePublicUrl(cert.fileUrl) || "#";
}

export const CertificatesSlider = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const sortCerts = (list) =>
    [...list].sort((a, b) => {
      if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1;
      const pa = typeof a.posicion === "number" ? a.posicion : 9999;
      const pb = typeof b.posicion === "number" ? b.posicion : 9999;
      if (pa !== pb) return pa - pb;
      return String(b.issuedDate || "").localeCompare(String(a.issuedDate || ""));
    });

  useEffect(() => {
    getCertificados()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setItems(sortCerts(list));
      })
      .catch(() => {
        setItems(sortCerts(MOCK_CERTIFICATES));
      })
      .finally(() => setLoading(false));
  }, []);

  const trackItems = useMemo(() => {
    if (!items.length) return [];
    if (isAdmin) return items;
    return [...items, ...items];
  }, [items, isAdmin]);

  const openCreate = () => navigate("/admin/certificado/nuevo");
  const openEdit = (c) => navigate(`/admin/certificado/${c.id}`);

  const handleDelete = async (c) => {
    const res = await swal.fire({
      icon: "question",
      title: "¿Eliminar certificado?",
      text: c.title,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!res.isConfirmed) return;
    try {
      await deleteCertificado(c.id);
      setItems((prev) => prev.filter((x) => x.id !== c.id));
      await swal.fire({ icon: "success", title: "Eliminado" });
    } catch {
      await swal.fire({ icon: "error", title: "No se pudo eliminar" });
    }
  };

  if (!loading && items.length === 0 && !isAdmin) {
    return null;
  }

  return (
    <motion.section
      id="certificados"
      className="certificates-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <div className="section-header-wrapper">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="certificates-header-row"
        >
          <h2 className="certificates-section-title">Certificados y cursos</h2>
          {isAdmin ? (
            <button
              type="button"
              onClick={openCreate}
              className="xp-create-btn"
              aria-label="Añadir certificado"
              title="Añadir certificado"
            >
              <span className="xp-plus">+</span>
            </button>
          ) : null}
        </motion.div>
      </div>

      {loading ? (
        <p className="loading-text" style={{ textAlign: "center" }}>
          Cargando certificados…
        </p>
      ) : items.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--light-text)", opacity: 0.85 }}>
          {isAdmin ? "Aún no hay certificados. Usá el botón + para agregar." : ""}
        </p>
      ) : (
        <div className="certificates-slider">
          <div className={`certificates-track${isAdmin ? " certificates-track--static" : ""}`}>
            {trackItems.map((cert, i) => {
              const href = cardHref(cert);
              const isPdf = cert.mediaType === "pdf" || (cert.fileUrl && cert.fileUrl.toLowerCase().endsWith(".pdf"));
              const imgSrc = filePublicUrl(cert.fileUrl);
              const showPdfThumb = isPdf || (!imgSrc && cert.mediaType === "pdf");
              return (
                <div key={`${cert.id}-${i}`} className="certificate-card-wrap">
                  <a
                    href={href === "#" ? undefined : href}
                    target={href === "#" ? undefined : "_blank"}
                    rel="noreferrer"
                    className="certificate-card"
                    onClick={href === "#" ? (e) => e.preventDefault() : undefined}
                  >
                    {cert.featured ? <span className="certificate-featured-badge">Destacado</span> : null}
                    <div className={`certificate-card-media ${showPdfThumb ? "certificate-card-pdf" : ""}`}>
                      {showPdfThumb ? (
                        <>
                          <span aria-hidden>📄</span>
                          PDF
                        </>
                      ) : imgSrc ? (
                        <img src={imgSrc} alt={cert.title} loading="lazy" />
                      ) : (
                        <span style={{ fontSize: "0.8rem", opacity: 0.75, padding: "0 0.5rem", textAlign: "center" }}>
                          Vista previa no disponible
                        </span>
                      )}
                    </div>
                    <div className="certificate-info">
                      <h4>{cert.title}</h4>
                      <span className="certificate-issuer">{cert.issuer}</span>
                      {cert.issuedDate ? (
                        <span className="certificate-date">{cert.issuedDate}</span>
                      ) : null}
                    </div>
                  </a>
                  {isAdmin ? (
                    <div className="certificates-admin-actions">
                      <button
                        type="button"
                        className="project-action-btn project-action-btn--edit project-action-btn--sm"
                        aria-label="Editar"
                        onClick={() => openEdit(cert)}
                      >
                        <i className="fa-solid fa-pen" />
                      </button>
                      <button
                        type="button"
                        className="project-action-btn project-action-btn--delete project-action-btn--sm"
                        aria-label="Eliminar"
                        onClick={() => handleDelete(cert)}
                      >
                        <i className="fa-solid fa-trash" />
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.section>
  );
};
