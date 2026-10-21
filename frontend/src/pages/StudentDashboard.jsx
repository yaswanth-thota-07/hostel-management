import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { ComplaintCard } from "../components/ComplaintCard";
import { EmptyState } from "../components/EmptyState";
import { useToast } from "../components/Toast";
import { CATEGORIES, WINGS, HOSTELS } from "../lib/format";

const VIEWS = [
  { key: "overview", label: "Overview" },
  { key: "new", label: "New Complaint" },
  { key: "my", label: "My Complaints" }
];

const ICONS = {
  overview: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  new: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  my: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  )
};

const EMPTY_FORM = {
  hostel: HOSTELS[0],
  wing: WINGS[0],
  roomNo: "",
  category: CATEGORIES[0],
  description: ""
};

export function StudentDashboard() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = auth?.token;

  const [profile, setProfile] = useState(auth?.identity || null);
  const [pending, setPending] = useState(null);
  const [completed, setCompleted] = useState(null);
  const [view, setView] = useState("overview");
  const [fileForm, setFileForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [p, pd, cp] = await Promise.all([
        api.get("/api/students/profile", token),
        api.get("/api/complaints/pending", token),
        api.get("/api/complaints/completed", token)
      ]);
      setProfile(p);
      setPending(pd.complaints || []);
      setCompleted(cp.complaints || []);
    } catch (err) {
      toast(err.message, "error");
    }
  }, [token, toast]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const set = (k) => (e) => setFileForm((f) => ({ ...f, [k]: e.target.value }));

  const submitComplaint = async (e) => {
    e.preventDefault();
    setError("");
    if (!fileForm.roomNo.trim()) {
      setError("Add your room number so the desk can find it");
      return;
    }
    if (fileForm.description.trim().length < 8) {
      setError("Give the desk a sentence or two — what's wrong, where, since when");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("hostel", fileForm.hostel);
      fd.append("wing", fileForm.wing);
      fd.append("roomNo", fileForm.roomNo.trim());
      fd.append("category", fileForm.category);
      fd.append("description", fileForm.description.trim());
      images.forEach((f) => fd.append("images", f));

      await api.postForm("/api/complaints/create", fd, token);
      toast("Complaint is in the queue");
      setFileForm(EMPTY_FORM);
      setImages([]);
      e.target.reset();
      await load();
      setView("my");
    } catch (err) {
      setError(err.message);
      toast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const cancelComplaint = async (id) => {
    try {
      await api.del(`/api/complaints/${id}`, token);
      toast("Complaint withdrawn");
      await load();
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  const all = (pending || []).concat(completed || []);
  const recent = [...all]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 4);

  const firstName = profile?.name?.split(" ")[0] || "there";

  return (
    <div className="sp">
      <nav className="sp__nav">
        <Link className="wordmark" to="/login">
          <span className="wordmark__dot" />
          <div>
            <div className="wordmark__text">Hostel</div>
            <div className="wordmark__sub">complaint desk</div>
          </div>
        </Link>

        <div className="sp__nav-label">Student portal</div>

        <ul className="sp__nav-list">
          {VIEWS.map((v) => (
            <li key={v.key}>
              <button
                className={`sp__nav-item${view === v.key ? " sp__nav-item--active" : ""}`}
                onClick={() => setView(v.key)}
              >
                {ICONS[v.key]}
                <span>{v.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="sp__nav-foot">
          <div className="sp__user">
            <div className="sp__user-name">{profile?.name || "Student"}</div>
            <div className="sp__user-meta">
              {profile?.regNo ? `${profile.regNo} · ` : ""}
              {profile?.email}
            </div>
          </div>
          <button className="btn btn--ghost btn--sm" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </nav>

      <main className="sp__main">
        {view === "overview" ? (
          <section className="dash">
            <div className="dash__head">
              <div>
                <div className="caption dash__kicker">Student portal</div>
                <h1 className="heading-lg">Hello, {firstName}.</h1>
                <div className="dash__role">
                  <span className="dot" />
                  {profile?.regNo} · {profile?.email}
                </div>
              </div>

              <button className="btn btn--primary" onClick={() => setView("new")}>
                File a complaint
              </button>
            </div>

            <div className="sp__stats">
              <div className="card sp__stat">
                <div className="sp__stat-num">{pending === null ? "…" : pending.length}</div>
                <div className="card__sub">open complaints</div>
              </div>
              <div className="card sp__stat">
                <div className="sp__stat-num">{completed === null ? "…" : completed.length}</div>
                <div className="card__sub">resolved to date</div>
              </div>
              <div className="card sp__stat sp__stat--cta">
                <div className="sp__stat-num">{recent.length}</div>
                <div className="card__sub">in your recent activity</div>
                <button className="btn btn--ghost btn--sm" onClick={() => setView("my")}>
                  View all →
                </button>
              </div>
            </div>

            <div className="sp__section-head">
              <h2 className="heading">Recent complaints</h2>
            </div>

            {!all.length ? (
              <EmptyState
                title="Nothing on the books yet"
                body="When something breaks, file a complaint and it'll show up here."
              />
            ) : (
              recent.map((c) => <ComplaintCard key={c._id} complaint={c} />)
            )}
          </section>
        ) : null}

        {view === "new" ? (
          <section className="dash">
            <div className="dash__head">
              <div>
                <div className="caption dash__kicker">Student portal</div>
                <h1 className="heading-lg">New complaint</h1>
                <div className="dash__role">
                  <span className="dot" />
                  filed as {profile?.regNo}
                </div>
              </div>
            </div>

            <div className="card" style={{ maxWidth: 720, margin: "0 auto" }}>
              <form onSubmit={submitComplaint}>
                <div className="form-2col">
                  <div className="field">
                    <label className="field__label" htmlFor="hostel">
                      Hostel
                    </label>
                    <select id="hostel" className="input" value={fileForm.hostel} onChange={set("hostel")}>
                      {HOSTELS.map((h) => (
                        <option key={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label className="field__label" htmlFor="wing">
                      Wing
                    </label>
                    <select id="wing" className="input" value={fileForm.wing} onChange={set("wing")}>
                      {WINGS.map((w) => (
                        <option key={w}>Wing {w}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field" style={{ marginTop: 16 }}>
                  <label className="field__label" htmlFor="roomNo">
                    Room number
                  </label>
                  <input
                    id="roomNo"
                    className="input input--mono"
                    type="text"
                    placeholder="e.g. 312"
                    value={fileForm.roomNo}
                    onChange={set("roomNo")}
                  />
                </div>

                <div className="field" style={{ marginTop: 16 }}>
                  <label className="field__label" htmlFor="category">
                    What's the matter with?
                  </label>
                  <select id="category" className="input" value={fileForm.category} onChange={set("category")}>
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="field" style={{ marginTop: 16 }}>
                  <label className="field__label" htmlFor="description">
                    Describe it
                  </label>
                  <textarea
                    id="description"
                    className="input"
                    rows={4}
                    placeholder="e.g. Ceiling fan wobbles on high speed and throws a loud clack since Tuesday night."
                    value={fileForm.description}
                    onChange={set("description")}
                  />
                </div>

                <div className="field" style={{ marginTop: 16 }}>
                  <label className="field__label" htmlFor="image">
                    Photos <span className="field__hint">(optional, up to 5)</span>
                  </label>
                  <input
                    id="image"
                    className="input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImages(Array.from(e.target.files || []))}
                  />
                </div>

                {error ? <div className="form-error" style={{ marginTop: 16 }}>{error}</div> : null}

                <div className="mt-24" style={{ display: "flex", gap: 12 }}>
                  <button className="btn btn--primary" disabled={saving}>
                    {saving ? <span className="spinner" /> : null} Submit complaint
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={() => setView("overview")}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </section>
        ) : null}

        {view === "my" ? (
          <section className="dash">
            <div className="dash__head">
              <div>
                <div className="caption dash__kicker">Student portal</div>
                <h1 className="heading-lg">My complaints</h1>
                <div className="dash__role">
                  <span className="dot" />
                  {pending?.length ?? "…"} open · {completed?.length ?? "…"} resolved
                </div>
              </div>
            </div>

            <MyComplaintsList
              pending={pending}
              completed={completed}
              onWithdraw={cancelComplaint}
            />
          </section>
        ) : null}
      </main>
    </div>
  );
}

function MyComplaintsList({ pending, completed, onWithdraw }) {
  const [tab, setTab] = useState("pending");
  const list = tab === "pending" ? pending : completed;

  return (
    <div>
      <div className="stacked-tabs">
        <div className="tabs">
          <button
            className={`tab${tab === "pending" ? " tab--active" : ""}`}
            onClick={() => setTab("pending")}
          >
            In the queue
          </button>
          <button
            className={`tab${tab === "completed" ? " tab--active" : ""}`}
            onClick={() => setTab("completed")}
          >
            Resolved
          </button>
        </div>
        <span className="body-sm">
          {list ? `${list.length} record${list.length === 1 ? "" : "s"}` : "loading…"}
        </span>
      </div>

      {!list ? (
        <EmptyState title="Reading the register…" body="Fetching your complaint history." />
      ) : list.length === 0 ? (
        <EmptyState
          title={tab === "pending" ? "No open complaints" : "Nothing archived yet"}
          body={
            tab === "pending"
              ? "When something breaks, file it and it'll land here."
              : "Resolved complaints land here, closed with the note the desk left."
          }
        />
      ) : (
        list.map((c) => (
          <ComplaintCard
            key={c._id}
            complaint={c}
            actions={
              c.status === "pending" ? (
                <button className="btn btn--danger-ghost btn--sm" onClick={() => onWithdraw(c._id)}>
                  Withdraw
                </button>
              ) : null
            }
          />
        ))
      )}
    </div>
  );
}