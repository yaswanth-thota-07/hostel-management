import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { navigate } from "../router.jsx";

export default function LoginSection() {
  const {
    loginStudent,
    signupStudent,
    verifyStudentOtp,
    resendStudentOtp,
    loginSubAdmin,
    loginAdmin,
  } = useAuth();

  const [activeRole, setActiveRole] = useState("student");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regNo, setRegNo] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const startResendTimer = () => {
    setResendCooldown(120);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (activeRole === "student") {
        await loginStudent(loginEmail.trim(), loginPassword);
        navigate("/student/complaints");
      } else if (activeRole === "subadmin") {
        await loginSubAdmin(loginEmail.trim(), loginPassword);
        navigate("/staff/complaints");
      } else if (activeRole === "admin") {
        await loginAdmin(loginEmail.trim(), loginPassword);
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!regEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }

    if (!/^\d{10}$/.test(regPhone)) {
      setErrorMessage("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      await signupStudent({
        name: regName.trim(),
        email: regEmail.trim(),
        regNo: regNo.trim(),
        phone: regPhone.trim(),
        password: regPassword,
        confirmPassword: regConfirmPassword,
      });
      setOtpModalOpen(true);
      startResendTimer();
    } catch (err) {
      setErrorMessage(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await verifyStudentOtp(regEmail.trim(), otpValue.trim());
      setOtpModalOpen(false);
      setIsRegistering(false);
      setSuccessMessage(res.message || "Account created successfully! Please sign in.");
      setLoginEmail(regEmail.trim());
      setLoginPassword("");
      setOtpValue("");
    } catch (err) {
      setErrorMessage(err.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setErrorMessage("");
    try {
      const res = await resendStudentOtp(regEmail.trim());
      startResendTimer();
      setSuccessMessage(res?.message || "A fresh OTP has been dispatched to your email.");
    } catch (err) {
      setErrorMessage(err.message || "Failed to resend OTP.");
    }
  };

  return (
    <section className="login-section login-section-full" id="login">
      <img
        src="/logo11.png"
        alt="Hostel Management Logo"
        className="main-login-logo"
      />

      <h1 className="section-heading" style={{ fontSize: "clamp(30px, 4vw, 42px)" }}>
        Hostel Management
      </h1>
      <p className="section-sub">
        {isRegistering
          ? "Register as a new user using your college credentials."
          : "Sign in to access your hostel management workspace."}
      </p>

      <div className="role-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeRole === "student"}
          className={`role-tab ${activeRole === "student" ? "role-tab-active" : ""}`}
          onClick={() => {
            setActiveRole("student");
            setErrorMessage("");
          }}
        >
          Student
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeRole === "subadmin"}
          className={`role-tab ${activeRole === "subadmin" ? "role-tab-active" : ""}`}
          onClick={() => {
            setActiveRole("subadmin");
            setIsRegistering(false);
            setErrorMessage("");
          }}
        >
          Staff
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeRole === "admin"}
          className={`role-tab ${activeRole === "admin" ? "role-tab-active" : ""}`}
          onClick={() => {
            setActiveRole("admin");
            setIsRegistering(false);
            setErrorMessage("");
          }}
        >
          Admin/Warden
        </button>
      </div>

      <div className="login-card" style={{ marginTop: "12px" }}>
        {errorMessage && <div className="form-alert form-alert-error">{errorMessage}</div>}
        {successMessage && <div className="form-alert form-alert-success">{successMessage}</div>}

        {activeRole === "student" && (
          <div style={{ display: "flex", gap: "10px", marginBottom: "4px" }}>
            <button
              type="button"
              className={`pill-btn ${!isRegistering ? "pill-btn-primary" : "pill-btn-ghost"} pill-btn-sm`}
              style={{ flex: 1 }}
              onClick={() => {
                setIsRegistering(false);
                setErrorMessage("");
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`pill-btn ${isRegistering ? "pill-btn-primary" : "pill-btn-ghost"} pill-btn-sm`}
              style={{ flex: 1 }}
              onClick={() => {
                setIsRegistering(true);
                setErrorMessage("");
              }}
            >
              New User
            </button>
          </div>
        )}

        {!isRegistering ? (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div className="field">
              <label className="field-label" htmlFor="email-input">
                {activeRole === "student"
                  ? "Student Email ID"
                  : activeRole === "subadmin"
                  ? "Staff Email ID"
                  : "Admin Email ID"}
              </label>
              <input
                id="email-input"
                type="email"
                required
                className="field-input"
                placeholder={
                  activeRole === "student"
                    ? "student@example.com"
                    : activeRole === "subadmin"
                    ? "staff@example.com"
                    : "admin@example.com"
                }
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="password-input">
                Password
              </label>
              <input
                id="password-input"
                type="password"
                required
                className="field-input"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="pill-btn pill-btn-primary pill-btn-block"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="field">
              <label className="field-label" htmlFor="reg-name">
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                required
                className="field-input"
                placeholder="e.g. Rahul Sharma"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="reg-email">
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                required
                className="field-input"
                placeholder="student@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="reg-no">
                Registration / Roll Number
              </label>
              <input
                id="reg-no"
                type="text"
                required
                className="field-input"
                placeholder="e.g. 21145"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="reg-phone">
                Mobile Number (10 digits)
              </label>
              <input
                id="reg-phone"
                type="tel"
                required
                maxLength="10"
                className="field-input"
                placeholder="9876543210"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="reg-pass">
                Password
              </label>
              <input
                id="reg-pass"
                type="password"
                required
                minLength="6"
                className="field-input"
                placeholder="Minimum 6 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="reg-confirm">
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                type="password"
                required
                className="field-input"
                placeholder="Re-enter password"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="pill-btn pill-btn-primary pill-btn-block"
            >
              {loading ? "Sending OTP..." : "Continue to Verification"}
            </button>
          </form>
        )}
      </div>

      {otpModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-head">
              <div>
                <h3 className="modal-title">Verify Email OTP</h3>
                <p className="modal-sub">
                  A 6-digit verification code was sent to <strong>{regEmail}</strong>
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setOtpModalOpen(false)}
              >
                ×
              </button>
            </div>

            {errorMessage && <div className="form-alert form-alert-error">{errorMessage}</div>}
            {successMessage && <div className="form-alert form-alert-success">{successMessage}</div>}

            <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div className="field">
                <label className="field-label" htmlFor="otp-input">
                  Enter 6-Digit OTP
                </label>
                <input
                  id="otp-input"
                  type="text"
                  maxLength="6"
                  required
                  autoFocus
                  className="field-input"
                  style={{
                    fontSize: "24px",
                    textAlign: "center",
                    letterSpacing: "0.4em",
                    fontWeight: "700",
                  }}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Didn't receive the email?"}
                </span>
                <button
                  type="button"
                  disabled={resendCooldown > 0}
                  className="pill-btn pill-btn-ghost pill-btn-sm"
                  onClick={handleResendOtp}
                >
                  Resend Code
                </button>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="pill-btn pill-btn-ghost"
                  onClick={() => setOtpModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || otpValue.length !== 6}
                  className="pill-btn pill-btn-primary"
                >
                  {loading ? "Verifying..." : "Verify & Activate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
