"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

import portfolioService from "@/app/apiservice/portfolioservice";
import "./portfolioview.css";

interface PortfolioDetail {
    title: string;
    desc: string;
}

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
    details: PortfolioDetail[];
    objectives: PortfolioDetail[];
    concepts: PortfolioDetail[];
}

function PortfolioView() {
    const router = useRouter();
    const params = useParams();

    const slug = decodeURIComponent(String(params.slug || ""));

    const [portfolio, setPortfolio] = useState<PortfolioItem | null>(null);
    const [loading, setLoading] = useState(true);

    const getSlug = (title: string) => {
        return title.trim().toLowerCase().replace(/\s+/g, "-");
    };

    const fetchPortfolio = async () => {
        try {
            setLoading(true);

            const response = await portfolioService.getAll();

            let result: any = response;

            if (typeof result === "string") {
                result = JSON.parse(
                    result.replace(/```(?:json|php)?|```/g, "").trim()
                );
            }

            if (result?.data?.success !== undefined) {
                result = result.data;
            } else if (result?.data?.data?.success !== undefined) {
                result = result.data.data;
            }

            if (result?.success === true) {
                const portfolios: PortfolioItem[] = Array.isArray(result.data)
                    ? result.data
                    : [];

                const selectedPortfolio = portfolios.find(
                    (item) => getSlug(item.title) === slug
                );

                if (!selectedPortfolio) {
                    Swal.fire({
                        icon: "error",
                        title: "Portfolio Not Found",
                        text: "The requested portfolio could not be found.",
                        confirmButtonColor: "#6668E7",
                    }).then(() => {
                        router.push("/admin/portfolio");
                    });

                    return;
                }

                setPortfolio({
                    ...selectedPortfolio,
                    details: selectedPortfolio.details || [],
                    objectives: selectedPortfolio.objectives || [],
                    concepts: selectedPortfolio.concepts || [],
                });
            } else {
                throw new Error(
                    result?.message || "Unable to retrieve portfolio."
                );
            }
        } catch (error: any) {
            console.error("Portfolio view error:", error);

            Swal.fire({
                icon: "error",
                title: "Something Went Wrong",
                text:
                    error.response?.data?.message ||
                    error.message ||
                    "Unable to load portfolio details.",
                confirmButtonColor: "#6668E7",
            }).then(() => {
                router.push("/admin/portfolio");
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) {
            fetchPortfolio();
        }
    }, [slug]);

    const handleEdit = () => {
        if (!portfolio) return;

        router.push(
            `/admin/portfolio/edit/${encodeURIComponent(
                getSlug(portfolio.title)
            )}`
        );
    };

    if (loading) {
        return (
            <section className="tm-admin-page portfolio-view-page">
                <div className="portfolio-view-loading">
                    <div className="tm-spinner"></div>
                    <p>Loading portfolio details...</p>
                </div>
            </section>
        );
    }

    if (!portfolio) {
        return null;
    }

    const imageUrl = portfolio.image_url || portfolio.image;

    return (
        <section className="tm-admin-page portfolio-view-page">
            <div className="container">

                {/* PAGE HEADER */}
                <div className="tm-admin-header portfolio-view-header">

                    <div>
                        <span className="tm-admin-eyebrow">
                            CONTENT MANAGEMENT
                        </span>

                        <h1>Portfolio Details</h1>

                        <p>
                            View complete information about your portfolio
                            project.
                        </p>
                    </div>

                    <div className="portfolio-view-header-actions">

                        <button
                            type="button"
                            className="tm-btn tm-btn-back"
                            onClick={() => router.push("/admin/portfolio")}
                        >
                            <i className="bi bi-arrow-left"></i>
                            Back to Portfolio
                        </button>

                        <button
                            type="button"
                            className="tm-btn tm-btn-primary"
                            onClick={handleEdit}
                        >
                            <i className="bi bi-pencil-square"></i>
                            Edit Portfolio
                        </button>

                    </div>

                </div>

                {/* PROJECT SUMMARY */}
                <div className="portfolio-view-summary">

                    <div className="portfolio-view-summary-image">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={portfolio.title}
                            />
                        ) : (
                            <i className="bi bi-briefcase-fill"></i>
                        )}
                    </div>

                    <div className="portfolio-view-summary-content">

                        <div className="portfolio-view-tags">

                            {portfolio.category && (
                                <span className="portfolio-view-category">
                                    {portfolio.category}
                                </span>
                            )}

                            {portfolio.portfolio_badge && (
                                <span className="portfolio-view-badge">
                                    <i className="bi bi-award-fill"></i>
                                    {portfolio.portfolio_badge}
                                </span>
                            )}

                        </div>

                        <h2>{portfolio.title}</h2>

                        <p className="portfolio-view-owner">
                            <i className="bi bi-person-circle"></i>
                            Project Owner:{" "}
                            <strong>
                                {portfolio.project_owner || "Not specified"}
                            </strong>
                        </p>

                        <p className="portfolio-view-summary-description">
                            {portfolio.category_desc ||
                                "No category description available."}
                        </p>

                    </div>

                </div>

                {/* DESCRIPTION */}
                <div className="portfolio-view-card">

                    <div className="portfolio-view-section-heading">
                        <div className="portfolio-view-section-icon">
                            <i className="bi bi-file-text"></i>
                        </div>

                        <div>
                            <h3>Project Description</h3>
                            <p>
                                Detailed overview of the portfolio project.
                            </p>
                        </div>
                    </div>

                    {portfolio.desc ? (
                        <div
                            className="portfolio-view-rich-content"
                            dangerouslySetInnerHTML={{
                                __html: portfolio.desc,
                            }}
                        />
                    ) : (
                        <p className="portfolio-view-empty">
                            No project description available.
                        </p>
                    )}

                </div>

                {/* PROJECT DETAILS */}
                <div className="portfolio-view-card">

                    <div className="portfolio-view-section-heading">
                        <div className="portfolio-view-section-icon">
                            <i className="bi bi-list-check"></i>
                        </div>

                        <div>
                            <h3>Project Details</h3>
                            <p>
                                Important information about this project.
                            </p>
                        </div>
                    </div>

                    {portfolio.details.length > 0 ? (

                        <div className="row g-3">

                            {portfolio.details.map((item, index) => (
                                <div
                                    className="col-lg-6 col-md-6 col-12"
                                    key={index}
                                >
                                    <div className="portfolio-view-detail-item">

                                        <span className="portfolio-view-number">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        <div>
                                            <h4>{item.title}</h4>
                                            <p>{item.desc}</p>
                                        </div>

                                    </div>
                                </div>
                            ))}

                        </div>

                    ) : (
                        <p className="portfolio-view-empty">
                            No project details available.
                        </p>
                    )}

                </div>

                {/* OBJECTIVES */}
                <div className="portfolio-view-card">

                    <div className="portfolio-view-section-heading">
                        <div className="portfolio-view-section-icon">
                            <i className="bi bi-bullseye"></i>
                        </div>

                        <div>
                            <h3>Project Objectives</h3>
                            <p>
                                Goals and objectives of this project.
                            </p>
                        </div>
                    </div>

                    {portfolio.objectives.length > 0 ? (

                        <div className="portfolio-view-objectives">

                            {portfolio.objectives.map((item, index) => (
                                <div
                                    className="portfolio-view-objective-item"
                                    key={index}
                                >
                                    <div className="portfolio-view-check">
                                        <i className="bi bi-check-lg"></i>
                                    </div>

                                    <div>
                                        <h4>{item.title}</h4>
                                        <p>{item.desc}</p>
                                    </div>
                                </div>
                            ))}

                        </div>

                    ) : (
                        <p className="portfolio-view-empty">
                            No project objectives available.
                        </p>
                    )}

                </div>

                {/* CONCEPTS */}
                <div className="portfolio-view-card">

                    <div className="portfolio-view-section-heading">
                        <div className="portfolio-view-section-icon">
                            <i className="bi bi-lightbulb"></i>
                        </div>

                        <div>
                            <h3>Project Concepts</h3>
                            <p>
                                Ideas and concepts used in this project.
                            </p>
                        </div>
                    </div>

                    {portfolio.concepts.length > 0 ? (

                        <div className="row g-3">

                            {portfolio.concepts.map((item, index) => (
                                <div
                                    className="col-lg-6 col-md-6 col-12"
                                    key={index}
                                >
                                    <div className="portfolio-view-concept-item">

                                        <div className="portfolio-view-concept-icon">
                                            <i className="bi bi-stars"></i>
                                        </div>

                                        <div>
                                            <h4>{item.title}</h4>
                                            <p>{item.desc}</p>
                                        </div>

                                    </div>
                                </div>
                            ))}

                        </div>

                    ) : (
                        <p className="portfolio-view-empty">
                            No project concepts available.
                        </p>
                    )}

                </div>

                {/* BOTTOM ACTIONS */}
                <div className="portfolio-view-bottom">

                    <button
                        type="button"
                        className="tm-btn tm-btn-back"
                        onClick={() => router.push("/admin/portfolio")}
                    >
                        <i className="bi bi-arrow-left"></i>
                        Back to Portfolio
                    </button>

                    <button
                        type="button"
                        className="tm-btn tm-btn-primary"
                        onClick={handleEdit}
                    >
                        <i className="bi bi-pencil-square"></i>
                        Edit Portfolio
                    </button>

                </div>

            </div>
        </section>
    );
}

export default PortfolioView;