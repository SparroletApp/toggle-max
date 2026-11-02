import "./blog.css";
import "../courses/courses.css"
function Blog() {
    const blogs = [
        {
            id: 1,
            title: "The Importance of UI/UX Design in Modern Websites",
            category: "UI/UX DESIGN",
            date: "October 20, 2026",
            image: "/blog-uiux.jpg",
            description:
                "Discover how user interface and user experience design help create engaging, accessible, and user-friendly websites.",
            readTime: "5 min read",
            link: "/blog/ui-ux-design",
        },
        {
            id: 2,
            title: "Why Figma Is Essential for Every UI/UX Designer",
            category: "DESIGN TOOLS",
            date: "October 15, 2026",
            image: "/blog-figma.jpg",
            description:
                "Explore how Figma simplifies collaboration, wireframing, prototyping, and interface design for modern designers.",
            readTime: "4 min read",
            link: "/blog/figma-for-designers",
        },
        {
            id: 3,
            title: "Graphic Design Principles Every Beginner Should Know",
            category: "GRAPHIC DESIGN",
            date: "October 10, 2026",
            image: "/blog-graphic.jpg",
            description:
                "Learn the fundamentals of color theory, typography, composition, and visual hierarchy to improve your design skills.",
            readTime: "6 min read",
            link: "/blog/graphic-design-principles",
        },
        {
            id: 4,
            title: "UI vs UX Design: Understanding the Difference",
            category: "UI/UX DESIGN",
            date: "October 5, 2026",
            image: "/blog-ui-vs-ux.jpg",
            description:
                "Understand the difference between UI and UX design, how they work together, and why both matter in digital products.",
            readTime: "5 min read",
            link: "/blog/ui-vs-ux",
        },
        {
            id: 5,
            title: "How to Build a Strong UI/UX Design Portfolio",
            category: "CAREER GUIDANCE",
            date: "September 28, 2026",
            image: "/blog-portfolio.jpg",
            description:
                "Learn how to showcase your design projects, explain your design process, and create a portfolio that attracts employers.",
            readTime: "7 min read",
            link: "/blog/ui-ux-portfolio",
        },
        {
            id: 6,
            title: "Top UI/UX Design Skills to Learn in 2026",
            category: "DESIGN CAREER",
            date: "September 20, 2026",
            image: "/blog-design-skills.jpg",
            description:
                "Explore the essential design skills, tools, and practical techniques that can help you prepare for a design career.",
            readTime: "6 min read",
            link: "/blog/ui-ux-design-skills",
        },
    ];

    return (
        <main className="blog-page">

            <div className="aboutuss-top">
                <div className="aboutus-overlay">
                    <div className="container">
                        <div className="aboutus-content">
                            <span className="aboutus-subtitle">
                                INSIGHTS & ARTICLES
                            </span>

                            <h1>Our Blog</h1>

                            <p>
                                <a href="/">Home</a>
                                <i className="bi bi-chevron-right"></i>
                                <span>Blog</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <section className="blog-wrapper">
                <div className="container blog-container">
                    <div className="blog-section-heading">
                        <div>
                            <span className="blog-section-label">
                                READ. LEARN. CREATE.
                            </span>

                            <h3>Latest Articles</h3>
                        </div>

                        <p>
                            Insights and resources for aspiring UI/UX
                            and graphic designers.
                        </p>
                    </div>
                    <div className="blog-list">

                        {blogs.map((blog, index) => (
                            <article className="blog-article" key={blog.id}>

                                <div className="blog-article-number">
                                    {String(index + 1).padStart(2, "0")}
                                </div>

                                <a
                                    href={blog.link}
                                    className="blog-article-image"
                                    aria-label={`Read ${blog.title}`}
                                >
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        loading="lazy"
                                    />

                                    <span className="blog-image-arrow">
                                        <i className="bi bi-arrow-up-right"></i>
                                    </span>
                                </a>

                                <div className="blog-article-content">

                                    <div className="blog-article-category">
                                        <span></span>
                                        {blog.category}
                                    </div>

                                    <h4>
                                        <a href={blog.link}>
                                            {blog.title}
                                        </a>
                                    </h4>

                                    <p className="blog-description">
                                        {blog.description}
                                    </p>

                                    <div className="blog-article-meta">
                                        <span>
                                            <i className="bi bi-calendar3"></i>
                                            {blog.date}
                                        </span>

                                        <span className="blog-meta-divider">
                                            /
                                        </span>

                                        <span>
                                            <i className="bi bi-clock"></i>
                                            {blog.readTime}
                                        </span>
                                    </div>

                                    <a
                                        href={blog.link}
                                        className="blog-read-more"
                                        aria-label={`Read more: ${blog.title}`}
                                    >
                                        Read Article
                                        <i className="bi bi-arrow-right"></i>
                                    </a>

                                </div>

                            </article>
                        ))}

                    </div>
                    <section className="blog-bottom">

                        <div className="blog-bottom-content">

                            <span className="blog-bottom-label">
                                YOUR CREATIVE JOURNEY STARTS HERE
                            </span>

                            <h3>
                                Turn your creativity into
                                <span> a career.</span>
                            </h3>

                            <p>
                                Learn practical design skills, work on
                                real-world projects, and build a portfolio
                                that showcases your talent.
                            </p>

                            <a
                                href="/courses"
                                className="blog-contact-btn"
                            >
                                Explore Our Courses
                                <i className="bi bi-arrow-up-right"></i>
                            </a>

                        </div>

                        <div className="blog-bottom-decoration">
                            <div className="blog-decoration-circle">
                                <i className="bi bi-palette2"></i>
                            </div>

                            <span className="blog-decoration-dot dot-one"></span>
                            <span className="blog-decoration-dot dot-two"></span>
                            <span className="blog-decoration-dot dot-three"></span>
                        </div>

                    </section>

                </div>
            </section>

        </main>
    );
}

export default Blog;