"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import "./blog-view.css";

const blogs = [
    {
        slug: "ui-ux-design",
        title: "The Importance of UI/UX Design in Modern Websites",
        category: "UI/UX DESIGN",
        date: "October 20, 2026",
        image: "/blog-uiux.jpg",
        readTime: "5 min read",
        description:
            "Discover how user interface and user experience design help create engaging, accessible, and user-friendly websites.",
        content: [
            {
                heading: "What Is UI/UX Design?",
                text: "UI (User Interface) design focuses on the visual elements of a digital product, including colors, typography, buttons, layouts, and interactive components. UX (User Experience) design focuses on how users interact with a product and how easily they can achieve their goals.",
            },
            {
                heading: "Why Is UI/UX Design Important?",
                text: "A well-designed website helps visitors find information quickly, understand your services, and navigate without confusion. A thoughtful user experience builds trust, improves accessibility, and encourages users to return.",
            },
            {
                heading: "Essential Principles of Good Design",
                text: "Good design combines visual hierarchy, consistent typography, appropriate color choices, intuitive navigation, responsive layouts, and accessibility. Designers should also test their work with real users and improve the experience based on feedback.",
            },
            {
                heading: "Start Your UI/UX Journey",
                text: "Learning UI/UX design involves understanding user needs, creating wireframes, developing prototypes, and testing design solutions. Practising with real-world projects is one of the best ways to develop your skills.",
            },
        ],
    },
    {
        slug: "figma-for-designers",
        title: "Why Figma Is Essential for Every UI/UX Designer",
        category: "DESIGN TOOLS",
        date: "October 15, 2026",
        image: "/blog-figma.jpg",
        readTime: "4 min read",
        description:
            "Explore how Figma simplifies collaboration, wireframing, prototyping, and interface design for modern designers.",
        content: [
            {
                heading: "What Makes Figma Special?",
                text: "Figma is a collaborative interface design tool that helps designers create user interfaces, wireframes, prototypes, and design systems. Its browser-based workflow makes it easy for teams to work together.",
            },
            {
                heading: "Design and Prototyping",
                text: "Designers can create layouts, organise components, connect screens, and build interactive prototypes. These prototypes help teams understand how a product will work before development begins.",
            },
            {
                heading: "Collaboration and Feedback",
                text: "Figma allows multiple team members to work on a design file, share feedback, and review changes. This can make communication between designers, developers, and stakeholders easier.",
            },
            {
                heading: "Build Your Skills",
                text: "Start by practising frames, components, auto layout, typography, and prototyping. Recreating familiar interfaces and building your own projects can help you develop confidence.",
            },
        ],
    },
    {
        slug: "graphic-design-principles",
        title: "Graphic Design Principles Every Beginner Should Know",
        category: "GRAPHIC DESIGN",
        date: "October 10, 2026",
        image: "/blog-graphic.jpg",
        readTime: "6 min read",
        description:
            "Learn the fundamentals of color theory, typography, composition, and visual hierarchy to improve your design skills.",
        content: [
            {
                heading: "Understand Visual Hierarchy",
                text: "Visual hierarchy helps people understand what to look at first. Designers create hierarchy through size, contrast, spacing, alignment, and typography.",
            },
            {
                heading: "Learn Color Theory",
                text: "Colors communicate mood and help establish a visual identity. Learning about color relationships, contrast, and accessible color combinations can make your designs more effective.",
            },
            {
                heading: "Choose Typography Carefully",
                text: "Typography affects readability and personality. Choose fonts that fit the project, maintain readable sizes, and use consistent spacing and hierarchy.",
            },
            {
                heading: "Practise Composition",
                text: "Balance, alignment, proximity, repetition, and whitespace help organise visual elements. Applying these principles makes designs easier to understand and more visually appealing.",
            },
        ],
    },
    {
        slug: "ui-vs-ux",
        title: "UI vs UX Design: Understanding the Difference",
        category: "UI/UX DESIGN",
        date: "October 5, 2026",
        image: "/blog-ui-vs-ux.jpg",
        readTime: "5 min read",
        description:
            "Understand the difference between UI and UX design, how they work together, and why both matter in digital products.",
        content: [
            {
                heading: "What Is UI Design?",
                text: "User Interface design focuses on the visual and interactive parts of a product. It includes buttons, menus, typography, colors, icons, and screen layouts.",
            },
            {
                heading: "What Is UX Design?",
                text: "User Experience design focuses on the complete experience of using a product. UX designers research user needs, identify problems, organise information, and test possible solutions.",
            },
            {
                heading: "How Do UI and UX Work Together?",
                text: "UX helps determine how a product should work, while UI helps determine how users interact with it visually. Both disciplines contribute to creating useful and enjoyable digital experiences.",
            },
            {
                heading: "Which Skill Should You Learn First?",
                text: "Understanding basic UX principles before moving into detailed interface design can help you make more purposeful decisions. Practise both through small projects and gradually develop your own process.",
            },
        ],
    },
    {
        slug: "ui-ux-portfolio",
        title: "How to Build a Strong UI/UX Design Portfolio",
        category: "CAREER GUIDANCE",
        date: "September 28, 2026",
        image: "/blog-portfolio.jpg",
        readTime: "7 min read",
        description:
            "Learn how to showcase your design projects, explain your design process, and create a portfolio that attracts employers.",
        content: [
            {
                heading: "Choose Your Best Projects",
                text: "Select projects that demonstrate your problem-solving ability, design thinking, and attention to detail. A few well-presented projects are often more useful than a large collection without context.",
            },
            {
                heading: "Explain Your Design Process",
                text: "Describe the problem, your research, user needs, wireframes, design decisions, prototypes, and testing. Explain why you made important decisions instead of presenting only final screens.",
            },
            {
                heading: "Show Realistic Outcomes",
                text: "Include feedback, usability findings, iterations, and measurable results when available. Be honest about your contribution and distinguish actual outcomes from assumptions.",
            },
            {
                heading: "Keep Your Portfolio Simple",
                text: "Use clear navigation, readable typography, consistent spacing, and responsive layouts. Make it easy for recruiters to understand your work and contact you.",
            },
        ],
    },
    {
        slug: "ui-ux-design-skills",
        title: "Top UI/UX Design Skills to Learn in 2026",
        category: "DESIGN CAREER",
        date: "September 20, 2026",
        image: "/blog-design-skills.jpg",
        readTime: "6 min read",
        description:
            "Explore the essential design skills, tools, and practical techniques that can help you prepare for a design career.",
        content: [
            {
                heading: "User Research and Empathy",
                text: "Understanding users is the foundation of effective UX design. Learn how to identify user needs, conduct interviews, create personas when appropriate, and evaluate usability.",
            },
            {
                heading: "Wireframing and Prototyping",
                text: "Wireframes help organise content and functionality, while prototypes allow designers to explore interactions and test ideas before development.",
            },
            {
                heading: "Visual and Interaction Design",
                text: "Build your knowledge of typography, color, spacing, layout, accessibility, responsive design, and interaction patterns to create consistent interfaces.",
            },
            {
                heading: "Communication and Collaboration",
                text: "Designers need to explain their decisions, receive feedback, collaborate with developers, and adapt their work to user needs and project requirements.",
            },
        ],
    },
];

