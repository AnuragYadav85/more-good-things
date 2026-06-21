import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Leave Management System" },
      { name: "description", content: "Corporate leave & complaint management." },
      { property: "og:title", content: "Leave Management System" },
      { property: "og:description", content: "Corporate leave & complaint management." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    navigate({ to: isAuthenticated ? "/dashboard" : "/login", replace: true });
  }, [loading, isAuthenticated, navigate]);

  return (
    <div className="login-container">
      <div className="spinner-container">
        <div className="spinner" />
      </div>
    </div>
  );
}
