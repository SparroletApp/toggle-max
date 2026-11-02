"use client";

import { useState } from "react";
import "./aboutus.css";

function AboutUs() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const highlights = [
        {
            icon: "bi bi-layout-text-window-reverse",
            title: "UI Fundamentals",
            desc: "Learn interface design principles, layouts, typography, and visual hierarchy to create attractive digital interfaces.",
        },
        {
            icon: "bi bi-people",
            title: "UX Strategies",
            desc: "Understand user research, usability testing, information architecture, and user-centered design.",
        },
        {
            icon: "bi bi-bezier2",
            title: "Wireframing & Prototyping",
            desc: "Transform ideas into wireframes and interactive prototypes that communicate your design concepts.",
        },
        {
            icon: "bi bi-hand-index-thumb",
            title: "Interaction Design",
            desc: "Create intuitive interactions and smooth user journeys for websites and mobile applications.",
        },
        {
            icon: "bi bi-palette",
            title: "Visual Design",
            desc: "Explore color theory, typography, spacing, and visual consistency to improve digital experiences.",
        },
        {
            icon: "bi bi-briefcase",
            title: "Portfolio Development",
            desc: "Present your design process and projects in a professional portfolio that showcases your creativity.",
        },
    ];

    const courseFeatures = [
        {
            icon: "bi bi-person-workspace",
            title: "Expert Mentorship",
            desc: "Learn through guidance from experienced mentors and subject-matter experts.",
        },
        {
            icon: "bi bi-camera-video",
            title: "Live Classes",
            desc: "Participate in interactive learning sessions and practical design exercises.",
        },
        {
            icon: "bi bi-lightning-charge",
            title: "Practical Training",
            desc: "Apply your knowledge through assignments, design challenges, and projects.",
        },
        {
            icon: "bi bi-file-earmark-person",
            title: "Portfolio Projects",
            desc: "Work on four or more portfolio-worthy projects to demonstrate your design skills.",
        },
        {
            icon: "bi bi-patch-check",
            title: "Certified Course",
            desc: "Complete the three-month training program and receive certification according to the program requirements.",
        },
        {
            icon: "bi bi-graph-up-arrow",
            title: "Career Support",
            desc: "Get guidance with portfolio preparation, interview readiness, and relevant job opportunities.",
        },
    ];

    const projects = [
        {
            number: "01",
            icon: "bi bi-window",
            category: "WEBSITE DESIGN",
            title: "Corporate Business Website",
            desc: "Design a professional business website with clear navigation, structured content, and an engaging user interface.",
        },
        {
            number: "02",
            icon: "bi bi-cart3",
            category: "E-COMMERCE DESIGN",
            title: "E-commerce Landing Page",
            desc: "Explore product presentation, landing-page layouts, visual hierarchy, and user-friendly shopping experiences.",
        },
        {
            number: "03",
            icon: "bi bi-headphones",
            category: "MOBILE APP DESIGN",
            title: "Podcast Application",
            desc: "Create a podcast app interface with intuitive navigation, content discovery, and a smooth listening experience.",
        },
        {
            number: "04",
            icon: "bi bi-airplane",
            category: "UX RESEARCH",
            title: "Travel Website Analysis",
            desc: "Analyze a travel website to identify usability issues and opportunities to improve the user experience.",
        },
        {
            number: "05",
            icon: "bi bi-clipboard-data",
            category: "COMPETITIVE ANALYSIS",
            title: "Short-Video App Analysis",
            desc: "Compare competing applications and examine their features, usability, and overall user experience.",
        },
        {
            number: "06",
            icon: "bi bi-mortarboard",
            category: "EDTECH DESIGN",
            title: "Education App Interface",
            desc: "Design an educational application interface that makes learning content easy to access and navigate.",
        },
    ];

    const careers = [
        {
            icon: "bi bi-person-workspace",
            title: "UX Designer",
            desc: "Create user-centered experiences through research, testing, and thoughtful design.",
        },
        {
            icon: "bi bi-palette",
            title: "UI Designer",
            desc: "Design attractive and consistent interfaces for websites and applications.",
        },
        {
            icon: "bi bi-search",
            title: "UX Researcher",
            desc: "Study user behavior and identify opportunities to improve digital products.",
        },
        {
            icon: "bi bi-diagram-3",
            title: "UX Architect",
            desc: "Structure digital experiences, information, and navigation systems.",
        },
        {
            icon: "bi bi-lightbulb",
            title: "UX Strategist",
            desc: "Connect user needs with product goals and experience strategies.",
        },
        {
            icon: "bi bi-boxes",
            title: "Product Designer",
            desc: "Help shape digital products from early concepts to polished interfaces.",
        },
        {
            icon: "bi bi-window-desktop",
            title: "Web Designer",
            desc: "Create engaging website layouts and visually effective web experiences.",
        },
        {
            icon: "bi bi-kanban",
            title: "Product Manager",
            desc: "Coordinate product priorities, user needs, and development objectives.",
        },
    ];

    const audiences = [
        {
            icon: "bi bi-stars",
            title: "Aspiring Designers",
            desc: "Start your design journey by learning the fundamentals of UI/UX and building practical skills from the ground up.",
        },
        {
            icon: "bi bi-person-gear",
            title: "Working Professionals",
            desc: "Expand your existing skill set and explore user experience, interface design, and digital product development.",
        },
        {
            icon: "bi bi-rocket-takeoff",
            title: "Entrepreneurs & Creators",
            desc: "Understand how thoughtful design can improve the usability and visual appeal of websites and digital products.",
        },
    ];

    const placementBenefits = [
        "Guidance from experienced mentors",
        "Practical assignments and design projects",
        "Support with building a professional portfolio",
        "Interview preparation and career guidance",
        "Assistance exploring relevant job opportunities",
    ];

    const faqs = [
        {
            question: "What is the duration of the UI/UX Design Course?",
            answer: "The UI/UX Design Course is presented as a three-month program. Contact Togglemax to confirm the current schedule and upcoming batch details.",
        },
        {
            question: "Do I need previous design experience?",
            answer: "The program can be suitable for aspiring designers who want to build their foundational knowledge. Contact the team to confirm the prerequisites for the current batch.",
        },
        {
            question: "What will I learn in the course?",
            answer: "The program covers UI fundamentals, UX strategies, wireframing, prototyping, interaction design, visual design, and portfolio development.",
        },
        {
            question: "Will I work on practical projects?",
            answer: "The program emphasizes practical learning through design exercises and projects involving websites, mobile applications, and UX analysis.",
        },
        {
            question: "Will I receive placement assistance?",
            answer: "Togglemax offers career guidance and placement assistance to help students prepare for relevant opportunities. Contact the team for the current placement support terms.",
        },
        {
            question: "How can I join the course?",
            answer: "Visit the Togglemax contact page to enquire about course fees, available batches, learning modes, and enrollment.",
        },
    ];

    return (
        <>
            <section className="aboutus">
                <div className="aboutus-top">
                    <div className="aboutus-overlay">
                        <div className="container">
                            <div className="aboutus-content">
                                <span className="aboutus-subtitle">
                                    GET TO KNOW US
                                </span>

                                <h1>About Us</h1>

                                <p>
                                    <a href="/">Home</a>
                                    <i className="bi bi-chevron-right"></i>
                                    <span>About Us</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="who-we container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-12 who-deals">
                            <div className="who-badge">
                                WHO WE ARE
                            </div>

                            <h1>
                                Provide <span>Quality </span>
                                education services for you
                            </h1>

                            <div className="who-small-desc">
                                Learn UI/UX design with expert mentorship,
                                hands-on projects, and industry-focused
                                training at Togglemax, Kochi.
                            </div>

                            <div className="who-big-desc">
                                Discover UI/UX design at Togglemax, Kochi,
                                through expert mentorship, hands-on projects,
                                and industry-focused training.
                                <br />
                                Develop your design skills, build a
                                professional portfolio, and prepare for
                                exciting career opportunities.
                            </div>

                            <a
                                className="about-primary-button"
                                href="https://togglemax.com/contact/"
                            >
                                BECOME A STUDENT
                                <i className="bi bi-arrow-right"></i>
                            </a>
                        </div>

                        <div className="col-lg-6 col-md-6 col-12">
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-12 date-column">
                                    <div className="img-who-left">
                                        <img
                                            src="/about1.jpg"
                                            alt="Togglemax design education"
                                        />

                                        <div className="dot-who"></div>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 col-12">
                                    <div className="img-who-right">
                                        <div className="img-top-about">
                                            <img
                                                src="/about2.jpg"
                                                alt="Creative design learning"
                                            />
                                        </div>

                                        <div className="img-down-about">
                                            <img
                                                src="/about3.jpg"
                                                alt="UI UX design training"
                                            />
                                        </div>

                                        <div className="sun-shape">
                                            <img
                                                src="/sun-shape.png"
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="vision-mission container">
                <div className="mission-top">
                    <div className="mission-heading">
                        <h1>
                            Our Mission
                            <br />
                            &amp; Vision
                        </h1>
                    </div>

                    <div className="mission-wrapper">
                        <div className="mission-card">
                            <div className="mission-img">
                                <img
                                    src="/mission.jpg"
                                    alt="Togglemax mission"
                                />
                            </div>

                            <div className="misison-details">
                                <h3>MISSION</h3>

                                <p>
                                    To empower aspiring designers with the
                                    skills and creativity to craft intuitive,
                                    user-friendly, and impactful digital
                                    experiences.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mission-down">
                    <div className="mission-wrapper">
                        <div className="mission2-card">
                            <div className="mission2-img">
                                <img
                                    src="/vision.jpg"
                                    alt="Togglemax vision"
                                />
                            </div>

                            <div className="misison2-details">
                                <h3>VISION</h3>

                                <p>
                                    To become a leading UI/UX design training
                                    academy that inspires creative minds and
                                    prepares them to shape meaningful digital
                                    experiences.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

                <section className="about-program-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="about-program-visual">
                                <div className="program-visual-top">
                                    <span className="program-visual-label">
                                        DESIGN THINKING
                                    </span>

                                    <div className="program-visual-icon">
                                        <i className="bi bi-bezier2"></i>
                                    </div>
                                </div>

                                <div className="program-visual-main">
                                    <div className="program-visual-window">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>

                                    <div className="program-visual-content">
                                        <div className="program-visual-sidebar">
                                            <i className="bi bi-grid"></i>
                                            <i className="bi bi-layers"></i>
                                            <i className="bi bi-image"></i>
                                            <i className="bi bi-gear"></i>
                                        </div>

                                        <div className="program-visual-canvas">
                                            <div className="visual-line visual-line-short"></div>
                                            <div className="visual-line"></div>

                                            <div className="visual-ui-card">
                                                <div className="visual-ui-circle"></div>

                                                <div className="visual-ui-lines">
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            </div>

                                            <div className="visual-ui-bottom">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="program-floating-note">
                                    <i className="bi bi-lightbulb"></i>

                                    <div>
                                        <strong>Think Creatively</strong>
                                        <span>Design with purpose</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="about-program-content">
                                <span className="about-section-label">
                                    OUR SPECIALIZATION
                                </span>

                                <h2>
                                    Learn UI/UX Design at{" "}
                                    <span>Togglemax</span>
                                </h2>

                                <p>
                                    Togglemax Education, based in Kochi,
                                    focuses on helping aspiring designers
                                    understand the principles behind
                                    effective user interfaces and meaningful
                                    user experiences.
                                </p>

                                <p>
                                    Our UI/UX Design Program introduces
                                    students to user-centered design,
                                    wireframing, prototyping, visual
                                    communication, and practical project
                                    development.
                                </p>

                                <p>
                                    Whether you are beginning your design
                                    journey or expanding your existing
                                    skills, the program helps you develop
                                    your creativity, strengthen your design
                                    process, and build a portfolio of work.
                                </p>

                                <a
                                    href="https://togglemax.com/our-courses/"
                                    className="about-primary-button"
                                >
                                    EXPLORE COURSE
                                    <i className="bi bi-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-highlights-section">
                <div className="container">
                    <div className="about-section-heading">
                        <span className="about-section-label">
                            WHAT YOU WILL LEARN
                        </span>

                        <h2>
                            Explore the World of{" "}
                            <span>UI/UX Design</span>
                        </h2>

                        <p>
                            Develop the creative, analytical, and practical
                            skills needed to design meaningful digital
                            experiences.
                        </p>
                    </div>

                    <div className="row">
                        {highlights.map((item, index) => (
                            <div
                                className="col-lg-4 col-md-6 col-12"
                                key={item.title}
                            >
                                <div className="about-highlight-item">
                                    <div className="about-highlight-top">
                                        <div className="about-highlight-icon">
                                            <i className={item.icon}></i>
                                        </div>

                                        <span>
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                    </div>

                                    <h3>{item.title}</h3>

                                    <p>{item.desc}</p>

                                    <div className="about-highlight-line"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="about-features-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-5">
                            <div className="about-features-intro">
                                <span className="about-section-label">
                                    THE TOGGLEMAX ADVANTAGE
                                </span>

                                <h2>
                                    Learn. Practice.
                                    <br />
                                    <span>Grow.</span>
                                </h2>

                                <p>
                                    Build your design foundation through
                                    guided learning, practical activities,
                                    project experience, and career-focused
                                    support.
                                </p>

                                <a
                                    href="https://togglemax.com/contact/"
                                    className="about-text-link"
                                >
                                    Talk to Our Team
                                    <i className="bi bi-arrow-up-right"></i>
                                </a>
                            </div>
                        </div>

                        <div className="col-lg-7">
                            <div className="about-features-list">
                                {courseFeatures.map((item, index) => (
                                    <div
                                        className="about-feature-row"
                                        key={item.title}
                                    >
                                        <div className="about-feature-number">
                                            {String(index + 1).padStart(2, "0")}
                                        </div>

                                        <div className="about-feature-icon">
                                            <i className={item.icon}></i>
                                        </div>

                                        <div className="about-feature-copy">
                                            <h3>{item.title}</h3>
                                            <p>{item.desc}</p>
                                        </div>

                                        <i className="bi bi-arrow-up-right about-feature-arrow"></i>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        
            <section className="about-careers-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-5">
                            <div className="about-careers-intro">
                                <span className="about-section-label">
                                    EXPLORE YOUR FUTURE
                                </span>

                                <h2>
                                    Where Can UI/UX Design{" "}
                                    <span>Take You?</span>
                                </h2>

                                <p>
                                    UI/UX design skills can open doors to
                                    different roles across digital product
                                    design, user research, and web
                                    experiences. Explore some of the career
                                    paths you may pursue.
                                </p>

                                <a
                                    href="https://togglemax.com/contact/"
                                    className="about-primary-button"
                                >
                                    START YOUR JOURNEY
                                    <i className="bi bi-arrow-right"></i>
                                </a>
                            </div>
                        </div>

                        <div className="col-lg-7">
                            <div className="row">
                                {careers.map((career, index) => (
                                    <div
                                        className="col-lg-6 col-md-6 col-12"
                                        key={career.title}
                                    >
                                        <div className="about-career-item">
                                            <div className="about-career-icon">
                                                <i className={career.icon}></i>
                                            </div>

                                            <div className="about-career-text">
                                                <span>
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>

                                                <h3>{career.title}</h3>

                                                <p>{career.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-audience-section">
                <div className="container">
                    <div className="about-section-heading">
                        <span className="about-section-label">
                            YOUR DESIGN JOURNEY STARTS HERE
                        </span>

                        <h2>
                            Who Can Learn{" "}
                            <span>UI/UX Design?</span>
                        </h2>

                        <p>
                            Whether you are exploring a new career or
                            expanding your creative skills, design learning
                            can help you discover new possibilities.
                        </p>
                    </div>

                    <div className="row">
                        {audiences.map((audience, index) => (
                            <div
                                className="col-lg-4 col-md-6 col-12"
                                key={audience.title}
                            >
                                <div className="about-audience-item">
                                    <span className="about-audience-number">
                                        0{index + 1}
                                    </span>

                                    <div className="about-audience-icon">
                                        <i className={audience.icon}></i>
                                    </div>

                                    <h3>{audience.title}</h3>

                                    <p>{audience.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="about-placement-section">
                <div className="container">
                    <div className="about-placement-panel">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <div className="about-placement-visual">
                                    <div className="placement-orbit placement-orbit-one"></div>
                                    <div className="placement-orbit placement-orbit-two"></div>

                                    <div className="placement-center-icon">
                                        <i className="bi bi-briefcase"></i>
                                    </div>

                                    <div className="placement-floating-icon placement-icon-one">
                                        <i className="bi bi-file-earmark-person"></i>
                                    </div>

                                    <div className="placement-floating-icon placement-icon-two">
                                        <i className="bi bi-chat-square-text"></i>
                                    </div>

                                    <div className="placement-floating-icon placement-icon-three">
                                        <i className="bi bi-graph-up-arrow"></i>
                                    </div>

                                    <div className="placement-visual-caption">
                                        <strong>Prepare for What's Next</strong>
                                        <span>Skills · Portfolio · Career</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="about-placement-content">
                                    <span className="about-section-label">
                                        CAREER DEVELOPMENT
                                    </span>

                                    <h2>
                                        Build Your Portfolio.
                                        <br />
                                        <span>Prepare for Your Career.</span>
                                    </h2>

                                    <p>
                                        Develop your professional skills
                                        with practical assignments,
                                        portfolio guidance, and career
                                        preparation support designed to
                                        help you explore opportunities in
                                        the design industry.
                                    </p>

                                    <div className="about-placement-list">
                                        {placementBenefits.map((benefit) => (
                                            <div
                                                className="about-placement-benefit"
                                                key={benefit}
                                            >
                                                <i className="bi bi-check-circle-fill"></i>
                                                <span>{benefit}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <a
                                        href="https://togglemax.com/contact/"
                                        className="about-primary-button"
                                    >
                                        ENQUIRE NOW
                                        <i className="bi bi-arrow-right"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            
        </>
    );
}

export default AboutUs;