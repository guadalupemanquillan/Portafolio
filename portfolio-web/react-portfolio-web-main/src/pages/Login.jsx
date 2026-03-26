import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { login, getStatus } from "../services/AuthService";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { refresh } = useAuth();

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
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return;
    setLoading(true);
    try {
      await login(form.username.trim(), form.password);
      const st = await getStatus();
      if (st?.authenticated) {
        await refresh();
        await swal.fire({ icon: "success", title: `Hola ${st.username}` });
        navigate("/", { replace: true });
      } else {
        await swal.fire({ icon: "error", title: "Credenciales inválidas" });
      }
    } catch {
      await swal.fire({ icon: "error", title: "No se pudo iniciar sesión" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className="experience"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="experience-card admin-form"
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ width: 420, maxWidth: "92vw", padding: "1.5rem 1.75rem" }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Iniciar sesión</h2>
        <div style={{ display: "grid", gap: ".75rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
            <label className="admin-label" htmlFor="username">Usuario</label>
            <input
              id="username"
              name="username"
              className="admin-input"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              placeholder="Usuario"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
            <label className="admin-label" htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              className="admin-input"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              placeholder="Contraseña"
            />
          </div>
          <div style={{ display: "flex", gap: ".5rem", justifyContent: "center" }}>
            <button type="submit" disabled={loading} className="swal-portfolio-confirm" style={{ cursor: loading ? "default" : "pointer" }}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <button
              type="button"
              className="swal-portfolio-cancel"
              style={{ cursor: "pointer" }}
              onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
            >
              Cerrar
            </button>
          </div>
        </div>
      </motion.form>
    </motion.section>
  );
}
