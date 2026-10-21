import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { TopBar } from "../components/TopBar";
import { ComplaintTriage } from "../components/ComplaintTriage";
import { EmptyState } from "../components/EmptyState";
import { useToast } from "../components/Toast";

const EMPTY_STAFF = {
  staffName: "",
  staffMobile: "",
  staffRegId: "",
  staffEmail: "",
  password: "",
  confirmPassword: ""
};

function StatStrip({ stats, loading }) {
  const cells = [
    { key: "today", label: "Filed today" },
    { key: "pending", label: "Awaiting the desk" },
    { key: "completed", label: "Resolved to date" }
  ];
  return (
    <div className="stats">
      {cells.map((c) => (
        <div className="stat" key={c.key}>
          <div className="stat__number">{loading ? "…" : (stats?.[c.key] ?? 0)}</div>
          <div className="stat__label">{c.label}</div>
        </div>
      ))}
    </div>
  );
}

export function AdminDashboard() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = auth?.token;

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [subAdmins, setSubAdmins] = useState(null);
  const [staffForm, setStaffForm] = useState(EMPTY_STAFF);
  const [savingStaff, setSavingStaff] = useState(false);
  const [staffError, setStaffError] = useState("");

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const [t, p, c] = await Promise.all([
        api.get("/api/admin/complaints/today", token),
        api.get("/api/admin/complaints/pending", token),
        api.get("/api/admin/complaints/completed", token)
      ]);
      setStats({
        today: t.complaints.length,
        pending: p.complaints.length,
        completed: c.complaints.length
      });
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setStatsLoading(false);
    }
  }, [token, toast]);

  const loadStaff = useCallback(async () => {
    try {
      const res = await api.get("/api/admin/subadmins", token);
      setSubAdmins(res.subAdmins || []);
    } catch (err) {
      toast(err.message, "error");
      setSubAdmins([]);
    }
  }, [token, toast]);

  useEffect(() => {
    loadStats();
    loadStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const setStaff = (k) => (e) => setStaffForm((f) => ({ ...f, [k]: e.target.value }));

  const createStaff = async (e) => {
    e.preventDefault();
    setStaffError("");
    const f = staffForm;
    if (!/^\d{10}$/.test(f.staffMobile.trim())) {
      setStaffError("Enter a valid 10-digit mobile number");
      return;
    }
    if (f.password !== f.confirmPassword) {
      setStaffError("Passwords do not match");
      return;
    }
    setSavingStaff(true);
    try {
      await api.post("/api/admin/create-subadmin", {
        staffName: f.staffName.trim(),
        staffMobile: f.staffMobile.trim(),
        staffRegId: f.staffRegId.trim().toUpperCase(),
        staffEmail: f.staffEmail.trim(),
        password: f.password
      }, token);
      toast("Staff account created");
      setStaffForm(EMPTY_STAFF);
      await Promise.all([loadStaff(), loadStats()]);
    } catch (err) {
      setStaffError(err.message);
      toast(err.message, "error");
    } finally {
      setSavingStaff(false);
    }
  };

  const deleteStaff = async (id, name) => {
    if (!window.confirm(`Remove ${name} from the desk? This can't be undone.`)) return;
    try {
      await api.del(`/api/admin/delete-subadmin/${id}`, token);
      toast("Staff account removed");
      await Promise.all([loadStaff(), loadStats()]);
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <TopBar
        username={auth?.identity?.email || "Admin"}
        roleLabel="Admin"
        onLogout={onLogout}
      />

      <main className="container dash">
        <div className="dash__head">
          <div>
            <div className="caption dash__kicker">Admin desk</div>
            <h1 className="heading-lg">Desk overview</h1>
            <div className="dash__role">
              <span className="dot" />
              hostel-wide · all wings
            </div>
          </div>
        </div>

        <StatStrip stats={stats} loading={statsLoading} />

        <div className="dash__body" style={{ marginTop: 32 }}>
          <aside className="card" aria-label="Manage staff">
            <div className="section-label">Staff accounts</div>

            <form onSubmit={createStaff}>
              <div className="field">
                <label className="field__label" htmlFor="staffName">
                  Full name
                </label>
                <input
                  id="staffName"
                  className="input"
                  type="text"
                  placeholder="e.g. Saloni Deshpande"
                  value={staffForm.staffName}
                  onChange={setStaff("staffName")}
                  required
                />
              </div>

              <div className="field" style={{ marginTop: 16 }}>
                <label className="field__label" htmlFor="staffMobile">
                  Mobile
                </label>
                <input
                  id="staffMobile"
                  className="input input--mono"
                  type="tel"
                  pattern="[0-9]{10}"
                  placeholder="10-digit number"
                  value={staffForm.staffMobile}
                  onChange={setStaff("staffMobile")}
                  required
                />
              </div>

              <div className="field" style={{ marginTop: 16 }}>
                <label className="field__label" htmlFor="staffRegId">
                  Staff reg. ID
                </label>
                <input
                  id="staffRegId"
                  className="input input--mono"
                  type="text"
                  placeholder="e.g. STF2134"
                  value={staffForm.staffRegId}
                  onChange={setStaff("staffRegId")}
                  required
                />
              </div>

              <div className="field" style={{ marginTop: 16 }}>
                <label className="field__label" htmlFor="staffEmail">
                  Work email
                </label>
                <input
                  id="staffEmail"
                  className="input"
                  type="email"
                  placeholder="staff@hostel.in"
                  value={staffForm.staffEmail}
                  onChange={setStaff("staffEmail")}
                  required
                />
              </div>

              <div className="form-2col" style={{ marginTop: 16 }}>
                <div className="field">
                  <label className="field__label" htmlFor="staffPassword">
                    Password
                  </label>
                  <input
                    id="staffPassword"
                    className="input"
                    type="password"
                    placeholder="Set one"
                    value={staffForm.password}
                    onChange={setStaff("password")}
                    required
                  />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="staffConfirm">
                    Confirm
                  </label>
                  <input
                    id="staffConfirm"
                    className="input"
                    type="password"
                    placeholder="Same again"
                    value={staffForm.confirmPassword}
                    onChange={setStaff("confirmPassword")}
                    required
                  />
                </div>
              </div>

              {staffError ? (
                <div className="form-error" style={{ marginTop: 16 }}>{staffError}</div>
              ) : null}

              <div className="mt-24">
                <button className="btn btn--primary btn--block" disabled={savingStaff}>
                  {savingStaff ? <span className="spinner" /> : null} Add staff member
                </button>
              </div>
            </form>

            <hr style={{ border: 0, borderTop: "1px solid var(--color-stone-200)", margin: "24px 0" }} />

            <div className="section-label">On the desk</div>
            {!subAdmins ? (
              <p className="body-sm">Loading…</p>
            ) : subAdmins.length === 0 ? (
              <EmptyState title="No staff yet" body="The first person you add appears here." />
            ) : (
              subAdmins.map((s) => (
                <div className="staff-row" key={s._id}>
                  <div>
                    <div className="staff-row__name">{s.staffName}</div>
                    <div className="staff-row__meta">
                      <span className="chip">{s.staffRegId}</span>
                      <span>{s.staffEmail}</span>
                    </div>
                  </div>
                  <button
                    className="btn btn--danger-ghost btn--sm"
                    onClick={() => deleteStaff(s._id, s.staffName)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </aside>

          <div>
            <div className="section-label">Complaint queue</div>
            <ComplaintTriage base="/api/admin" token={token} showStudent={true} onChanged={loadStats} />
          </div>
        </div>
      </main>
    </>
  );
}