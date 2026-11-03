"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import portfolioService from "@/app/apiservice/portfolioservice";
import "./portfolio.css";

interface PortfolioItem {
    id: number;
    category: string;
    category_desc: string | null;
    portfolio_badge: string | null;
    project_owner: string | null;
    title: string;
    desc: string | null;
    image: string | null;
    image_url: string | null;
    details: any[];
    objectives: any[];
    concepts: any[];
}

function Portfolio() {

    const router = useRouter();

    const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });
    const fetchPortfolios = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await portfolioService.getAll();

            console.log("Portfolio API Response:", response);

            let result: any = response;

            if (typeof result === "string") {
                result = JSON.parse(
                    result.replace(/```(?:json|php)?|```/g, "").trim()
                );
            }

            if (result?.data?.success !== undefined) {
                result = result.data;
            }

            if (result?.success === true) {

                setPortfolios(
                    Array.isArray(result.data) ? result.data : []
                );

                setError("");

            } else {

                setPortfolios([]);
                setError(
                    result?.message || "Unable to retrieve portfolios."
                );

            }

        } catch (error: any) {

            console.error("Portfolio fetching error:", error);

            setPortfolios([]);

            setError(
                error.response?.data?.message ||
                "Something went wrong while fetching portfolios."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchPortfolios();
    }, []);

    const filteredPortfolios = portfolios.filter((portfolio) => {

        const keyword = search.toLowerCase();

        return (
            portfolio.title?.toLowerCase().includes(keyword) ||
            portfolio.category?.toLowerCase().includes(keyword) ||
            portfolio.project_owner?.toLowerCase().includes(keyword) ||
            portfolio.portfolio_badge?.toLowerCase().includes(keyword) ||
            portfolio.desc?.toLowerCase().includes(keyword)
        );

    });

    const handleView = (title: string) => {

        const slug = title
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");

        router.push(
            `/admin/portfolio/view/${encodeURIComponent(slug)}`
        );

    };

    const handleEdit = (title: string) => {

        const slug = title
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");

        router.push(
            `/admin/portfolio/edit/${encodeURIComponent(slug)}`
        );

    };

    const handleDelete = async (id: number) => {

        const result = await Swal.fire({

            title: "Delete Portfolio?",

            text: "Are you sure you want to delete this portfolio? Its image will also be deleted. This action cannot be undone.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Yes, Delete",

            cancelButtonText: "Cancel",

            reverseButtons: true,

            confirmButtonColor: "#e74c3c",

            cancelButtonColor: "#747784",

            focusCancel: true,

        });

        if (!result.isConfirmed) {
            return;
        }

        try {

            Swal.fire({

                title: "Deleting Portfolio...",

                text: "Please wait while we delete the portfolio.",

                allowOutsideClick: false,

                allowEscapeKey: false,

                showConfirmButton: false,

                didOpen: () => {
                    Swal.showLoading();
                },

            });

            const apiResult = await portfolioService.delete(id);

            console.log(
                "DELETE PORTFOLIO RAW RESPONSE:",
                apiResult
            );

            let response: any = apiResult;

            if (typeof response === "string") {

                const cleanedResponse = response
                    .replace(/^```(?:php|json)?\s*/i, "")
                    .replace(/\s*```$/, "")
                    .trim();

                response = JSON.parse(cleanedResponse);

            }

            if (
                response?.success === undefined &&
                response?.data?.success !== undefined
            ) {
                response = response.data;
            }

            console.log(
                "FINAL DELETE RESPONSE:",
                response
            );

            Swal.close();

            if (
                response?.success === true ||
                response?.success === "true"
            ) {

                await Toast.fire({

                    icon: "success",

                    title:
                        response.message ||
                        "Portfolio deleted successfully!",

                });

                await fetchPortfolios();

            } else {

                await Toast.fire({

                    icon: "error",

                    title:
                        response?.message ||
                        "Unable to delete portfolio.",

                });

            }

        } catch (error: any) {

            console.error(
                "Portfolio deletion error:",
                error
            );

            Swal.close();

            Toast.fire({

                icon: "error",

                title:
                    error.response?.data?.message ||
                    "Something went wrong while deleting the portfolio.",

            });

        }

    };

    return (

        <section className="portfolio tm-admin-page">

 <div className="container">

            <div className="tm-admin-header">

                <div>

                    <span className="tm-admin-eyebrow">
                        CONTENT MANAGEMENT
                    </span>

                    <h1>Portfolio</h1>

                    <p>
                        Manage your projects, portfolio descriptions,
                        categories and project details.
                    </p>

                </div>

                <div className="tm-course-header-actions">

                    <button
                        type="button"
                        className="tm-btn tm-btn-back"
                        onClick={() => router.push("/admin/dashboard")}
                    >

                        <i className="bi bi-arrow-left"></i>

                        Back to Dashboard

                    </button>

                    <button
                        type="button"
                        className="tm-btn tm-btn-primary"
                        onClick={() => router.push("/admin/portfolio/create")}
                    >

                        <i className="bi bi-plus-lg"></i>

                        Add New Portfolio

                    </button>

                </div>

            </div>

            <div className="tm-course-summary">

                <div className="tm-course-summary-icon">

                    <i className="bi bi-briefcase-fill"></i>

                </div>

                <div>

                    <span>Total Portfolios</span>

                    <h3>{portfolios.length}</h3>

                </div>

            </div>

            <div className="tm-table-card">
                <div className="tm-table-header">

                    <div>

                        <h2>All Portfolios</h2>

                        <p>
                            View and manage all your portfolio projects.
                        </p>

                    </div>

                    <div className="tm-table-search">

                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            placeholder="Search portfolios..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {search && (

                            <button
                                type="button"
                                className="tm-search-clear"
                                onClick={() => setSearch("")}
                            >

                                <i className="bi bi-x-lg"></i>

                            </button>

                        )}

                    </div>

                </div>

                <div className="tm-table-responsive">

                    <table className="tm-admin-table">

                        <thead>

                            <tr>

                                <th>SL NO</th>

                                <th>PROJECT DETAILS</th>

                                <th>CATEGORY</th>

                                <th>PROJECT OWNER</th>

                                <th>BADGE</th>

                                <th>ACTIONS</th>

                            </tr>

                        </thead>

                        <tbody>


                            {loading ? (

                                <tr>

                                    <td colSpan={7}>

                                        <div className="tm-table-status">

                                            <div className="tm-spinner"></div>

                                            <p>Loading portfolios...</p>

                                        </div>

                                    </td>

                                </tr>

                            ) : error ? (

                                <tr>

                                    <td colSpan={7}>

                                        <div className="tm-table-status tm-error-status">

                                            <i className="bi bi-exclamation-circle"></i>

                                            <p>{error}</p>

                                            <button
                                                className="tm-btn tm-btn-outline"
                                                onClick={fetchPortfolios}
                                            >

                                                <i className="bi bi-arrow-clockwise"></i>

                                                Retry

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ) : filteredPortfolios.length === 0 ? (

                                <tr>

                                    <td colSpan={7}>

                                        <div className="tm-table-status">

                                            <i className="bi bi-briefcase"></i>

                                            <h4>

                                                {search
                                                    ? "No matching portfolios found"
                                                    : "No portfolios available"}

                                            </h4>

                                            <p>

                                                {search
                                                    ? "Try searching with another keyword."
                                                    : "Add your first portfolio to get started."}

                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (


                                filteredPortfolios.map((portfolio, index) => (

                                    <tr key={portfolio.id}>

                                        <td>

                                            <span className="tm-table-number">

                                                {String(index + 1).padStart(2, "0")}

                                            </span>

                                        </td>
                                        <td>

                                            <div className="tm-course-info">

                                                <div className="tm-course-image">

                                                    {portfolio.image_url ? (

                                                        <img
                                                            src={portfolio.image_url}
                                                            alt={portfolio.title}
                                                        />

                                                    ) : (

                                                        <i className="bi bi-briefcase-fill"></i>

                                                    )}

                                                </div>

                                                <div className="tm-course-text">

                                                    <h4>{portfolio.title}</h4>

                                                    <p className="tm-portfolio-description">

                                                        {portfolio.desc
                                                            ? portfolio.desc.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
                                                            : "No description available"}

                                                    </p>

                                                </div>

                                            </div>

                                        </td>
                                        <td>

                                            {portfolio.category ? (

                                                <span className="tm-course-badge">

                                                    {portfolio.category}

                                                </span>

                                            ) : (

                                                <span className="tm-no-badge">
                                                    No Category
                                                </span>

                                            )}

                                        </td>
                                        <td>

                                            <span className="tm-portfolio-owner">

                                                <i className="bi bi-person-circle"></i>

                                                {portfolio.project_owner || "Not specified"}

                                            </span>

                                        </td>
                                        <td>

                                            {portfolio.portfolio_badge ? (

                                                <span className="tm-course-badge">

                                                    {portfolio.portfolio_badge}

                                                </span>

                                            ) : (

                                                <span className="tm-no-badge">
                                                    No Badge
                                                </span>

                                            )}

                                        </td>
                        
                                        <td>

                                            <div className="tm-table-actions">

                                                <button
                                                    type="button"
                                                    className="tm-action-btn tm-view-btn"
                                                    title="View Portfolio"
                                                    onClick={() => handleView(portfolio.title)}
                                                >

                                                    <i className="bi bi-eye-fill"></i>

                                                </button>

                                                <button
                                                    type="button"
                                                    className="tm-action-btn tm-edit-btn"
                                                    title="Edit Portfolio"
                                                    onClick={() => handleEdit(portfolio.title)}
                                                >

                                                    <i className="bi bi-pencil-square"></i>

                                                </button>

                                                <button
                                                    type="button"
                                                    className="tm-action-btn tm-delete-btn"
                                                    title="Delete Portfolio"
                                                    onClick={() => handleDelete(portfolio.id)}
                                                >

                                                    <i className="bi bi-trash3-fill"></i>

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

                {!loading && !error && filteredPortfolios.length > 0 && (

                    <div className="tm-table-footer">

                        <p>

                            Showing <strong>{filteredPortfolios.length}</strong> of{" "}

                            <strong>{portfolios.length}</strong> portfolios

                        </p>

                        <span>

                            <i className="bi bi-check-circle-fill"></i>

                            Portfolio management

                        </span>

                    </div>

                )}

            </div>
</div>
        </section>

    );

}

export default Portfolio;