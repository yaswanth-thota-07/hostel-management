import WardenLayout from "./WardenLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function WardenProfile() {
  const { user } = useAuth();

  return (
    <WardenLayout>
      <header className="complaints-header">
        <div className="complaints-header-text">
          <span className="pill-label">Staff • Profile</span>
          <h1 className="complaints-title">Staff Member Profile</h1>
          <p className="complaints-sub">
            Hostel maintenance assignments and staff credentials.
          </p>
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
        }}
      >
        <div
          className="complaint-card"
          style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--color-text)",
                color: "var(--color-white)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              ST
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>
                {user?.staffName || user?.name || "Hostel Staff"}
              </h2>
              <span style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
                Active Maintenance Authority
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div className="detail-row">
              <span className="detail-label">Staff Email</span>
              <span className="detail-value">{user?.staffEmail || "staff@hostel.com"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Assigned Role</span>
              <span className="status-pill status-pill-progress">Sub-Admin (Staff)</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Resolution Access</span>
              <span className="detail-value">Full Complaint Authority</span>
            </div>
          </div>
        </div>

        <div
          className="complaint-card"
          style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
            Operational Responsibilities
          </h3>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--color-text-secondary)", margin: 0 }}>
            Hostel staff members have privileged authority to review incoming student complaints,
            inspect campus facilities, and log resolution notes when issues are addressed.
          </p>
          <div
            style={{
              background: "var(--color-surface)",
              padding: "16px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              fontSize: "13px",
              color: "var(--color-text-secondary)",
              lineHeight: "1.5",
            }}
          >
            • Daily complaints submitted by students should be reviewed promptly.
            <br />
            • Always verify physical repairs before recording the resolution note.
            <br />
            • Escalated infrastructure complaints should be communicated to Hostel Warden.
          </div>
        </div>
      </div>
    </WardenLayout>
  );
}
