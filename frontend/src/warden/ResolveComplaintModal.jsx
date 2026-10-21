import { useState } from "react";
import { api } from "../api/client.js";

export default function ResolveComplaintModal({ complaint, role = "subadmin", onClose, onSuccess }) {
  const [resolutionNote, setResolutionNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!complaint) return null;

  const images =
    complaint.images && complaint.images.length > 0
      ? complaint.images
      : complaint.image
      ? [complaint.image]
      : [];
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const handleResolve = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      if (role === "admin") {
        await api.admin.completeComplaint(complaint._id, resolutionNote.trim());
      } else {
        await api.subadmin.completeComplaint(complaint._id, resolutionNote.trim());
      }
      onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Failed to mark complaint as resolved.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog">
        <div className="modal-head">
          <div>
            <span className="pill-label">Complaint Resolution</span>
            <h3 className="modal-title" style={{ marginTop: "6px" }}>
              Resolve Complaint #{complaint._id?.slice(-6).toUpperCase()}
            </h3>
            <p className="modal-sub">
              {complaint.hostel} • Flank {complaint.wing} • Room {complaint.roomNo}
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {errorMsg && <div className="form-alert form-alert-error">{errorMsg}</div>}

        <form onSubmit={handleResolve} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-sm)",
              padding: "14px",
              border: "1px solid var(--color-border)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
                {complaint.category} Issue
              </span>
              {complaint.student?.name && (
                <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
                  Reported by: <strong>{complaint.student.name}</strong> ({complaint.student.regNo || complaint.student.email})
                </span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text)" }}>
              {complaint.description}
            </p>
            {images.length > 0 && (
              <div style={{ marginTop: "8px", position: "relative", height: "160px", overflow: "hidden", borderRadius: "8px", background: "#111" }}>
                <img
                  src={images[activeImgIdx]}
                  alt="Evidence"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveImgIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                      style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.65)", color: "#fff", border: "none", borderRadius: "50%", width: "26px", height: "26px", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImgIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                      style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.65)", color: "#fff", border: "none", borderRadius: "50%", width: "26px", height: "26px", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      ›
                    </button>
                    <span style={{ position: "absolute", bottom: "6px", left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.7)", color: "#fff", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: 600 }}>
                      {activeImgIdx + 1} / {images.length}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="resolution-note">
              Resolution Note & Actions Taken
            </label>
            <textarea
              id="resolution-note"
              required
              rows={3}
              className="field-input field-textarea"
              placeholder="Detail actions taken (e.g. Electrician replaced capacitor; tap washer replaced)..."
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="pill-btn pill-btn-ghost"
              disabled={submitting}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="pill-btn pill-btn-primary"
            >
              {submitting ? "Resolving Complaint..." : "Mark as Completed"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
