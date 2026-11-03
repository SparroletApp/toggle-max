"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

import faqService from "@/app/apiservice/faqservice";
import "./view-faq.css";

interface FaqItem {
    id: number;
    question: string;
    answer: string;
    created_at?: string;
    updated_at?: string;
}

function ViewFaq() {
    const router = useRouter();
    const params = useParams();

    const slug = params.slug as string;

    const [faq, setFaq] = useState<FaqItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

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
                setFaq(response.data);
                setError("");
            } else {
                setFaq(null);
                setError(
                    response?.message || "Unable to retrieve FAQ details."
                );
            }

        } catch (error: any) {
            console.error("FAQ fetching error:", error);

            setFaq(null);

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

    const handleEdit = () => {
        if (faq) {
            router.push(`/admin/faq/edit/${faq.id}`);
        }
    };

    const handleDelete = async () => {
        if (!faq) return;

        const result = await Swal.fire({
            title: "Delete FAQ?",
            text: "Are you sure you want to delete this FAQ? This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            confirmButtonColor: "#e74c3c",
            cancelButtonColor: "#747784",
            focusCancel: true,
        });

        if (!result.isConfirmed) return;

        try {
            Swal.fire({
                title: "Deleting FAQ...",
                text: "Please wait while we delete the FAQ.",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const apiResult = await faqService.deleteFaq(faq.id);

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

            Swal.close();

            if (
                response?.success === true ||
                response?.success === "true"
            ) {
                await Toast.fire({
                    icon: "success",
                    title: response.message || "FAQ deleted successfully!",
                });

                router.push("/admin/faq");
            } else {
                Toast.fire({
                    icon: "error",
                    title: response?.message || "Unable to delete FAQ.",
                });
            }

        } catch (error: any) {
            console.error("FAQ deletion error:", error);

            Swal.close();

            Toast.fire({
                icon: "error",
                title:
                    error.response?.data?.message ||
                    "Something went wrong while deleting the FAQ.",
            });
        }
    };

    return (
        <section className="view-faq tm-admin-page">

            <div className="container">

                <div className="tm-admin-header">

                    <div>

                        <span className="tm-admin-eyebrow">
                            CONTENT MANAGEMENT
                        </span>

                        <h1>View FAQ</h1>

                        <p>
                            View the complete question and answer details.
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

                {loading ? (

                    <div className="tm-table-card">

                        <div className="tm-table-status">

                            <div className="tm-spinner"></div>

                            <p>Loading FAQ details...</p>

                        </div>

                    </div>

                ) : error || !faq ? (

                    <div className="tm-table-card">

                        <div className="tm-table-status tm-error-status">

                            <i className="bi bi-exclamation-circle"></i>

                            <h4>Unable to Load FAQ</h4>

                            <p>
                                {error || "FAQ details not found."}
                            </p>

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


                    <div className="view-faq-card">


                        <div className="view-faq-card-header">

                            <div className="view-faq-icon">
                                <i className="bi bi-question-circle-fill"></i>
                            </div>

                            <div className="view-faq-heading">

                                <span>FAQ DETAILS</span>

                                <h2>Frequently Asked Question</h2>

                                <p>
                                    FAQ ID: #{faq.id}
                                </p>

                            </div>

                            <div className="view-faq-status">
                                <i className="bi bi-check-circle-fill"></i>
                                Available
                            </div>

                        </div>

                        <div className="view-faq-section">

                            <div className="view-faq-label">

                                <span className="view-faq-label-icon">
                                    <i className="bi bi-chat-square-question-fill"></i>
                                </span>

                                <span>QUESTION</span>

                            </div>

                            <div className="view-faq-question">
                                {faq.question}
                            </div>

                        </div>

                        <div className="view-faq-section">

                            <div className="view-faq-label">

                                <span className="view-faq-label-icon">
                                    <i className="bi bi-chat-left-text-fill"></i>
                                </span>

                                <span>ANSWER</span>

                            </div>

                            <div className="view-faq-answer">
                                {faq.answer}
                            </div>

                        </div>

                        {(faq.created_at || faq.updated_at) && (

                            <div className="view-faq-meta">

                                {faq.created_at && (

                                    <div>

                                        <i className="bi bi-calendar-plus"></i>

                                        <span>
                                            Created:{" "}
                                            {new Date(faq.created_at).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )}
                                        </span>

                                    </div>

                                )}

                                {faq.updated_at && (

                                    <div>

                                        <i className="bi bi-clock-history"></i>

                                        <span>
                                            Last Updated:{" "}
                                            {new Date(faq.updated_at).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )}
                                        </span>

                                    </div>

                                )}

                            </div>

                        )}

                        <div className="view-faq-actions">

                            <button
                                type="button"
                                className="tm-btn tm-btn-back"
                                onClick={() => router.push("/admin/faq")}
                            >

                                <i className="bi bi-arrow-left"></i>

                                Back

                            </button>

                            <div>

                                <button
                                    type="button"
                                    className="tm-btn view-faq-delete-btn"
                                    onClick={handleDelete}
                                >

                                    <i className="bi bi-trash3-fill"></i>

                                    Delete FAQ

                                </button>

                                <button
                                    type="button"
                                    className="tm-btn tm-btn-primary"
                                    onClick={handleEdit}
                                >

                                    <i className="bi bi-pencil-square"></i>

                                    Edit FAQ

                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </section>
    );
}

export default ViewFaq;