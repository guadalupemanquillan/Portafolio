import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getHabilidades, deleteHabilidad } from "../services/HabilidadService";
import { useAuth } from "../context/AuthContext.jsx";
import { MOCK_SKILLS } from "../data/portfolioMockData";
import { buildApiUrl } from "../config/api";

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

const DEFAULT_SKILL_IMG =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#7c3aed"/>
          <stop offset="1" stop-color="#db2777"/>
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="80" height="80" rx="18" fill="rgba(15,23,42,0.2)" stroke="url(#g)" stroke-width="2"/>
      <path d="M28 54 L40 42 L48 50 L60 38 L68 46 L48 66 Z" fill="url(#g)" opacity="0.9"/>
    </svg>`
  );

const getSkillImageSrc = (image) => {
  if (!image) return DEFAULT_SKILL_IMG;
  if (/^https?:\/\//i.test(image)) return image;
  let path = String(image).trim().replace(/\\/g, "/").replace(/^\.?\/+/, "");
  if (path.startsWith("uploads/")) return buildApiUrl(path);
  if (path.startsWith("habilidades/")) return buildApiUrl(`uploads/${path}`);
  return buildApiUrl(`uploads/habilidades/${path}`);
};

const handleSkillImageError = (event) => {
  event.currentTarget.src = DEFAULT_SKILL_IMG;
};


const hexToRgb = (hex) => {
  const m = hex.replace('#','').match(/.{1,2}/g);
  if (!m) return [244, 114, 182];
  const [r,g,b] = m.map((x) => parseInt(x, 16));
  return [r,g,b];
};

const rgba = (rgb, a) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a})`;

export const Habilidades = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dynamicColors, setDynamicColors] = useState({});
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

  const applyOrdered = useCallback((items) => {
    const list = Array.isArray(items) ? items.slice() : [];
    const total = list.length;
    const result = new Array(total);
    const taken = new Set();
    const floating = [];

    for (const sk of list) {
      const pos = typeof sk.posicion === 'number' ? sk.posicion : null;
      if (Number.isInteger(pos) && pos >= 1 && pos <= total && !taken.has(pos)) {
        result[pos - 1] = sk;
        taken.add(pos);
      } else {
        floating.push(sk);
      }
    }

    for (let i = floating.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [floating[i], floating[j]] = [floating[j], floating[i]];
    }
    let idx = 0;
    for (let i = 0; i < total; i++) {
      if (!result[i]) {
        result[i] = floating[idx++];
      }
    }
    return result.filter(Boolean);
  }, []);

  useEffect(() => {
    getHabilidades()
      .then((data) => {
        console.log("HABILIDADES BACKEND:", data);
  
        const base = Array.isArray(data) ? data : [];
        setSkills(applyOrdered(base));
      })
      .catch((err) => {
        console.error("Error cargando habilidades", err);
        setSkills(applyOrdered(MOCK_SKILLS));
      })
      .finally(() => setLoading(false));
  }, [applyOrdered]);

  const computeDominantHex = (imgEl) => {
    try {
      const w = Math.max(1, Math.min(48, imgEl.naturalWidth));
      const h = Math.max(1, Math.min(48, imgEl.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const rw = imgEl.naturalWidth || w;
      const rh = imgEl.naturalHeight || h;
      ctx.drawImage(imgEl, 0, 0, rw, rh, 0, 0, 32, 32);
      const data = ctx.getImageData(0, 0, 32, 32).data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha < 16) continue;
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
      if (!count) return null;
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);
      const toHex = (n) => n.toString(16).padStart(2, "0");
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    } catch {
      return null;
    }
  };

  const handleSpotMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty('--spot-x', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--spot-y', `${(py * 100).toFixed(1)}%`);
  };

  const handleSpotLeave = (e) => {
    const el = e.currentTarget;
    el.style.setProperty('--spot-x', `50%`);
    el.style.setProperty('--spot-y', `50%`);
  };

  const handleImgLoadColor = (e, skillId) => {
    const el = e.currentTarget;
    const hex = computeDominantHex(el);
    if (hex) {
      setDynamicColors((prev) => (prev[skillId] ? prev : { ...prev, [skillId]: hex }));
    }
  };

  const openCreateForm = () => navigate("/admin/habilidad/nuevo");
  const openEditForm = (sk) => navigate(`/admin/habilidad/${sk.id}`);

  const handleDelete = async (sk) => {
    const res = await swal.fire({
      icon: "question",
      title: "¿Eliminar habilidad?",
      text: `${sk.name}`,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });
    if (res.isConfirmed) {
      try {
        await deleteHabilidad(sk.id);
        setSkills((prev) => applyOrdered(prev.filter((s) => s.id !== sk.id)));
        await swal.fire({ icon: "success", title: "Eliminada" });
      } catch {
        await swal.fire({ icon: "error", title: "No se pudo eliminar" });
      }
    }
  };

  const allItems = skills;

  return (
    <motion.section
      id="habilidades"
      className="skills"
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
          className="section-header section-header--skills"
        >
          <motion.h2 className="section-header-title">Habilidades Técnicas</motion.h2>
          {isAdmin ? (
          <button
            onClick={openCreateForm}
            aria-label="Añadir habilidad"
            title="Añadir habilidad"
            className="xp-create-btn"
          >
            <span className="xp-plus">+</span>
          </button>
          ) : null}
        </motion.div>
      </div>

      {/* Grid */}
      <motion.div
        className="stack-grid"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        {loading && skills.length === 0 ? (
          <p className="loading-text" style={{ width: "100%", textAlign: "center" }}>Cargando habilidades...</p>
        ) : null}

        {allItems.map((skill) => {
          const extractedHex = dynamicColors[skill.id];
          const brandHex = extractedHex || '#f472b6';
          const rgb = hexToRgb(brandHex);
          const cardStyle = {
            background: rgba(rgb, 0.12),
            borderColor: rgba(rgb, 0.45),
            '--stack-color': brandHex,
          };
          const btnStyle = {
            background: rgba(rgb, 0.16),
            borderColor: rgba(rgb, 0.52),
            color: rgba(rgb, 0.96),
          };
          return (
          <motion.div
            key={skill.id}
            className={`stack-item`}
            variants={fadeInUp}
            style={cardStyle}
            onMouseMove={handleSpotMove}
            onMouseLeave={handleSpotLeave}
          >
            <div className="stack-icon">
              <img
                src={getSkillImageSrc(skill.image)}
                alt={skill.name}
                crossOrigin="anonymous"
                onError={handleSkillImageError}
                onLoad={(e) => handleImgLoadColor(e, skill.id)}
              />
            </div>
            <div className="stack-pill">
              <div className="stack-item-name">{skill.name}</div>
            </div>
            {isAdmin ? (
            <div className="stack-actions">
              <button
                aria-label="Editar"
                onClick={() => openEditForm(skill)}
                className="project-action-btn project-action-btn--edit project-action-btn--sm"
                style={btnStyle}
              >
                <i className="fa-solid fa-pen" />
              </button>
              <button
                aria-label="Borrar"
                onClick={() => handleDelete(skill)}
                className="project-action-btn project-action-btn--delete project-action-btn--sm"
                style={btnStyle}
              >
                <i className="fa-solid fa-trash" />
              </button>
            </div>
            ) : null}
          </motion.div>
        );
        })}
      </motion.div>
    </motion.section>
  );
}
