import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MorphingText } from "./ui/MorphingText";
import { PROFILE } from "../data/portfolioMockData";

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

export const Hero = () => {
  // Descarga de CV sin backend: archivo estático dentro de `public/uploads/cv/cv.pdf`.
  const cvUrl = PROFILE.cvUrl;
  return (
    <motion.section
      id="home"
      className="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="hero-container">
        {/* Fila 1: saludo + nombre a todo el ancho (no tapa la columna del código) */}
        <motion.div
          className="hero-headline"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div className="hero-intro" variants={fadeInUp}>
            <span className="intro-icon" aria-hidden="true">
              👋
            </span>
            <span className="intro-text">Hola, soy</span>
            <span className="intro-caret" aria-hidden="true"></span>
          </motion.div>
          <motion.h1
            className="glitch hero-title"
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
          >
            {PROFILE.fullName}
          </motion.h1>
        </motion.div>

        {/* Fila 2: texto a la izquierda | bloque código a la derecha */}
        <div className="hero-columns">
          <motion.div
            className="hero-content"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <MorphingText
              className="hero-subtitle"
              variants={fadeInUp}
              texts={PROFILE.subtitleItems}
            />
            <motion.p className="hero-description" variants={fadeInUp}>
              {PROFILE.aboutDescription}
            </motion.p>
            <motion.div className="cta-buttons" variants={staggerContainer}>
              <motion.a
                href="#proyectos"
                className="cta-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver Mi Trabajo
              </motion.a>
              <motion.a
                href="#contacto"
                className="cta-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contáctame
              </motion.a>
              <motion.a
                href={cvUrl}
                className="cta-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                target="_blank"
                rel="noopener noreferrer"
                download={PROFILE.cvDownloadName || undefined}
              >
                Descarga mi CV
              </motion.a>
            </motion.div>
            <motion.div className="social-links" variants={staggerContainer}>
              {PROFILE.social.map((s) => (
                <motion.a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                  {s.label === "GitHub" ? (
                    <i className="fab fa-github"></i>
                  ) : null}
                  {s.label === "LinkedIn" ? (
                    <i className="fab fa-linkedin"></i>
                  ) : null}
                  {s.label === "Instagram" ? (
                    <i className="fab fa-instagram"></i>
                  ) : null}
                  {s.label === "X" ? (
                    <i className="fab fa-x-twitter"></i>
                  ) : null}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-image-container"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
          <div className="code-display">
            <SyntaxHighlighter
              language="javascript"
              customStyle={{
                margin: 0,
                padding: "clamp(1rem, 2.5vw, 2rem)",
                maxWidth: "100%",
                overflowX: "auto",
                borderRadius: "20px",
                background: "rgba(30,41,59,0.8)",
                backdropFilter: "blur(10px)",
                marginBottom: 0,
                fontSize: "clamp(0.7rem, 1.35vw, 0.95rem)",
              }}
              style={vscDarkPlus}
            >
              {`const aboutMe: DeveloperProfile = {
  codename: "${PROFILE.aboutMeCode.codename}",
  origin: "${PROFILE.aboutMeCode.origin}",
  role: "${PROFILE.aboutMeCode.role}",
  stack: {
    languages: ${JSON.stringify(PROFILE.aboutMeCode.stack.languages)},
    frameworks: ${JSON.stringify(PROFILE.aboutMeCode.stack.frameworks)},
    databases: ${JSON.stringify(PROFILE.aboutMeCode.stack.databases)}
  },
  traits: ${JSON.stringify(PROFILE.aboutMeCode.traits)},
  missionStatement: "${PROFILE.aboutMeCode.missionStatement}",
  availability: "${PROFILE.aboutMeCode.availability}",
};`}
            </SyntaxHighlighter>
          </div>

          <motion.div
            className="floating-card"
            /* Menos movimiento vertical para que no “suba” encima del código */
            animate={{ y: [0, -4, 0], rotate: [0, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="card-content">
              <span className="card-icon"> 💻 </span>
              <span className="card-text">Construyendo soluciones reales con código limpio y escalable.!</span>
              <span className="card-icon"> 💻 </span>
            </div>
          </motion.div>
        </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
