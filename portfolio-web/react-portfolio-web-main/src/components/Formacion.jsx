import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getFormaciones, deleteFormacion } from "../services/FormacionService";
import { useAuth } from "../context/AuthContext.jsx";
import { MOCK_FORMACION } from "../data/portfolioMockData";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const sortFormaciones = (items) => {
  const monthOrder = [
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

  const getMonthIndex = (month) => {
    const index = monthOrder.indexOf(month);
    return index === -1 ? 0 : index;
  };

  return [...items].sort((a, b) => {
    const aEndYear =
      a.cursandoAhora || !a.anoFin ? a.anoInicio ?? 0 : a.anoFin;
    const bEndYear =
      b.cursandoAhora || !b.anoFin ? b.anoInicio ?? 0 : b.anoFin;

    if (aEndYear !== bEndYear) {
      return bEndYear - aEndYear;
    }

    const aEndMonth =
      a.cursandoAhora || !a.mesFin
        ? getMonthIndex(a.mesInicio)
        : getMonthIndex(a.mesFin);
    const bEndMonth =
      b.cursandoAhora || !b.mesFin
        ? getMonthIndex(b.mesInicio)
        : getMonthIndex(b.mesFin);

    if (aEndMonth !== bEndMonth) {
      return bEndMonth - aEndMonth;
    }

    if (a.anoInicio !== b.anoInicio) {
      return (b.anoInicio ?? 0) - (a.anoInicio ?? 0);
    }

    return getMonthIndex(b.mesInicio) - getMonthIndex(a.mesInicio);
  });
};

export const Formacion = () => {
  const navigate = useNavigate();
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

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

  const fetchFormaciones = () =>
    getFormaciones()
      .then((data) => {
        console.log("FORMACIONES BACKEND:", data);
        const base = Array.isArray(data) ? data : [];
        const sorted = sortFormaciones(base);
        setStudies(sorted.length ? sorted : sortFormaciones(MOCK_FORMACION));
      })
      .catch((err) => {
        console.error("Error cargando formación", err);
        setStudies(sortFormaciones(MOCK_FORMACION));
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    fetchFormaciones();
  }, []);

  const openCreateForm = () => navigate("/admin/formacion/nuevo");
  const openEditForm = (st) => navigate(`/admin/formacion/${st.id}`);

  const handleDelete = async (st) => {
    const res = await swal.fire({
      icon: "question",
      title: "¿Eliminar formación?",
      text: `${st.nombre} - ${st.centro}`,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });
    if (res.isConfirmed) {
      try {
        await deleteFormacion(st.id);
        setStudies((prev) => prev.filter((e) => e.id !== st.id));
        await swal.fire({ icon: "success", title: "Eliminado" });
      } catch {
        await swal.fire({ icon: "error", title: "No se pudo eliminar" });
      }
    }
  };

  return (
    <motion.section
      id="formacion"
      className="education"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="section-header-wrapper">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="section-header section-header--education"
        >
          <motion.h2 className="section-header-title">Formación Académica</motion.h2>
          {isAdmin ? (
          <button
            aria-label="Añadir formación"
            title="Añadir formación"
            onClick={openCreateForm}
            className="xp-create-btn"
          >
            <span className="xp-plus">+</span>
          </button>
          ) : null}
        </motion.div>
      </div>

      <motion.div
        className="education-timeline"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        {loading && studies.length === 0 ? (
          <p className="loading-text">Cargando formación...</p>
        ) : null}

        {studies.map((study, index) => (
          <motion.div
            key={study.id}
            className={`education-item ${
              index % 2 === 0 ? "right" : "left"
            }`}
            variants={fadeInUp}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
          >
            <div className="education-marker" />
            <div className="education-content">
              <div className="education-header">
                <div className="row-with-actions">
                  <h3>{study.nombre}</h3>
                  <div className="row-with-actions">
                    <button
                      style={{ display: isAdmin ? undefined : 'none' }}
                      aria-label="Editar"
                      onClick={() => openEditForm(study)}
                      className="project-action-btn project-action-btn--edit"
                    >
                      <i className="fa-solid fa-pen" />
                    </button>
                    <button
                      style={{ display: isAdmin ? undefined : 'none' }}
                      aria-label="Borrar"
                      onClick={() => handleDelete(study)}
                      className="project-action-btn project-action-btn--delete"
                    >
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                </div>
                <span className="education-center">{study.centro}</span>
                <span className="education-dates">
                  {study.mesInicio} {study.anoInicio} -{" "}
                  {study.cursandoAhora
                    ? "Actualidad"
                    : `${study.mesFin} ${study.anoFin}`}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};
