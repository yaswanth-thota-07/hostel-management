import { useState, useEffect } from "react";
import { api } from "../api/client.js";

export default function ComplaintDetailModal({ complaint, onClose, onRefresh }) {
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [complaint?._id]);

  if (!complaint) return null;

  const images =
    complaint.images && complaint.images.length > 0
      ? complaint.images
      : complaint.image
      ? [complaint.image]
      : [];

  const isPending = complaint.status === "pending";

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this complaint?")) return;
    setDeleting(true);
    setErrorMsg("");
    try {
      await api.complaints.delete(complaint._id);
      onRefresh();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Failed to cancel complaint.");
      setDeleting(false);
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

        {images.length > 0 ? (
          <div className="modal-content-split">
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
                    Click arrows to view photos
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

            <div className="modal-split-details" style={{ marginTop: "7px" }}>
              <div className="modal-detail-grid" style={{ gridTemplateColumns: "1fr" }}>
                <div className="modal-detail-card">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">
                    {complaint.hostel}, Flank {complaint.wing}, Room {complaint.roomNo}
                  </span>
                </div>

                <div className="modal-detail-card">
                  <span className="detail-label">Submitted On</span>
                  <span className="detail-value">{formatDate(complaint.createdAt)}</span>
                </div>

                {complaint.status === "completed" && (
                  <div className="modal-detail-card">
                    <span className="detail-label">Resolved On</span>
                    <span className="detail-value">{formatDate(complaint.resolvedAt)}</span>
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
                    padding: "16px 20px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {complaint.description}
                </p>
              </div>

              {complaint.resolutionNote && (
                <div
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "16px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    Resolution Note from Administration
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "15px",
                      lineHeight: "1.55",
                      color: "var(--color-text)",
                    }}
                  >
                    {complaint.resolutionNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div className="modal-detail-grid">
              <div className="modal-detail-card">
                <span className="detail-label">Location</span>
                <span className="detail-value">
                  {complaint.hostel}, Wing {complaint.wing}, Room {complaint.roomNo}
                </span>
              </div>

              <div className="modal-detail-card">
                <span className="detail-label">Submitted On</span>
                <span className="detail-value">{formatDate(complaint.createdAt)}</span>
              </div>

              {complaint.status === "completed" && (
                <div className="modal-detail-card">
                  <span className="detail-label">Resolved On</span>
                  <span className="detail-value">{formatDate(complaint.resolvedAt)}</span>
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
                  padding: "16px 20px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {complaint.description}
              </p>
            </div>

            {complaint.resolutionNote && (
              <div
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "16px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "var(--color-text-muted)",
                  }}
                >
                  Resolution Note from Administration
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: "15px",
                    lineHeight: "1.55",
                    color: "var(--color-text)",
                  }}
                >
                  {complaint.resolutionNote}
                </p>
              </div>
            )}
          </div>
        )}

        <div
          className="modal-actions"
          style={{
            justifyContent: "space-between",
            paddingTop: "12px",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          {isPending ? (
            <button
              type="button"
              disabled={deleting}
              className="pill-btn pill-btn-danger pill-btn-sm"
              onClick={handleCancel}
            >
              {deleting ? "Cancelling..." : "Cancel Complaint"}
            </button>
          ) : (
            <div />
          )}
          <button type="button" className="pill-btn pill-btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
