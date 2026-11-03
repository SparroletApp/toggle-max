"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";

import blogService from "@/app/apiservice/blogservice";
import "./edit-blog.css";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

const JoditEditor = dynamic(() => import("jodit-react"), {
    ssr: false,
});

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
}

function EditBlog() {
    const router = useRouter();
    const params = useParams();

    const rawSlug = params.slug;

    const slug = Array.isArray(rawSlug)
        ? rawSlug[0]
        : rawSlug || "";

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [blogId, setBlogId] = useState<number | null>(null);

    const [badgeTitle, setBadgeTitle] = useState("");
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [existingMainImage, setExistingMainImage] = useState("");
    const [mainImagePreview, setMainImagePreview] = useState("");
    const [removeExistingMainImage, setRemoveExistingMainImage] =
        useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const previewUrlsRef = useRef<string[]>([]);

    const [questionsAnswers, setQuestionsAnswers] = useState<
        QuestionAnswer[]
    >([
        {
            question: "",
            answer: "",
        },
    ]);
    const showToast = (
        icon: "success" | "error" | "warning" | "info",
        title: string
    ) => {
        Toast.fire({
            icon,
            title,
        });
    };

    const getImageUrl = (image: string) => {
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

    const parseResponse = (response: any) => {
        let result = response?.data ?? response;

        if (typeof result === "string") {
            const cleanedResponse = result
                .replace(/^```(?:php|json)?\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();

            result = JSON.parse(cleanedResponse);
        }

        if (
            result?.success === undefined &&
            result?.data?.success !== undefined
        ) {
            result = result.data;
        }

        return result;
    };

    const createSlug = (value: string) => {
        return value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");
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

    const createPreviewUrl = (file: File) => {
        const url = URL.createObjectURL(file);

        previewUrlsRef.current.push(url);

        return url;
    };

    const revokePreviewUrl = (url: string) => {
        if (url && url.startsWith("blob:")) {
            URL.revokeObjectURL(url);

            previewUrlsRef.current =
                previewUrlsRef.current.filter(
                    (item) => item !== url
                );
        }
    };

    const fetchBlog = async () => {
        try {
            setFetching(true);

            if (!slug) {
                throw new Error("Invalid blog URL.");
            }

            const response = await blogService.getAllBlogs();

            const result = parseResponse(response);

            console.log("All Blogs Response:", result);

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
                (blog: BlogData) =>
                    createSlug(blog.title) === createSlug(slug)
            );

            if (!selectedBlog) {
                throw new Error("Blog not found.");
            }

            const blog: BlogData = selectedBlog;

            console.log("EDIT BLOG DETAILS:", blog);

            if (!blog.id) {
                throw new Error("Invalid blog details received.");
            }

            setBlogId(blog.id);

            setBadgeTitle(blog.badge_title || "");
            setTitle(blog.title || "");
            setDesc(blog.desc || "");
            setExistingMainImage(blog.main_image || "");

            setMainImagePreview(
                blog.main_image
                    ? getImageUrl(blog.main_image)
                    : ""
            );

            setMainImage(null);
            setRemoveExistingMainImage(false);
            const additionalImages = parseArray(blog.images)
                .filter(
                    (image: any) =>
                        typeof image === "string" && image.trim()
                );

            setExistingImages(additionalImages);

            setImages([]);
            setImagePreviews([]);
            const qa = parseArray(blog.questions_answers);

            setQuestionsAnswers(
                qa.length > 0
                    ? qa.map((item: any) => ({
                        question: item.question || "",
                        answer: item.answer || "",
                    }))
                    : [
                        {
                            question: "",
                            answer: "",
                        },
                    ]
            );
        } catch (error: any) {
            console.error("Fetch Blog Error:", error);

            console.error(
                "Laravel Response:",
                error.response?.data
            );

            showToast(
                "error",
                error.response?.data?.message ||
                error.message ||
                "Unable to load blog details."
            );
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchBlog();

        return () => {
            previewUrlsRef.current.forEach((url) => {
                URL.revokeObjectURL(url);
            });

            previewUrlsRef.current = [];
        };

    }, [slug]);

    const handleMainImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            Swal.fire(
                "Invalid File",
                "Please select a valid image.",
                "error"
            );

            e.target.value = "";
            return;
        }

        if (file.size > 4 * 1024 * 1024) {
            Swal.fire(
                "File Too Large",
                "Maximum image size is 4MB.",
                "error"
            );

            e.target.value = "";
            return;
        }

        if (mainImagePreview.startsWith("blob:")) {
            revokePreviewUrl(mainImagePreview);
        }

        const preview = createPreviewUrl(file);

        setMainImage(file);
        setMainImagePreview(preview);

        setRemoveExistingMainImage(false);

        e.target.value = "";
    };

    const removeMainImage = () => {
        if (mainImagePreview.startsWith("blob:")) {
            revokePreviewUrl(mainImagePreview);
        }

        setMainImage(null);
        setMainImagePreview("");
        setExistingMainImage("");
        setRemoveExistingMainImage(true);
    };
    const handleImagesChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFiles = Array.from(e.target.files || []);

        if (!selectedFiles.length) return;

        const totalImages =
            existingImages.length + images.length;

        if (totalImages + selectedFiles.length > 10) {
            Swal.fire(
                "Maximum Images",
                "You can upload a maximum of 10 additional images.",
                "warning"
            );

            e.target.value = "";
            return;
        }

        const validFiles = selectedFiles.filter((file) => {
            return (
                file.type.startsWith("image/") &&
                file.size <= 4 * 1024 * 1024
            );
        });

        if (validFiles.length !== selectedFiles.length) {
            Swal.fire(
                "Invalid Images",
                "Only valid images up to 4MB each are allowed.",
                "warning"
            );
        }

        if (!validFiles.length) {
            e.target.value = "";
            return;
        }

        const newPreviews = validFiles.map((file) =>
            createPreviewUrl(file)
        );

        setImages((prev) => [...prev, ...validFiles]);

        setImagePreviews((prev) => [
            ...prev,
            ...newPreviews,
        ]);

        e.target.value = "";
    };

    const removeExistingImage = (index: number) => {
        setExistingImages((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const removeImage = (index: number) => {
        const preview = imagePreviews[index];

        if (preview) {
            revokePreviewUrl(preview);
        }

        setImages((prev) =>
            prev.filter((_, i) => i !== index)
        );

        setImagePreviews((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const addQuestionAnswer = () => {
        setQuestionsAnswers((prev) => [
            ...prev,
            {
                question: "",
                answer: "",
            },
        ]);
    };

    const removeQuestionAnswer = (index: number) => {
        setQuestionsAnswers((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const handleQuestionChange = (
        index: number,
        value: string
    ) => {
        setQuestionsAnswers((prev) =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, question: value }
                    : item
            )
        );
    };

    const handleAnswerChange = (
        index: number,
        value: string
    ) => {
        setQuestionsAnswers((prev) =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, answer: value }
                    : item
            )
        );
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!blogId) {
            showToast("error", "Blog ID is missing.");
            return;
        }

        if (!title.trim()) {
            showToast("warning", "Please enter the blog title.");
            return;
        }

        if (
            !desc.trim() ||
            desc === "<p><br></p>" ||
            desc === "<p></p>"
        ) {
            showToast(
                "warning",
                "Please enter the blog description."
            );
            return;
        }

        if (!mainImagePreview) {
            showToast(
                "warning",
                "Please select a main blog image."
            );
            return;
        }

        const validQuestionsAnswers = questionsAnswers.filter(
            (item) =>
                item.question.trim() || item.answer.trim()
        );

        const incompleteQA = validQuestionsAnswers.some(
            (item) =>
                !item.question.trim() ||
                !item.answer.trim()
        );

        if (incompleteQA) {
            showToast(
                "warning",
                "Please enter both question and answer for each FAQ."
            );
            return;
        }

        const totalImages =
            existingImages.length + images.length;

        if (totalImages > 10) {
            showToast(
                "warning",
                "You can upload a maximum of 10 additional images."
            );
            return;
        }

        const formData = new FormData();

        formData.append("id", blogId.toString());

        formData.append("badge_title", badgeTitle);
        formData.append("title", title.trim());
        formData.append("desc", desc);
        if (mainImage) {
            formData.append("main_image", mainImage);
        } else if (removeExistingMainImage) {
            formData.append("remove_main_image", "1");
        }

        existingImages.forEach((image) => {
            formData.append("existing_images[]", image);
        });


        images.forEach((image) => {
            formData.append("images[]", image);
        });

        validQuestionsAnswers.forEach((item, index) => {
            formData.append(
                `questions_answers[${index}][question]`,
                item.question.trim()
            );

            formData.append(
                `questions_answers[${index}][answer]`,
                item.answer.trim()
            );
        });

        console.log("BLOG UPDATE FORM DATA:");

        formData.forEach((value, key) => {
            if (value instanceof File) {
                console.log(key, value.name);
            } else {
                console.log(key, value);
            }
        });

        try {
            setLoading(true);

            const response = await blogService.updateBlog(
                blogId,
                formData
            );

            console.log("Update Blog Response:", response);

            const result = parseResponse(response);

            console.log("Parsed Update Response:", result);

            if (
                result?.success === true ||
                result?.success === "true"
            ) {
                await Toast.fire({
                    icon: "success",
                    title:
                        result.message ||
                        "Blog updated successfully!",
                });

                router.push("/admin/blog");
            } else {
                showToast(
                    "error",
                    result?.message || "Unable to update blog."
                );
            }
        } catch (error: any) {
            console.error("Update Blog Error:", error);

            console.error(
                "Laravel Validation Errors:",
                error.response?.data?.errors
            );

            const validationErrors =
                error.response?.data?.errors;

            let message =
                error.response?.data?.message ||
                error.message ||
                "Something went wrong while updating the blog.";

            if (validationErrors) {
                const firstError = Object.values(
                    validationErrors
                ).flat()[0];

                if (firstError) {
                    message = String(firstError);
                }
            }

            showToast("error", message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="create-blog-page container">
                <div className="blog-form-card text-center py-5">
                    <div className="spinner-border text-primary"></div>

                    <p className="mt-3 mb-0">
                        Loading blog details...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="create-blog-page container">

            <div className="blog-page-header">
                <div>
                    <h2>Edit Blog</h2>

                    <p>
                        Update your blog post, images and frequently
                        asked questions.
                    </p>
                </div>

                <button
                    type="button"
                    className="blog-back-btn"
                    onClick={() => router.back()}
                    disabled={loading}
                >
                    <i className="bi bi-arrow-left"></i>
                    Back
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="blog-form-card">

                    <div className="blog-section-heading">
                        <div className="blog-heading-icon">
                            <i className="bi bi-pencil-square"></i>
                        </div>

                        <div>
                            <h4>Blog Information</h4>

                            <p>
                                Edit the basic details of your blog.
                            </p>
                        </div>
                    </div>

                    <div className="row g-4">

                        <div className="col-lg-6 col-12">
                            <label className="blog-form-label">
                                Badge Title
                            </label>

                            <input
                                type="text"
                                className="form-control blog-form-control"
                                placeholder="Eg: UI/UX Design"
                                value={badgeTitle}
                                onChange={(e) =>
                                    setBadgeTitle(e.target.value)
                                }
                                disabled={loading}
                            />
                        </div>

                        <div className="col-lg-6 col-12">
                            <label className="blog-form-label">
                                Blog Title <span>*</span>
                            </label>

                            <input
                                type="text"
                                className="form-control blog-form-control"
                                placeholder="Enter blog title"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="col-12">
                            <label className="blog-form-label">
                                Blog Description <span>*</span>
                            </label>

                            <div className="blog-editor-wrapper">
                                <JoditEditor
                                    value={desc}
                                    onBlur={(newContent) =>
                                        setDesc(newContent)
                                    }
                                    config={{
                                        readonly: loading,
                                        height: 150,
                                        placeholder:
                                            "Write your blog content here...",
                                        toolbarSticky: false,
                                        buttons: [
                                            "bold",
                                            "italic",
                                            "underline",
                                            "|",
                                            "ul",
                                            "ol",
                                            "|",
                                            "font",
                                            "fontsize",
                                            "|",
                                            "link",
                                            "image",
                                            "table",
                                            "|",
                                            "align",
                                            "undo",
                                            "redo",
                                            "|",
                                            "source",
                                        ],
                                    }}
                                />
                            </div>
                        </div>

                    </div>
                </div>
                <div className="blog-form-card">

                    <div className="blog-section-heading">
                        <div className="blog-heading-icon">
                            <i className="bi bi-image"></i>
                        </div>

                        <div>
                            <h4>Main Blog Image</h4>

                            <p>
                                Replace or update the featured image for
                                your blog.
                            </p>
                        </div>
                    </div>

                    <div className="blog-upload-area">

                        {!mainImagePreview ? (

                            <label className="blog-upload-label">

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleMainImageChange}
                                    hidden
                                    disabled={loading}
                                />

                                <i className="bi bi-cloud-arrow-up"></i>

                                <h5>
                                    Click to upload main image
                                </h5>

                                <p>
                                    JPG, PNG or WEBP (Maximum 4MB)
                                </p>

                            </label>

                        ) : (

                            <div className="blog-main-preview">

                                <img
                                    src={mainImagePreview}
                                    alt="Main blog preview"
                                />

                                <button
                                    type="button"
                                    className="blog-remove-image"
                                    onClick={removeMainImage}
                                    disabled={loading}
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>

                                <div className="blog-preview-info">
                                    <i className="bi bi-check-circle-fill"></i>

                                    {mainImage
                                        ? mainImage.name
                                        : "Existing main image"}
                                </div>

                            </div>

                        )}

                    </div>
                </div>
                <div className="blog-form-card">

                    <div className="blog-section-heading">
                        <div className="blog-heading-icon">
                            <i className="bi bi-images"></i>
                        </div>

                        <div>
                            <h4>Additional Blog Images</h4>

                            <p>
                                Manage existing images or upload new
                                images.
                            </p>
                        </div>
                    </div>

                    <div className="blog-upload-area">

                        <label className="blog-upload-label">

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onChange={handleImagesChange}
                                hidden
                                disabled={
                                    loading ||
                                    existingImages.length + images.length >= 10
                                }
                            />

                            <i className="bi bi-cloud-plus"></i>

                            <h5>Click to upload images</h5>

                            <p>
                                You can upload up to 10 images (4MB
                                each).
                            </p>

                            <span>
                                {existingImages.length + images.length} / 10
                                images
                            </span>

                        </label>

                    </div>
                    {existingImages.length > 0 && (

                        <div className="blog-image-preview-grid">

                            {existingImages.map((image, index) => (

                                <div
                                    className="blog-image-preview-item"
                                    key={`existing-${image}-${index}`}
                                >

                                    <img
                                        src={getImageUrl(image)}
                                        alt={`Existing blog image ${index + 1}`}
                                    />

                                    <button
                                        type="button"
                                        className="blog-remove-image"
                                        onClick={() =>
                                            removeExistingImage(index)
                                        }
                                        disabled={loading}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>

                                    <div className="blog-image-number">
                                        Existing Image {index + 1}
                                    </div>

                                </div>

                            ))}

                        </div>

                    )}
                    {imagePreviews.length > 0 && (

                        <div className="blog-image-preview-grid">

                            {imagePreviews.map((preview, index) => (

                                <div
                                    className="blog-image-preview-item"
                                    key={`${preview}-${index}`}
                                >

                                    <img
                                        src={preview}
                                        alt={`New blog image ${index + 1}`}
                                    />

                                    <button
                                        type="button"
                                        className="blog-remove-image"
                                        onClick={() => removeImage(index)}
                                        disabled={loading}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>

                                    <div className="blog-image-number">
                                        New Image {index + 1}
                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                    {existingImages.length === 0 &&
                        images.length === 0 && (

                            <div className="text-center py-3">
                                <p className="text-muted mb-0">
                                    No additional images selected.
                                </p>
                            </div>

                        )}

                </div>

                <div className="blog-form-card">

                    <div className="blog-section-heading">
                        <div className="blog-heading-icon">
                            <i className="bi bi-patch-question"></i>
                        </div>

                        <div>
                            <h4>Questions & Answers</h4>

                            <p>
                                Edit frequently asked questions related
                                to this blog.
                            </p>
                        </div>
                    </div>

                    {questionsAnswers.map((item, index) => (

                        <div
                            className="blog-qa-item"
                            key={index}
                        >

                            <div className="blog-qa-header">

                                <h5>
                                    Question {index + 1}
                                </h5>

                                {questionsAnswers.length > 1 && (

                                    <button
                                        type="button"
                                        className="blog-qa-remove-btn"
                                        onClick={() =>
                                            removeQuestionAnswer(index)
                                        }
                                        disabled={loading}
                                    >
                                        <i className="bi bi-trash3"></i>
                                        Remove
                                    </button>

                                )}

                            </div>

                            <div className="row g-4">

                                <div className="col-12">

                                    <label className="blog-form-label">
                                        Question
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control blog-form-control"
                                        placeholder="Enter question"
                                        value={item.question}
                                        onChange={(e) =>
                                            handleQuestionChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        disabled={loading}
                                    />

                                </div>

                                <div className="col-12">

                                    <label className="blog-form-label">
                                        Answer
                                    </label>

                                    <textarea
                                        className="form-control blog-form-control blog-textarea"
                                        rows={4}
                                        placeholder="Enter answer"
                                        value={item.answer}
                                        onChange={(e) =>
                                            handleAnswerChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        disabled={loading}
                                    />

                                </div>

                            </div>

                        </div>

                    ))}

                    <button
                        type="button"
                        className="blog-add-qa-btn"
                        onClick={addQuestionAnswer}
                        disabled={loading}
                    >
                        <i className="bi bi-plus-circle"></i>
                        Add Question & Answer
                    </button>

                </div>

                <div className="blog-form-actions">

                    <button
                        type="button"
                        className="blog-cancel-btn"
                        onClick={() => router.back()}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="blog-submit-btn"
                        disabled={loading || fetching}
                    >

                        {loading ? (

                            <>
                                <span className="spinner-border spinner-border-sm"></span>
                                Updating...
                            </>

                        ) : (

                            <>
                                <i className="bi bi-check-circle"></i>
                                Update Blog
                            </>

                        )}

                    </button>

                </div>

            </form>
        </div>
    );
}

export default EditBlog;