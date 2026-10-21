import { createContext, useContext, useState, useCallback } from "react";

const STORAGE_KEY = "hoste.auth";

const AuthContext = createContext(null);

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStored);

  const login = useCallback((role, token, identity) => {
    const next = { role, token, identity: identity || {} };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setAuth(next);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export const ROLE_LABELS = {
  student: "Student",
  admin: "Admin",
  subadmin: "Staff"
};

export const ROLE_ROUTES = {
  student: "/student",
  admin: "/admin",
  subadmin: "/subadmin"
};