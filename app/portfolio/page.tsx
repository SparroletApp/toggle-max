"use client";

import { useState } from "react";
import "./portfolio.css";

function Portfolio() {
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = [
        "All",
        "UI/UX Design",
        "Web Design",
        "Mobile App",
        "Graphic Design",
    ];

    const projects = [
        {
            id: 1,
            title: "E-Commerce App Design",
            category: "UI/UX Design",
            student: "UI/UX Student Project",
            image: "/graphic-attract.jpg",
            description:
                "A modern shopping experience designed with intuitive navigation and a user-friendly interface.",
            icon: "bi-bag",
        },
        {
            id: 2,
            title: "Travel Website",
            category: "Web Design",
            student: "Web Design Student Project",
            image: "/graphicss.jpg",
            description:
                "A visually engaging travel website designed to make exploring destinations simple and enjoyable.",
            icon: "bi-globe",
        },
        {
            id: 3,
            title: "Food Delivery App",
            category: "Mobile App",
            student: "UI/UX Student Project",
            image: "/figma.jpg",
            description:
                "A mobile application concept focused on seamless food discovery, ordering, and delivery tracking.",
            icon: "bi-phone",
        },
        {
            id: 4,
            title: "Brand Identity Design",
            category: "Graphic Design",
            student: "Graphic Design Student Project",
            image: "/adobe.jpg",
            description:
                "A creative branding project featuring a distinctive visual identity, typography, and color system.",
            icon: "bi-palette",
        },
        {
            id: 5,
            title: "Finance Dashboard",
            category: "UI/UX Design",
            student: "UI/UX Student Project",
            image: "/courses.jpg",
            description:
                "A clean dashboard interface that presents financial insights through structured layouts and data visualization.",
            icon: "bi-bar-chart",
        },
        {
            id: 6,
            title: "Fitness Mobile App",
            category: "Mobile App",
            student: "UI/UX Student Project",
            image: "/uiux.jpg",
            description:
                "A fitness application concept designed to help users track workouts, monitor progress, and build healthy habits.",
            icon: "bi-heart-pulse",
        },
    ];

    const filteredProjects =
        activeCategory === "All"
            ? projects
            : projects.filter(
                  (project) => project.category === activeCategory
              );

    return (
        <section className="portfolio" id="student-portfolio">
            <div className="portfolio-container">

                <div className="portfolio-heading">
                    <span className="portfolio-eyebrow">
                        <span className="portfolio-eyebrow-line"></span>
                        STUDENT SHOWCASE
                    </span>

                    <h2>
                        Creativity in Action.
                        <br />
                        <span>Designs That Inspire.</span>
                    </h2>

                    <p>
                        Explore the creative work of our students at Togglemax.
                        From intuitive UI/UX experiences to stunning websites
                        and mobile applications, discover ideas transformed
                        into impactful digital designs.
                    </p>
                </div>

                <div className="portfolio-stats">
                    <div className="portfolio-stat">
                        <i className="bi bi-vector-pen"></i>
                        <div>
                            <h3>UI/UX</h3>
                            <p>Creative Experiences</p>
                        </div>
                    </div>

                    <div className="portfolio-stat">
                        <i className="bi bi-laptop"></i>
                        <div>
                            <h3>Web Design</h3>
                            <p>Digital Experiences</p>
                        </div>
                    </div>

                    <div className="portfolio-stat">
                        <i className="bi bi-phone"></i>
                        <div>
                            <h3>Mobile Apps</h3>
                            <p>Designed for People</p>
                        </div>
                    </div>

                    <div className="portfolio-stat">
                        <i className="bi bi-palette"></i>
                        <div>
                            <h3>Graphic Design</h3>
                            <p>Ideas Into Visuals</p>
                        </div>
                    </div>
                </div>

                <div className="portfolio-filter-wrapper">
                    <div
                        className="portfolio-filters"
                        aria-label="Filter student projects"
                    >
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                className={`portfolio-filter ${
                                    activeCategory === category
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => setActiveCategory(category)}
                                aria-pressed={activeCategory === category}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <span className="portfolio-project-count">
                        {filteredProjects.length} Projects
                    </span>
                </div>

                <div className="portfolio-grid">
                    {filteredProjects.map((project) => (
                        <article
                            className="portfolio-card"
                            key={project.id}
                        >
                            <div className="portfolio-card-image">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    loading="lazy"
                                />

                                <span className="portfolio-card-category">
                                    {project.category}
                                </span>

                                <div className="portfolio-image-overlay">
                                    <span className="portfolio-overlay-icon">
                                        <i className={`bi ${project.icon}`}></i>
                                    </span>
                                </div>
                            </div>

                            <div className="portfolio-card-content">
                                <div className="portfolio-card-student">
                                    <span className="portfolio-student-icon">
                                        <i className="bi bi-person"></i>
                                    </span>

                                    <span>{project.student}</span>
                                </div>

                                <h3>{project.title}</h3>

                                <p>{project.description}</p>

                                <div className="portfolio-card-footer">
                                    <span className="portfolio-project-type">
                                        <i className="bi bi-stars"></i>
                                        Student Work
                                    </span>

                                    <span className="portfolio-card-arrow">
                                        <i className="bi bi-arrow-up-right"></i>
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="portfolio-empty">
                        <i className="bi bi-images"></i>
                        <h3>No projects found</h3>
                        <p>Try selecting another category.</p>
                    </div>
                )}

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

                    <a
                        href="https://togglemax.com/contact/"
                        className="portfolio-cta-button"
                    >
                        Start Your Journey
                        <i className="bi bi-arrow-up-right"></i>
                    </a>
                </div>

            </div>
        </section>
    );
}

export default Portfolio;