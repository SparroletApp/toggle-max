"use client";

import { useState } from "react";
import "./login.css";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    console.log({
      email,
      password,
      rememberMe,
    });

    alert("Login form submitted successfully!");
  };

  return (
    <section className="admin-login">
      <div className="login-background-shape login-shape-one"></div>
      <div className="login-background-shape login-shape-two"></div>

      <div className="login-card">
        <div className="login-brand">
          <img
            src="/logo.webp"
            alt="Togglemax Logo"
            className="login-logo-image"
          />
        </div>
        <div className="login-heading">
          <h1>Welcome back!</h1>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-form-group">
            <label htmlFor="admin-email">
              Email Address
            </label>
            <div className="login-input-wrapper">
              <i className="bi bi-envelope"></i>
              <input
                type="email"
                id="admin-email"
                name="email"
                placeholder="Enter your admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>
          <div className="login-form-group">
            <label htmlFor="admin-password">
              Password
            </label>
            <div className="login-input-wrapper">
              <i className="bi bi-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                id="admin-password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                <i
                  className={
                    showPassword
                      ? "bi bi-eye-slash"
                      : "bi bi-eye"
                  }
                ></i>
              </button>
            </div>
          </div>
          <button type="submit" className="login-submit">
            <span>Sign In to Dashboard</span>
            <i className="bi bi-arrow-right"></i>
          </button>
        </form>
        <div className="login-security-note">
          <i className="bi bi-shield-check"></i>
          <span>
            Secure access for authorized administrators only
          </span>
        </div>
      </div>
    </section>
  );
}
