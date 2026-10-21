import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useToast } from "../components/Toast";

export function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    regNo: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setBusy(true);
    try {
      const res = await api.post("/api/students/signup", {
        name: form.name.trim(),
        email: form.email.trim(),
        regNo: form.regNo.trim().toUpperCase(),
        phone: form.phone.trim(),
        password: form.password
      });

      if (res.devOtp) {
        sessionStorage.setItem("hoste.devOtp", res.devOtp);
      }

      navigate(`/verify-otp?email=${encodeURIComponent(form.email.trim())}`);
    } catch (err) {
      setError(err.message);
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth auth--center auth--center--compact container">
      <section className="auth__panel">
        <div className="card">
          <h1 className="heading">Student registration</h1>
          <p className="card__sub mt-8">
            Once verified, this account can file and track complaints.
          </p>

          <form onSubmit={submit} className="mt-32">
            <div className="field">
              <label className="field__label" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                className="input"
                type="text"
                placeholder="e.g. Aarav Kulkarni"
                value={form.name}
                onChange={set("name")}
                autoComplete="name"
                required
              />
            </div>

            <div className="form-2col" style={{ marginTop: 16 }}>
              <div className="field">
                <label className="field__label" htmlFor="email">
                  College email
                </label>
                <input
                  id="email"
                  className="input"
                  type="email"
                  placeholder="you@aitpune.edu.in"
                  value={form.email}
                  onChange={set("email")}
                  autoComplete="email"
                  required
                />
                <span className="field__hint">Must end in @aitpune.edu.in</span>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="regNo">
                  Registration number
                </label>
                <input
                  id="regNo"
                  className="input input--mono"
                  type="text"
                  placeholder="e.g. 23L3550"
                  value={form.regNo}
                  onChange={set("regNo")}
                  required
                />
              </div>
            </div>

            <div className="field" style={{ marginTop: 16 }}>
              <label className="field__label" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                className="input input--mono"
                type="tel"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={set("phone")}
                autoComplete="tel"
                required
              />
            </div>

            <div className="form-2col" style={{ marginTop: 16 }}>
              <div className="field">
                <label className="field__label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  className="input"
                  type="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={set("password")}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="field">
                <label className="field__label" htmlFor="confirmPassword">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  className="input"
                  type="password"
                  placeholder="Same again"
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {error ? <div className="form-error auth__error">{error}</div> : null}

            <div className="auth__submit">
              <button className="btn btn--primary btn--block" disabled={busy}>
                {busy ? <span className="spinner" /> : null} Send me an OTP
              </button>
            </div>
          </form>

          <p className="auth__foot">
            Already registered? <Link to="/login">Sign in →</Link>
          </p>
        </div>
      </section>
    </div>
  );
}