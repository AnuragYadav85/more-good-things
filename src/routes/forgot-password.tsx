import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineKey,
  HiOutlineArrowLeft,
} from "react-icons/hi";
import { sendOtp, changePassword } from "@/lib/api/api";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — LMS" },
      { name: "description", content: "Reset your LMS password using OTP verification." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const showApiError = (err: any, fallback: string) => {
    if (err?.response) {
      toast.error(err.response.data?.message || err.response.data?.detail || fallback);
    } else {
      toast.error("Unable to connect to server. Please try again.");
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!email.trim() || !isValidEmail(email.trim())) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("email", email.trim());
      const res = await sendOtp(fd);
      const data = res?.data || {};
      if (data.success === false) {
        toast.error(data.message || "Failed to send OTP");
      } else {
        toast.success(data.message || "OTP sent");
        setOtpSent(true);
        setStep(2);
      }
    } catch (err: any) {
      showApiError(err, "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!otp.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("email", email.trim());
      fd.append("otp", otp.trim());
      fd.append("password", newPassword);
      fd.append("confirm_password", confirmPassword);
      const res = await changePassword(fd);
      const data = res?.data || {};
      if (data.success === false) {
        toast.error(data.message || "Failed to update password");
      } else {
        toast.success(data.message || "Password updated");
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setOtpSent(false);
        navigate({ to: data.redirect || "/login" });
      }
    } catch (err: any) {
      showApiError(err, "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">L</div>
          <span className="login-logo-text">
            {step === 3 ? "All Set" : "Reset Password"}
          </span>
          <span className="login-logo-sub">
            {step === 1 && "We'll send a verification code to your email."}
            {step === 2 && `Enter the OTP sent to ${email}`}
            {step === 3 && "Your password has been updated."}
          </span>
        </div>

        {step === 1 && (
          <form className="login-form" onSubmit={handleSendOTP}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon"><HiOutlineMail /></span>
                <input
                  type="email"
                  className="input-with-icon"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? <span className="spinner-inline" /> : "Send OTP"}
            </button>
            <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
              <Link
                to="/login"
                className="login-link"
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <HiOutlineArrowLeft /> Back to login
              </Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="login-form" onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label">OTP</label>
              <div className="input-wrapper">
                <span className="input-icon"><HiOutlineKey /></span>
                <input
                  type="text"
                  className="input-with-icon"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><HiOutlineLockClosed /></span>
                <input
                  type="password"
                  className="input-with-icon"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><HiOutlineLockClosed /></span>
                <input
                  type="password"
                  className="input-with-icon"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? <span className="spinner-inline" /> : "Reset Password"}
            </button>
          </form>
        )}

        {step === 3 && (
          <div style={{ textAlign: "center" }}>
            <Link to="/login" className="btn-login" style={{ display: "inline-block", textAlign: "center" }}>
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}