import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getProyectos, deleteProyecto } from "../services/ProyectoService";
import { useAuth } from "../context/AuthContext.jsx";
import { MOCK_PROJECTS } from "../data/portfolioMockData";
import { buildApiUrl } from "../config/api";

const getProjectImageSrc = (image) => {
  if (!image) return null;
  if (/^https?:\/\//i.test(image)) return image;
  const raw = String(image).trim().replace(/\\/g, "/");
  if (raw.startsWith("/uploads/")) return buildApiUrl(raw);
  let path = raw.replace(/^\.?\/+/, "");
  if (path.startsWith("uploads/")) return buildApiUrl(path);
  if (path.startsWith("proyectos/")) return buildApiUrl(`uploads/${path}`);
  // filename suelto
  return buildApiUrl(`uploads/proyectos/${path}`);
};
 

// placeholder eliminado a petición: no mostrar imagen de relleno
const getProjectImageValue = (p) => {
  const candidates = [p?.imagen, p?.image, p?.imagenUrl, p?.img, p?.imagenPath, p?.imagePath];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim().length > 0) return c.trim();
  }
  return null;
};

//

const handleProjectImgError = (e) => {
  const img = e.currentTarget;
  try {
    if (!img.dataset.retry) {
      const url = new URL(img.src);
      const parts = url.pathname.split("/");
      const fname = parts.pop() || "";
      const lower = fname.toLowerCase();
      if (lower && lower !== fname) {
        parts.push(lower);
        url.pathname = parts.join("/");
        img.dataset.retry = "1";
        img.src = url.toString();
        return;
      }
    }
  } catch {
    void 0;
  }
  
  // sin placeholder
  img.style.display = "none";
};

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

