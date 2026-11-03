"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";


import "./portfolio.css";
import portfolioService from "../apiservice/portfolioservice";

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
    details?: {
        title: string;
        desc: string;
    }[];
    objectives?: {
        title: string;
        desc: string;
    }[];
    concepts?: {
        title: string;
        desc: string;
    }[];
}

function Portfolio() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [projects, setProjects] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Generate slug from portfolio title
    const getSlug = (title: string) => {
        return title
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    };

    const fetchPortfolios = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await portfolioService.getAll();

            let result: any = response?.data ?? response;

            if (typeof result === "string") {
                result = JSON.parse(
                    result.replace(/```(?:json|php)?|```/g, "").trim()
                );
            }

            // Handle nested response
            while (
                result?.data &&
                !Array.isArray(result.data) &&
                typeof result.data === "object"
            ) {
                result = result.data;
            }

            if (result?.success === true && Array.isArray(result.data)) {
                setProjects(result.data);
            } else if (Array.isArray(result?.data)) {
                setProjects(result.data);
            } else if (Array.isArray(result)) {
                setProjects(result);
            } else {
                throw new Error(
                    result?.message || "Unable to load portfolios."
                );
            }
        } catch (error: any) {
            console.error("Portfolio fetch error:", error);

            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to load portfolio projects."
            );
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPortfolios();
    }, []);

    const categories = useMemo(() => {
        const uniqueCategories = Array.from(
            new Set(
                projects
                    .map((project) => project.category)
                    .filter((category): category is string =>
                        Boolean(category?.trim())
                    )
            )
        );

        return ["All", ...uniqueCategories];
    }, [projects]);

    // Filter projects
    const filteredProjects =
        activeCategory === "All"
            ? projects
            : projects.filter(
                (project) => project.category === activeCategory
            );

    // Get project icon based on category
    const getCategoryIcon = (category: string) => {
        const value = category.toLowerCase();

        if (value.includes("ui") || value.includes("ux")) {
            return "bi-vector-pen";
        }

        if (value.includes("web")) {
            return "bi-globe";
        }

        if (value.includes("mobile") || value.includes("app")) {
            return "bi-phone";
        }

        if (value.includes("graphic")) {
            return "bi-palette";
        }

        return "bi-briefcase";
    };

    // Get project image
    const getImage = (project: PortfolioItem) => {
        return project.image_url || project.image || "";
    };

    return (
        <section className="portfolio" id="student-portfolio">

            {/* PAGE BANNER */}
            <div className="aboutus-top portfolio-top">
                <div className="aboutus-overlay">
                    <div className="container">
                        <div className="aboutus-content">

                            <span className="aboutus-subtitle">
                                EXPLORE OUR STUDENT WORK
                            </span>

                            <h1>Student Portfolio</h1>

                            <p>
                                <Link href="/">Home</Link>
                                <i className="bi bi-chevron-right"></i>
                                <span>Student Portfolio</span>
                            </p>

                        </div>
                    </div>
                </div>
            </div>

            <div className="portfolio-container container">

                {/* PORTFOLIO CATEGORY STATS */}

                <div className="portfolio-stats">

                    {Array.from(
                        new Map(
                            projects
                                .filter((project) => project.category?.trim())
                                .map((project) => [
                                    project.category.trim(),
                                    project
                                ])
                        ).values()
                    ).map((project) => (

                        <div className="portfolio-stat" key={project.category}>

                            <i className={`bi ${getCategoryIcon(project.category)}`}></i>

                            <div>
                                <h3>{project.category}</h3>

                                <p>
                                    {project.category_desc ||
                                        "Creative Experiences"}
                                </p>
                            </div>

                        </div>

                    ))}

                </div>

                {/* CATEGORY FILTERS */}
                <div className="portfolio-filter-wrapper">

                    <div
                        className="portfolio-filters"
                        aria-label="Filter student projects"
                    >
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                className={`portfolio-filter ${activeCategory === category
                                    ? "active"
                                    : ""
                                    }`}
                                onClick={() =>
                                    setActiveCategory(category)
                                }
                                aria-pressed={
                                    activeCategory === category
                                }
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <span className="portfolio-project-count">
                        {filteredProjects.length} Projects
                    </span>

                </div>

                {/* LOADING */}
                {loading && (
                    <div className="portfolio-empty">
                        <div className="spinner-border"></div>
                        <p>Loading student portfolios...</p>
                    </div>
                )}

                {/* ERROR */}
                {!loading && error && (
                    <div className="portfolio-empty">
                        <i className="bi bi-exclamation-circle"></i>
                        <h3>Unable to load portfolios</h3>
                        <p>{error}</p>

                        <button
                            type="button"
                            className="portfolio-filter active"
                            onClick={fetchPortfolios}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* PORTFOLIO GRID */}
                {!loading && !error && filteredProjects.length > 0 && (

                    <div className="portfolio-grid">

                        {filteredProjects.map((project) => {

                            const image = getImage(project);

                            return (
                                <Link
                                    href={`/portfolio/${encodeURIComponent(getSlug(project.title))}`}
                                    className="portfolio-card"
                                    key={project.id}
                                    aria-label={`View ${project.title} project`}
                                    onClick={() => {
                                        localStorage.setItem("portfolio_id", String(project.id));
                                    }}
                                >
                                    {/* IMAGE */}
                                    <div className="portfolio-card-image">

                                        {image ? (
                                            <img
                                                src={image}
                                                alt={project.title}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="portfolio-no-image">
                                                <i className="bi bi-image"></i>
                                            </div>
                                        )}

                                        <span className="portfolio-card-category">
                                            {project.category}
                                        </span>

                                        <div className="portfolio-image-overlay">

                                            <span className="portfolio-overlay-icon">
                                                <i
                                                    className={`bi ${getCategoryIcon(
                                                        project.category
                                                    )}`}
                                                ></i>
                                            </span>

                                        </div>

                                    </div>

                                    {/* CARD CONTENT */}
                                    <div className="portfolio-card-content">

                                        {/* PROJECT OWNER */}
                                        <div className="portfolio-card-student">

                                            <span className="portfolio-student-icon">
                                                <i className="bi bi-person"></i>
                                            </span>

                                            <span>
                                                {project.project_owner ||
                                                    "Student Project"}
                                            </span>

                                        </div>

                                        {/* TITLE */}
                                        <h3>{project.title}</h3>

                                        {/* DESCRIPTION */}
                                        <p>
                                            {project.category_desc ||
                                                project.desc ||
                                                "Explore this creative student project."}
                                        </p>

                                        {/* FOOTER */}
                                        <div className="portfolio-card-footer">

                                            <span className="portfolio-project-type">
                                                <i className="bi bi-stars"></i>

                                                {project.portfolio_badge ||
                                                    "Student Work"}
                                            </span>

                                            <span className="portfolio-card-arrow">
                                                <i className="bi bi-arrow-up-right"></i>
                                            </span>

                                        </div>

                                    </div>

                                </Link>
                            );
                        })}

                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && !error && filteredProjects.length === 0 && (

                    <div className="portfolio-empty">

                        <i className="bi bi-images"></i>

                        <h3>No projects found</h3>

                        <p>
                            {projects.length === 0
                                ? "No portfolio projects have been added yet."
                                : "Try selecting another category."}
                        </p>

                    </div>

                )}

                {/* CALL TO ACTION */}
                <div className="portfolio-cta">

                    <div className="portfolio-cta-icon">
                        <i className="bi bi-lightbulb"></i>
                    </div>

                    <div className="portfolio-cta-content">

                        <h3>Ready to Create Something Amazing?</h3>

                        <p>
                            Learn UI/UX design, master industry tools, and
                            build your own professional design portfolio.
                        </p>

                    </div>

                    <Link
                        href="/contact-us"
                        className="portfolio-cta-button"
                    >
                        Start Your Journey
                        <i className="bi bi-arrow-up-right"></i>
                    </Link>

                </div>

            </div>

        </section>
    );
}

export default Portfolio;