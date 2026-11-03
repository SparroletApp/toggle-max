"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

import blogService from "@/app/apiservice/blogservice";
import "./blog-view.css";

interface QuestionAnswer {
    question: string;
    answer: string;
}

interface BlogData {
    id: number;
    badge_title: string | null;
    title: string;
    desc: string | null;
    main_image: string | null;
    images: string[] | string | null;
    questions_answers: QuestionAnswer[] | string | null;
    created_at?: string;
    updated_at?: string;
}

function ViewBlog() {
    const router = useRouter();
    const params = useParams();

    const rawSlug = params.slug;

    const slug = Array.isArray(rawSlug)
        ? rawSlug[0]
        : rawSlug || "";

    const [blog, setBlog] = useState<BlogData | null>(null);
    const [additionalImages, setAdditionalImages] = useState<string[]>([]);
    const [questionsAnswers, setQuestionsAnswers] = useState<QuestionAnswer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState("");

    // ==========================================
    // PARSE API RESPONSE
    // ==========================================

    const parseResponse = (response: any) => {
        let result = response?.data ?? response;

        if (typeof result === "string") {
            result = result
                .replace(/^```(?:php|json)?\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();

            try {
                result = JSON.parse(result);
            } catch (error) {
                console.error("Invalid API JSON Response:", result);

                throw new Error(
                    "The server returned an invalid response. Please check the Laravel API."
                );
            }
        }

        if (
            result?.success === undefined &&
            result?.data?.success !== undefined
        ) {
            result = result.data;
        }

        return result;
    };

    // ==========================================
    // PARSE ARRAY DATA
    // ==========================================

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

    // ==========================================
    // CREATE SLUG
    // ==========================================

    const createSlug = (value: string) => {
        return value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");
    };

    // ==========================================
    // IMAGE URL
    // ==========================================

    const getImageUrl = (image: string | null) => {
        if (!image) return "";

        if (image.startsWith("http")) {
            return image;
        }

        const storageUrl =
            process.env.NEXT_PUBLIC_STORAGE_URL || "";

        return `${storageUrl.replace(/\/$/, "")}/${image.replace(
            /^\//,
            ""
        )}`;
    };

    // ==========================================
    // FETCH BLOG
    // ==========================================

    const fetchBlog = async () => {
        try {
            setLoading(true);

            if (!slug) {
                throw new Error("Invalid blog URL.");
            }

            const response = await blogService.getAllBlogs();

            const result = parseResponse(response);

            console.log("Blog View Response:", result);

            if (
                result?.success !== true &&
                result?.success !== "true"
            ) {
                throw new Error(
                    result?.message || "Unable to fetch blogs."
                );
            }

            const blogList = Array.isArray(result.data)
                ? result.data
                : [];

            const selectedBlog = blogList.find(
                (item: BlogData) =>
                    createSlug(item.title) === createSlug(slug)
            );

            if (!selectedBlog) {
                throw new Error("Blog not found.");
            }

            setBlog(selectedBlog);

            // Additional images
            const parsedImages = parseArray(selectedBlog.images).filter(
                (image: any) =>
                    typeof image === "string" && image.trim()
            );

            setAdditionalImages(parsedImages);

            // Questions and answers
            const parsedQA = parseArray(
                selectedBlog.questions_answers
            );

            setQuestionsAnswers(
                parsedQA.filter(
                    (item: any) =>
                        item &&
                        (item.question || item.answer)
                )
            );

            // Important:
            // Main image is NOT assigned to selectedImage.
            // Therefore, it will never open in the popup.

        } catch (error: any) {
            console.error("Fetch Blog Error:", error);

            console.error(
                "Laravel Response:",
                error.response?.data
            );

            Swal.fire({
                icon: "error",
                title: "Unable to Load Blog",
                text:
                    error.response?.data?.message ||
                    error.message ||
                    "Something went wrong.",
                confirmButtonColor: "#6668e7",
            }).then(() => {
                router.push("/admin/blog");
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlog();
    }, [slug]);

    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date?: string) => {
        if (!date) return "Not available";

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return "Not available";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="view-blog-page container">
                <div className="view-blog-loading">
                    <div className="spinner-border text-primary"></div>
                    <p>Loading blog details...</p>
                </div>
            </div>
        );
    }

    // ==========================================
    // BLOG NOT FOUND
    // ==========================================

    if (!blog) {
        return (
            <div className="view-blog-page container">
                <div className="view-blog-empty">
                    <i className="bi bi-file-earmark-x"></i>

                    <h4>Blog Not Found</h4>

                    <p>
                        The requested blog could not be found.
                    </p>

                    <button
                        type="button"
                        className="view-blog-back-btn"
                        onClick={() => router.push("/admin/blog")}
                    >
                        <i className="bi bi-arrow-left"></i>
                        Back to Blogs
                    </button>
                </div>
            </div>
        );
    }

    // ==========================================
    // MAIN JSX
    // ==========================================

    return (
        <div className="view-blog-page container">

            <div className="view-blog-page-header">

                <div>

                    <h2>Blog Details</h2>

                    <p>
                        View the complete blog information, images
                        and frequently asked questions.
                    </p>
                </div>

                <div className="view-blog-header-actions">

                    <button
                        type="button"
                        className="view-blog-back-btn"
                        onClick={() => router.push("/admin/blog")}
                    >
                        <i className="bi bi-arrow-left"></i>
                        Back
                    </button>

                    <button
                        type="button"
                        className="view-blog-edit-btn"
                        onClick={() =>
                            router.push(
                                `/admin/blog/edit/${encodeURIComponent(
                                    createSlug(blog.title)
                                )}`
                            )
                        }
                    >
                        <i className="bi bi-pencil-square"></i>
                        Edit Blog
                    </button>

                </div>

            </div>

            <div className="view-blog-main-card">
                <div className="view-blog-header-content">
                    <div className="view-blog-title-section">

                        {blog.badge_title && (
                            <span className="view-blog-badge">
                                {blog.badge_title}
                            </span>
                        )}

                        <h1>{blog.title}</h1>

                        <div className="view-blog-meta">

                            <span>
                                <i className="bi bi-calendar3"></i>
                                Created: {formatDate(blog.created_at)}
                            </span>

                            <span>
                                <i className="bi bi-arrow-repeat"></i>
                                Updated: {formatDate(blog.updated_at)}
                            </span>

                            <span>
                                <i className="bi bi-images"></i>
                                {additionalImages.length} Additional Images
                            </span>

                        </div>

                    </div>
                    {blog.main_image && (

                        <div className="view-blog-main-image-wrapper">

                            <img
                                src={getImageUrl(blog.main_image)}
                                alt={blog.title}
                                className="view-blog-main-image"
                            />

                        </div>

                    )}

                </div>
                <div className="view-blog-content-section">

                    <div className="view-blog-section-heading">

                        <div className="view-blog-section-icon">
                            <i className="bi bi-file-text"></i>
                        </div>

                        <div>
                            <h3>Blog Description</h3>

                            <p>
                                Complete content of the blog post.
                            </p>
                        </div>

                    </div>

                    {blog.desc ? (

                        <div
                            className="view-blog-description"
                            dangerouslySetInnerHTML={{
                                __html: blog.desc,
                            }}
                        />

                    ) : (

                        <p className="view-blog-no-content">
                            No description available.
                        </p>

                    )}

                </div>

            </div>
            <div className="view-blog-section-card">

                <div className="view-blog-section-heading">

                    <div className="view-blog-section-icon">
                        <i className="bi bi-images"></i>
                    </div>

                    <div>
                        <h3>Additional Images</h3>

                        <p>
                            Images uploaded for this blog.
                        </p>
                    </div>

                    <span className="view-blog-count">
                        {additionalImages.length} Images
                    </span>

                </div>

                {additionalImages.length > 0 ? (

                    <div className="view-blog-gallery">

                        {additionalImages.map((image, index) => (

                            <div
                                className="view-blog-gallery-item"
                                key={`${image}-${index}`}
                                onClick={() =>
                                    setSelectedImage(getImageUrl(image))
                                }
                            >

                                <img
                                    src={getImageUrl(image)}
                                    alt={`Blog image ${index + 1}`}
                                />

                                <div className="view-blog-gallery-overlay">
                                    <i className="bi bi-zoom-in"></i>
                                </div>

                                <span>
                                    Image {index + 1}
                                </span>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="view-blog-no-content">

                        <i className="bi bi-image"></i>

                        <p>
                            No additional images available.
                        </p>

                    </div>
                )}
            </div>
            <div className="view-blog-section-card">

                <div className="view-blog-section-heading">

                    <div className="view-blog-section-icon">
                        <i className="bi bi-patch-question"></i>
                    </div>

                    <div>
                        <h3>Questions & Answers</h3>

                        <p>
                            Frequently asked questions related to this blog.
                        </p>
                    </div>

                    <span className="view-blog-count">
                        {questionsAnswers.length} Questions
                    </span>

                </div>

                {questionsAnswers.length > 0 ? (

                    <div className="view-blog-qa-list">

                        {questionsAnswers.map((item, index) => (

                            <div
                                className="view-blog-qa-item"
                                key={index}
                            >

                                <div className="view-blog-question">

                                    <span className="view-blog-qa-number">
                                        Q{index + 1}
                                    </span>

                                    <div>
                                        <small>QUESTION</small>

                                        <h5>
                                            {item.question}
                                        </h5>
                                    </div>

                                </div>

                                <div className="view-blog-answer">

                                    <span className="view-blog-answer-label">
                                        <i className="bi bi-arrow-return-right"></i>
                                        ANSWER
                                    </span>

                                    <p>
                                        {item.answer}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="view-blog-no-content">

                        <i className="bi bi-chat-square-text"></i>

                        <p>
                            No questions and answers available.
                        </p>

                    </div>

                )}

            </div>

            <div className="view-blog-bottom-actions">

                <button
                    type="button"
                    className="view-blog-back-btn"
                    onClick={() => router.push("/admin/blog")}
                >
                    <i className="bi bi-arrow-left"></i>
                    Back to Blogs
                </button>

                <button
                    type="button"
                    className="view-blog-edit-btn"
                    onClick={() =>
                        router.push(
                            `/admin/blog/edit/${encodeURIComponent(
                                createSlug(blog.title)
                            )}`
                        )
                    }
                >
                    <i className="bi bi-pencil-square"></i>
                    Edit Blog
                </button>

            </div>
            {selectedImage && (

                <div
                    className="view-blog-image-modal"
                    onClick={() => setSelectedImage("")}
                >

                    <button
                        type="button"
                        className="view-blog-modal-close"
                        onClick={() => setSelectedImage("")}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>

                    <img
                        src={selectedImage}
                        alt="Additional blog image preview"
                        onClick={(e) => e.stopPropagation()}
                    />

                </div>

            )}

        </div>
    );
}

export default ViewBlog;