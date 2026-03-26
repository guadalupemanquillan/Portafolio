// Edita este archivo para personalizar tu portafolio.
// Si no hay backend corriendo, las secciones usarán estos datos como fallback.

export const PROFILE = {
  fullName: "ROCIO GUADALUPE MANQUILLAN",
  // Lo que aparece como “morphing text” bajo tu nombre.
  subtitleItems: [
    "Data Engineer",
    "Frontend",
    "Backend",
    "Full Stack",
  ],
  // Texto del párrafo principal.
  aboutDescription:
    "Full Stack Developer con experiencia en desarrollo end-to-end de aplicaciones web, desde diseño e implementación de APIs REST en Node.js hasta construcción de interfaces modulares en Angular. Experiencia en modelado de datos en MongoDB, manejo de errores en endpoints y comunicación en tiempo real mediante WebSockets. Participación en refactorización de sistemas productivos y trabajo remoto bajo modalidad contractor.",
  // Bloque de “código” del Hero (solo para estética).
  aboutMeCode: {
    codename: "ROCIO GUADALUPE MANQUILLAN",
    origin: "🌍 Chubut - Argentina",
    role: "Full Stack Developer (Junior)",
    stack: {
      languages: ["JavaScript (ES6+)", "TypeScript", "HTML", "CSS"],
      frameworks: ["Angular", "Node.js", "Express"],
      databases: ["MongoDB"],
    },
    traits: [
      "Arquitectura modular de aplicaciones",
      "Pensamiento estructurado en frontend y backend",
      "Trabajo colaborativo remoto",
      "Aprendizaje continuo",
    ],
    missionStatement:
      "Transformar requerimientos en soluciones escalables y mantenibles",
    availability: "Open to Remote Work",
  },
  // Se usa para generar el botón “Descarga mi CV”.
  // Puedes dejarlo como ruta local/public si ya tienes el PDF.
  cvUrl: "/uploads/cv/cv.pdf",
  cvDownloadName: "_ROCIO GUADALUPE MANQUILLAN - fullstack (2).pdf",
  social: [
    { label: "GitHub", href: "https://github.com/guadalupeman" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/lelupech/" },
  ],
};

export const MOCK_PROJECTS = [
  {
    id: 1,
    nombre: "Plataforma de Mensajería Escalable (tipo Slack)",
    descripcion:
      "Desarrollo frontend en Angular con arquitectura modular. Backend básico en Node.js para manejo de eventos y lógica de comunicación. Integración de WebSockets para mensajería en tiempo real. Desarrollo de encriptador de textos para protección de mensajes. Integración con MongoDB para almacenamiento de datos.",
    enlaceGithub: "",
    enlaceDespliegue: "",
    tecnologias: ["Angular", "Node.js", "WebSockets (Socket.io)"],
    posicion: 1,
    imagen: null,
  },
  {
    id: 2,
    nombre: "Plataforma Educativa Interna",
    descripcion:
      "Frontend estructurado por categorías dinámicas en Angular. Implementación de lógica de filtrado en TypeScript. Integración con APIs REST y persistencia en MongoDB. Diseño de arquitectura escalable para incorporación de nuevos módulos.",
    enlaceGithub: "",
    enlaceDespliegue: "",
    tecnologias: ["Angular", "TypeScript", "MongoDB"],
    posicion: 2,
    imagen: null,
  },
];

export const MOCK_EXPERIENCES = [
  {
    id: 1,
    puesto: "Full Stack Developer (Junior)",
    empresa: "Nexus Software",
    descripcion:
      "Ingresé como Trainee Developer y evolucioné a Junior Full Stack Developer, participando activamente en el desarrollo end-to-end de un CRM corporativo y aplicaciones internas.\n\n- Desarrollo de frontend en Angular utilizando TypeScript, arquitectura modular y componentes reutilizables.\n- Diseño e implementación de APIs REST desde cero con Node.js y Express.\n- Desarrollo de endpoints y definición de rutas para módulos del sistema (usuarios, mensajería, contenidos, citas).\n- Implementación de operaciones CRUD conectadas a MongoDB.\n- Modelado de colecciones y consultas para persistencia y recuperación eficiente.\n- Organización de estructura de carpetas y separación de responsabilidades en backend (rutas, controladores, modelos).\n- Integración de APIs externas y conexión de servicios para ampliar funcionalidades.\n- Implementación de flujo end-to-end: desde interfaz frontend hasta lógica backend y base de datos.\n- Desarrollo de funcionalidades en tiempo real mediante WebSockets (Socket.io).\n- Refactorización y unificación de más de 100 componentes del CRM.\n- Estandarización de estructura de estilos para reducir incidencias de UI en producción.\n- Testing básico previo a despliegue.\n- Gestión de Pull Requests y colaboración técnica mediante Git y GitHub.\n- Validaciones y manejo estructurado de errores en endpoints REST.",
    mesInicio: "Octubre",
    anoInicio: 2024,
    trabajoActivo: true,
    mesFin: null,
    anoFin: null,
  },
];

export const MOCK_FORMACION = [
  {
    id: 1,
    nombre: "Licenciatura en Ingeniería Informática (en curso)",
    centro: "La Universidad de Tech",
    mesInicio: "Enero",
    anoInicio: 2024,
    cursandoAhora: true,
    mesFin: null,
    anoFin: null,
  },
  {
    id: 2,
    nombre: "Formación en Frontend (Angular y JavaScript)",
    centro: "Alura",
    mesInicio: "Enero",
    anoInicio: 2023,
    cursandoAhora: false,
    mesFin: "Junio",
    anoFin: 2023,
  },
  {
    id: 3,
    nombre: "Técnico Superior en Programación",
    centro: "Teclab Instituto Técnico Superior",
    mesInicio: "Marzo",
    anoInicio: 2021,
    cursandoAhora: false,
    mesFin: "Diciembre",
    anoFin: 2022,
  },
  {
    id: 4,
    nombre: "Estudiante de Desarrollo de Software",
    centro: "Universidad del Chubut",
    mesInicio: "Marzo",
    anoInicio: 2020,
    cursandoAhora: false,
    mesFin: "Febrero",
    anoFin: 2021,
  },
];

export const MOCK_SKILLS = [
  { id: 1, name: "Angular", image: null, category: "frontend", posicion: 1 },
  { id: 2, name: "TypeScript", image: null, category: "frontend", posicion: 2 },
  { id: 3, name: "JavaScript (ES6+)", image: null, category: "frontend", posicion: 3 },
  { id: 4, name: "Node.js", image: null, category: "backend", posicion: 4 },
  { id: 5, name: "Express", image: null, category: "backend", posicion: 5 },
  { id: 6, name: "MongoDB", image: null, category: "database", posicion: 6 },
  { id: 7, name: "REST APIs", image: null, category: "backend", posicion: 7 },
  { id: 8, name: "WebSockets (Socket.io)", image: null, category: "backend", posicion: 8 },
  { id: 9, name: "API Integrations + SDKs", image: null, category: "tools", posicion: 9 },
  { id: 10, name: "Git / GitHub / PRs", image: null, category: "tools", posicion: 10 },
];

/** Fallback si la API de certificados no está disponible */
export const MOCK_CERTIFICATES = [
  {
    id: "mock-c1",
    title: "Power BI + IA",
    issuer: "Acelerador de Carrera",
    issuedDate: "2025-06-15",
    fileUrl: "",
    credentialUrl: "",
    mediaType: "image",
    featured: true,
    visible: true,
    posicion: 1,
  },
  {
    id: "mock-c2",
    title: "Data Engineering",
    issuer: "Plataforma X",
    issuedDate: "2025-03-20",
    fileUrl: "",
    credentialUrl: "",
    mediaType: "image",
    featured: false,
    visible: true,
    posicion: 2,
  },
  {
    id: "mock-c3",
    title: "Leadership & Personal Development",
    issuer: "MPH",
    issuedDate: "2024-11-01",
    fileUrl: "",
    credentialUrl: "",
    mediaType: "image",
    featured: false,
    visible: true,
    posicion: 3,
  },
];

