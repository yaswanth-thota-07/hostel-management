import { useState, useEffect } from "react";
import { api } from "../api/client.js";

export default function WardenComplaintDetailModal({ complaint: rawComplaint, role = "subadmin", onClose, onSuccess }) {
  const [resolutionNote, setResolutionNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const complaint = rawComplaint?.complaint
    ? {
        ...rawComplaint.complaint,
        resolvedBy: rawComplaint.solvedBy || rawComplaint.complaint.resolvedBy,
        resolvedByModel:
          rawComplaint.complaint.resolvedByModel ||
          (rawComplaint.solvedBy?.staffName ? "SubAdmin" : "Admin"),
      }
    : rawComplaint;

  useEffect(() => {
    setActiveImageIndex(0);
    setResolutionNote("");
    setErrorMsg("");
  }, [complaint?._id]);

  if (!complaint) return null;

  const images =
    complaint.images && complaint.images.length > 0
      ? complaint.images
      : complaint.image
      ? [complaint.image]
      : [];

  const isPending = complaint.status === "pending";

  const handleResolve = async (e) => {
    e.preventDefault();
    if (!resolutionNote.trim()) {
      setErrorMsg("Please enter a resolution note detailing the actions taken.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      if (role === "admin") {
        await api.admin.completeComplaint(complaint._id, resolutionNote.trim());
      } else {
        await api.subadmin.completeComplaint(complaint._id, resolutionNote.trim());
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Failed to mark complaint as resolved.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog modal-dialog-xl"
        style={{ maxWidth: "1240px", width: "92vw" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <span
              className={`status-pill ${
                complaint.status === "completed"
                  ? "status-pill-resolved"
                  : "status-pill-progress"
              }`}
            >
              {complaint.status === "completed" ? "Resolved" : "Pending"}
            </span>
            <h3 className="modal-title" style={{ marginTop: "10px", fontSize: "24px" }}>
              {complaint.category} Issue
            </h3>
            <p className="modal-sub">Complaint ID: #{complaint._id?.slice(-6).toUpperCase()}</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {errorMsg && <div className="form-alert form-alert-error">{errorMsg}</div>}

        <div className={images.length > 0 ? "modal-content-split" : ""}>
          {images.length > 0 && (
            <div className="modal-split-media">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  className="detail-label"
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Attached Photo Evidence {images.length > 1 ? `(${activeImageIndex + 1} of ${images.length})` : ""}
                </span>

                {images.length > 1 && (
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-text-secondary)" }}>
                    Click side arrows to browse
                  </span>
                )}
              </div>

              <div className="modal-image-container" style={{ position: "relative" }}>
                <img
                  src={images[activeImageIndex]}
                  alt={`Complaint Evidence ${activeImageIndex + 1}`}
                  className="modal-full-image"
                />

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="modal-carousel-arrow modal-carousel-arrow-prev"
                      title="Previous image"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                      }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="modal-carousel-arrow modal-carousel-arrow-next"
                      title="Next image"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                      }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>

                    <div className="modal-carousel-counter">
                      {activeImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="modal-carousel-thumbs">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`modal-carousel-thumb-btn ${idx === activeImageIndex ? "modal-carousel-thumb-btn-active" : ""}`}
                      onClick={() => setActiveImageIndex(idx)}
                    >
                      <img src={imgUrl} alt={`Thumb ${idx + 1}`} className="modal-carousel-thumb-img" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className={images.length > 0 ? "modal-split-details" : ""} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div
              className="modal-detail-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "20px",
                background: "var(--color-surface)",
                padding: "24px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="modal-detail-card" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span className="detail-label" style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Student Resident</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontSize: "15px", color: "var(--color-text)" }}>
                    <span style={{ fontWeight: 600, width: "60px", display: "inline-block" }}>Name</span> : {complaint.student?.name || "Resident"}
                  </span>
                  {complaint.student?.regNo && (
                    <span style={{ fontSize: "15px", color: "var(--color-text)" }}>
                      <span style={{ fontWeight: 600, width: "60px", display: "inline-block" }}>Reg no.</span> : {complaint.student.regNo}
                    </span>
                  )}
                </div>
              </div>

              <div className="modal-detail-card" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span className="detail-label" style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Location</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontSize: "15px", color: "var(--color-text)" }}>
                    <span style={{ fontWeight: 600, width: "75px", display: "inline-block" }}>Hostel</span> : {complaint.hostel}
                  </span>
                  <span style={{ fontSize: "13px", color: "var(--color-text)", whiteSpace: "nowrap" }}>
                    <span style={{ fontWeight: 600, width: "75px", display: "inline-block" }}>Room no</span> : {complaint.roomNo}
                    <span style={{ fontWeight: 600, marginLeft: "16px" }}>Flank</span> : {complaint.wing}
                  </span>
                </div>
              </div>

              <div className="modal-detail-card" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span className="detail-label" style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Submitted On</span>
                <span className="detail-value" style={{ fontSize: "15px", fontWeight: "500", color: "var(--color-text)" }}>{formatDate(complaint.createdAt)}</span>
              </div>

              {complaint.student?.phone && (
                <div className="modal-detail-card" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span className="detail-label" style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Contact Phone</span>
                  <span className="detail-value" style={{ fontSize: "15px", fontWeight: "500", color: "var(--color-text)" }}>+91 {complaint.student.phone}</span>
                </div>
              )}

              {complaint.status === "completed" && (
                <div className="modal-detail-card" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span className="detail-label" style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Resolved On</span>
                  <span className="detail-value" style={{ fontSize: "15px", fontWeight: "500", color: "var(--color-text)" }}>{formatDate(complaint.resolvedAt)}</span>
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span
                className="detail-label"
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Issue Description
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "var(--color-text)",
                  background: "var(--color-surface)",
                  padding: "16px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {complaint.description}
              </p>
            </div>

            {complaint.status === "completed" && complaint.resolutionNote && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span
                  className="detail-label"
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "#166534",
                  }}
                >
                  Resolution Record
                </span>
                <div
                  style={{
                    background: "#f0fdf4",
                    padding: "16px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid #bbf7d0",
                    color: "#166534",
                    fontSize: "14px",
                    lineHeight: "1.55",
                  }}
                >
                  <strong>Note:</strong> {complaint.resolutionNote}
                  {(complaint.resolvedBy?.staffName || complaint.resolvedBy?.name) && (
                    <div style={{ marginTop: "12px", fontSize: "13px", color: "#14532d", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span>
                        <strong>Resolved by:</strong> {complaint.resolvedBy.staffName || complaint.resolvedBy.name} (
                        {complaint.resolvedByModel === "Admin" ? "Warden" : "Staff"})
                      </span>
                      {(complaint.resolvedBy.phone || complaint.resolvedBy.staffPhone) && (
                        <span>
                          <strong>Contact:</strong> +91 {complaint.resolvedBy.phone || complaint.resolvedBy.staffPhone}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {isPending && (
              <form onSubmit={handleResolve} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "6px" }}>
                <div className="field">
                  <label className="field-label" htmlFor="resolution-note-input" style={{ fontWeight: 700 }}>
                    Resolution Note & Action Taken (Required to mark resolved)
                  </label>
                  <textarea
                    id="resolution-note-input"
                    required
                    rows={3}
                    className="field-input field-textarea"
                    placeholder="Specify action taken (e.g. Electrician replaced switch and tested fan; plumber replaced leaking tap washer)..."
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                  />
                </div>

                <div className="modal-actions" style={{ marginTop: "4px" }}>
                  <button
                    type="button"
                    className="pill-btn pill-btn-ghost"
                    onClick={onClose}
                    disabled={submitting}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="pill-btn pill-btn-primary"
                    disabled={submitting}
                    style={{ minWidth: "160px" }}
                  >
                    {submitting ? "Resolving..." : "Mark as Resolved"}
                  </button>
                </div>
              </form>
            )}

            {!isPending && (
              <div className="modal-actions" style={{ marginTop: "8px" }}>
                <button
                  type="button"
                  className="pill-btn pill-btn-ghost"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
