import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("hostel_token") || null);
  const [role, setRole] = useState(() => localStorage.getItem("hostel_role") || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("hostel_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token || !role) {
        setIsLoading(false);
        return;
      }
      if (role === "student") {
        try {
          const profile = await api.student.profile();
          setUser(profile);
          localStorage.setItem("hostel_user", JSON.stringify(profile));
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, [token, role]);

  const saveAuth = (newToken, newRole, userData = null) => {
    setToken(newToken);
    setRole(newRole);
    setUser(userData);
    localStorage.setItem("hostel_token", newToken);
    localStorage.setItem("hostel_role", newRole);
    if (userData) {
      localStorage.setItem("hostel_user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("hostel_user");
    }
  };

  const loginStudent = async (email, password) => {
    const res = await api.student.login({ email, password });
    localStorage.setItem("hostel_token", res.token);
    localStorage.setItem("hostel_role", "student");
    setToken(res.token);
    setRole("student");
    try {
      const profile = await api.student.profile();
      setUser(profile);
      localStorage.setItem("hostel_user", JSON.stringify(profile));
    } catch {
      setUser({ email });
    }
    return res;
  };

  const signupStudent = async (data) => {
    return await api.student.signup(data);
  };

  const verifyStudentOtp = async (email, otp) => {
    return await api.student.verifyOtp({ email, otp });
  };

  const resendStudentOtp = async (email) => {
    return await api.student.resendOtp({ email });
  };

  const loginSubAdmin = async (staffEmail, password) => {
    const res = await api.subadmin.login({ staffEmail, password });
    saveAuth(res.token, "subadmin", { staffEmail });
    return res;
  };

  const loginAdmin = async (email, password) => {
    const res = await api.admin.login({ email, password });
    saveAuth(res.token, "admin", { email });
    return res;
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    localStorage.removeItem("hostel_token");
    localStorage.removeItem("hostel_role");
    localStorage.removeItem("hostel_user");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        user,
        isLoading,
        isAuthenticated: !!token,
        loginStudent,
        signupStudent,
        verifyStudentOtp,
        resendStudentOtp,
        loginSubAdmin,
        loginAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