export const Proyectos = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const gridRef = useRef(null);
  const [colCount, setColCount] = useState(1);
  const renderCard = (p) => (
    <motion.div
      key={p.id}
      className="project-card"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
    >
      {(() => {
        const value = getProjectImageValue(p);
        const src = value ? getProjectImageSrc(value) : null;
        return (
          <div
            className="project-image"
            style={{
              backgroundImage: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {src ? (
              <img
                src={src}
                alt={p.nombre}
                onError={handleProjectImgError}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : null}
          </div>
        );
      })()}
      <div className="project-header">
        <h3>{p.nombre}</h3>
        <motion.div className="project-actions">
          {(p.enlaceGithub || p.enlace) && (
            <a
              href={p.enlaceGithub || p.enlace}
              target="_blank"
              rel="noreferrer"
              aria-label={`Abrir GitHub de ${p.nombre}`}
              className="project-action-link"
            >
              <i className="fa-brands fa-github" />
            </a>
          )}
          {p.enlaceDespliegue && (
            <a
              href={p.enlaceDespliegue}
              target="_blank"
              rel="noreferrer"
              aria-label={`Abrir demo de ${p.nombre}`}
              className="project-action-link"
            >
              <i className="fa-solid fa-arrow-up-right-from-square" />
            </a>
          )}
          {isAdmin ? (
            <button
              aria-label="Editar"
              onClick={() => openEditForm(p)}
              className="project-action-btn project-action-btn--edit"
            >
              <i className="fa-solid fa-pen" />
            </button>
          ) : null}
          {isAdmin ? (
            <button
              aria-label="Borrar"
              onClick={() => handleDelete(p)}
              className="project-action-btn project-action-btn--delete"
            >
              <i className="fa-solid fa-trash" />
            </button>
          ) : null}
        </motion.div>
      </div>
      <p>{p.descripcion}</p>
      <div className="project-tech">
        {(p.tecnologias || []).map((t, idx) => (
          <span key={idx}>{t}</span>
        ))}
      </div>
    </motion.div>
  );

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

  const applyOrdered = useCallback((items) => {
    const list = Array.isArray(items) ? items.slice() : [];
    const total = list.length;
    const result = new Array(total);
    const taken = new Set();
    const floating = [];

    for (const it of list) {
      const pos = typeof it.posicion === "number" ? it.posicion : null;
      if (
        Number.isInteger(pos) &&
        pos >= 1 &&
        pos <= total &&
        !taken.has(pos)
      ) {
        result[pos - 1] = it;
        taken.add(pos);
      } else {
        floating.push(it);
      }
    }
    for (let i = floating.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [floating[i], floating[j]] = [floating[j], floating[i]];
    }
    let idx = 0;
    for (let i = 0; i < total; i++) {
      if (!result[i]) result[i] = floating[idx++];
    }
    return result.filter(Boolean);
  }, []);

  const fetchProyectos = useCallback(
    () =>
      getProyectos()
        .then((data) =>
          setProjects(applyOrdered(Array.isArray(data) ? data : []))
        )
        .catch((err) => {
          console.error("Error cargando proyectos", err);
          // Fallback visual si no hay backend.
          setProjects(applyOrdered(MOCK_PROJECTS));
        })
        .finally(() => setLoading(false)),
    [applyOrdered]
  );

  useEffect(() => {
    fetchProyectos();
  }, [fetchProyectos]);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const GAP = 32;
    const MIN = 300;
    const calc = () => {
      const w = el.clientWidth || el.offsetWidth || 0;
      const cols = Math.max(1, Math.floor((w + GAP) / (MIN + GAP)));
      setColCount(cols);
    };
    let ro = null;
    if (typeof window !== "undefined" && "ResizeObserver" in window) {
      ro = new ResizeObserver(calc);
      ro.observe(el);
    } else {
      window.addEventListener("resize", calc);
    }
    calc();
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", calc);
    };
  }, []);

  const openCreateForm = () => navigate("/admin/proyecto/nuevo");
  const openEditForm = (p) => navigate(`/admin/proyecto/${p.id}`);

  const handleDelete = async (p) => {
    const res = await swal.fire({
      icon: "question",
      title: "¿Eliminar proyecto?",
      text: p.nombre,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });
    if (res.isConfirmed) {
      try {
        await deleteProyecto(p.id);
        setProjects((prev) => applyOrdered(prev.filter((x) => x.id !== p.id)));
        await swal.fire({ icon: "success", title: "Eliminado" });
      } catch {
        await swal.fire({ icon: "error", title: "No se pudo eliminar" });
      }
    }
  };

  return (
    <motion.section
      id="proyectos"
      className="projects"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="section-header-wrapper">
        <motion.div
          className="section-header section-header--projects"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 className="section-header-title">Mis Proyectos</motion.h2>
          {isAdmin ? (
            <button
              aria-label="Añadir proyecto"
              title="Añadir proyecto"
              onClick={openCreateForm}
              className="xp-create-btn"
            >
              <span className="xp-plus">+</span>
            </button>
          ) : null}
        </motion.div>
      </div>

      <motion.div
        ref={gridRef}
        className={`project-grid${
          projects.length === 1
            ? " project-grid--1"
            : projects.length === 2
            ? " project-grid--2"
            : ""
        }`}
        variants={staggerContainer}
        initial={false}
        animate="animate"
      >
        {loading && (
          <motion.div variants={fadeInUp} className="project-card">
            <h3>Cargando proyectos...</h3>
          </motion.div>
        )}

        {!loading && projects.length === 0 && (
          <motion.div variants={fadeInUp} className="project-card">
            <h3>Sin proyectos todavía</h3>
            <p>Añade uno desde la consola para probar.</p>
          </motion.div>
        )}

        {(() => {
          const ordered = projects;
          if (ordered.length <= 2) return ordered.map(renderCard);
          const cols = Math.max(1, colCount);
          const rem = ordered.length % cols;
          if (rem === 0 || cols === 1) return ordered.map(renderCard);
          const pad = Math.floor((cols - rem) / 2);
          const head = ordered.slice(0, ordered.length - rem);
          const tail = ordered.slice(ordered.length - rem);
          return (
            <>
              {head.map(renderCard)}
              {Array.from({ length: pad }).map((_, i) => (
                <div
                  key={`sp-${i}`}
                  className="project-card project-spacer"
                  aria-hidden="true"
                />
              ))}
              {tail.map(renderCard)}
            </>
          );
        })()}
      </motion.div>
    </motion.section>
  );
};
