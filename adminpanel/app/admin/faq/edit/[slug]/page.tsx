"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

import faqService from "@/app/apiservice/faqservice";
import "./edit-faq.css";

// SWEETALERT TOAST
const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    showCloseButton: true,
});

interface FaqForm {
    question: string;
    answer: string;
}

function EditFaq() {
    const router = useRouter();
    const params = useParams();

    const slug = params.slug as string;

    const [formData, setFormData] = useState<FaqForm>({
        question: "",
        answer: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // FETCH FAQ DETAILS
    const fetchFaq = async () => {
        try {
            setLoading(true);
            setError("");

            const id = Number(slug);

            if (!id || isNaN(id)) {
                setError("Invalid FAQ ID.");
                return;
            }

            const apiResult = await faqService.getFaqById(id);

            console.log("FAQ DETAILS RESPONSE:", apiResult);

            let response: any = apiResult;

            if (typeof response === "string") {
                response = JSON.parse(
                    response
                        .replace(/^```(?:php|json)?\s*/i, "")
                        .replace(/\s*```$/, "")
                        .trim()
                );
            }

            if (
                response?.success === undefined &&
                response?.data?.success !== undefined
            ) {
                response = response.data;
            }

            if (response?.success === true && response?.data) {
                setFormData({
                    question: response.data.question || "",
                    answer: response.data.answer || "",
                });

                setError("");
            } else {
                setError(
                    response?.message || "Unable to retrieve FAQ details."
                );
            }

        } catch (error: any) {
            console.error("FAQ fetching error:", error);

            setError(
                error.response?.data?.message ||
                "Something went wrong while fetching FAQ details."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) {
            fetchFaq();
        }
    }, [slug]);

    // HANDLE INPUT CHANGE
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // UPDATE FAQ
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // VALIDATION
        if (!formData.question.trim()) {
            Toast.fire({
                icon: "warning",
                title: "Please enter the FAQ question.",
            });
            return;
        }

        if (!formData.answer.trim()) {
            Toast.fire({
                icon: "warning",
                title: "Please enter the FAQ answer.",
            });
            return;
        }

        try {
            setSaving(true);

            const apiResult = await faqService.updateFaq(Number(slug), {
                question: formData.question.trim(),
                answer: formData.answer.trim(),
            });

            console.log("UPDATE FAQ RESPONSE:", apiResult);

            let response: any = apiResult;

            if (typeof response === "string") {
                response = JSON.parse(
                    response
                        .replace(/^```(?:php|json)?\s*/i, "")
                        .replace(/\s*```$/, "")
                        .trim()
                );
            }

            if (
                response?.success === undefined &&
                response?.data?.success !== undefined
            ) {
                response = response.data;
            }

            if (
                response?.success === true ||
                response?.success === "true"
            ) {
                Toast.fire({
                    icon: "success",
                    title: response.message || "FAQ updated successfully!",
                });

                setTimeout(() => {
                    router.push("/admin/faq");
                }, 1000);

            } else {
                Toast.fire({
                    icon: "error",
                    title: response?.message || "Unable to update FAQ.",
                });
            }

        } catch (error: any) {
            console.error("FAQ update error:", error);

            Toast.fire({
                icon: "error",
                title:
                    error.response?.data?.message ||
                    "Something went wrong while updating the FAQ.",
            });

        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="edit-faq tm-admin-page">

            <div className="container">

                {/* PAGE HEADER */}

                <div className="tm-admin-header">

                    <div>

                        <span className="tm-admin-eyebrow">
                            CONTENT MANAGEMENT
                        </span>

                        <h1>Edit FAQ</h1>

                        <p>
                            Update your frequently asked question and answer.
                        </p>

                    </div>

                    <div className="tm-course-header-actions">

                        <button
                            type="button"
                            className="tm-btn tm-btn-back"
                            onClick={() => router.push("/admin/faq")}
                        >
                            <i className="bi bi-arrow-left"></i>
                            Back to FAQs
                        </button>

                    </div>

                </div>

                {/* LOADING */}

                {loading ? (

                    <div className="tm-table-card">

                        <div className="tm-table-status">

                            <div className="tm-spinner"></div>

                            <p>Loading FAQ details...</p>

                        </div>

                    </div>

                ) : error ? (

                    <div className="tm-table-card">

                        <div className="tm-table-status tm-error-status">

                            <i className="bi bi-exclamation-circle"></i>

                            <h4>Unable to Load FAQ</h4>

                            <p>{error}</p>

                            <button
                                type="button"
                                className="tm-btn tm-btn-outline"
                                onClick={fetchFaq}
                            >
                                <i className="bi bi-arrow-clockwise"></i>
                                Retry
                            </button>

                        </div>

                    </div>

                ) : (

                    /* FORM CARD */

                    <div className="tm-form-card">

                        <div className="tm-form-card-header">

                            <div className="tm-form-card-icon">
                                <i className="bi bi-pencil-square"></i>
                            </div>

                            <div>

                                <h2>FAQ Information</h2>

                                <p>
                                    Make changes to the question and answer below.
                                </p>

                            </div>

                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="row">

                                {/* QUESTION */}

                                <div className="col-12">

                                    <div className="tm-form-group">

                                        <label htmlFor="question">
                                            Question
                                            <span className="tm-required">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            id="question"
                                            name="question"
                                            className="tm-form-control"
                                            placeholder="Enter the FAQ question"
                                            value={formData.question}
                                            onChange={handleChange}
                                            maxLength={500}
                                            required
                                        />

                                        <div className="tm-form-hint">
                                            Enter a clear and simple question.
                                        </div>

                                    </div>

                                </div>

                                {/* ANSWER */}

                                <div className="col-12">

                                    <div className="tm-form-group">

                                        <label htmlFor="answer">
                                            Answer
                                            <span className="tm-required">*</span>
                                        </label>

                                        <textarea
                                            id="answer"
                                            name="answer"
                                            className="tm-form-control edit-faq-answer"
                                            placeholder="Enter the FAQ answer"
                                            value={formData.answer}
                                            onChange={handleChange}
                                            rows={3}
                                            required
                                        />

                                        <div className="tm-form-hint">
                                            Provide a helpful and detailed answer.
                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* FORM ACTIONS */}

                            <div className="tm-form-actions">

                                <button
                                    type="button"
                                    className="tm-btn tm-btn-back"
                                    onClick={() => router.push("/admin/faq")}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="tm-btn tm-btn-primary"
                                    disabled={saving}
                                >

                                    {saving ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-lg"></i>
                                            Update FAQ
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                )}

            </div>

        </section>
    );
}

export default EditFaq;