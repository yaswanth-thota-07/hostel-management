import { useState } from "react";
import { Link, usePath, navigate } from "../router.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "./student.css";

export default function StudentLayout({ children }) {
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
          <Link to="/" className="brand">
            <img src="/logo11.png" alt="Hostel Logo" className="brand-logo-img" />
            <div className="brand-text">
              <span className="brand-name">Hostel Management</span>
              <span className="brand-sub">Student Portal</span>
            </div>
          </Link>

          <nav className="student-nav" aria-label="Student navigation">
            <Link
              to="/student/complaints"
              className={
                path === "/student/complaints"
                  ? "student-nav-link student-nav-link-active"
                  : "student-nav-link"
              }
              aria-current={path === "/student/complaints" ? "page" : undefined}
            >
              My Complaints
            </Link>

            <Link
              to="/student/raise-complaint"
              className={
                path === "/student/raise-complaint"
                  ? "student-nav-link student-nav-link-active"
                  : "student-nav-link"
              }
              aria-current={path === "/student/raise-complaint" ? "page" : undefined}
            >
              Raise Complaint
            </Link>

            <Link
              to="/student/profile"
              className={
                path === "/student/profile"
                  ? "student-nav-link student-nav-link-active"
                  : "student-nav-link"
              }
              aria-current={path === "/student/profile" ? "page" : undefined}
            >
              Student Profile
            </Link>
          </nav>
        </div>

        <div className="student-sidebar-bottom">
          <div className="user-badge">
            <div className="user-badge-info">
              <span className="user-badge-name">{user?.name || "Student Resident"}</span>
              {user?.regNo && <span className="user-badge-sub">{user.regNo}</span>}
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
              Are you sure you want to log out of your student account?
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
