"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";

import blogService from "@/app/apiservice/blogservice";
import "./create-blog.css";

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

function CreateBlog() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [badgeTitle, setBadgeTitle] = useState("");
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");

    const [mainImage, setMainImage] = useState<File | null>(null);
    const [images, setImages] = useState<File[]>([]);

    const [mainImagePreview, setMainImagePreview] = useState("");
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [questionsAnswers, setQuestionsAnswers] = useState<QuestionAnswer[]>([
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

    const handleMainImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            Swal.fire("Invalid File", "Please select a valid image.", "error");
            e.target.value = "";
            return;
        }

        if (file.size > 4 * 1024 * 1024) {
            Swal.fire("File Too Large", "Maximum image size is 4MB.", "error");
            e.target.value = "";
            return;
        }

        setMainImage(file);
        setMainImagePreview(URL.createObjectURL(file));
    };
    const handleImagesChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const selectedFiles = Array.from(e.target.files || []);

        if (images.length + selectedFiles.length > 10) {
            Swal.fire(
                "Maximum Images",
                "You can upload a maximum of 10 additional images.",
                "warning"
            );

            e.target.value = "";
            return;
        }

        const validFiles = selectedFiles.filter((file) => {

            if (!file.type.startsWith("image/")) {
                return false;
            }

            if (file.size > 4 * 1024 * 1024) {
                return false;
            }

            return true;
        });

        if (validFiles.length !== selectedFiles.length) {
            Swal.fire(
                "Invalid Images",
                "Only valid images up to 4MB each are allowed.",
                "warning"
            );
        }

        setImages((prev) => [...prev, ...validFiles]);

        setImagePreviews((prev) => [
            ...prev,
            ...validFiles.map((file) => URL.createObjectURL(file)),
        ]);

        e.target.value = "";
    };

    const removeMainImage = () => {

        setMainImage(null);
        setMainImagePreview("");
    };

    const removeImage = (index: number) => {

        URL.revokeObjectURL(imagePreviews[index]);

        setImages((prev) => prev.filter((_, i) => i !== index));

        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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

        if (!title.trim()) {
            showToast("warning", "Please enter the blog title.");
            return;
        }

        if (!desc.trim() || desc === "<p><br></p>") {
            showToast("warning", "Please enter the blog description.");
            return;
        }

        const validQuestionsAnswers = questionsAnswers.filter(
            (item) => item.question.trim() || item.answer.trim()
        );

        const incompleteQA = validQuestionsAnswers.some(
            (item) => !item.question.trim() || !item.answer.trim()
        );

        if (incompleteQA) {
            showToast(
                "warning",
                "Please enter both question and answer for each FAQ."
            );
            return;
        }

        const formData = new FormData();

        formData.append("badge_title", badgeTitle);
        formData.append("title", title);
        formData.append("desc", desc);

        if (mainImage) {
            formData.append("main_image", mainImage);
        }

        images.forEach((image) => {
            formData.append("images[]", image);
        });

        validQuestionsAnswers.forEach((item, index) => {
            formData.append(
                `questions_answers[${index}][question]`,
                item.question
            );

            formData.append(
                `questions_answers[${index}][answer]`,
                item.answer
            );
        });

        try {
            setLoading(true);

            const response = await blogService.createBlog(formData);

            console.log("Create Blog Response:", response);
            let result = response;

            if (typeof response === "string") {
                const cleanedResponse = response
                    .replace(/^```(?:php|json)?\s*/i, "")
                    .replace(/\s*```$/i, "")
                    .trim();

                result = JSON.parse(cleanedResponse);
            }

            console.log("Parsed Blog Response:", result);

            if (result?.success === true) {

                showToast(
                    "success",
                    result.message || "Blog created successfully!"
                );

                setTimeout(() => {
                    router.push("/admin/blog");
                }, 1000);

            } else {

                showToast(
                    "error",
                    result?.message || "Unable to create blog."
                );

            }

        } catch (error: any) {

            console.error("Create Blog Error:", error);

            const message =
                error.response?.data?.message ||
                error.message ||
                "Something went wrong while creating the blog.";

            showToast("error", message);

        } finally {
            setLoading(false);
        }
    };




    return (

        <div className="create-blog-page container">

            <div className="blog-page-header">

                <div>
                    <h2>Create Blog</h2>

                    <p>
                        Add a new blog post to your website.
                    </p>
                </div>

                <button
                    type="button"
                    className="blog-back-btn"
                    onClick={() => router.back()}
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
                            <p>Enter the basic details of your blog.</p>
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
                                        readonly: false,
                                        height: 150,
                                        placeholder: "Write your blog content here...",
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
                            <p>Upload the featured image for your blog.</p>
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
                                />

                                <i className="bi bi-cloud-arrow-up"></i>

                                <h5>Click to upload main image</h5>

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
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>

                                <div className="blog-preview-info">
                                    <i className="bi bi-check-circle-fill"></i>
                                    {mainImage?.name}
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
                                Upload additional images to display inside your blog.
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
                            />

                            <i className="bi bi-cloud-plus"></i>

                            <h5>Click to upload images</h5>

                            <p>
                                You can upload up to 10 images (4MB each).
                            </p>

                            <span>
                                {images.length} / 10 images selected
                            </span>

                        </label>

                    </div>

                    {imagePreviews.length > 0 && (

                        <div className="blog-image-preview-grid">

                            {imagePreviews.map((preview, index) => (

                                <div
                                    className="blog-image-preview-item"
                                    key={`${preview}-${index}`}
                                >

                                    <img
                                        src={preview}
                                        alt={`Blog image ${index + 1}`}
                                    />

                                    <button
                                        type="button"
                                        className="blog-remove-image"
                                        onClick={() => removeImage(index)}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>

                                    <div className="blog-image-number">
                                        Image {index + 1}
                                    </div>

                                </div>

                            ))}

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
                                Add frequently asked questions related to this blog.
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
                                    />

                                </div>

                            </div>

                        </div>

                    ))}


                    <button
                        type="button"
                        className="blog-add-qa-btn"
                        onClick={addQuestionAnswer}
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
                        disabled={loading}
                    >

                        {loading ? (

                            <>
                                <span className="spinner-border spinner-border-sm"></span>
                                Creating...
                            </>

                        ) : (

                            <>
                                <i className="bi bi-check-circle"></i>
                                Create Blog
                            </>

                        )}

                    </button>

                </div>

            </form>

        </div>
    );
}

export default CreateBlog;