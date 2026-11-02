"use client";

import Link from "next/link";
import "./course-view.css";

function CourseView() {
    const courseHighlights = [
        {
            icon: "bi-palette",
            title: "UI Design",
            description: "Create attractive and user-friendly interfaces.",
        },
        {
            icon: "bi-people",
            title: "UX Research",
            description: "Understand users and their design requirements.",
        },
        {
            icon: "bi-bezier2",
            title: "Wireframing",
            description: "Plan layouts and build interactive prototypes.",
        },
        {
            icon: "bi-briefcase",
            title: "Portfolio Building",
            description: "Develop practical projects for your portfolio.",
        },
    ];

    const learningTopics = [
        "UI/UX Design Fundamentals",
        "User Research and Analysis",
        "Information Architecture",
        "Wireframing and User Flows",
        "Figma and Interface Design",
        "Interactive Prototyping",
        "Responsive Web Design",
        "Usability Testing",
        "Real-World Design Projects",
        "Portfolio Development",
    ];

    return (
        <section className="courses-view">
            <div className="courses-view-container container">
                <div className="courses-view-hero">

                    <div className="courses-view-content">
                        <span className="courses-view-label">
                            <span></span>
                            DESIGN PROGRAM
                        </span>

                        <h1>
                            UI/UX Designing
                            <span> Course</span>
                        </h1>

                        <p className="courses-view-description">
                            Turn your creativity into a professional design
                            skill. Learn UI and UX design, understand user
                            behavior, create engaging digital experiences,
                            and build a portfolio through practical,
                            industry-focused training.
                        </p>

                        <div className="courses-view-meta">
                            <div>
                                <span className="courses-view-meta-icon">
                                    <i className="bi bi-clock"></i>
                                </span>

                                <div>
                                    <small>Course Duration</small>
                                    <strong>3 Months</strong>
                                </div>
                            </div>

                            <div>
                                <span className="courses-view-meta-icon">
                                    <i className="bi bi-calendar-week"></i>
                                </span>

                                <div>
                                    <small>Class Schedule</small>
                                    <strong>5 Days a Week</strong>
                                </div>
                            </div>

                            <div>
                                <span className="courses-view-meta-icon">
                                    <i className="bi bi-laptop"></i>
                                </span>

                                <div>
                                    <small>Learning Mode</small>
                                    <strong>Online & Offline</strong>
                                </div>
                            </div>
                        </div>

                        <div className="courses-view-actions">
                            <Link
                                href="/contact-us"
                                className="courses-view-primary-btn"
                            >
                                Enquire About Course
                                <i className="bi bi-arrow-up-right"></i>
                            </Link>

                            <a
                                href="#course-curriculum"
                                className="courses-view-secondary-btn"
                            >
                                Explore Curriculum
                                <i className="bi bi-arrow-down"></i>
                            </a>
                        </div>

                        <div className="courses-view-note">
                            <i className="bi bi-patch-check-fill"></i>
                            Practical, job-oriented design training
                        </div>
                    </div>

                    <div className="courses-view-image-wrapper">
                        <div className="courses-view-image">
                            <img
                                src="/uiux.jpg"
                                alt="UI/UX Designing course at Togglemax"
                            />

                            <div className="courses-view-image-badge">
                                <span className="courses-view-badge-icon">
                                    <i className="bi bi-brush"></i>
                                </span>

                                <div>
                                    <strong>Design Your Future</strong>
                                    <span>Learn. Create. Grow.</span>
                                </div>
                            </div>
                        </div>

                        <div className="courses-view-decoration courses-view-decoration-one"></div>
                        <div className="courses-view-decoration courses-view-decoration-two"></div>
                    </div>

                </div>
                <div className="courses-view-highlights">
                    {courseHighlights.map((item, index) => (
                        <div
                            className="courses-view-highlight"
                            key={item.title}
                        >
                            <div className="courses-view-highlight-top">
                                <span className="courses-view-highlight-icon">
                                    <i className={`bi ${item.icon}`}></i>
                                </span>

                                <span className="courses-view-highlight-number">
                                    0{index + 1}
                                </span>
                            </div>

                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>
                <div className="courses-view-overview">
                    <div className="courses-view-overview-content">
                        <span className="courses-view-section-label">
                            ABOUT THE PROGRAM
                        </span>

                        <h2>
                            Learn to Design
                            <span> Better Digital Experiences</span>
                        </h2>

                        <p>
                            Our UI/UX Designing course introduces you to the
                            complete design process, from understanding user
                            needs to designing polished digital interfaces.
                            Develop your creativity, improve your problem-solving
                            skills, and learn to create meaningful user
                            experiences.
                        </p>

                        <p>
                            Through practical assignments and design projects,
                            you will explore design principles, user research,
                            wireframing, prototyping, and modern interface
                            design tools.
                        </p>

                        <Link
                            href="/contact-us"
                            className="courses-view-text-link"
                        >
                            Start Your Learning Journey
                            <i className="bi bi-arrow-right"></i>
                        </Link>
                    </div>

                    <div className="courses-view-topics" id="course-curriculum">
                        <div className="courses-view-topics-heading">
                            <span className="courses-view-topics-icon">
                                <i className="bi bi-journal-check"></i>
                            </span>

                            <div>
                                <span>WHAT YOU WILL LEARN</span>
                                <h3>Course Curriculum</h3>
                            </div>
                        </div>

                        <div className="courses-view-topics-list">
                            {learningTopics.map((topic, index) => (
                                <div
                                    className="courses-view-topic"
                                    key={topic}
                                >
                                    <span className="courses-view-topic-check">
                                        <i className="bi bi-check2"></i>
                                    </span>

                                    <span>{topic}</span>

                                    <small>
                                        {String(index + 1).padStart(2, "0")}
                                    </small>
                                </div>
                            ))}
                        </div>

                        <div className="courses-view-topics-footer">
                            <i className="bi bi-lightbulb"></i>
                            Learn through practical exercises and projects.
                        </div>
                    </div>
                </div>
                <div className="courses-view-cta">
                    <div className="courses-view-cta-icon">
                        <i className="bi bi-rocket-takeoff"></i>
                    </div>

                    <div className="courses-view-cta-content">
                        <h3>Ready to become a UI/UX Designer?</h3>
                        <p>
                            Take the first step toward your creative career
                            with Togglemax.
                        </p>
                    </div>

                    <Link
                        href="/contact-us"
                        className="courses-view-cta-btn"
                    >
                        Enquire Now
                        <i className="bi bi-arrow-right"></i>
                    </Link>
                </div>

            </div>
        </section>
    );
}

export default CourseView;