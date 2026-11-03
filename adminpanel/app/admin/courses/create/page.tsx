"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import "jodit/es2021/jodit.min.css";
import "./createcourse.css";

import courseService from "@/app/apiservice/coursesservice";
import Swal from "sweetalert2";

const JoditEditor = dynamic(
    () => import("jodit-react"),
    {
        ssr: false,
        loading: () => (
            <div className="jodit-loading">
                Loading editor...
            </div>
        ),
    }
);

interface KeyPoint {
    title: string;
}

interface Curriculum {
    title: string;
    desc: string;
    points: string[];
}

interface ApiError {
    response?: {
        status?: number;
        data?: {
            message?: string;
            errors?: Record<string, string[]>;
        };
    };
    message?: string;
}

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
});

const joditConfig = {
    readonly: false,
    height: 200,
    minHeight: 150,
    placeholder: "Write your description here...",
    toolbar: true,
    spellcheck: true,
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    toolbarAdaptive: false,

    buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "paragraph",
        "|",
        "align",
        "|",
        "link",
        "table",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "fullsize",
    ],

    uploader: {
        insertImageAsBase64URI: true,
    },
};

const stripHtml = (value: string) => {
    return value
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&#160;/g, " ")
        .trim();
};

export default function CreateCourse() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        desc: "",
        months: "",
        days: "",
        badge: "",
    });

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");

    const [keyPoints, setKeyPoints] = useState<KeyPoint[]>([
        { title: "" },
    ]);

    const [curriculum, setCurriculum] = useState<Curriculum[]>([
        {
            title: "",
            desc: "",
            points: [""],
        },
    ]);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const showToast = (
        icon: "success" | "error" | "warning" | "info",
        title: string
    ) => {
        Toast.fire({
            icon,
            title,
        });
    };

    // BASIC FORM INPUTS

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // COURSE DESCRIPTION EDITOR

    const handleDescriptionChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            desc: value,
        }));
    };

    // IMAGE UPLOAD

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const allowedExtensions = ["png", "jpg", "jpeg", "webp"];
        const extension = file.name.split(".").pop()?.toLowerCase();

        if (!extension || !allowedExtensions.includes(extension)) {
            showToast(
                "error",
                "Only PNG, JPG, JPEG and WEBP images are allowed."
            );

            e.target.value = "";
            return;
        }

        if (file.size > 20 * 1024 * 1024) {
            showToast(
                "error",
                "Image size must not exceed 20 MB."
            );

            e.target.value = "";
            return;
        }

        const preview = URL.createObjectURL(file);

        setImage(file);
        setImagePreview(preview);

        showToast("success", "Image selected successfully.");
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview("");

        const fileInput = document.getElementById(
            "courseImage"
        ) as HTMLInputElement | null;

        if (fileInput) {
            fileInput.value = "";
        }
    };

    // KEY POINTS

    const addKeyPoint = () => {
        setKeyPoints((prev) => [
            ...prev,
            { title: "" },
        ]);
    };

    const updateKeyPoint = (
        index: number,
        value: string
    ) => {
        setKeyPoints((prev) =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, title: value }
                    : item
            )
        );
    };

    const removeKeyPoint = (index: number) => {
        setKeyPoints((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    // CURRICULUM MODULES

    const addCurriculum = () => {
        setCurriculum((prev) => [
            ...prev,
            {
                title: "",
                desc: "",
                points: [""],
            },
        ]);
    };

    const removeCurriculum = (index: number) => {
        setCurriculum((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const updateCurriculum = (
        index: number,
        field: "title" | "desc",
        value: string
    ) => {
        setCurriculum((prev) =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, [field]: value }
                    : item
            )
        );
    };

    // CURRICULUM TOPICS

    const addCurriculumPoint = (sectionIndex: number) => {
        setCurriculum((prev) =>
            prev.map((section, i) =>
                i === sectionIndex
                    ? {
                        ...section,
                        points: [...section.points, ""],
                    }
                    : section
            )
        );
    };

    const updateCurriculumPoint = (
        sectionIndex: number,
        pointIndex: number,
        value: string
    ) => {
        setCurriculum((prev) =>
            prev.map((section, i) =>
                i === sectionIndex
                    ? {
                        ...section,
                        points: section.points.map((point, j) =>
                            j === pointIndex ? value : point
                        ),
                    }
                    : section
            )
        );
    };

    const removeCurriculumPoint = (
        sectionIndex: number,
        pointIndex: number
    ) => {
        setCurriculum((prev) =>
            prev.map((section, i) =>
                i === sectionIndex
                    ? {
                        ...section,
                        points: section.points.filter(
                            (_, j) => j !== pointIndex
                        ),
                    }
                    : section
            )
        );
    };

    // FORM SUBMISSION

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (loading) return;

        if (!formData.title.trim()) {
            showToast("warning", "Please enter the course title.");
            return;
        }

        if (!stripHtml(formData.desc)) {
            showToast("warning", "Please enter the course description.");
            return;
        }

        if (!formData.months || Number(formData.months) < 1) {
            showToast("warning", "Please enter a valid course duration.");
            return;
        }

        if (!image) {
            showToast("warning", "Please upload a course image.");
            return;
        }

        const validKeyPoints = keyPoints
            .filter((point) => point.title.trim())
            .map((point) => ({
                title: point.title.trim(),
            }));

        if (validKeyPoints.length === 0) {
            showToast(
                "warning",
                "Please add at least one course key point."
            );
            return;
        }

        const validCurriculum = curriculum
            .filter((section) => section.title.trim())
            .map((section) => ({
                title: section.title.trim(),
                desc: section.desc,
                points: section.points
                    .filter((point) => point.trim())
                    .map((point) => point.trim()),
            }));

        if (validCurriculum.length === 0) {
            showToast(
                "warning",
                "Please add at least one curriculum module."
            );
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();

            data.append("title", formData.title.trim());

            // Save formatted HTML description
            data.append("desc", formData.desc);

            data.append("months", formData.months);
            data.append("days", formData.days.trim());
            data.append("badge", formData.badge.trim());

            data.append("image", image, image.name);

            data.append(
                "keyPoints",
                JSON.stringify(validKeyPoints)
            );

            // Curriculum descriptions are also saved as HTML
            data.append(
                "curriculum",
                JSON.stringify(validCurriculum)
            );

            console.log("COURSE FORM DATA:");

            data.forEach((value, key) => {
                console.log(
                    key,
                    value instanceof File
                        ? {
                            name: value.name,
                            type: value.type,
                            size: value.size,
                        }
                        : value
                );
            });

            const apiResult = await courseService.addCourse(data);

            console.log("RAW COURSE RESPONSE:", apiResult);

            let response: any = apiResult;

            if (typeof response === "string") {
                try {
                    const cleanedResponse = response
                        .replace(/^```(?:php|json)?\s*/i, "")
                        .replace(/\s*```$/, "")
                        .trim();

                    response = JSON.parse(cleanedResponse);
                } catch (parseError) {
                    console.error("RESPONSE PARSING ERROR:", parseError);

                    showToast(
                        "error",
                        "Invalid response received from server."
                    );

                    return;
                }
            }

            if (
                response?.success === undefined &&
                response?.data?.success !== undefined
            ) {
                response = response.data;
            }

            console.log("FINAL COURSE RESPONSE:", response);

            if (
                response?.success === true ||
                response?.success === "true"
            ) {
                await Toast.fire({
                    icon: "success",
                    title:
                        response.message ||
                        "Course created successfully!",
                    timer: 1800,
                });

                router.replace("/admin/courses");
                return;
            }

            showToast(
                "error",
                response?.message || "Course creation failed."
            );

        } catch (error: unknown) {
            console.error("CREATE COURSE ERROR:", error);

            const err = error as ApiError;

            console.error("API STATUS:", err.response?.status);
            console.error("API ERROR RESPONSE:", err.response?.data);

            const validationErrors = err.response?.data?.errors;

            if (validationErrors) {
                const firstError = Object.values(
                    validationErrors
                )[0]?.[0];

                showToast(
                    "error",
                    firstError || "Please check the form details."
                );
            } else {
                showToast(
                    "error",
                    err.response?.data?.message ||
                    err.message ||
                    "Unable to create course. Please try again."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="create-course-page container">

            {/* PAGE HEADER */}

            <div className="create-course-header">
                <div>
                    <span className="create-course-label">
                        COURSE MANAGEMENT
                    </span>

                    <h2>Create New Course</h2>

                    <p>
                        Add a new training program to your Togglemax website.
                    </p>
                </div>

                <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => router.back()}
                >
                    <i className="bi bi-arrow-left"></i>
                    Back
                </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>

                {/* BASIC INFORMATION */}

                <div className="admin-form-card">

                    <div className="admin-form-card-heading">
                        <div className="admin-form-card-icon">
                            <i className="bi bi-info-circle"></i>
                        </div>

                        <div>
                            <h4>Basic Information</h4>
                            <p>Enter the main details of your course.</p>
                        </div>
                    </div>

                    <div className="admin-form-grid row">

                        <div className="admin-form-group col-lg-6 col-12">
                            <label>
                                Course Title <span>*</span>
                            </label>

                            <input
                                type="text"
                                name="title"
                                placeholder="Eg: UI/UX Design Masterclass"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="admin-form-group col-lg-6 col-12">
                            <label>Course Badge</label>

                            <input
                                type="text"
                                name="badge"
                                placeholder="Eg: MOST POPULAR"
                                value={formData.badge}
                                onChange={handleChange}
                            />
                        </div>

                        {/* COURSE DESCRIPTION JODIT EDITOR */}

                        <div className="admin-form-group col-12">
                            <label>
                                Course Description <span>*</span>
                            </label>

                            <div className="course-jodit-editor">
                                <JoditEditor
                                    value={formData.desc}
                                    config={{
                                        ...joditConfig,
                                        placeholder: "Write your course description...",
                                    }}
                                    onBlur={handleDescriptionChange}
                                />
                            </div>
                        </div>

                        <div className="admin-form-group col-lg-6 col-12">
                            <label>
                                Duration (Months) <span>*</span>
                            </label>

                            <input
                                type="number"
                                name="months"
                                placeholder="Eg: 3"
                                min="1"
                                value={formData.months}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="admin-form-group col-lg-6 col-12">
                            <label>Training Days</label>

                            <input
                                type="text"
                                name="days"
                                placeholder="Eg: 5 Days a Week"
                                value={formData.days}
                                onChange={handleChange}
                            />
                        </div>

                    </div>
                </div>

                {/* COURSE IMAGE */}

                <div className="admin-form-card">

                    <div className="admin-form-card-heading">
                        <div className="admin-form-card-icon">
                            <i className="bi bi-image"></i>
                        </div>

                        <div>
                            <h4>Course Image</h4>
                            <p>Upload a cover image for your course.</p>
                        </div>
                    </div>

                    <div className="admin-image-upload">

                        <input
                            type="file"
                            accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                            id="courseImage"
                            onChange={handleImageChange}
                            hidden
                        />

                        <div className="admin-image-upload-content">

                            <label
                                htmlFor="courseImage"
                                className="admin-image-upload-label"
                            >
                                <i className="bi bi-cloud-arrow-up"></i>
                                <h5>Upload Course Image</h5>
                                <p>Click to browse your files</p>
                                <small>
                                    PNG, JPG, JPEG or WEBP · Max 20 MB
                                </small>
                            </label>

                            {imagePreview && (
                                <div className="admin-image-preview">

                                    <img
                                        src={imagePreview}
                                        alt="Course Preview"
                                    />

                                    <button
                                        type="button"
                                        className="admin-btn-danger course-remove-image"
                                        onClick={removeImage}
                                    >
                                        <i className="bi bi-trash"></i>
                                        Remove
                                    </button>

                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* COURSE KEY POINTS */}

                <div className="admin-form-card">

                    <div className="course-section-heading">

                        <div className="admin-form-card-heading">
                            <div className="admin-form-card-icon">
                                <i className="bi bi-check2-circle"></i>
                            </div>

                            <div>
                                <h4>Course Key Points</h4>
                                <p>Highlight what students will learn.</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="admin-btn-add"
                            onClick={addKeyPoint}
                        >
                            <i className="bi bi-plus-lg"></i>
                            Add Point
                        </button>

                    </div>

                    <div className="row g-3">

                        {keyPoints.map((point, index) => (
                            <div
                                className="col-lg-6 col-12"
                                key={index}
                            >
                                <div className="admin-form-row">

                                    <span className="course-row-number">
                                        {index + 1}
                                    </span>

                                    <input
                                        type="text"
                                        placeholder="Enter course key point"
                                        value={point.title}
                                        onChange={(e) =>
                                            updateKeyPoint(index, e.target.value)
                                        }
                                    />

                                    {keyPoints.length > 1 && (
                                        <button
                                            type="button"
                                            className="admin-btn-danger course-icon-remove"
                                            onClick={() => removeKeyPoint(index)}
                                            aria-label="Remove key point"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    )}

                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                {/* COURSE CURRICULUM */}

                <div className="admin-form-card">

                    <div className="course-section-heading">

                        <div className="admin-form-card-heading">
                            <div className="admin-form-card-icon">
                                <i className="bi bi-journal-bookmark"></i>
                            </div>

                            <div>
                                <h4>Course Curriculum</h4>
                                <p>Create modules and learning topics.</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="admin-btn-add"
                            onClick={addCurriculum}
                        >
                            <i className="bi bi-plus-lg"></i>
                            Add Module
                        </button>

                    </div>

                    {curriculum.map((section, sectionIndex) => (
                        <div
                            className="curriculum-section"
                            key={sectionIndex}
                        >

                            <div className="curriculum-section-header">

                                <h5>
                                    <i className="bi bi-bookmark-fill"></i>
                                    Module {sectionIndex + 1}
                                </h5>

                                {curriculum.length > 1 && (
                                    <button
                                        type="button"
                                        className="admin-btn-danger course-icon-remove"
                                        onClick={() => removeCurriculum(sectionIndex)}
                                        aria-label="Remove module"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                )}

                            </div>

                            <div className="row g-3">

                                <div className="admin-form-group col-lg-6 col-12">
                                    <label>
                                        Module Title <span>*</span>
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Eg: Introduction to UI/UX Design"
                                        value={section.title}
                                        onChange={(e) =>
                                            updateCurriculum(
                                                sectionIndex,
                                                "title",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                {/* CURRICULUM DESCRIPTION JODIT EDITOR */}

                                <div className="admin-form-group col-12">
                                    <label>Module Description</label>

                                    <div className="course-jodit-editor curriculum-jodit-editor">
                                        <JoditEditor
                                            value={section.desc}
                                            config={{
                                                ...joditConfig,
                                                height: 180,
                                                placeholder: "Describe this curriculum module...",
                                            }}
                                            onBlur={(value) =>
                                                updateCurriculum(
                                                    sectionIndex,
                                                    "desc",
                                                    value
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* LEARNING TOPICS */}

                            <div className="curriculum-points-heading">

                                <label>Learning Topics</label>

                                <button
                                    type="button"
                                    onClick={() =>
                                        addCurriculumPoint(sectionIndex)
                                    }
                                >
                                    <i className="bi bi-plus-lg"></i>
                                    Add Topic
                                </button>

                            </div>

                            <div className="row g-3">

                                {section.points.map((point, pointIndex) => (
                                    <div
                                        className="col-lg-6 col-12"
                                        key={pointIndex}
                                    >
                                        <div className="admin-form-row curriculum-topic-row">

                                            <i className="bi bi-dot curriculum-dot"></i>

                                            <input
                                                type="text"
                                                placeholder="Enter learning topic"
                                                value={point}
                                                onChange={(e) =>
                                                    updateCurriculumPoint(
                                                        sectionIndex,
                                                        pointIndex,
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            {section.points.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="admin-btn-danger course-icon-remove"
                                                    onClick={() =>
                                                        removeCurriculumPoint(
                                                            sectionIndex,
                                                            pointIndex
                                                        )
                                                    }
                                                    aria-label="Remove topic"
                                                >
                                                    <i className="bi bi-x-lg"></i>
                                                </button>
                                            )}

                                        </div>
                                    </div>
                                ))}

                            </div>

                        </div>
                    ))}

                </div>

                {/* SUBMIT BUTTON */}

                <div className="admin-form-submit">

                    <p>
                        <i className="bi bi-shield-check"></i>
                        Review your course details before publishing.
                    </p>

                    <button
                        type="submit"
                        className="admin-btn-primary course-submit-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm"></span>
                                Creating Course...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-plus-circle"></i>
                                Create Course
                            </>
                        )}
                    </button>

                </div>

            </form>
        </section>
    );
}