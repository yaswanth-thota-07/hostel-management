import { useState, useRef } from "react";
import StudentLayout from "./StudentLayout.jsx";
import { navigate } from "../router.jsx";
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

export default function StudentRaiseComplaint() {
  const [hostel, setHostel] = useState(HOSTELS[0]);
  const [wing, setWing] = useState(HOSTEL_WINGS[HOSTELS[0]][0] || "NA");
  const [roomNo, setRoomNo] = useState("");
  const [category, setCategory] = useState("Electrical");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef(null);

  const handleHostelChange = (e) => {
    const selected = e.target.value;
    setHostel(selected);
    const wings = HOSTEL_WINGS[selected];
    setWing(wings.length > 0 ? wings[0] : "NA");
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
    }));

    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    setPreviewUrls((prev) => {
      const target = prev[index];
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== index);
    });
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!hostel || !wing || !roomNo || !category || !description) {
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

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      await api.complaints.create(formData);
      navigate("/student/complaints");
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StudentLayout>
      <div className="raise-page-container">
        <div className="raise-page-head">
          <div className="complaints-header-text">
            <h1 className="complaints-title">Raise Hostel Complaint</h1>
            <p className="complaints-sub">
              Detail your maintenance or room service request. You can attach multiple photos to help hostel staff resolve the issue faster.
            </p>
          </div>
        </div>

        <div className="raise-form-card">
          {errorMsg && <div className="form-alert form-alert-error">{errorMsg}</div>}

          <form onSubmit={handleSubmit} className="raise-form">
            <div className="raise-form-grid-3">
              <div className="field">
                <label className="field-label" htmlFor="hostel-input">
                  Hostel Building
                </label>
                <select
                  id="hostel-input"
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
                <label className="field-label" htmlFor="wing-input">
                  Flank / Block
                </label>
                {HOSTEL_WINGS[hostel].length > 0 ? (
                  <select
                    id="wing-input"
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
                    id="wing-input"
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
                rows={4}
                className="field-input field-textarea"
                placeholder="Provide specific details about the issue (e.g. ceiling fan speed regulator broken, bathroom tap continuously leaking, broken window latch)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="field">
              <div className="field-row" style={{ marginBottom: "4px" }}>
                <label className="field-label">Photo Evidence (Multiple Supported)</label>
                {previewUrls.length > 0 && (
                  <span style={{ fontSize: "12px", color: "var(--color-text-secondary)", fontWeight: 600 }}>
                    {previewUrls.length} {previewUrls.length === 1 ? "photo" : "photos"} selected
                  </span>
                )}
              </div>

              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <div
                className="file-upload-box"
                onClick={() => fileInputRef.current?.click()}
                style={{ padding: "28px 20px" }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="file-upload-label" style={{ fontSize: "14px" }}>
                  + Click to Attach Photos (Multiple allowed)
                </span>
                <span className="file-upload-hint">
                  PNG, JPG, or WEBP up to 5MB each • Select one or multiple files
                </span>
              </div>

              {previewUrls.length > 0 && (
                <div className="multi-image-preview-grid">
                  {previewUrls.map((item, index) => (
                    <div key={index} className="multi-image-card">
                      <img src={item.url} alt={`Upload ${index + 1}`} className="multi-image-thumb" />
                      <div className="multi-image-info">
                        <span className="multi-image-name">{item.name}</span>
                        <span className="multi-image-size">{item.size} MB</span>
                      </div>
                      <button
                        type="button"
                        className="multi-image-remove"
                        title="Remove photo"
                        onClick={() => handleRemoveImage(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="multi-image-add-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span style={{ fontSize: "20px", lineHeight: 1 }}>+</span>
                    <span>Add More</span>
                  </button>
                </div>
              )}
            </div>

            <div className="raise-form-actions">
              <button
                type="button"
                className="pill-btn pill-btn-ghost"
                disabled={submitting}
                onClick={() => navigate("/student/complaints")}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="pill-btn pill-btn-primary raise-submit-btn"
              >
                {submitting ? "Uploading & Submitting..." : "Submit Complaint"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </StudentLayout>
  );
}
