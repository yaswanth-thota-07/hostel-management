import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, ROLE_ROUTES } from "./context/AuthContext";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { VerifyOTP } from "./pages/VerifyOTP";
import { StudentDashboard } from "./pages/StudentDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { SubAdminDashboard } from "./pages/SubAdminDashboard";
import { HelpButton } from "./components/HelpButton";

function RequireRole({ role, children }) {
  const { auth } = useAuth();
  if (!auth?.token) return <Navigate to="/login" replace />;
  if (auth.role !== role) return <Navigate to={ROLE_ROUTES[auth.role] || "/login"} replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route
          path="/student"
          element={
            <RequireRole role="student">
              <StudentDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireRole role="admin">
              <AdminDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/subadmin"
          element={
            <RequireRole role="subadmin">
              <SubAdminDashboard />
            </RequireRole>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <HelpButton />
    </BrowserRouter>
  );
}