import { useState } from "react";
import { Link, usePath, navigate } from "../router.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "../student/student.css";
import "./warden.css";

const NAV_GROUPS = [
  {
    label: "Operations",
    items: [
      {
        label: "Complaint Register",
        to: "/staff/complaints",
        aliases: ["/staff/dashboard", "/warden/complaints", "/subadmin/complaints"],
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        label: "Staff Profile",
        to: "/staff/profile",
        aliases: ["/warden/profile", "/subadmin/profile"],
      },
    ],
  },
];

export default function WardenLayout({ children }) {
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
          <Link to="/staff/complaints" className="brand">
            <img src="/logo11.png" alt="Hostel Logo" className="brand-logo-img" />
            <div className="brand-text">
              <span className="brand-name">Hostel Management</span>
              <span className="brand-sub">Staff Portal</span>
            </div>
          </Link>

          <nav className="student-nav warden-nav" aria-label="Staff navigation">
            {NAV_GROUPS.map((group) => (
              <div className="warden-nav-group" key={group.label}>
                <span className="warden-nav-group-label">{group.label}</span>

                {group.items.map((item) => {
                  const isActive =
                    path === item.to || (item.aliases && item.aliases.includes(path));
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
              </div>
            ))}
          </nav>
        </div>

        <div className="student-sidebar-bottom">
          <div className="user-badge">
            <div className="user-badge-info">
              <span className="user-badge-name">{user?.staffName || user?.name || "Hostel Staff"}</span>
              <span className="user-badge-sub">{user?.staffEmail || "Staff Member"}</span>
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
              Are you sure you want to sign out of the staff portal?
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
