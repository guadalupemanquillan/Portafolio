import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import AdminExperienciaForm from './pages/AdminExperienciaForm.jsx'
import AdminFormacionForm from './pages/AdminFormacionForm.jsx'
import AdminHabilidadForm from './pages/AdminHabilidadForm.jsx'
import AdminProyectoForm from './pages/AdminProyectoForm.jsx'
import AdminCertificadoForm from './pages/AdminCertificadoForm.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import AdminRoute from './routes/AdminRoute.jsx'
import axios from 'axios'

axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin/experiencia/nuevo" element={<AdminRoute><AdminExperienciaForm /></AdminRoute>} />
        <Route path="/admin/experiencia/:id" element={<AdminRoute><AdminExperienciaForm /></AdminRoute>} />
        <Route path="/admin/formacion/nuevo" element={<AdminRoute><AdminFormacionForm /></AdminRoute>} />
        <Route path="/admin/formacion/:id" element={<AdminRoute><AdminFormacionForm /></AdminRoute>} />
        <Route path="/admin/habilidad/nuevo" element={<AdminRoute><AdminHabilidadForm /></AdminRoute>} />
        <Route path="/admin/habilidad/:id" element={<AdminRoute><AdminHabilidadForm /></AdminRoute>} />
        <Route path="/admin/proyecto/nuevo" element={<AdminRoute><AdminProyectoForm /></AdminRoute>} />
        <Route path="/admin/proyecto/:id" element={<AdminRoute><AdminProyectoForm /></AdminRoute>} />
        <Route path="/admin/certificado/nuevo" element={<AdminRoute><AdminCertificadoForm /></AdminRoute>} />
        <Route path="/admin/certificado/:id" element={<AdminRoute><AdminCertificadoForm /></AdminRoute>} />
        <Route path="/login" element={<Login />} />
        {/* No hay panel /admin único: redirige al login; las rutas reales son /admin/proyecto/..., etc. */}
        <Route path="/admin" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
