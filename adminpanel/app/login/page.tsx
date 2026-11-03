"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css";
import adminLoginService from "../apiservice/adminloginservice";

function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const parseResponse = (response: any) => {
        let result = response?.data ?? response;

        if (typeof result === "string") {
            result = result
                .replace(/^```(?:json|php)?\s*/i, "")
                .replace(/\s*```$/, "")
                .trim();

            result = JSON.parse(result);
        }

        return result;
    };

    const handleLogin = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            alert("Please enter your email and password.");
            return;
        }

        if (loading) return;

        setLoading(true);

        try {
            sessionStorage.removeItem("access_token");
            sessionStorage.removeItem("user");

            const response = await adminLoginService.login({
                email: email.trim(),
                password: password,
            });

            const result = parseResponse(response);

            console.log("LOGIN SUCCESS:", result?.success);
            console.log("LOGIN MESSAGE:", result?.message);

            const token = result?.token ?? result?.data?.token;
            const user = result?.user ?? result?.data?.user;
            if (result?.success === true && token) {
                sessionStorage.setItem("access_token", token);
                if (user) {
                    sessionStorage.setItem(
                        "user",
                        JSON.stringify(user)
                    );
                }

                alert("Login successful!");
                router.replace("/admin/dashboard");

            } else {
                alert(
                    result?.message ||
                    "Login failed. Authentication token was not received."
                );
            }

        } catch (error: any) {
            console.error("LOGIN ERROR:", error);

            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Invalid email or password. Please try again.";

            alert(errorMessage);

        } finally {
            setLoading(false);
        }
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

                <form
                    className="login-form"
                    onSubmit={handleLogin}
                >

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
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                autoComplete="username"
                                required
                                disabled={loading}
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
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                id="admin-password"
                                name="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                autoComplete="current-password"
                                required
                                disabled={loading}
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
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

                    <button
                        type="submit"
                        className="login-submit"
                        disabled={loading}
                    >
                        <span>
                            {loading
                                ? "Signing In..."
                                : "Sign In to Dashboard"}
                        </span>

                        <i
                            className={
                                loading
                                    ? "bi bi-arrow-repeat"
                                    : "bi bi-arrow-right"
                            }
                        ></i>
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

export default Login;