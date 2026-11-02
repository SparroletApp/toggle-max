"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import "./portfolio-view.css";

const projects = [
    {
        slug: "e-commerce-app-design",
        title: "E-Commerce App Design",
        category: "UI/UX Design",
        student: "UI/UX Student Project",
        image: "/graphic-attract.jpg",
        icon: "bi-bag",
        description:
            "A modern shopping experience designed with intuitive navigation and a user-friendly interface.",
        overview:
            "This e-commerce application concept focuses on creating a seamless online shopping experience. It combines a clean interface, intuitive navigation, and an organized product browsing experience to help users discover products and complete purchases effortlessly.",
        objective:
            "To design a user-friendly shopping application that simplifies product discovery, improves navigation, and creates a smooth checkout experience.",
        challenge:
            "Organizing a large product collection while maintaining a simple interface and making important shopping actions easy to find.",
        solution:
            "A structured product layout, clear visual hierarchy, intuitive category navigation, and consistent interface elements improve usability.",
        tools: ["Figma", "UI Design", "UX Research", "Prototyping"],
    },
    {
        slug: "travel-website",
        title: "Travel Website",
        category: "Web Design",
        student: "Web Design Student Project",
        image: "/graphicss.jpg",
        icon: "bi-globe",
        description:
            "A visually engaging travel website designed to make exploring destinations simple and enjoyable.",
        overview:
            "A travel website concept that helps visitors explore destinations, discover travel experiences, and plan their next adventure through an engaging digital experience.",
        objective:
            "To make destination discovery and travel planning visually engaging and easy to navigate.",
        challenge:
            "Presenting destination information and travel inspiration without overwhelming visitors.",
        solution:
            "Destination-focused imagery, clear navigation, and structured content create an enjoyable browsing experience.",
        tools: ["Figma", "Web Design", "UI Design", "Prototyping"],
    },
    {
        slug: "food-delivery-app",
        title: "Food Delivery App",
        category: "Mobile App",
        student: "UI/UX Student Project",
        image: "/figma.jpg",
        icon: "bi-phone",
        description:
            "A mobile application concept focused on seamless food discovery, ordering, and delivery tracking.",
        overview:
            "This food delivery application concept brings restaurant discovery, menu browsing, ordering, and delivery tracking into one simple mobile experience.",
        objective:
            "To simplify food ordering with an intuitive interface and a clear checkout process.",
        challenge:
            "Helping users quickly find meals, compare options, and understand their order status.",
        solution:
            "Search-friendly navigation, organized restaurant listings, clear menus, and straightforward ordering steps.",
        tools: ["Figma", "Mobile UI Design", "UX Research", "Prototyping"],
    },
    {
        slug: "brand-identity-design",
        title: "Brand Identity Design",
        category: "Graphic Design",
        student: "Graphic Design Student Project",
        image: "/adobe.jpg",
        icon: "bi-palette",
        description:
            "A creative branding project featuring a distinctive visual identity, typography, and color system.",
        overview:
            "A visual branding concept that explores how colors, typography, graphic elements, and brand assets work together to communicate a consistent brand personality.",
        objective:
            "To develop a memorable visual identity that communicates a brand's personality across different touchpoints.",
        challenge:
            "Creating a distinctive visual language that remains consistent across multiple formats.",
        solution:
            "A cohesive color palette, carefully selected typography, and consistent graphic elements create a recognizable brand identity.",
        tools: [
            "Adobe Illustrator",
            "Adobe Photoshop",
            "Typography",
            "Brand Design",
        ],
    },
    {
        slug: "finance-dashboard",
        title: "Finance Dashboard",
        category: "UI/UX Design",
        student: "UI/UX Student Project",
        image: "/courses.jpg",
        icon: "bi-bar-chart",
        description:
            "A clean dashboard interface that presents financial insights through structured layouts and data visualization.",
        overview:
            "A finance dashboard concept designed to make financial information easier to understand through organized data, clear visualizations, and accessible interface components.",
        objective:
            "To present complex financial information in a clear, structured, and easy-to-understand interface.",
        challenge:
            "Displaying different financial metrics without making the dashboard visually crowded.",
        solution:
            "A modular layout, clear typography, and carefully organized charts improve the dashboard experience.",
        tools: ["Figma", "Dashboard Design", "Data Visualization", "Prototyping"],
    },
    {
        slug: "fitness-mobile-app",
        title: "Fitness Mobile App",
        category: "Mobile App",
        student: "UI/UX Student Project",
        image: "/uiux.jpg",
        icon: "bi-heart-pulse",
        description:
            "A fitness application concept designed to help users track workouts, monitor progress, and build healthy habits.",
        overview:
            "A fitness application concept that helps users organize workouts, track their activity, and monitor their progress through a simple and motivating mobile interface.",
        objective:
            "To create a fitness tracking experience that makes workout planning and progress monitoring accessible.",
        challenge:
            "Presenting workout information and progress metrics in a way that is easy to understand.",
        solution:
            "A structured dashboard, clear progress indicators, and accessible workout information create an engaging experience.",
        tools: ["Figma", "Mobile UI Design", "UX Research", "Prototyping"],
    },
];

