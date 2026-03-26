import { createContext, useContext, useEffect, useState } from "react";
import { getStatus } from "../services/AuthService";

const AuthCtx = createContext({ authenticated: false, username: null, role: null, isAdmin: false, loading: true, refresh: () => {} });

export function AuthProvider({ children }) {
  const [state, setState] = useState({ authenticated: false, username: null, role: null });
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    getStatus()
      .then((st) => {
        setState({ authenticated: !!st?.authenticated, username: st?.username || null, role: st?.role || null });
      })
      .catch(() => {
        setState({ authenticated: false, username: null, role: null });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const id = requestAnimationFrame(() => refresh());
    return () => cancelAnimationFrame(id);
  }, []);

  const value = {
    authenticated: state.authenticated,
    username: state.username,
    role: state.role,
    isAdmin: state.role === "ROLE_ADMIN",
    loading,
    refresh,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
