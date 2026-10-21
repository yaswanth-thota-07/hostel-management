import { useState, useEffect } from "react";
import StudentLayout from "./StudentLayout.jsx";
import { api } from "../api/client.js";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await api.student.profile();
        setProfile(data);
      } catch (err) {
        setErrorMsg(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <StudentLayout>
      <header className="complaints-header">
        <div className="complaints-header-text">
          <span className="pill-label">Student • Account</span>
          <h1 className="complaints-title">Resident Profile</h1>
          <p className="complaints-sub">
            Verified resident details and college registration information.
          </p>
        </div>
      </header>

      {errorMsg && <div className="form-alert form-alert-error">{errorMsg}</div>}

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-secondary)" }}>
          Loading profile...
        </div>
      ) : profile ? (
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
                {profile.name?.slice(0, 2).toUpperCase() || "ST"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>{profile.name}</h2>
                <span style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
                  Verified Resident • Roll #{profile.regNo}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div className="detail-row">
                <span className="detail-label">College Email</span>
                <span className="detail-value">{profile.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Registration No</span>
                <span className="detail-value">{profile.regNo}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Mobile Contact</span>
                <span className="detail-value">+91 {profile.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Resident Since</span>
                <span className="detail-value">{formatDate(profile.createdAt)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Account Status</span>
                <span className="status-pill status-pill-resolved">Active Student</span>
              </div>
            </div>
          </div>

          <div
            className="complaint-card"
            style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
              Hostel Resident Guidelines
            </h3>
            <p style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--color-text-secondary)", margin: 0 }}>
              As an enrolled resident at AIT Pune, all maintenance complaints submitted through
              this portal are directly monitored by warden staff and hostel administrators.
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
              • Always provide clear descriptions or photos for faster resolution.
              <br />
              • For room changes or gate passes, contact hostel office in person.
            </div>
          </div>
        </div>
      ) : null}
    </StudentLayout>
  );
}
