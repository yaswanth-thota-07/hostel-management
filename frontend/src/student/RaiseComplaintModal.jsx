import { useState, useRef } from "react";
import { api } from "../api/client.js";

const CATEGORIES = [
  "Electrical",
  "Plumbing",
  "Furniture",
  "Cleanliness",
  "Internet / WiFi",
  "Civil / Wall / Window",
  "Appliance",
  "Other",
];

const HOSTEL_WINGS = {
  "Vishweswaraiya": ["A", "B", "C", "D"],
  "Abdul Kalam": ["E", "F", "G"],
  "Homi Bhabha": ["H"],
  "SN Bose": [],
  "Sarabhai": [],
  "Capt Gurbir Singh": [],
  "Ramanujan": [],
  "Kalpana Chawla": [],
};

const HOSTELS = Object.keys(HOSTEL_WINGS);

export default function RaiseComplaintModal({ isOpen, onClose, onSuccess }) {
  const [hostel, setHostel] = useState(HOSTELS[0]);
  const [wing, setWing] = useState(HOSTEL_WINGS[HOSTELS[0]][0] || "NA");
  const [roomNo, setRoomNo] = useState("");
  const [category, setCategory] = useState("Electrical");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef(null);

  const handleHostelChange = (e) => {
    const selected = e.target.value;
    setHostel(selected);
    const wings = HOSTEL_WINGS[selected];
    setWing(wings.length > 0 ? wings[0] : "NA");
  };

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!hostel || !roomNo || !category || !description) {
      setErrorMsg("Please fill in all required complaint fields.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("hostel", hostel.trim());
      formData.append("wing", wing.trim());
      formData.append("roomNo", roomNo.trim());
      formData.append("category", category);
      formData.append("description", description.trim());
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      await api.complaints.create(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog modal-dialog-wide">
        <div className="modal-head">
          <div>
            <span className="pill-label">New Service Complaint</span>
            <h3 className="modal-title" style={{ marginTop: "6px" }}>
              Raise Hostel Complaint
            </h3>
            <p className="modal-sub">
              Detail your maintenance or room service request for hostel administration.
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {errorMsg && <div className="form-alert form-alert-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "12px" }}>
            <div className="field">
              <label className="field-label" htmlFor="hostel-select">
                Hostel Building
              </label>
              <select
                id="hostel-select"
                required
                className="field-input"
                value={hostel}
                onChange={handleHostelChange}
                style={{ cursor: "pointer" }}
              >
                {HOSTELS.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="wing-select">
                Flank / Block
              </label>
              {HOSTEL_WINGS[hostel].length > 0 ? (
                <select
                  id="wing-select"
                  className="field-input"
                  value={wing}
                  onChange={(e) => setWing(e.target.value)}
                  style={{ cursor: "pointer" }}
                >
                  {HOSTEL_WINGS[hostel].map((w) => (
                    <option key={w} value={w}>Flank {w}</option>
                  ))}
                </select>
              ) : (
                <input
                  id="wing-select"
                  type="text"
                  className="field-input"
                  value="NA"
                  disabled
                  style={{ color: "var(--color-text-secondary)", background: "var(--color-surface)" }}
                />
              )}
            </div>

            <div className="field">
              <label className="field-label" htmlFor="room-input">
                Room No.
              </label>
              <input
                id="room-input"
                type="text"
                required
                className="field-input"
                placeholder="e.g. 312"
                value={roomNo}
                onChange={(e) => setRoomNo(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="category-select">
              Issue Category
            </label>
            <select
              id="category-select"
              className="field-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="desc-input">
              Description of Problem
            </label>
            <textarea
              id="desc-input"
              required
              className="field-input field-textarea"
              placeholder="Provide specific details about the issue (e.g. ceiling fan making grinding noise, bathroom tap continuously leaking)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field-label">Evidence Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {!previewUrl ? (
              <div
                className="file-upload-box"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="file-upload-label">+ Attach Photo Evidence</span>
                <span className="file-upload-hint">PNG, JPG, or WEBP up to 5MB</span>
              </div>
            ) : (
              <div className="image-preview-wrap">
                <img src={previewUrl} alt="Complaint preview" className="image-preview" />
                <button
                  type="button"
                  className="image-remove-btn"
                  title="Remove image"
                  onClick={handleRemoveImage}
                >
                  ✕
                </button>
              </div>
            )}
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
              {submitting ? "Uploading & Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
