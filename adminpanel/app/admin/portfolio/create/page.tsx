"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";

import portfolioService from "@/app/apiservice/portfolioservice";
import "./create-portfolio.css";


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

interface PortfolioDetail {
    title: string;
    desc: string;
}

interface PortfolioObjective {
    title: string;
    desc: string;
}

interface PortfolioConcept {
    title: string;
    desc: string;
}

function CreatePortfolio() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState("");
    const [categoryDesc, setCategoryDesc] = useState("");
    const [portfolioBadge, setPortfolioBadge] = useState("");
    const [projectOwner, setProjectOwner] = useState("");
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");
    const [details, setDetails] = useState<PortfolioDetail[]>([
        { title: "", desc: "" }
    ]);
    const [objectives, setObjectives] = useState<PortfolioObjective[]>([
        { title: "", desc: "" }
    ]);

    const [concepts, setConcepts] = useState<PortfolioConcept[]>([
        { title: "", desc: "" }
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

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file = e.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {

            Swal.fire({
                icon: "error",
                title: "Invalid Image",
                text: "Only JPG, JPEG, PNG and WEBP images are allowed.",
                confirmButtonColor: "#ff5656"
            });

            e.target.value = "";
            return;
        }

        if (file.size > 4 * 1024 * 1024) {

            Swal.fire({
                icon: "error",
                title: "Image Too Large",
                text: "Image size should not exceed 4MB.",
                confirmButtonColor: "#ff5656"
            });

            e.target.value = "";
            return;
        }

        setImage(file);

        const previewUrl = URL.createObjectURL(file);

        setImagePreview(previewUrl);
        e.target.value = "";

    };

    const removeImage = () => {

        setImage(null);
        setImagePreview("");

    };
    const addDetail = () => {

        setDetails(prev => [
            ...prev,
            { title: "", desc: "" }
        ]);

    };

    const removeDetail = (index: number) => {

        setDetails(prev =>
            prev.filter((_, i) => i !== index)
        );

    };

    const updateDetail = (
        index: number,
        field: keyof PortfolioDetail,
        value: string
    ) => {

        setDetails(prev =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, [field]: value }
                    : item
            )
        );

    };

    const addObjective = () => {

        setObjectives(prev => [
            ...prev,
            { title: "", desc: "" }
        ]);

    };

    const removeObjective = (index: number) => {

        setObjectives(prev =>
            prev.filter((_, i) => i !== index)
        );

    };

    const updateObjective = (
        index: number,
        field: keyof PortfolioObjective,
        value: string
    ) => {

        setObjectives(prev =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, [field]: value }
                    : item
            )
        );

    };
    const addConcept = () => {

        setConcepts(prev => [
            ...prev,
            { title: "", desc: "" }
        ]);

    };

    const removeConcept = (index: number) => {

        setConcepts(prev =>
            prev.filter((_, i) => i !== index)
        );

    };

    const updateConcept = (
        index: number,
        field: keyof PortfolioConcept,
        value: string
    ) => {

        setConcepts(prev =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, [field]: value }
                    : item
            )
        );

    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (loading) return;

        // VALIDATION

        if (!category.trim()) {
            showToast("warning", "Please enter portfolio category.");
            return;
        }

        if (!title.trim()) {
            showToast("warning", "Please enter project title.");
            return;
        }

        const invalidDetails = details.some(
            (item) => !item.title.trim() || !item.desc.trim()
        );

        if (invalidDetails) {
            showToast("warning", "Complete all project detail fields.");
            return;
        }

        const invalidObjectives = objectives.some(
            (item) => !item.title.trim() || !item.desc.trim()
        );

        if (invalidObjectives) {
            showToast("warning", "Complete all objective fields.");
            return;
        }

        const invalidConcepts = concepts.some(
            (item) => !item.title.trim() || !item.desc.trim()
        );

        if (invalidConcepts) {
            showToast("warning", "Complete all concept fields.");
            return;
        }

        // FORM DATA

        const formData = new FormData();

        formData.append("category", category.trim());
        formData.append("category_desc", categoryDesc);
        formData.append("portfolio_badge", portfolioBadge);
        formData.append("project_owner", projectOwner);
        formData.append("title", title.trim());
        formData.append("desc", desc);

        if (image) {
            formData.append("image", image);
        }

        details.forEach((item, index) => {
            formData.append(
                `details[${index}][title]`,
                item.title.trim()
            );

            formData.append(
                `details[${index}][desc]`,
                item.desc.trim()
            );
        });

        objectives.forEach((item, index) => {
            formData.append(
                `objectives[${index}][title]`,
                item.title.trim()
            );

            formData.append(
                `objectives[${index}][desc]`,
                item.desc.trim()
            );
        });

        concepts.forEach((item, index) => {
            formData.append(
                `concepts[${index}][title]`,
                item.title.trim()
            );

            formData.append(
                `concepts[${index}][desc]`,
                item.desc.trim()
            );
        });
        try {
            setLoading(true);
            const response = await portfolioService.create(formData);
            console.log("Portfolio API Response:", response);
            const normalizeResponse = (value: any): any => {
                if (typeof value === "string") {
                    let cleanedValue = value.trim();

                    cleanedValue = cleanedValue
                        .replace(/^```(?:php|json)?\s*/i, "")
                        .replace(/\s*```$/, "")
                        .trim();
                    try {
                        value = JSON.parse(cleanedValue);
                    } catch (error) {
                        console.error("JSON parsing failed:", error);
                        return null;
                    }
                }
                if (!value || typeof value !== "object") {
                    return null;
                }
                if (value.success !== undefined) {
                    return value;
                }
                if (value.data !== undefined) {
                    return normalizeResponse(value.data);
                }
                if (value.body !== undefined) {
                    return normalizeResponse(value.body);
                }
                return null;
            };
            const result = normalizeResponse(response);
            console.log("Normalized Portfolio Response:", result);
            if (
                result?.success === true ||
                result?.success === "true"
            ) {
                await Toast.fire({
                    icon: "success",
                    title: result.message || "Portfolio created successfully!",
                    timer: 1800,
                });
                router.replace("/admin/portfolio");
                return;
            }
            showToast(
                "error",
                result?.message || "Portfolio creation failed."
            );
        } catch (error: any) {
            console.error("Portfolio Creation Error:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong while creating portfolio.";
            const validationErrors = error?.response?.data?.errors;
            if (validationErrors) {
                const firstError = Object.values(validationErrors)
                    .flat()[0] as string;

                showToast(
                    "error",
                    firstError || message
                );
            } else {
                showToast("error", message);
            }

        } finally {
            setLoading(false);
        }
    };
    const joditConfig = {
        readonly: false,
        height: 250,
        placeholder: "Write project description...",
        toolbar: true,
        spellcheck: true,
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
            "paragraph",
            "|",
            "align",
            "outdent",
            "indent",
            "|",
            "link",
            "image",
            "table",
            "|",
            "undo",
            "redo",
            "|",
            "hr",
            "eraser",
            "fullsize"
        ],
        uploader: {
            insertImageAsBase64URI: true
        },
        style: {
            font: "14px Inter, sans-serif"
        }
    };

    return (

        <section className="portfolio-page">

            <div className="container">

                <div className="portfolio-page-header">

                    <div>

                        <span className="portfolio-page-subtitle">
                            CONTENT MANAGEMENT
                        </span>

                        <h2>Create Portfolio</h2>

                        <p>
                            Add a new project to your portfolio collection.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="portfolio-back-btn"
                        onClick={() => router.back()}
                    >

                        <i className="bi bi-arrow-left"></i>
                        Back

                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="portfolio-form-card">

                        <div className="portfolio-card-heading">

                            <div className="portfolio-heading-icon">
                                <i className="bi bi-folder2-open"></i>
                            </div>

                            <div>

                                <h4>Basic Information</h4>

                                <p>
                                    Enter the main project information.
                                </p>

                            </div>

                        </div>

                        <div className="row g-4">

                            <div className="col-lg-6 col-12">

                                <label className="portfolio-label">
                                    Category <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    className="form-control portfolio-input"
                                    placeholder="Enter category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                />

                            </div>

                            <div className="col-lg-6 col-12">

                                <label className="portfolio-label">
                                    Portfolio Badge
                                </label>

                                <input
                                    type="text"
                                    className="form-control portfolio-input"
                                    placeholder="Example: Featured Project"
                                    value={portfolioBadge}
                                    onChange={(e) => setPortfolioBadge(e.target.value)}
                                />

                            </div>

                            <div className="col-12">

                                <label className="portfolio-label">
                                    Category Description
                                </label>

                                <textarea
                                    className="form-control portfolio-textarea"
                                    placeholder="Enter category description"
                                    rows={3}
                                    value={categoryDesc}
                                    onChange={(e) => setCategoryDesc(e.target.value)}
                                />

                            </div>

                            <div className="col-lg-6 col-12">

                                <label className="portfolio-label">
                                    Project Owner
                                </label>

                                <input
                                    type="text"
                                    className="form-control portfolio-input"
                                    placeholder="Enter project owner"
                                    value={projectOwner}
                                    onChange={(e) => setProjectOwner(e.target.value)}
                                />

                            </div>

                            <div className="col-lg-6 col-12">

                                <label className="portfolio-label">
                                    Project Title <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    className="form-control portfolio-input"
                                    placeholder="Enter project title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />

                            </div>
                            <div className="col-12">

                                <label className="portfolio-label">
                                    Project Description
                                </label>

                                <div className="portfolio-jodit-editor">

                                    <JoditEditor
                                        value={desc}
                                        onBlur={(newContent: string) => setDesc(newContent)}
                                        config={joditConfig}
                                    />

                                </div>

                            </div>

                        </div>

                    </div>
                    <div className="portfolio-form-card">

                        <div className="portfolio-card-heading">

                            <div className="portfolio-heading-icon">
                                <i className="bi bi-image"></i>
                            </div>

                            <div>

                                <h4>Project Image</h4>

                                <p>
                                    Upload the main portfolio project image.
                                </p>

                            </div>

                        </div>

                        <div className="portfolio-upload-area">

                            {!imagePreview ? (

                                <label className="portfolio-upload-box">

                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleImageChange}
                                        hidden
                                    />

                                    <div className="portfolio-upload-icon">
                                        <i className="bi bi-cloud-arrow-up"></i>
                                    </div>

                                    <h5>Click to upload image</h5>

                                    <p>
                                        JPG, JPEG, PNG or WEBP
                                    </p>

                                    <span>
                                        Maximum file size: 4MB
                                    </span>

                                </label>

                            ) : (

                                <div className="portfolio-image-preview">

                                    <img
                                        src={imagePreview}
                                        alt="Portfolio preview"
                                    />

                                    <button
                                        type="button"
                                        className="portfolio-remove-image"
                                        onClick={removeImage}
                                    >

                                        <i className="bi bi-trash"></i>
                                        Remove Image

                                    </button>

                                    <label className="portfolio-change-image">

                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            hidden
                                            onChange={handleImageChange}
                                        />

                                        <i className="bi bi-pencil"></i>
                                        Change Image

                                    </label>

                                </div>

                            )}

                        </div>

                    </div>

                    <div className="portfolio-form-card">

                        <div className="portfolio-card-heading portfolio-dynamic-heading">

                            <div className="portfolio-heading-left">

                                <div className="portfolio-heading-icon">
                                    <i className="bi bi-card-list"></i>
                                </div>

                                <div>

                                    <h4>Project Details</h4>

                                    <p>
                                        Add detailed project information.
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                className="portfolio-add-btn"
                                onClick={addDetail}
                            >

                                <i className="bi bi-plus-lg"></i>
                                Add Detail

                            </button>

                        </div>

                        {details.map((item, index) => (

                            <div className="portfolio-dynamic-item" key={index}>

                                <div className="portfolio-item-top">

                                    <h6>Detail {index + 1}</h6>

                                    {details.length > 1 && (

                                        <button
                                            type="button"
                                            className="portfolio-delete-btn"
                                            onClick={() => removeDetail(index)}
                                        >

                                            <i className="bi bi-trash"></i>
                                            Remove

                                        </button>

                                    )}

                                </div>

                                <div className="row g-3">

                                    <div className="col-lg-6 col-12">

                                        <label className="portfolio-label">
                                            Detail Title <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control portfolio-input"
                                            placeholder="Enter detail title"
                                            value={item.title}
                                            onChange={(e) =>
                                                updateDetail(index, "title", e.target.value)
                                            }
                                        />

                                    </div>

                                    <div className="col-lg-6 col-12">

                                        <label className="portfolio-label">
                                            Detail Description <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control portfolio-input"
                                            placeholder="Enter detail description"
                                            value={item.desc}
                                            onChange={(e) =>
                                                updateDetail(index, "desc", e.target.value)
                                            }
                                        />

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                    <div className="portfolio-form-card">

                        <div className="portfolio-card-heading portfolio-dynamic-heading">

                            <div className="portfolio-heading-left">

                                <div className="portfolio-heading-icon">
                                    <i className="bi bi-bullseye"></i>
                                </div>

                                <div>

                                    <h4>Project Objectives</h4>

                                    <p>
                                        Define the goals and objectives of the project.
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                className="portfolio-add-btn"
                                onClick={addObjective}
                            >

                                <i className="bi bi-plus-lg"></i>
                                Add Objective

                            </button>

                        </div>

                        {objectives.map((item, index) => (

                            <div className="portfolio-dynamic-item" key={index}>

                                <div className="portfolio-item-top">

                                    <h6>Objective {index + 1}</h6>

                                    {objectives.length > 1 && (

                                        <button
                                            type="button"
                                            className="portfolio-delete-btn"
                                            onClick={() => removeObjective(index)}
                                        >

                                            <i className="bi bi-trash"></i>
                                            Remove

                                        </button>

                                    )}

                                </div>

                                <div className="row g-3">

                                    <div className="col-lg-6 col-12">

                                        <label className="portfolio-label">
                                            Objective Title <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control portfolio-input"
                                            placeholder="Enter objective title"
                                            value={item.title}
                                            onChange={(e) =>
                                                updateObjective(index, "title", e.target.value)
                                            }
                                        />

                                    </div>

                                    <div className="col-lg-6 col-12">

                                        <label className="portfolio-label">
                                            Objective Description <span>*</span>
                                        </label>

                                        <textarea
                                            className="form-control portfolio-textarea"
                                            rows={2}
                                            placeholder="Enter objective description"
                                            value={item.desc}
                                            onChange={(e) =>
                                                updateObjective(index, "desc", e.target.value)
                                            }
                                        />

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>
                    <div className="portfolio-form-card">

                        <div className="portfolio-card-heading portfolio-dynamic-heading">

                            <div className="portfolio-heading-left">

                                <div className="portfolio-heading-icon">
                                    <i className="bi bi-lightbulb"></i>
                                </div>

                                <div>

                                    <h4>Project Concepts</h4>

                                    <p>
                                        Add the concepts and strategies used in the project.
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                className="portfolio-add-btn"
                                onClick={addConcept}
                            >

                                <i className="bi bi-plus-lg"></i>
                                Add Concept

                            </button>

                        </div>

                        {concepts.map((item, index) => (

                            <div className="portfolio-dynamic-item" key={index}>

                                <div className="portfolio-item-top">

                                    <h6>Concept {index + 1}</h6>

                                    {concepts.length > 1 && (

                                        <button
                                            type="button"
                                            className="portfolio-delete-btn"
                                            onClick={() => removeConcept(index)}
                                        >

                                            <i className="bi bi-trash"></i>
                                            Remove

                                        </button>

                                    )}

                                </div>

                                <div className="row g-3">

                                    <div className="col-lg-6 col-12">

                                        <label className="portfolio-label">
                                            Concept Title <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control portfolio-input"
                                            placeholder="Enter concept title"
                                            value={item.title}
                                            onChange={(e) =>
                                                updateConcept(index, "title", e.target.value)
                                            }
                                        />

                                    </div>

                                    <div className="col-lg-6 col-12">

                                        <label className="portfolio-label">
                                            Concept Description <span>*</span>
                                        </label>

                                        <textarea
                                            className="form-control portfolio-textarea"
                                            rows={2}
                                            placeholder="Enter concept description"
                                            value={item.desc}
                                            onChange={(e) =>
                                                updateConcept(index, "desc", e.target.value)
                                            }
                                        />

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>
                    <div className="portfolio-form-actions">

                        <button
                            type="button"
                            className="portfolio-cancel-btn"
                            onClick={() => router.back()}
                            disabled={loading}
                        >

                            Cancel

                        </button>

                        <button
                            type="submit"
                            className="portfolio-submit-btn"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="spinner-border spinner-border-sm"></span>
                                    Creating...
                                </>

                            ) : (

                                <>
                                    <i className="bi bi-check2-circle"></i>
                                    Create Portfolio
                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </section>

    );

}

export default CreatePortfolio;