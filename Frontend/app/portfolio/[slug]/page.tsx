"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import portfolioService from "@/app/apiservice/portfolioservice";
import "./portfolio-view.css";

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

function getSlug(title: string) {
    return title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

function parseApiResponse(response: any): any {
    let result = response?.data ?? response;
    if (typeof result === "string") {
        result = result
            .replace(/^```(?:php|json|javascript)?\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        try {
            result = JSON.parse(result);
        } catch (error) {
            console.error("Portfolio JSON parsing error:", error);
            return null;
        }
    }
    if (
        result &&
        typeof result === "object" &&
        !Array.isArray(result) &&
        result.data !== undefined
    ) {
        result = result.data;
    }

    return result;
}

function parseArray(value: any): PortfolioDetail[] {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    return [];
}

function normalizePortfolio(item: any): PortfolioItem {
    return {
        id: Number(item.id),
        category: item.category || "",
        category_desc: item.category_desc || null,
        portfolio_badge: item.portfolio_badge || null,
        project_owner: item.project_owner || null,
        title: item.title || "",
        desc: item.desc || null,
        image: item.image || null,
        image_url: item.image_url || null,
        details: parseArray(item.details),
        objectives: parseArray(item.objectives),
        concepts: parseArray(item.concepts),
    };
}

function getCategoryIcon(category: string) {
    const value = category.toLowerCase();

    if (value.includes("ui") || value.includes("ux")) {
        return "bi-palette";
    }

    if (value.includes("web")) {
        return "bi-globe";
    }

    if (value.includes("mobile") || value.includes("app")) {
        return "bi-phone";
    }

    if (value.includes("graphic")) {
        return "bi-brush";
    }

    return "bi-grid";
}

function getPlainText(value: string | null) {
    if (!value) return "";

    return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getPortfolioImage(portfolio: PortfolioItem) {
    if (portfolio.image_url) {
        return portfolio.image_url;
    }

    if (portfolio.image?.startsWith("http")) {
        return portfolio.image;
    }

    if (portfolio.image) {
        return `http://localhost:8000/storage/${portfolio.image}`;
    }

    return "";
}

function PortfolioView() {
    const params = useParams<{ slug: string }>();
    const slug = decodeURIComponent(String(params.slug || ""));

    const [portfolio, setPortfolio] = useState<PortfolioItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;

        let isMounted = true;

        const fetchPortfolio = async () => {
            try {
                setLoading(true);
                setNotFound(false);

                let selectedPortfolio: any = null;

                const storedId =
                    typeof window !== "undefined"
                        ? localStorage.getItem("portfolio_id")
                        : null;

                if (storedId) {
                    try {
                        const response = await portfolioService.getById(
                            Number(storedId)
                        );

                        selectedPortfolio = parseApiResponse(response);
                    } catch (error) {
                        console.error(
                            "Error fetching portfolio by ID:",
                            error
                        );
                    }
                }
                if (
                    !selectedPortfolio ||
                    getSlug(selectedPortfolio.title || "") !== slug
                ) {
                    const response = await portfolioService.getAll();
                    const portfolioList = parseApiResponse(response);

                    const items = Array.isArray(portfolioList)
                        ? portfolioList
                        : [];

                    selectedPortfolio = items.find(
                        (item: any) => getSlug(item.title || "") === slug
                    );
                }

                if (!selectedPortfolio) {
                    if (isMounted) {
                        setNotFound(true);
                        setPortfolio(null);
                    }
                    return;
                }

                const formattedPortfolio =
                    normalizePortfolio(selectedPortfolio);

                if (isMounted) {
                    setPortfolio(formattedPortfolio);
                    localStorage.setItem(
                        "portfolio_id",
                        String(formattedPortfolio.id)
                    );
                }
            } catch (error) {
                console.error("Error loading portfolio:", error);

                if (isMounted) {
                    setNotFound(true);
                    setPortfolio(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPortfolio();

        return () => {
            isMounted = false;
        };
    }, [slug]);

    if (loading) {
        return (
            <section className="portfolio-view-not-found">
                <div className="portfolio-view-not-found-icon">
                    <i className="bi bi-arrow-repeat"></i>
                </div>

                <h1>Loading Project...</h1>

                <p>Please wait while we load the student project details.</p>
            </section>
        );
    }

    if (notFound || !portfolio) {
        return (
            <section className="portfolio-view-not-found">
                <div className="portfolio-view-not-found-icon">
                    <i className="bi bi-images"></i>
                </div>

                <h1>Project Not Found</h1>

                <p>
                    Sorry, we could not find this student project.
                    Explore our portfolio to discover more creative work.
                </p>

                <Link
                    href="/portfolio"
                    className="portfolio-view-primary-button"
                >
                    <i className="bi bi-arrow-left"></i>
                    Back to Portfolio
                </Link>
            </section>
        );
    }

    const categoryIcon = getCategoryIcon(portfolio.category);
    const imageUrl = getPortfolioImage(portfolio);

    const heroDescription =
        getPlainText(portfolio.category_desc) ||
        getPlainText(portfolio.desc) ||
        "Explore this creative student project and discover the ideas behind its design.";

    return (
        <main className="portfolio-view-page">

            <section className="portfolio-view-hero container">
                <div className="portfolio-view-container">
                    <div className="portfolio-view-hero-grid">

                        <div className="portfolio-view-hero-content">

                            <span className="portfolio-view-eyebrow">
                                <span></span>
                                TOGGLEMAX STUDENT WORK
                            </span>

                            <span className="portfolio-view-category">
                                <i className={`bi ${categoryIcon}`}></i>
                                {portfolio.category}
                            </span>

                            <h1>{portfolio.title}</h1>

                            <p className="portfolio-view-description">
                                {heroDescription}
                            </p>

                            <div className="portfolio-view-student">
                                <span className="portfolio-view-student-icon">
                                    <i className="bi bi-person"></i>
                                </span>

                                <div>
                                    <small>PROJECT BY</small>
                                    <strong>
                                        {portfolio.project_owner ||
                                            "Togglemax Student"}
                                    </strong>
                                </div>
                            </div>

                            <a
                                href="#project-overview"
                                className="portfolio-view-primary-button"
                            >
                                Explore Project
                                <i className="bi bi-arrow-down-right"></i>
                            </a>

                        </div>

                        <div className="portfolio-view-hero-image">

                            <div className="portfolio-view-image-frame">

                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={portfolio.title}
                                    />
                                ) : (
                                    <div className="portfolio-no-image">
                                        <i className={`bi ${categoryIcon}`}></i>
                                        <span>No project image available</span>
                                    </div>
                                )}

                                <div className="portfolio-view-image-caption">

                                    <span>
                                        <i className={`bi ${categoryIcon}`}></i>
                                    </span>

                                    <div>
                                        <strong>{portfolio.title}</strong>
                                        <small>Student Design Project</small>
                                    </div>

                                </div>

                            </div>

                            <div className="portfolio-view-floating-badge">
                                <i className="bi bi-stars"></i>
                                Creative Thinking
                            </div>

                        </div>

                    </div>
                </div>
            </section>

            <section
                className="portfolio-view-overview container"
                id="project-overview"
            >
                <div className="portfolio-view-container">

                    <div className="portfolio-view-section-heading">

                        <h2>
                            Turning Ideas Into{" "}
                            <strong>Meaningful Experiences.</strong>
                        </h2>

                        <p>
                            Discover the ideas, design decisions, and creative
                            thinking behind this student project.
                        </p>

                    </div>

                    <div className="portfolio-view-details-grid">


                        <div className="portfolio-view-details">

                            {portfolio.objectives.map((item, index) => (
                                <article
                                    className="portfolio-view-detail-item"
                                    key={`objective-${index}`}
                                >

                                    <span className="portfolio-view-detail-number">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <div>
                                        <h3>{item.title}</h3>
                                        <p>{item.desc}</p>
                                    </div>

                                </article>
                            ))}

                        </div>



                        <aside className="portfolio-view-info">

                            <div className="portfolio-view-info-heading">
                                <span>
                                    <i className="bi bi-grid-1x2"></i>
                                </span>

                                <div>
                                    <h3>Project Details</h3>
                                    <p>Project at a glance</p>
                                </div>
                            </div>

                            {portfolio.details.map((item, index) => (
                                <div
                                    className="portfolio-view-info-row"
                                    key={`detail-${index}`}
                                >
                                    <div>
                                        <strong>{item.title}</strong>
                                        <p>{item.desc}</p>
                                    </div>
                                </div>
                            ))}

                        </aside>
                    </div>
                </div>
            </section>



            <section className="portfolio-view-process">

                <div className="portfolio-view-container container">

                    <div className="portfolio-view-section-heading">

                        <span>OUR CREATIVE APPROACH</span>

                        <h2>
                            From Concept to{" "}
                            <strong>Creation.</strong>
                        </h2>

                        <p>
                            A thoughtful process transforms creative ideas into
                            practical and engaging design experiences.
                        </p>

                    </div>

                    <div className="portfolio-view-process-grid">

                        {portfolio.concepts.map((item, index) => (
                            <article
                                className="portfolio-view-process-card"
                                key={`concept-${index}`}
                            >

                                <div className="portfolio-view-process-top">

                                    <span>
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <i className="bi bi-lightbulb"></i>

                                </div>

                                <h3>{item.title}</h3>

                                <p>{item.desc}</p>

                            </article>
                        ))}

                    </div>

                </div>

            </section>


            {/* CALL TO ACTION */}

            <section className="portfolio-view-cta-section">

                <div className="container">

                    <div className="portfolio-view-cta">

                        <div className="portfolio-view-cta-content">

                            <span>START YOUR CREATIVE JOURNEY</span>

                            <h2>
                                Your Ideas Deserve to{" "}
                                <strong>Come to Life.</strong>
                            </h2>

                            <p>
                                Learn UI/UX design, explore industry tools,
                                develop practical skills, and build a portfolio
                                that showcases your creativity.
                            </p>

                            <div className="portfolio-view-cta-actions">

                                <Link
                                    href="/contact-us"
                                    className="portfolio-view-primary-button"
                                >
                                    Start Your Journey
                                    <i className="bi bi-arrow-up-right"></i>
                                </Link>

                                <Link
                                    href="/portfolio"
                                    className="portfolio-view-secondary-button"
                                >
                                    <i className="bi bi-arrow-left"></i>
                                    Back to Portfolio
                                </Link>

                            </div>

                        </div>

                        <div className="portfolio-view-cta-icon">
                            <i className="bi bi-lightbulb"></i>
                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default PortfolioView;