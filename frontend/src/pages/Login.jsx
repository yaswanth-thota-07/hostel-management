import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

const ROLES = [
  { key: "student", label: "Student" },
  { key: "admin", label: "Admin" },
  { key: "subadmin", label: "Staff" }
];

const META = {
  student: {
    lede: "Sign in with your college email to raise a complaint from your room, or track one already on the books.",
    fieldLabel: "College email",
    fieldName: "email",
    fieldType: "email",
    placeholder: "you@aitpune.edu.in",
    endpoint: "POST /api/students/login",
    cta: "Sign in",
    extra: "first time here? create an account"
  },
  admin: {
    lede: "The desk-side view. Manage staff, watch today's queue, and close complaints as they clear.",
    fieldLabel: "Admin email",
    fieldName: "email",
    fieldType: "email",
    placeholder: "admin@hostel.in",
    endpoint: "POST /api/admin/login",
    cta: "Open the desk"
  },
  subadmin: {
    lede: "Staff login for the maintenance desk. Pick up pending complaints and log your resolution notes.",
    fieldLabel: "Staff email",
    fieldName: "staffEmail",
    fieldType: "email",
    placeholder: "staff@hostel.in",
    endpoint: "POST /api/subadmin/login",
    cta: "Open the desk"
  }
};

const PATH_SEGMENT = {
  student: "students",
  admin: "admin",
  subadmin: "subadmin"
};

export function Login() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const meta = META[role];

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await api.post(`/api/${PATH_SEGMENT[role]}/login`, {
        [meta.fieldName]: email.trim(),
        password
      });

      login(role, res.token, { [meta.fieldName]: email.trim() });

      if (role === "student") {
        try {
          const profile = await api.get("/api/students/profile", res.token);
          login(role, res.token, {
            name: profile.name,
            email: profile.email,
            regNo: profile.regNo,
            phone: profile.phone
          });
        } catch {
          /* fall back to email-only identity */
        }
      }

      navigate(role === "student" ? "/student" : role === "admin" ? "/admin" : "/subadmin");
    } catch (err) {
      setError(err.message);
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth auth--center container">
      <section className="auth__panel">
        <div className="card">
          <div className="seg" role="tablist" aria-label="Choose your portal">
            {ROLES.map((r) => (
              <button
                key={r.key}
                role="tab"
                aria-selected={role === r.key}
                className={`seg__btn${role === r.key ? " seg__btn--active" : ""}`}
                onClick={() => {
                  setRole(r.key);
                  setError("");
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="mt-32">
            <h1 className="heading">{meta.cta}</h1>
            <p className="card__sub mt-8">{meta.lede}</p>
          </div>

          <form onSubmit={submit} className="mt-32">
            <div className="field">
              <label className="field__label" htmlFor="email">
                {meta.fieldLabel}
              </label>
              <input
                id="email"
                className="input"
                type={meta.fieldType}
                placeholder={meta.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              {role === "student" ? (
                <span className="field__hint">Only @aitpune.edu.in addresses are accepted.</span>
              ) : null}
            </div>

            <div className="field" style={{ marginTop: 16 }}>
              <label className="field__label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error ? <div className="form-error auth__error">{error}</div> : null}

            <div className="auth__submit">
              <button className="btn btn--primary btn--block" disabled={busy}>
                {busy ? <span className="spinner" /> : null} {meta.cta}
              </button>
            </div>
          </form>

          {role === "student" ? (
            <div className="auth__foot">
              <Link to="/signup">Create a student account →</Link>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}