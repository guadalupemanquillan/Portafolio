import { motion } from "framer-motion";
import { useState } from "react";
import Swal from "sweetalert2";
import { createContact } from "../services/ContactService";
import emailjs from "@emailjs/browser";

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

export const Contacto = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = { name: "", email: "", message: "" };
    if (!formData.name.trim()) next.name = "Por favor, indica tu nombre.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) next.email = "Por favor, indica tu email.";
    else if (!emailRegex.test(formData.email)) next.email = "El email no es válido.";
    if (!formData.message.trim()) next.message = "Por favor, escribe tu mensaje.";
    setErrors(next);
    return !next.name && !next.email && !next.message;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormStatus({
      submitting: true,
      success: false,
      error: false,
      message: "",
    });

    // Validación personalizada
    if (!validate()) {
      setFormStatus({ submitting: false, success: false, error: true, message: "" });
      const issues = [errors.name, errors.email, errors.message].filter(Boolean);
      const current = issues.length
        ? issues
        : [
            !formData.name.trim() && "Por favor, indica tu nombre.",
            !formData.email.trim()
              ? "Por favor, indica tu email."
              : !/^([^\s@]+@[^\s@]+\.[^\s@]+)$/.test(formData.email) && "El email no es válido.",
            !formData.message.trim() && "Por favor, escribe tu mensaje.",
          ].filter(Boolean);

      swal.fire({
        icon: "warning",
        title: "Revisa el formulario",
        html: `<ul style="text-align:left;margin:0;padding-left:18px;">${current
          .map((m) => `<li>${m}</li>`)
          .join("")}</ul>`,
      });
      return;
    }

    try {
      await createContact({
        email: formData.email,
        asunto: "Mensaje desde portfolio React",
        mensaje: formData.message,
      });

      setFormStatus({
        submitting: false,
        success: true,
        error: false,
        message: "",
      });

      swal.fire({
        icon: "success",
        title: "¡Mensaje enviado!",
        text: "Te responderé cuanto antes.",
      });

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      // Fallback sin backend: enviar con EmailJS desde el navegador.
      try {
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const pk = typeof publicKey === "string" ? publicKey.trim() : "";
        const sid = typeof serviceId === "string" ? serviceId.trim() : "";
        const tid = typeof templateId === "string" ? templateId.trim() : "";

        console.log("[EmailJS env]", {
          hasPublicKey: Boolean(pk),
          hasServiceId: Boolean(sid),
          hasTemplateId: Boolean(tid),
        });

        if (!pk || !sid || !tid) throw new Error("Faltan variables EmailJS");

        await emailjs.send(
          sid,
          tid,
          {
            from_name: formData.name,
            from_email: formData.email,
            asunto: "Mensaje desde portfolio React",
            message: formData.message,
          },
          { publicKey: pk }
        );

        setFormStatus({
          submitting: false,
          success: true,
          error: false,
          message: "",
        });

        swal.fire({
          icon: "success",
          title: "¡Mensaje enviado!",
          text: "Te responderé cuanto antes.",
        });

        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } catch (err) {
        setFormStatus({
          submitting: false,
          success: false,
          error: true,
          message: "",
        });

        const msg =
          err?.text ||
          err?.message ||
          "EmailJS no está disponible (o Vite no leyó el .env). Verifica VITE_EMAILJS_PUBLIC_KEY / SERVICE_ID / TEMPLATE_ID y reinicia `npm run dev`.";

        swal.fire({
          icon: "error",
          title: "No se ha podido enviar",
          text: msg,
        });
      }
    }
  };

  return (
    <motion.section
      id="contacto"
      className="contact"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        viewport={{ once: true }}
      >
        Ponte en contacto
      </motion.h2>
      <motion.div className="contact-content" variants={fadeInUp}>
        <motion.form className="contact-form" onSubmit={handleSubmit} noValidate>
          <motion.input
            type="text"
            name="name"
            placeholder="Tu nombre..."
            required
            whileFocus={{ scale: 1.02 }}
            value={formData.name}
            onChange={handleInputChange}
            style={
              errors.name
                ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239,68,68,0.12)" }
                : {}
            }
          />
          {errors.name && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="field-error"
              style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: 6 }}
            >
              {errors.name}
            </motion.div>
          )}
          <motion.input
            type="email"
            name="email"
            placeholder="Tu email..."
            required
            whileFocus={{ scale: 1.02 }}
            value={formData.email}
            onChange={handleInputChange}
            style={
              errors.email
                ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239,68,68,0.12)" }
                : {}
            }
          />
          {errors.email && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="field-error"
              style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: 6 }}
            >
              {errors.email}
            </motion.div>
          )}
          <motion.textarea
            name="message"
            placeholder="Tu mensaje..."
            required
            whileFocus={{ scale: 1.02 }}
            value={formData.message}
            onChange={handleInputChange}
            style={
              errors.message
                ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239,68,68,0.12)" }
                : {}
            }
          />
          {errors.message && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="field-error"
              style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: 6 }}
            >
              {errors.message}
            </motion.div>
          )}
          <motion.button
            className="submit-btn"
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={formStatus.submitting}
          >
            {formStatus.submitting ? "Enviando..." : "Enviar mensaje"}
          </motion.button>
          {formStatus.message && (
            <motion.div
              className={`form-status ${
                formStatus.success ? "success" : "error"
              }`}
            >
              {formStatus.message}
            </motion.div>
          )}
        </motion.form>
      </motion.div>
    </motion.section>
  );
};
