import { Link } from "../router.jsx";

export default function DashboardHeader() {
  return (
    <header className="complaints-header">
      <div className="complaints-header-text">
        <span className="pill-label">Staff Operations</span>
        <h1 className="complaints-title">Hostel Overview</h1>
        <p className="complaints-sub">
          Monitor complaints, maintenance activity and service performance
          across your hostel.
        </p>
      </div>

      <div className="warden-header-actions">
        <span className="warden-header-date">Active Session</span>
        <Link
          to="/staff/complaints"
          className="pill-btn pill-btn-primary complaints-raise-btn"
        >
          View Complaints <span aria-hidden="true">→</span>
        </Link>
      </div>
    </header>
  );
}
