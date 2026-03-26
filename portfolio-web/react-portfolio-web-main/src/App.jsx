import { useEffect, useState } from "react";
import { incrementVisits } from "./services/VisitsService";
import "./App.css";
import { Contacto } from "./components/Contacto";
import { Experiencia } from "./components/Experiencia";
import { Footer } from "./components/Footer";
import { Formacion } from "./components/Formacion";
import { Habilidades } from "./components/Habilidades";
import { CertificatesSlider } from "./components/CertificatesSlider";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { Proyectos } from "./components/Proyectos";
import emailjs from "@emailjs/browser";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsLoaded(true));
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (typeof publicKey === "string" && publicKey.trim()) emailjs.init(publicKey.trim());
    const VISIT_FLAG = '__VISIT_INCREMENTED__';
    if (!window[VISIT_FLAG]) {
      window[VISIT_FLAG] = true;
      incrementVisits().catch(() => {});
    }
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={`app ${isLoaded ? "loaded" : ""}`}>
      <Navbar />

      <Hero />
      <Proyectos />
      <Experiencia />
      <Formacion />
      <Habilidades />
      <CertificatesSlider />
      <Contacto />

      <Footer />
    </div>
  );
}

export default App;
