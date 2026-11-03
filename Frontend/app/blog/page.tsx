"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import blogService, { BlogItem } from "@/app/apiservice/blogservice";

import "./blog.css";
import "../courses/courses.css";

function Blog() {
    const [blogs, setBlogs] = useState<BlogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await blogService.getAllBlogs();

                setBlogs(response);
            } catch (err: any) {
                console.error("Blog fetch error:", err);

                setError(
                    err?.message || "Unable to load blogs. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    // CREATE SLUG FROM BLOG TITLE
    const createSlug = (title: string) => {
        return title
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/&/g, " and ")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    // STORE BLOG ID WHEN CLICKING A BLOG
    const handleBlogClick = (blogId: number) => {
        localStorage.setItem("blog_id", String(blogId));
    };

    // CONVERT LARAVEL STORAGE IMAGE PATH INTO FULL URL
    const getImageUrl = (image: string | null) => {
        if (!image) {
            return "/blog-placeholder.jpg";
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

        const backendUrl = apiUrl
            .replace(/\/api\/?$/, "")
            .replace(/\/$/, "");

        return `${backendUrl}/storage/${image.replace(/^\/+/, "")}`;
    };

    // CALCULATE APPROXIMATE READING TIME
    const getReadTime = (description: string | null) => {
        if (!description) {
            return "1 min read";
        }

        const plainText = description.replace(/<[^>]*>/g, " ").trim();

        const wordCount = plainText
            .split(/\s+/)
            .filter(Boolean).length;

        const minutes = Math.max(1, Math.ceil(wordCount / 200));

        return `${minutes} min read`;
    };

    // FORMAT LARAVEL DATE
    const getFormattedDate = (date?: string) => {
        if (!date) {
            return "Recently published";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Recently published";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <main className="blog-page">

            {/* PAGE BANNER */}
            <div className="aboutuss-top">
                <div className="aboutus-overlay">
                    <div className="container">
                        <div className="aboutus-content">
                            <span className="aboutus-subtitle">
                                INSIGHTS & ARTICLES
                            </span>

                            <h1>Our Blog</h1>

                            <p>
                                <Link href="/">Home</Link>
                                <i className="bi bi-chevron-right"></i>
                                <span>Blog</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* BLOG LIST */}
            <section className="blog-wrapper">
                <div className="container blog-container">

                    {/* SECTION HEADING */}
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

                    {/* LOADING */}
                    {loading && (
                        <div className="text-center py-5">
                            <div
                                className="spinner-border"
                                role="status"
                            ></div>

                            <p className="mt-3">
                                Loading latest articles...
                            </p>
                        </div>
                    )}

                    {/* ERROR */}
                    {!loading && error && (
                        <div className="text-center py-5">
                            <i className="bi bi-exclamation-circle fs-1 text-danger"></i>

                            <h4 className="mt-3">
                                Unable to Load Blogs
                            </h4>

                            <p>{error}</p>

                            <button
                                className="btn btn-primary"
                                onClick={() => window.location.reload()}
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* EMPTY */}
                    {!loading && !error && blogs.length === 0 && (
                        <div className="text-center py-5">
                            <i className="bi bi-journal-text fs-1"></i>

                            <h4 className="mt-3">
                                No Articles Available
                            </h4>

                            <p>
                                New articles will be published here soon.
                            </p>
                        </div>
                    )}

                    {/* BLOG ARTICLES */}
                    {!loading && !error && blogs.length > 0 && (
                        <div className="blog-list">

                            {blogs.map((blog, index) => {

                                const blogSlug = createSlug(blog.title);

                                // URL CONTAINS ONLY THE TITLE SLUG
                                const blogUrl = `/blog/${blogSlug}`;

                                return (
                                    <article
                                        className="blog-article"
                                        key={blog.id}
                                    >

                                        <div className="blog-article-number">
                                            {String(index + 1).padStart(2, "0")}
                                        </div>

                                        {/* BLOG IMAGE */}
                                        <Link
                                            href={blogUrl}
                                            className="blog-article-image"
                                            aria-label={`Read ${blog.title}`}
                                            onClick={() =>
                                                handleBlogClick(blog.id)
                                            }
                                        >
                                            <img
                                                src={getImageUrl(blog.main_image)}
                                                alt={blog.title}
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "/blog-placeholder.jpg";
                                                }}
                                            />

                                            <span className="blog-image-arrow">
                                                <i className="bi bi-arrow-up-right"></i>
                                            </span>
                                        </Link>

                                        <div className="blog-article-content">

                                            {/* CATEGORY */}
                                            <div className="blog-article-category">
                                                <span></span>

                                                {blog.badge_title || "GENERAL"}
                                            </div>

                                            {/* BLOG TITLE */}
                                            <h4>
                                                <Link
                                                    href={blogUrl}
                                                    onClick={() =>
                                                        handleBlogClick(blog.id)
                                                    }
                                                >
                                                    {blog.title}
                                                </Link>
                                            </h4>

                                            {/* DESCRIPTION */}
                                            <div
                                                className="blog-description"
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        blog.desc ||
                                                        "Explore this article to learn more.",
                                                }}
                                            />

                                            {/* BLOG META */}
                                            <div className="blog-article-meta">

                                                <span>
                                                    <i className="bi bi-calendar3"></i>

                                                    {getFormattedDate(
                                                        blog.created_at
                                                    )}
                                                </span>

                                                <span className="blog-meta-divider">
                                                    /
                                                </span>

                                                <span>
                                                    <i className="bi bi-clock"></i>

                                                    {getReadTime(blog.desc)}
                                                </span>

                                            </div>

                                            {/* READ MORE */}
                                            <Link
                                                href={blogUrl}
                                                className="blog-read-more"
                                                aria-label={`Read more: ${blog.title}`}
                                                onClick={() =>
                                                    handleBlogClick(blog.id)
                                                }
                                            >
                                                Read Article
                                                <i className="bi bi-arrow-right"></i>
                                            </Link>

                                        </div>

                                    </article>
                                );
                            })}

                        </div>
                    )}

                    {/* BOTTOM CTA */}
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

                            <Link
                                href="/courses"
                                className="blog-contact-btn"
                            >
                                Explore Our Courses
                                <i className="bi bi-arrow-up-right"></i>
                            </Link>

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