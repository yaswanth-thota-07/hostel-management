import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "../router.jsx";

export default function Navbar() {
  const { isAuthenticated, role } = useAuth();

  const getDashboardUrl = () => {
    if (role === "student") return "/student/complaints";
    if (role === "subadmin") return "/staff/complaints";
    if (role === "admin") return "/admin/dashboard";
    return "#login";
  };

  return (
    <nav className="navbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <span className="brand-mark-inner" />
        </span>
        <div className="brand-text">
          <span className="brand-name">HOSTEL HUB</span>
          <span className="brand-sub">Smart Hostel Management System</span>
        </div>
      </div>

      <div className="nav-links">
        <a href="#hero" className="nav-link">
          Overview
        </a>
        <a href="#features" className="nav-link">
          Features
        </a>
        <a href="#login" className="nav-link">
          Access
        </a>
        {isAuthenticated ? (
          <Link to={getDashboardUrl()} className="pill-btn pill-btn-primary nav-cta">
            Open Portal
          </Link>
        ) : (
          <a href="#login" className="pill-btn pill-btn-primary nav-cta">
            Sign In
          </a>
        )}
      </div>
    </nav>
  );
}
