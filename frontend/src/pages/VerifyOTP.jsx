import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { useToast } from "../components/Toast";

function parseWait(message = "") {
  const m = message.match(/(\d+)/);
  return m ? Number(m[1]) : 30;
}

export function VerifyOTP() {
  const [params] = useSearchParams();
  const email = params.get("email") || "";
  const navigate = useNavigate();
  const { toast } = useToast();

  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [wait, setWait] = useState(0);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [devFilled, setDevFilled] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("hoste.devOtp");
    if (stored) {
      setOtp(stored);
      setDevFilled(true);
      sessionStorage.removeItem("hoste.devOtp");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const verify = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.trim().length !== 6) {
      setError("Enter the full 6-digit code");
      return;
    }
    setBusy(true);
    try {
      await api.post("/api/students/verify-otp", { email, otp: otp.trim() });
      setOk(true);
      toast("Account created — sign in to continue");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message);
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setError("");
    setResending(true);
    try {
      const res = await api.post("/api/students/resend-otp", { email });
      if (res.devOtp) {
        setOtp(res.devOtp);
        setDevFilled(true);
      }
      toast(res.message || "A fresh code is on its way");
      setWait(60);
    } catch (err) {
      setWait(parseWait(err.message));
      setError(err.message);
      toast(err.message, "error");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth auth--center container">
      <section className="auth__panel">
        <div className="card">
          {ok ? (
            <div className="stack">
              <span className="badge">
                <span className="badge__dot badge__dot--live" />
                Verified
              </span>
              <h1 className="heading">You're on the books.</h1>
              <p className="card__sub">Taking you to the sign-in page…</p>
            </div>
          ) : (
            <>
              <h1 className="heading">Enter the code</h1>
              <p className="card__sub mt-8">
                Sent to <strong>{email || "your college email"}</strong>
              </p>

              <form onSubmit={verify} className="mt-32">
                <div className="field">
                  <label className="field__label" htmlFor="otp">
                    6-digit code
                  </label>
                  <input
                    id="otp"
                    className="input input--mono"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="•  •  •  •  •  •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    autoFocus
                    required
                  />
                  {devFilled ? (
                    <span className="field__hint">
                      Auto-filled for local development — email delivery isn't
                      configured, so the code couldn't be sent to your inbox.
                    </span>
                  ) : null}
                </div>

                {error ? <div className="form-error auth__error">{error}</div> : null}

                <div className="auth__submit">
                  <button className="btn btn--primary btn--block" disabled={busy}>
                    {busy ? <span className="spinner" /> : null} Verify &amp; create account
                  </button>
                </div>
              </form>

              <div className="auth__foot">
                {wait > 0 ? (
                  <span>Roughly {wait}s before you can ask for a new code.</span>
                ) : (
                  <>
                    <span>Didn't get it?</span>
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={resend}
                      disabled={resending}
                    >
                      {resending ? "Sending…" : "Resend code"}
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        <p className="caption mt-16" style={{ textAlign: "center" }}>
          <Link to="/login">Back to sign in</Link>
        </p>
      </section>
    </div>
  );
}