const designProcess = [
    {
        number: "01",
        title: "Research",
        icon: "bi-search",
        description:
            "Understand user needs, identify problems, and explore ideas before starting the design.",
    },
    {
        number: "02",
        title: "Wireframing",
        icon: "bi-bezier2",
        description:
            "Plan the structure, navigation, and essential elements of the project.",
    },
    {
        number: "03",
        title: "Visual Design",
        icon: "bi-palette",
        description:
            "Develop the visual identity using typography, colors, layouts, and design components.",
    },
    {
        number: "04",
        title: "Prototyping",
        icon: "bi-phone",
        description:
            "Connect screens and demonstrate how the final design works.",
    },
];

function PortfolioView() {
    const params = useParams<{ slug: string }>();
    const slug = params.slug;

    const project = projects.find((item) => item.slug === slug);

    if (!project) {
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
                                <i className={`bi ${project.icon}`}></i>
                                {project.category}
                            </span>

                            <h1>{project.title}</h1>

                            <p className="portfolio-view-description">
                                {project.description}
                            </p>

                            <div className="portfolio-view-student">
                                <span className="portfolio-view-student-icon">
                                    <i className="bi bi-person"></i>
                                </span>

                                <div>
                                    <small>PROJECT BY</small>
                                    <strong>{project.student}</strong>
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
                                <img
                                    src={project.image}
                                    alt={project.title}
                                />

                                <div className="portfolio-view-image-caption">
                                    <span>
                                        <i className={`bi ${project.icon}`}></i>
                                    </span>

                                    <div>
                                        <strong>{project.title}</strong>
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
                            <article className="portfolio-view-detail-item">
                                <span className="portfolio-view-detail-number">
                                    01
                                </span>
                                <div>
                                    <h3>Project Overview</h3>
                                    <p>{project.overview}</p>
                                </div>
                            </article>

                            <article className="portfolio-view-detail-item">
                                <span className="portfolio-view-detail-number">
                                    02
                                </span>

                                <div>
                                    <h3>Project Objective</h3>
                                    <p>{project.objective}</p>
                                </div>
                            </article>

                            <article className="portfolio-view-detail-item">
                                <span className="portfolio-view-detail-number">
                                    03
                                </span>

                                <div>
                                    <h3>The Challenge</h3>
                                    <p>{project.challenge}</p>
                                </div>
                            </article>

                            <article className="portfolio-view-detail-item">
                                <span className="portfolio-view-detail-number">
                                    04
                                </span>

                                <div>
                                    <h3>The Solution</h3>
                                    <p>{project.solution}</p>
                                </div>
                            </article>
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

                            <div className="portfolio-view-info-row">
                                <span>Project Name</span>
                                <strong>{project.title}</strong>
                            </div>

                            <div className="portfolio-view-info-row">
                                <span>Category</span>
                                <strong>{project.category}</strong>
                            </div>

                            <div className="portfolio-view-info-row">
                                <span>Project Type</span>
                                <strong>Student Project</strong>
                            </div>

                            <div className="portfolio-view-info-row">
                                <span>Created By</span>
                                <strong>Togglemax Student</strong>
                            </div>

                            <div className="portfolio-view-tools">
                                <h4>
                                    <i className="bi bi-tools"></i>
                                    Tools & Skills
                                </h4>

                                <div>
                                    {project.tools.map((tool) => (
                                        <span key={tool}>{tool}</span>
                                    ))}
                                </div>
                            </div>
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
                        {designProcess.map((step) => (
                            <article
                                className="portfolio-view-process-card"
                                key={step.number}
                            >
                                <div className="portfolio-view-process-top">
                                    <span>{step.number}</span>

                                    <i className={`bi ${step.icon}`}></i>
                                </div>

                                <h3>{step.title}</h3>

                                <p>{step.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
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