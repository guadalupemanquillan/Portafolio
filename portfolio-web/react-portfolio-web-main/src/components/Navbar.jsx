import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { logout as apiLogout } from "../services/AuthService";
import { getVisits } from "../services/VisitsService";
import { uploadCv } from "../services/CvService";
import Swal from "sweetalert2";

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

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, refresh } = useAuth();
  const [visits, setVisits] = useState(null);
  const fileRef = useRef(null);

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

  const handleLogout = async () => {
    try {
      await apiLogout();
    } finally {
      refresh();
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    let active = true;
    getVisits()
      .then((data) => {
        if (active) setVisits(typeof data?.total === "number" ? data.total : null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const triggerUpload = () => {
    if (fileRef.current) fileRef.current.click();
  };

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset for next upload
    if (!file) return;
    if (!(file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))) {
      await swal.fire({ icon: "error", title: "Selecciona un PDF" });
      return;
    }
    const confirm = await swal.fire({
      icon: "question",
      title: "¿Actualizar CV?",
      text: file.name,
      showCancelButton: true,
      confirmButtonText: "Subir",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;
    try {
      await uploadCv(file);
      await swal.fire({ icon: "success", title: "CV actualizado" });
      // no-op: Hero usa ruta fija /uploads/cv/cv.pdf
    } catch {
      await swal.fire({ icon: "error", title: "No se pudo subir el CV" });
    }
  };

  const links = [
    { href: "#home", label: "Home" },
    { href: "#proyectos", label: "Proyectos" },
    { href: "#experiencia", label: "Experiencia" },
    { href: "#formacion", label: "Formación" },
    { href: "#habilidades", label: "Habilidades" },
    { href: "#certificados", label: "Certificados" },
    { href: "#contacto", label: "Contacto" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="logo"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ display: "flex", alignItems: "center", gap: ".75rem" }}
      >
        <span>Portfolio</span>
        {isAdmin ? (
          <button
            onClick={handleLogout}
            className="nav-logout-btn"
            aria-label="Cerrar sesión"
            style={{
              border: "1px solid var(--card-border)",
              background: "transparent",
              color: "var(--text-color)",
              borderRadius: 10,
              padding: "6px 10px",
              fontSize: ".9rem",
            }}
          >
            Cerrar sesión
          </button>
        ) : null}
        {isAdmin ? (
          <span style={{ color: "var(--light-text)", fontSize: ".9rem" }} title="Visitas totales">
            {visits === null ? "…" : `Visitas: ${visits}`}
          </span>
        ) : null}
        {isAdmin ? (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              onChange={onFileChange}
              style={{ display: "none" }}
            />
            <button
              onClick={triggerUpload}
              className="nav-upload-btn"
              aria-label="Actualizar CV"
              style={{
                border: "1px solid var(--card-border)",
                background: "transparent",
                color: "var(--text-color)",
                borderRadius: 10,
                padding: "6px 10px",
                fontSize: ".9rem",
              }}
            >
              Actualizar CV
            </button>
          </>
        ) : null}
      </motion.div>

      <motion.ul
        className="nav-links nav-links-desktop"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {links.map((link) => (
          <motion.li
            key={link.href}
            variants={fadeInUp}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <a href={link.href}>{link.label}</a>
          </motion.li>
        ))}
      </motion.ul>

      <motion.button
        className={`nav-toggle ${isOpen ? "open" : ""}`}
        whileTap={{ scale: 0.9 }}
        aria-label="Abrir menú de navegación"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span></span>
        <span></span>
        <span></span>
      </motion.button>

      <motion.div
        className="nav-mobile"
        initial={false}
        animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <motion.ul
          className="nav-mobile-list"
          variants={staggerContainer}
          initial="initial"
          animate={isOpen ? "animate" : "initial"}
        >
          {links.map((link) => (
            <motion.li
              key={link.href}
              variants={fadeInUp}
              whileTap={{ scale: 0.97 }}
            >
              <a href={link.href} onClick={handleLinkClick}>
                {link.label}
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </motion.nav>
  );
};
