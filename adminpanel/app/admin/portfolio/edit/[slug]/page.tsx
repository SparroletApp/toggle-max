"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";

import portfolioService from "@/app/apiservice/portfolioservice";
import "./edit-portfolio.css";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
});

const JoditEditor = dynamic(() => import("jodit-react"), {
    ssr: false,
    loading: () => <div>Loading editor...</div>,
});

interface PortfolioItem {
    title: string;
    desc: string;
}

interface Portfolio {
    id: number;
    category: string;
    category_desc: string;
    portfolio_badge: string;
    project_owner: string;
    title: string;
    desc: string;
    image: string | null;
    image_url?: string | null;
    details: PortfolioItem[];
    objectives: PortfolioItem[];
    concepts: PortfolioItem[];
}

const joditConfig = {
    readonly: false,
    height: 250,
    toolbar: true,
    spellcheck: true,
    buttons: [
        "bold", "italic", "underline", "|",
        "ul", "ol", "|",
        "font", "fontsize", "paragraph", "|",
        "align", "outdent", "indent", "|",
        "link", "image", "table", "|",
        "undo", "redo", "|",
        "hr", "eraser", "fullsize",
    ],
    uploader: {
        insertImageAsBase64URI: true,
    },
};

const parseArray = (value: any): PortfolioItem[] => {
    if (Array.isArray(value)) return value;

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

const parseResponse = (value: any): any => {

    if (typeof value === "string") {
        try {
            value = JSON.parse(
                value.replace(/^```(?:php|json)?\s*/i, "")
                    .replace(/\s*```$/, "")
                    .trim()
            );
        } catch {
            return null;
        }
    }

    if (!value || typeof value !== "object") return null;

    if (value.success !== undefined) return value;

    if (value.data !== undefined) return parseResponse(value.data);

    if (value.body !== undefined) return parseResponse(value.body);

    return value;
};

const createSlug = (value: string) => {
    return value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
};

export default function EditPortfolio() {

    const router = useRouter();
    const params = useParams();

    const slug = decodeURIComponent(
        String(params.slug || "")
    );

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [portfolioId, setPortfolioId] = useState<number | null>(null);

    const [category, setCategory] = useState("");
    const [categoryDesc, setCategoryDesc] = useState("");
    const [portfolioBadge, setPortfolioBadge] = useState("");
    const [projectOwner, setProjectOwner] = useState("");
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");
    const [existingImage, setExistingImage] = useState("");

    const [details, setDetails] = useState<PortfolioItem[]>([
        { title: "", desc: "" },
    ]);

    const [objectives, setObjectives] = useState<PortfolioItem[]>([
        { title: "", desc: "" },
    ]);

    const [concepts, setConcepts] = useState<PortfolioItem[]>([
        { title: "", desc: "" },
    ]);

    // FETCH PORTFOLIO USING SLUG

    useEffect(() => {

        if (!slug) return;

        const fetchPortfolio = async () => {

            try {

                setLoading(true);

                const apiResult = await portfolioService.getAll();

                console.log("Portfolio API Response:", apiResult);

                const response = parseResponse(
                    apiResult?.data ?? apiResult
                );

                if (
                    response?.success === false ||
                    response?.success === "false"
                ) {
                    throw new Error(
                        response?.message || "Unable to load portfolios."
                    );
                }

                const portfolios = Array.isArray(response?.data)
                    ? response.data
                    : Array.isArray(response?.portfolios)
                        ? response.portfolios
                        : Array.isArray(response)
                            ? response
                            : [];

                const portfolio = portfolios.find(
                    (item: Portfolio) =>
                        createSlug(item.title) === slug.toLowerCase()
                );

                if (!portfolio) {
                    throw new Error("Portfolio not found.");
                }

                console.log("Selected Portfolio:", portfolio);

                setPortfolioId(Number(portfolio.id));

                setCategory(portfolio.category || "");
                setCategoryDesc(portfolio.category_desc || "");
                setPortfolioBadge(portfolio.portfolio_badge || "");
                setProjectOwner(portfolio.project_owner || "");
                setTitle(portfolio.title || "");
                setDesc(portfolio.desc || "");

                setExistingImage(
                    portfolio.image_url ||
                    portfolio.image ||
                    ""
                );

                setDetails(
                    parseArray(portfolio.details).length
                        ? parseArray(portfolio.details)
                        : [{ title: "", desc: "" }]
                );

                setObjectives(
                    parseArray(portfolio.objectives).length
                        ? parseArray(portfolio.objectives)
                        : [{ title: "", desc: "" }]
                );

                setConcepts(
                    parseArray(portfolio.concepts).length
                        ? parseArray(portfolio.concepts)
                        : [{ title: "", desc: "" }]
                );

            } catch (error: any) {

                console.error("Fetch Portfolio Error:", error);

                Toast.fire({
                    icon: "error",
                    title: error?.message || "Unable to load portfolio.",
                });

                router.replace("/admin/portfolio");

            } finally {

                setLoading(false);

            }

        };

        fetchPortfolio();

    }, [slug]);

    // IMAGE CHANGE

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file = e.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {

            Toast.fire({
                icon: "error",
                title: "Only JPG, PNG and WEBP images are allowed.",
            });

            e.target.value = "";
            return;
        }

        if (file.size > 4 * 1024 * 1024) {

            Toast.fire({
                icon: "error",
                title: "Image size should not exceed 4MB.",
            });

            e.target.value = "";
            return;
        }

        setImage(file);
        setImagePreview(URL.createObjectURL(file));

        e.target.value = "";

    };

    // DYNAMIC DETAILS

    const addDetail = () => {
        setDetails(prev => [...prev, { title: "", desc: "" }]);
    };

    const removeDetail = (index: number) => {
        setDetails(prev => prev.filter((_, i) => i !== index));
    };

    const updateDetail = (
        index: number,
        field: keyof PortfolioItem,
        value: string
    ) => {
        setDetails(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    // DYNAMIC OBJECTIVES

    const addObjective = () => {
        setObjectives(prev => [...prev, { title: "", desc: "" }]);
    };

    const removeObjective = (index: number) => {
        setObjectives(prev => prev.filter((_, i) => i !== index));
    };

    const updateObjective = (
        index: number,
        field: keyof PortfolioItem,
        value: string
    ) => {
        setObjectives(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    // DYNAMIC CONCEPTS

    const addConcept = () => {
        setConcepts(prev => [...prev, { title: "", desc: "" }]);
    };

    const removeConcept = (index: number) => {
        setConcepts(prev => prev.filter((_, i) => i !== index));
    };

    const updateConcept = (
        index: number,
        field: keyof PortfolioItem,
        value: string
    ) => {
        setConcepts(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    // UPDATE PORTFOLIO

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (saving) return;

        if (!portfolioId) {
            Toast.fire({
                icon: "error",
                title: "Portfolio ID not found.",
            });
            return;
        }

        if (!category.trim()) {
            Toast.fire({
                icon: "warning",
                title: "Please enter portfolio category.",
            });
            return;
        }

        if (!title.trim()) {
            Toast.fire({
                icon: "warning",
                title: "Please enter project title.",
            });
            return;
        }

        if (details.some(item => !item.title.trim() || !item.desc.trim())) {
            Toast.fire({
                icon: "warning",
                title: "Complete all project detail fields.",
            });
            return;
        }

        if (objectives.some(item => !item.title.trim() || !item.desc.trim())) {
            Toast.fire({
                icon: "warning",
                title: "Complete all objective fields.",
            });
            return;
        }

        if (concepts.some(item => !item.title.trim() || !item.desc.trim())) {
            Toast.fire({
                icon: "warning",
                title: "Complete all concept fields.",
            });
            return;
        }

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
            formData.append(`details[${index}][title]`, item.title.trim());
            formData.append(`details[${index}][desc]`, item.desc.trim());
        });

        objectives.forEach((item, index) => {
            formData.append(`objectives[${index}][title]`, item.title.trim());
            formData.append(`objectives[${index}][desc]`, item.desc.trim());
        });

        concepts.forEach((item, index) => {
            formData.append(`concepts[${index}][title]`, item.title.trim());
            formData.append(`concepts[${index}][desc]`, item.desc.trim());
        });

        try {

            setSaving(true);

            const apiResult = await portfolioService.update(
                portfolioId,
                formData
            );

            const response = parseResponse(
                apiResult?.data ?? apiResult
            );

            if (
                response?.success === true ||
                response?.success === "true"
            ) {

                await Toast.fire({
                    icon: "success",
                    title: response.message || "Portfolio updated successfully!",
                });

                router.replace("/admin/portfolio");

            } else {

                Toast.fire({
                    icon: "error",
                    title: response?.message || "Portfolio update failed.",
                });

            }

        } catch (error: any) {

            console.error("Portfolio Update Error:", error);

            const validationErrors = error?.response?.data?.errors;

            const firstError = validationErrors
                ? Object.values(validationErrors).flat()[0]
                : null;

            Toast.fire({
                icon: "error",
                title: String(
                    firstError ||
                    error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong."
                ),
            });

        } finally {

            setSaving(false);

        }

    };

    // LOADING

    if (loading) {
        return (
            <section className="portfolio-page">
                <div className="container">
                    <div className="portfolio-form-card text-center py-5">
                        <div className="spinner-border text-danger mb-3"></div>
                        <h5>Loading Portfolio...</h5>
                        <p>Please wait while we fetch portfolio details.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="portfolio-page">

            <div className="container">

                <div className="portfolio-page-header">

                    <div>
                        <span className="portfolio-page-subtitle">
                            CONTENT MANAGEMENT
                        </span>

                        <h2>Edit Portfolio</h2>

                        <p>
                            Update your existing portfolio project details.
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

                    {/* BASIC INFORMATION */}

                    <div className="portfolio-form-card">

                        <div className="portfolio-card-heading">

                            <div className="portfolio-heading-icon">
                                <i className="bi bi-folder2-open"></i>
                            </div>

                            <div>
                                <h4>Basic Information</h4>
                                <p>Update the main project information.</p>
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
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
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
                                    value={portfolioBadge}
                                    onChange={e => setPortfolioBadge(e.target.value)}
                                />
                            </div>

                            <div className="col-12">
                                <label className="portfolio-label">
                                    Category Description
                                </label>

                                <textarea
                                    className="form-control portfolio-textarea"
                                    rows={3}
                                    value={categoryDesc}
                                    onChange={e => setCategoryDesc(e.target.value)}
                                />
                            </div>

                            <div className="col-lg-6 col-12">
                                <label className="portfolio-label">
                                    Project Owner
                                </label>

                                <input
                                    type="text"
                                    className="form-control portfolio-input"
                                    value={projectOwner}
                                    onChange={e => setProjectOwner(e.target.value)}
                                />
                            </div>

                            <div className="col-lg-6 col-12">
                                <label className="portfolio-label">
                                    Project Title <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    className="form-control portfolio-input"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
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
                                        config={joditConfig}
                                        onBlur={(value: string) => setDesc(value)}
                                    />
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* IMAGE */}

                    <div className="portfolio-form-card">

                        <div className="portfolio-card-heading">
                            <div className="portfolio-heading-icon">
                                <i className="bi bi-image"></i>
                            </div>

                            <div>
                                <h4>Project Image</h4>
                                <p>Change the existing portfolio image.</p>
                            </div>
                        </div>

                        <div className="portfolio-upload-area">

                            {!imagePreview && !existingImage ? (

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
                                    <p>JPG, JPEG, PNG or WEBP</p>

                                    <span>Maximum file size: 4MB</span>

                                </label>

                            ) : (

                                <div className="portfolio-image-preview">

                                    <img
                                        src={imagePreview || existingImage}
                                        alt="Portfolio preview"
                                    />

                                    <button
                                        type="button"
                                        className="portfolio-remove-image"
                                        onClick={() => {
                                            setImage(null);
                                            setImagePreview("");
                                            setExistingImage("");
                                        }}
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

                    {/* DETAILS */}

                    <div className="portfolio-form-card">

                        <div className="portfolio-card-heading portfolio-dynamic-heading">

                            <div className="portfolio-heading-left">
                                <div className="portfolio-heading-icon">
                                    <i className="bi bi-card-list"></i>
                                </div>

                                <div>
                                    <h4>Project Details</h4>
                                    <p>Manage detailed project information.</p>
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
                                            value={item.title}
                                            onChange={e =>
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
                                            value={item.desc}
                                            onChange={e =>
                                                updateDetail(index, "desc", e.target.value)
                                            }
                                        />
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                    {/* OBJECTIVES */}

                    <div className="portfolio-form-card">

                        <div className="portfolio-card-heading portfolio-dynamic-heading">

                            <div className="portfolio-heading-left">
                                <div className="portfolio-heading-icon">
                                    <i className="bi bi-bullseye"></i>
                                </div>

                                <div>
                                    <h4>Project Objectives</h4>
                                    <p>Manage project objectives.</p>
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
                                            value={item.title}
                                            onChange={e =>
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
                                            value={item.desc}
                                            onChange={e =>
                                                updateObjective(index, "desc", e.target.value)
                                            }
                                        />
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                    {/* CONCEPTS */}

                    <div className="portfolio-form-card">

                        <div className="portfolio-card-heading portfolio-dynamic-heading">

                            <div className="portfolio-heading-left">
                                <div className="portfolio-heading-icon">
                                    <i className="bi bi-lightbulb"></i>
                                </div>

                                <div>
                                    <h4>Project Concepts</h4>
                                    <p>Manage project concepts and strategies.</p>
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
                                            value={item.title}
                                            onChange={e =>
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
                                            value={item.desc}
                                            onChange={e =>
                                                updateConcept(index, "desc", e.target.value)
                                            }
                                        />
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                    {/* ACTIONS */}

                    <div className="portfolio-form-actions">

                        <button
                            type="button"
                            className="portfolio-cancel-btn"
                            onClick={() => router.back()}
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="portfolio-submit-btn"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <span className="spinner-border spinner-border-sm"></span>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check2-circle"></i>
                                    Update Portfolio
                                </>
                            )}
                        </button>

                    </div>

                </form>

            </div>

        </section>
    );
}
