"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import blogService, { BlogItem } from "@/app/apiservice/blogservice";

import "./blog-view.css";

interface QuestionAnswer {
    question: string;
    answer: string;
}

type BlogData = BlogItem;

interface BlogContentSection {
    heading: string;
    text: string;
}

function BlogView() {
    const params = useParams();

    const rawSlug = params.slug;

    const slug = Array.isArray(rawSlug)
        ? rawSlug[0]
        : rawSlug || "";

    const [blog, setBlog] = useState<BlogData | null>(null);
    const [additionalImages, setAdditionalImages] = useState<string[]>([]);
    const [questionsAnswers, setQuestionsAnswers] = useState<QuestionAnswer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    const parseArray = (value: any): any[] => {
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
    };

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

    const formatDate = (date?: string) => {
        if (!date) {
            return "Recently published";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Recently published";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };
    const getReadTime = (description: string | null) => {
        if (!description) {
            return "1 min read";
        }

        const plainText = description
            .replace(/<[^>]*>/g, " ")
            .trim();

        const wordCount = plainText
            .split(/\s+/)
            .filter(Boolean).length;

        const minutes = Math.max(1, Math.ceil(wordCount / 200));

        return `${minutes} min read`;
    };

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                setError("");

                if (!slug) {
                    throw new Error("Invalid blog URL.");
                }

                const storedBlogId = localStorage.getItem("blog_id");

                if (!storedBlogId) {
                    throw new Error(
                        "Blog ID not found. Please select an article from the blog page."
                    );
                }

                const blogId = Number(storedBlogId);

                if (!Number.isInteger(blogId) || blogId <= 0) {
                    throw new Error("Invalid blog ID.");
                }

                const blogList = await blogService.getAllBlogs();

                const selectedBlog = blogList.find(
                    (item) => Number(item.id) === blogId
                );

                if (!selectedBlog) {
                    throw new Error("Blog article not found.");
                }
                if (
                    createSlug(selectedBlog.title) !==
                    createSlug(decodeURIComponent(slug))
                ) {
                    throw new Error(
                        "The blog URL does not match the selected article."
                    );
                }

                setBlog(selectedBlog);

                setAdditionalImages(
                    parseArray(selectedBlog.images).filter(
                        (image: any) =>
                            typeof image === "string" &&
                            image.trim() !== ""
                    )
                );

                setQuestionsAnswers(
                    parseArray(selectedBlog.questions_answers).filter(
                        (item: any) =>
                            item &&
                            (item.question || item.answer)
                    )
                );

            } catch (err: any) {
                console.error("Blog detail error:", err);

                setError(
                    err?.message ||
                    "Unable to load this blog article."
                );

                setBlog(null);

            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [slug]);

    if (loading) {
        return (
            <main className="blog-view-page">
                <div className="blog-view-not-found">

                    <div className="spinner-border text-primary"></div>

                    <h1>Loading Article...</h1>

                    <p>
                        Please wait while we load the blog details.
                    </p>

                </div>
            </main>
        );
    }

    if (!blog) {
        return (
            <main className="blog-view-page">
                <div className="blog-view-not-found">

                    <i className="bi bi-journal-x"></i>

                    <h1>Article Not Found</h1>

                    <p>
                        {error ||
                            "The blog article you are looking for does not exist."}
                    </p>

                    <Link
                        href="/blog"
                        className="blog-view-back-btn"
                    >
                        <i className="bi bi-arrow-left"></i>
                        Back to Blog
                    </Link>

                </div>
            </main>
        );
    }

    const contentSections: BlogContentSection[] = [];

    if (blog.desc) {
        contentSections.push({
            heading: "About This Article",
            text: blog.desc,
        });
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

                                    {blog.badge_title || "GENERAL"}

                                </span>

                                <h1>{blog.title}</h1>

                                <div className="blog-view-meta">

                                    <span>
                                        <i className="bi bi-calendar3"></i>

                                        {formatDate(blog.created_at)}
                                    </span>

                                    <span>
                                        <i className="bi bi-clock"></i>

                                        {getReadTime(blog.desc)}
                                    </span>

                                </div>

                            </header>

                        </div>

                        <div className="col-lg-6 col-12">

                            <div className="blog-view-cover">

                                <img
                                    src={getImageUrl(blog.main_image)}
                                    alt={blog.title}
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "/blog-placeholder.jpg";
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                </div>

                {/* BLOG CONTENT */}
                <div className="blog-view-layout">

                    <article className="blog-view-article">

                        <div className="blog-view-article-label">

                            <i className="bi bi-book-half"></i>

                            ARTICLE

                        </div>

                        {/* DESCRIPTION */}
                        {contentSections.map((section, index) => (

                            <section
                                className="blog-view-content-section"
                                key={section.heading}
                            >

                                <span className="blog-view-section-number">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <div>

                                    <h2>{section.heading}</h2>

                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: section.text,
                                        }}
                                    />

                                </div>

                            </section>

                        ))}

                        {/* QUESTIONS AND ANSWERS */}
                        {questionsAnswers.length > 0 && (

                            <div className="blog-view-faq-section">

                                <div className="blog-view-article-label">

                                    <i className="bi bi-patch-question"></i>

                                    QUESTIONS & ANSWERS

                                </div>

                                {questionsAnswers.map((item, index) => (

                                    <section
                                        className="blog-view-content-section"
                                        key={index}
                                    >

                                        <span className="blog-view-section-number">
                                            Q{index + 1}
                                        </span>

                                        <div>

                                            <h2>{item.question}</h2>

                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: item.answer,
                                                }}
                                            />

                                        </div>

                                    </section>

                                ))}

                            </div>

                        )}

                        {/* ADDITIONAL IMAGES */}
                        {additionalImages.length > 0 && (

                            <div className="blog-view-additional-images">

                                <div className="blog-view-article-label">

                                    <i className="bi bi-images"></i>

                                    ARTICLE IMAGES

                                </div>

                                <div className="row g-3">

                                    {additionalImages.map((image, index) => (

                                        <div
                                            className="col-lg-4 col-md-6 col-12"
                                            key={`${image}-${index}`}
                                        >

                                            <div className="blog-view-cover">

                                                <img
                                                    src={getImageUrl(image)}
                                                    alt={`${blog.title} image ${index + 1}`}
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            "/blog-placeholder.jpg";
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        )}

                        {/* ARTICLE FOOTER */}
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

                    {/* SIDEBAR */}
                    <aside className="blog-view-sidebar">

                        <div className="blog-view-sidebar-card">

                            <span className="blog-view-sidebar-label">
                                LEARN WITH TOGGLEMAX
                            </span>

                            <div className="blog-view-sidebar-icon">

                                <i className="bi bi-palette2"></i>

                            </div>

                            <h3>
                                Turn your creativity into a career.
                            </h3>

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

                        <Link
                            href="/blog"
                            className="blog-view-back-link"
                        >
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