function BlogView() {
    const params = useParams();
    const slug = params.slug as string;

    const blog = blogs.find((item) => item.slug === slug);

    if (!blog) {
        return (
            <main className="blog-view-page">
                <div className="blog-view-not-found">
                    <i className="bi bi-journal-x"></i>
                    <h1>Article Not Found</h1>
                    <p>The blog article you are looking for does not exist.</p>
                    <Link href="/blog" className="blog-view-back-btn">
                        <i className="bi bi-arrow-left"></i>
                        Back to Blog
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="blog-view-page">
            <div className="container">

                <div className="blog-view-hero">
                    <div className="row align-items-center g-4">
                        <div className="col-lg-6 col-12">
                            <header className="blog-view-header">
                                <span className="blog-view-category">
                                    <span className="blog-view-category-dot"></span>
                                    {blog.category}
                                </span>

                                <h1>{blog.title}</h1>

                                <p className="blog-view-intro">
                                    {blog.description}
                                </p>

                                <div className="blog-view-meta">
                                    <span>
                                        <i className="bi bi-calendar3"></i>
                                        {blog.date}
                                    </span>

                                    <span>
                                        <i className="bi bi-clock"></i>
                                        {blog.readTime}
                                    </span>
                                </div>
                            </header>
                        </div>

                        <div className="col-lg-6 col-12">
                            <div className="blog-view-cover">
                                <img src={blog.image} alt={blog.title} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="blog-view-layout">
                    <article className="blog-view-article">
                        <div className="blog-view-article-label">
                            <i className="bi bi-book-half"></i>
                            ARTICLE
                        </div>

                        {blog.content.map((section, index) => (
                            <section
                                className="blog-view-content-section"
                                key={section.heading}
                            >
                                <span className="blog-view-section-number">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <div>
                                    <h2>{section.heading}</h2>
                                    <p>{section.text}</p>
                                </div>
                            </section>
                        ))}

                        <div className="blog-view-article-footer">
                            <div className="blog-view-footer-icon">
                                <i className="bi bi-lightbulb"></i>
                            </div>

                            <div>
                                <h3>Keep learning. Keep creating.</h3>
                                <p>
                                    Great design grows through curiosity,
                                    practice, and continuous learning.
                                </p>
                            </div>
                        </div>
                    </article>

                    <aside className="blog-view-sidebar">
                        <div className="blog-view-sidebar-card">
                            <span className="blog-view-sidebar-label">
                                LEARN WITH TOGGLEMAX
                            </span>

                            <div className="blog-view-sidebar-icon">
                                <i className="bi bi-palette2"></i>
                            </div>

                            <h3>Turn your creativity into a career.</h3>

                            <p>
                                Develop practical design skills, work on
                                projects, and build your portfolio.
                            </p>

                            <Link
                                href="/courses"
                                className="blog-view-course-btn"
                            >
                                Explore Courses
                                <i className="bi bi-arrow-up-right"></i>
                            </Link>
                        </div>

                        <Link href="/blog" className="blog-view-back-link">
                            <i className="bi bi-arrow-left"></i>
                            Back to All Articles
                        </Link>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default BlogView;