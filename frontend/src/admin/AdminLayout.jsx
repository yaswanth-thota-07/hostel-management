import { useState } from "react";
import { Link, usePath, navigate } from "../router.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "../student/student.css";

const NAV_ITEMS = [
  { label: "Complaint Register", to: "/admin/dashboard", aliases: ["/warden/dashboard"] },
  { label: "Staff Management", to: "/admin/staff", aliases: ["/warden/staff", "/warden/subadmins", "/admin/subadmins"] },
];

export default function AdminLayout({ children }) {
  const path = usePath();
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate("/");
  };

  return (
    <div className="student-layout-root">
      <aside className="student-sidebar">
        <div className="student-sidebar-top">
          <Link to="/admin/dashboard" className="brand">
            <img src="/logo11.png" alt="Hostel Logo" className="brand-logo-img" />
            <div className="brand-text">
              <span className="brand-name">Hostel Management</span>
              <span className="brand-sub">Admin Portal</span>
            </div>
          </Link>

          <nav className="student-nav" aria-label="Admin navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = path === item.to || (item.aliases && item.aliases.includes(path));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    isActive
                      ? "student-nav-link student-nav-link-active"
                      : "student-nav-link"
                  }
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="student-sidebar-bottom">
          <div className="user-badge">
            <div className="user-badge-info">
              <span className="user-badge-name">{user?.name || "Hostel Admin"}</span>
              <span className="user-badge-sub">{user?.email || "admin@hostel.com"}</span>
            </div>
          </div>

          <button
            type="button"
            className="pill-btn pill-btn-ghost pill-btn-block pill-btn-sm"
            onClick={() => setShowLogoutConfirm(true)}
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="student-main-wrap">{children}</main>

      {showLogoutConfirm && (
        <div className="modal-backdrop">
          <div className="modal-dialog" style={{ maxWidth: "400px" }}>
            <div className="modal-head">
              <h3 className="modal-title">Confirm Sign Out</h3>
            </div>
            <p style={{ margin: "4px 0 16px", color: "var(--color-text-secondary)", fontSize: "14px" }}>
              Are you sure you want to sign out of the admin portal?
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="pill-btn pill-btn-ghost"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="pill-btn pill-btn-primary"
                onClick={handleConfirmLogout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
