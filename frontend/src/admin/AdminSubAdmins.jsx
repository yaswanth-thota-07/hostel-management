import { useState, useEffect, useCallback } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { api } from "../api/client.js";

export default function AdminSubAdmins() {
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [staffName, setStaffName] = useState("");
  const [staffMobile, setStaffMobile] = useState("");
  const [staffRegId, setStaffRegId] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalError, setModalError] = useState("");

  const fetchSubAdmins = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await api.admin.getSubAdmins();
      setSubAdmins(res?.subAdmins || []);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load sub-admins list.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubAdmins();
  }, [fetchSubAdmins]);

  const handleCreateSubAdmin = async (e) => {
    e.preventDefault();
    setModalError("");

    if (password !== confirmPassword) {
      setModalError("Passwords do not match");
      return;
    }

    if (!/^\d{10}$/.test(staffMobile)) {
      setModalError("Please enter a valid 10-digit mobile number");
      return;
    }

    setSubmitting(true);
    try {
      await api.admin.createSubAdmin({
        staffName: staffName.trim(),
        staffMobile: staffMobile.trim(),
        staffRegId: staffRegId.trim(),
        staffEmail: staffEmail.trim(),
        password,
        confirmPassword,
      });

      setSuccessMsg("Staff member account created successfully.");
      setModalOpen(false);
      setStaffName("");
      setStaffMobile("");
      setStaffRegId("");
      setStaffEmail("");
      setPassword("");
      setConfirmPassword("");
      fetchSubAdmins();
    } catch (err) {
      setModalError(err.message || "Failed to create staff member.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this staff account?")) return;
    setDeletingId(id);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await api.admin.deleteSubAdmin(id);
      setSuccessMsg("Staff account removed successfully.");
      fetchSubAdmins();
    } catch (err) {
      setErrorMsg(err.message || "Failed to remove staff account.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <AdminLayout>
      <header className="complaints-header">
        <div className="complaints-header-text">
          <span className="pill-label">Staff Management</span>
          <h1 className="complaints-title">Hostel Staff Directory</h1>
          <p className="complaints-sub">
            Assign, monitor, and manage maintenance staff (sub-admins) across hostels.
          </p>
        </div>

        <button
          type="button"
          className="pill-btn pill-btn-primary"
          onClick={() => {
            setModalError("");
            setModalOpen(true);
          }}
        >
          + Add Staff Account
        </button>
      </header>

      {errorMsg && <div className="form-alert form-alert-error">{errorMsg}</div>}
      {successMsg && <div className="form-alert form-alert-success">{successMsg}</div>}

      <div className="table-responsive" style={{ background: "var(--color-white)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", marginTop: "16px" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-secondary)" }}>
            Loading staff directory...
          </div>
        ) : subAdmins.length > 0 ? (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Staff Email</th>
                <th>Registration ID</th>
                <th>Mobile Number</th>
                <th>Created Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subAdmins.map((admin) => (
                <tr key={admin._id}>
                  <td>
                    <strong>{admin.staffName}</strong>
                  </td>
                  <td>{admin.staffEmail}</td>
                  <td>
                    <span className="pill-label" style={{ padding: "4px 10px", fontSize: "11px" }}>
                      {admin.staffRegId}
                    </span>
                  </td>
                  <td>+91 {admin.staffMobile}</td>
                  <td style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                    {formatDate(admin.createdAt)}
                  </td>
                  <td>
                    <button
                      type="button"
                      disabled={deletingId === admin._id}
                      className="pill-btn pill-btn-danger pill-btn-sm"
                      onClick={() => handleDelete(admin._id)}
                    >
                      {deletingId === admin._id ? "Removing..." : "Remove"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-secondary)" }}>
            No staff accounts found. Click &quot;Add Staff Account&quot; to create one.
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-head">
              <div>
                <span className="pill-label">Staff Provisioning</span>
                <h3 className="modal-title" style={{ marginTop: "6px" }}>
                  Create Staff Account (Sub-Admin)
                </h3>
                <p className="modal-sub">
                  Grant hostel maintenance and complaint resolution authority to staff.
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
            </div>

            {modalError && <div className="form-alert form-alert-error">{modalError}</div>}

            <form onSubmit={handleCreateSubAdmin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="field">
                <label className="field-label" htmlFor="staff-name">
                  Staff Full Name
                </label>
                <input
                  id="staff-name"
                  type="text"
                  required
                  className="field-input"
                  placeholder="e.g. Ramesh Kulkarni"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="field-label" htmlFor="staff-email">
                  Staff Email ID
                </label>
                <input
                  id="staff-email"
                  type="email"
                  required
                  className="field-input"
                  placeholder="staff@hostel.com"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="field">
                  <label className="field-label" htmlFor="staff-reg">
                    Staff Reg ID
                  </label>
                  <input
                    id="staff-reg"
                    type="text"
                    required
                    className="field-input"
                    placeholder="e.g. EMP-1082"
                    value={staffRegId}
                    onChange={(e) => setStaffRegId(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label className="field-label" htmlFor="staff-mob">
                    Mobile Number (10 digits)
                  </label>
                  <input
                    id="staff-mob"
                    type="tel"
                    required
                    maxLength="10"
                    className="field-input"
                    placeholder="9876543210"
                    value={staffMobile}
                    onChange={(e) => setStaffMobile(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="field">
                  <label className="field-label" htmlFor="staff-pw">
                    Password
                  </label>
                  <input
                    id="staff-pw"
                    type="password"
                    required
                    className="field-input"
                    placeholder="Set staff password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label className="field-label" htmlFor="staff-cpw">
                    Confirm Password
                  </label>
                  <input
                    id="staff-cpw"
                    type="password"
                    required
                    className="field-input"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="pill-btn pill-btn-ghost"
                  disabled={submitting}
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="pill-btn pill-btn-primary"
                >
                  {submitting ? "Creating Staff Account..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
