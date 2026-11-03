"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import blogService from "@/app/apiservice/blogservice";
import "./blog.css";

interface BlogItem {
    id: number;
    badge_title: string | null;
    title: string;
    desc: string | null;
    main_image: string | null;
    images: string[] | null;
    questions_answers: any[];
    created_at?: string;
    updated_at?: string;
}

function Blog() {

    const router = useRouter();

    const [blogs, setBlogs] = useState<BlogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    // IMAGE URL HANDLER
    const getImageUrl = (image: string) => {

        if (!image) return "";

        if (image.startsWith("http")) {
            return image;
        }

        const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || "";

        return `${storageUrl.replace(/\/$/, "")}/${image.replace(/^\//, "")}`;

    };

    // FETCH BLOGS
    const fetchBlogs = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await blogService.getAllBlogs();

            console.log("Blog API Response:", response);

            let result: any = response;

            if (typeof result === "string") {

                result = JSON.parse(
                    result.replace(/```(?:json|php)?|```/g, "").trim()
                );

            }

            if (result?.data?.success !== undefined) {
                result = result.data;
            }

            if (result?.success === true) {

                setBlogs(
                    Array.isArray(result.data) ? result.data : []
                );

                setError("");

            } else {

                setBlogs([]);

                setError(
                    result?.message || "Unable to retrieve blogs."
                );

            }

        } catch (error: any) {

            console.error("Blog fetching error:", error);

            setBlogs([]);

            setError(
                error.response?.data?.message ||
                "Something went wrong while fetching blogs."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // SEARCH BLOGS
    const filteredBlogs = blogs.filter((blog) => {

        const keyword = search.toLowerCase();

        return (

            blog.title?.toLowerCase().includes(keyword) ||

            blog.badge_title?.toLowerCase().includes(keyword) ||

            blog.desc?.toLowerCase().includes(keyword)

        );

    });

    // CREATE SLUG
    const createSlug = (title: string) => {

        return title
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");

    };

    // VIEW BLOG
    const handleView = (title: string) => {

        const slug = createSlug(title);

        router.push(
            `/admin/blog/view/${encodeURIComponent(slug)}`
        );

    };

    const handleEdit = (title: string) => {

        const slug = createSlug(title);

        router.push(
            `/admin/blog/edit/${encodeURIComponent(slug)}`
        );

    };

    const handleDelete = async (id: number) => {

        const result = await Swal.fire({

            title: "Delete Blog?",

            text: "Are you sure you want to delete this blog? Its images will also be deleted. This action cannot be undone.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Yes, Delete",

            cancelButtonText: "Cancel",

            reverseButtons: true,

            confirmButtonColor: "#e74c3c",

            cancelButtonColor: "#747784",

            focusCancel: true,

        });

        if (!result.isConfirmed) {
            return;
        }

        try {

            Swal.fire({

                title: "Deleting Blog...",

                text: "Please wait while we delete the blog.",

                allowOutsideClick: false,

                allowEscapeKey: false,

                showConfirmButton: false,

                didOpen: () => {
                    Swal.showLoading();
                },

            });

            const apiResult = await blogService.deleteBlog(id);

            console.log(
                "DELETE BLOG RAW RESPONSE:",
                apiResult
            );

            let response: any = apiResult;

            if (typeof response === "string") {

                const cleanedResponse = response
                    .replace(/^```(?:php|json)?\s*/i, "")
                    .replace(/\s*```$/, "")
                    .trim();

                response = JSON.parse(cleanedResponse);

            }

            if (
                response?.success === undefined &&
                response?.data?.success !== undefined
            ) {

                response = response.data;

            }

            console.log(
                "FINAL DELETE RESPONSE:",
                response
            );

            Swal.close();

            if (
                response?.success === true ||
                response?.success === "true"
            ) {

                await Toast.fire({

                    icon: "success",

                    title:
                        response.message ||
                        "Blog deleted successfully!",

                });

                await fetchBlogs();

            } else {

                await Toast.fire({

                    icon: "error",

                    title:
                        response?.message ||
                        "Unable to delete blog.",

                });

            }

        } catch (error: any) {

            console.error(
                "Blog deletion error:",
                error
            );

            Swal.close();

            Toast.fire({

                icon: "error",

                title:
                    error.response?.data?.message ||
                    "Something went wrong while deleting the blog.",

            });

        }

    };

    return (

        <section className="blog tm-admin-page">

            <div className="container">

                {/* PAGE HEADER */}

                <div className="tm-admin-header">

                    <div>

                        <span className="tm-admin-eyebrow">
                            CONTENT MANAGEMENT
                        </span>

                        <h1>Blogs</h1>

                        <p>
                            Manage your blog posts, descriptions,
                            images and frequently asked questions.
                        </p>

                    </div>

                    <div className="tm-course-header-actions">

                        <button
                            type="button"
                            className="tm-btn tm-btn-back"
                            onClick={() => router.push("/admin/dashboard")}
                        >

                            <i className="bi bi-arrow-left"></i>

                            Back to Dashboard

                        </button>

                        <button
                            type="button"
                            className="tm-btn tm-btn-primary"
                            onClick={() => router.push("/admin/blog/create")}
                        >

                            <i className="bi bi-plus-lg"></i>

                            Add New Blog

                        </button>

                    </div>

                </div>

                {/* SUMMARY */}

                <div className="tm-course-summary">

                    <div className="tm-course-summary-icon">

                        <i className="bi bi-journal-richtext"></i>

                    </div>

                    <div>

                        <span>Total Blogs</span>

                        <h3>{blogs.length}</h3>

                    </div>

                </div>

                {/* BLOG TABLE */}

                <div className="tm-table-card">

                    <div className="tm-table-header">

                        <div>

                            <h2>All Blogs</h2>

                            <p>
                                View and manage all your blog posts.
                            </p>

                        </div>

                        <div className="tm-table-search">

                            <i className="bi bi-search"></i>

                            <input
                                type="text"
                                placeholder="Search blogs..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            {search && (

                                <button
                                    type="button"
                                    className="tm-search-clear"
                                    onClick={() => setSearch("")}
                                >

                                    <i className="bi bi-x-lg"></i>

                                </button>

                            )}

                        </div>

                    </div>

                    <div className="tm-table-responsive">

                        <table className="tm-admin-table">

                            <thead>

                                <tr>

                                    <th>SL NO</th>

                                    <th>BLOG DETAILS</th>

                                    <th>BADGE</th>

                                    <th>IMAGES</th>

                                    <th>ACTIONS</th>

                                </tr>

                            </thead>

                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td colSpan={6}>

                                            <div className="tm-table-status">

                                                <div className="tm-spinner"></div>

                                                <p>Loading blogs...</p>

                                            </div>

                                        </td>

                                    </tr>

                                ) : error ? (

                                    <tr>

                                        <td colSpan={6}>

                                            <div className="tm-table-status tm-error-status">

                                                <i className="bi bi-exclamation-circle"></i>

                                                <p>{error}</p>

                                                <button
                                                    type="button"
                                                    className="tm-btn tm-btn-outline"
                                                    onClick={fetchBlogs}
                                                >

                                                    <i className="bi bi-arrow-clockwise"></i>

                                                    Retry

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ) : filteredBlogs.length === 0 ? (

                                    <tr>

                                        <td colSpan={6}>

                                            <div className="tm-table-status">

                                                <i className="bi bi-journal-text"></i>

                                                <h4>

                                                    {search
                                                        ? "No matching blogs found"
                                                        : "No blogs available"}

                                                </h4>

                                                <p>

                                                    {search
                                                        ? "Try searching with another keyword."
                                                        : "Add your first blog to get started."}

                                                </p>

                                            </div>

                                        </td>

                                    </tr>

                                ) : (

                                    filteredBlogs.map((blog, index) => {

                                        const blogImages = Array.isArray(blog.images)
                                            ? blog.images.filter(
                                                (image) => typeof image === "string" && image.trim() !== ""
                                            )
                                            : [];

                                        return (

                                            <tr key={blog.id}>
                                                <td>

                                                    <span className="tm-table-number">

                                                        {String(index + 1).padStart(2, "0")}

                                                    </span>

                                                </td>

                                                <td>

                                                    <div className="tm-course-info">

                                                        <div className="tm-course-image">

                                                            {blog.main_image ? (

                                                                <img
                                                                    src={getImageUrl(blog.main_image)}
                                                                    alt={blog.title}
                                                                />

                                                            ) : (

                                                                <i className="bi bi-journal-richtext"></i>

                                                            )}

                                                        </div>

                                                        <div className="tm-course-text">

                                                            <h4>{blog.title}</h4>

                                                            <p className="tm-portfolio-description">

                                                                {blog.desc
                                                                    ? blog.desc
                                                                        .replace(/<[^>]*>/g, "")
                                                                        .replace(/\s+/g, " ")
                                                                        .trim()
                                                                    : "No description available"}

                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                <td>

                                                    {blog.badge_title ? (

                                                        <span className="tm-course-badge">

                                                            {blog.badge_title}

                                                        </span>

                                                    ) : (

                                                        <span className="tm-no-badge">
                                                            No Badge
                                                        </span>

                                                    )}

                                                </td>


                                                <td>

                                                    {blogImages.length > 0 ? (

                                                        <div className="tm-blog-image-group">

                                                            {blogImages.slice(0, 3).map((image, imageIndex) => (

                                                                <div
                                                                    className="tm-blog-small-image"
                                                                    key={imageIndex}
                                                                >

                                                                    <img
                                                                        src={getImageUrl(image)}
                                                                        alt={`${blog.title} image ${imageIndex + 1}`}
                                                                    />

                                                                </div>

                                                            ))}

                                                            {blogImages.length > 3 && (

                                                                <span className="tm-blog-more-images">

                                                                    +{blogImages.length - 3}

                                                                </span>

                                                            )}

                                                        </div>

                                                    ) : (

                                                        <span className="tm-no-badge">
                                                            No Images
                                                        </span>

                                                    )}

                                                </td>

                                                <td>

                                                    <div className="tm-table-actions">
                                                        <button
                                                            type="button"
                                                            className="tm-action-btn tm-view-btn"
                                                            title="View Blog"
                                                            onClick={() => handleView(blog.title)}
                                                        >

                                                            <i className="bi bi-eye-fill"></i>

                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="tm-action-btn tm-edit-btn"
                                                            title="Edit Blog"
                                                            onClick={() => handleEdit(blog.title)}
                                                        >

                                                            <i className="bi bi-pencil-square"></i>

                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="tm-action-btn tm-delete-btn"
                                                            title="Delete Blog"
                                                            onClick={() => handleDelete(blog.id)}
                                                        >

                                                            <i className="bi bi-trash3-fill"></i>

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    })

                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* TABLE FOOTER */}

                    {!loading && !error && filteredBlogs.length > 0 && (

                        <div className="tm-table-footer">

                            <p>

                                Showing <strong>{filteredBlogs.length}</strong> of{" "}

                                <strong>{blogs.length}</strong> blogs

                            </p>

                            <span>

                                <i className="bi bi-check-circle-fill"></i>

                                Blog management

                            </span>

                        </div>

                    )}

                </div>

            </div>

        </section>

    );

}

export default Blog;