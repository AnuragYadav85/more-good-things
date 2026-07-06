import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";
import { loginUser } from "@/lib/api/api";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — LMS" },
      { name: "description", content: "Sign in to the Leave Management System." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/dashboard", replace: true });
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      const res = await loginUser(formData);
      const data = res.data || {};
      if (data.success) {
        const u = data.user || {};
        login({
          email: u.email || email,
          designation: u.designation || "Employee",
        });
        navigate({ to: data.redirect || "/dashboard" });
      } else {
        toast.error(data.message || "Invalid email or password");
      }
    } catch (err: any) {
      if (err?.response) {
        toast.error(
          err.response.data?.message ||
            err.response.data?.detail ||
            "Invalid email or password",
        );
      } else {
        toast.error("Unable to connect to server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">L</div>
          <span className="login-logo-text">Leave Management</span>
          <span className="login-logo-sub">Sign in to your account</span>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <HiOutlineMail />
              </span>
              <input
                type="email"
                className="input-with-icon"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <HiOutlineLockClosed />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="input-with-icon"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>
          </div>

          <div className="login-actions">
            <Link to="/forgot-password" className="login-link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? <span className="spinner-inline" /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}