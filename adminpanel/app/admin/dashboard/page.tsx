"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import adminLoginService from "@/app/apiservice/adminloginservice";
import "./dashboard.css";

// SWEETALERT TOAST
const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    showCloseButton: true,
});

function Dashboard() {
    const router = useRouter();

    const [loggingOut, setLoggingOut] = useState(false);

    const dashboardItems = [
        {
            title: "Courses",
            description: "Manage courses, durations, curriculum and course details.",
            icon: "bi-mortarboard-fill",
            path: "/admin/courses",
            color: "purple",
            count: "Manage Courses",
        },
        {
            title: "Portfolio",
            description: "Add, edit and manage student projects and portfolio works.",
            icon: "bi-grid-1x2-fill",
            path: "/admin/portfolio",
            color: "blue",
            count: "Manage Projects",
        },
        {
            title: "Blog",
            description: "Create blog posts, update articles and manage content.",
            icon: "bi-journal-richtext",
            path: "/admin/blog",
            color: "orange",
            count: "Manage Articles",
        },
        {
            title: "FAQ",
            description: "Manage frequently asked questions and their answers.",
            icon: "bi-patch-question-fill",
            path: "/admin/faq",
            color: "green",
            count: "Manage FAQs",
        },
        {
            title: "Contact Us",
            description: "Manage contact information and website contact details.",
            icon: "bi-telephone-fill",
            path: "/admin/contact",
            color: "pink",
            count: "Manage Contact",
        },
    ];

    // LOGOUT
    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Logout?",
            text: "Are you sure you want to logout from the admin panel?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#6668e7",
            cancelButtonColor: "#747784",
            reverseButtons: true,
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setLoggingOut(true);

            await adminLoginService.logout();

            Toast.fire({
                icon: "success",
                title: "Logged out successfully!",
            });

            setTimeout(() => {
                router.replace("/admin-login");
            }, 1000);

        } catch (error: any) {
            console.error("Logout error:", error);

            // The logout service clears sessionStorage in its finally block.
            Toast.fire({
                icon: "error",
                title: "Session ended. Redirecting to login...",
            });

            setTimeout(() => {
                router.replace("/admin-login");
            }, 1000);

        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <section className="dashboard">

            <div className="container">

                {/* DASHBOARD HEADER */}

                <div className="dashboard-header">

                    <div>
                        <span className="dashboard-eyebrow">
                            ADMIN PANEL
                        </span>

                        <h1>Dashboard</h1>

                        <p>
                            Welcome back! Manage your Togglemax website
                            from one place.
                        </p>
                    </div>

                    <div className="dashboard-header-actions">

                        <button
                            type="button"
                            className="dashboard-logout-btn"
                            onClick={handleLogout}
                            disabled={loggingOut}
                        >
                            {loggingOut ? (
                                <>
                                    <span className="spinner-border spinner-border-sm"></span>
                                    Logging out...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-box-arrow-right"></i>
                                    Logout
                                </>
                            )}
                        </button>

                        <div className="dashboard-header-icon">
                            <i className="bi bi-speedometer2"></i>
                        </div>

                    </div>

                </div>

                {/* SECTION HEADER */}

                <div className="dashboard-section-header">

                    <div>
                        <h2>Website Management</h2>

                        <p>
                            Select a section to manage your website content.
                        </p>
                    </div>

                    <span className="dashboard-total">
                        <i className="bi bi-grid-fill"></i>
                        {dashboardItems.length} Sections
                    </span>

                </div>

                {/* DASHBOARD CARDS */}

                <div className="dashboard-grid">

                    {dashboardItems.map((item, index) => (

                        <div
                            className="dashboard-card"
                            key={index}
                            onClick={() => router.push(item.path)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    router.push(item.path);
                                }
                            }}
                        >

                            <div className="dashboard-card-top">

                                <div className={`dashboard-card-icon ${item.color}`}>
                                    <i className={`bi ${item.icon}`}></i>
                                </div>

                                <div className="dashboard-card-arrow">
                                    <i className="bi bi-arrow-up-right"></i>
                                </div>

                            </div>

                            <div className="dashboard-card-content">

                                <h3>{item.title}</h3>

                                <p>{item.description}</p>

                            </div>

                            <div className="dashboard-card-footer">

                                <span>{item.count}</span>

                                <i className="bi bi-arrow-right"></i>

                            </div>

                        </div>

                    ))}

                </div>

                {/* FOOTER NOTE */}

                <div className="dashboard-footer-note">

                    <div className="dashboard-footer-icon">
                        <i className="bi bi-lightbulb-fill"></i>
                    </div>

                    <div>
                        <h4>Manage Everything in One Place</h4>

                        <p>
                            Keep your courses, portfolio, blogs and website
                            content updated through your admin panel.
                        </p>
                    </div>

                </div>

            </div>

        </section>
    );
}

export default Dashboard;