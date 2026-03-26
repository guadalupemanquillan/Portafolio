import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getExperiencias, deleteExperiencia } from "../services/ExperienciaService";
import { useAuth } from "../context/AuthContext.jsx";
import { MOCK_EXPERIENCES } from "../data/portfolioMockData";

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

const sortExperiences = (items) => {
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
      a.trabajoActivo || !a.anoFin ? a.anoInicio ?? 0 : a.anoFin;
    const bEndYear =
      b.trabajoActivo || !b.anoFin ? b.anoInicio ?? 0 : b.anoFin;

    if (aEndYear !== bEndYear) {
      return bEndYear - aEndYear;
    }

    const aEndMonth =
      a.trabajoActivo || !a.mesFin
        ? getMonthIndex(a.mesInicio)
        : getMonthIndex(a.mesFin);
    const bEndMonth =
      b.trabajoActivo || !b.mesFin
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

export const Experiencia = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
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

  const fetchExperiencias = () =>
    getExperiencias()
      .then((data) => {
        const sorted = sortExperiences(data || []);
        setExperiences(sorted);
      })
      .catch((err) => {
        console.error("Error cargando experiencias", err);
        setExperiences(sortExperiences(MOCK_EXPERIENCES));
      })
      .finally(() => {
        setLoading(false);
      });

  useEffect(() => {
    fetchExperiencias();
  }, []);

  const openCreateForm = () => navigate("/admin/experiencia/nuevo");
  const openEditForm = (exp) => navigate(`/admin/experiencia/${exp.id}`);

  const handleDelete = async (exp) => {
    const res = await swal.fire({
      icon: "question",
      title: "¿Eliminar experiencia?",
      text: `${exp.puesto} - ${exp.empresa}`,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });
    if (res.isConfirmed) {
      try {
        await deleteExperiencia(exp.id);
        setExperiences((prev) => prev.filter((e) => e.id !== exp.id));
        await swal.fire({ icon: "success", title: "Eliminado" });
      } catch {
        await swal.fire({ icon: "error", title: "No se pudo eliminar" });
      }
    }
  };

  // El formulario se gestiona en rutas /admin/experiencia/*

  return (
    <motion.section
      id="experiencia"
      className="experience"
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
          className="section-header section-header--experience"
        >
          <motion.h2 className="section-header-title">Experiencia Laboral</motion.h2>
          {isAdmin ? (
          <button
            aria-label="Añadir experiencia"
            title="Añadir experiencia"
            onClick={openCreateForm}
            className="xp-create-btn"
          >
            <span className="xp-plus">+</span>
          </button>
          ) : null}
        </motion.div>
      </div>

      <motion.div
        className="experience-grid"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        {loading && (
          <p className="loading-text">Cargando experiencias...</p>
        )}
        {/* Formulario se gestiona en página aparte */}

        {experiences.map((exp) => (
          <motion.div
            key={exp.id}
            className="experience-card"
            variants={fadeInUp}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
          >
            <div className="experience-header">
              <div className="experience-title-row">
                <h3>{exp.puesto}</h3>
                <div className="row-with-actions">
                  <span
                    className={`experience-status ${
                      exp.trabajoActivo ? "active" : "ended"
                    }`}
                  >
                    {exp.trabajoActivo ? "En activo" : "Finalizado"}
                  </span>
                  {isAdmin ? (
                  <button
                    aria-label="Editar"
                    onClick={() => openEditForm(exp)}
                    className="project-action-btn project-action-btn--edit"
                  >
                    <i className="fa-solid fa-pen" />
                  </button>
                  ) : null}
                  {isAdmin ? (
                  <button
                    aria-label="Borrar"
                    onClick={() => handleDelete(exp)}
                    className="project-action-btn project-action-btn--delete"
                  >
                    <i className="fa-solid fa-trash" />
                  </button>
                  ) : null}
                </div>
              </div>
              <span className="experience-company">{exp.empresa}</span>
              <span className="experience-dates">
                {exp.mesInicio} {exp.anoInicio} -{" "}
                {exp.trabajoActivo ? "Actualidad" : `${exp.mesFin} ${exp.anoFin}`}
              </span>
            </div>
            <p className="experience-description">{exp.descripcion}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};
