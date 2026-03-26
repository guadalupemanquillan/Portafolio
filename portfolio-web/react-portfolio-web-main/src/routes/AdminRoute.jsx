import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminRoute({ children }) {
  const { loading, authenticated, isAdmin } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!authenticated || !isAdmin) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
