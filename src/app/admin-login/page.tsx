"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import "@/app/page.css";
import Navbar from "@/components/Layout/Navbar";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user, isAdmin } = useAuth() as any;
  const router = useRouter();

  // Auto-redirect if already logged in as admin
  useEffect(() => {
    if (user && isAdmin()) {
      router.push('/admin-dashboard');
    }
  }, [user, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (typeof login !== "function") {
        setError("Login is not available. Please try again later.");
        return;
      }

      const result = await login(email, password);
      const role = result?.data?.user?.role;
      if (result.success && (role === "admin" || role === "superAdmin")) {
        router.push("/admin-dashboard");
      } else {
        setError("Admin credentials required");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error("Admin login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Admin Login</h1>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div
            style={{
              marginTop: "16px",
              fontSize: "14px",
              color: "var(--gray-color)",
            }}
          >
            Try: admin@test.com (password: any)
          </div>
        </div>
      </div>
    </>
  );
}
