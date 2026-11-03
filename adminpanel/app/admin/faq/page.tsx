"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import faqService from "@/app/apiservice/faqservice";

interface FaqItem {
    id: number;
    question: string;
    answer: string;
    created_at?: string;
    updated_at?: string;
}

function Faq() {
    const router = useRouter();

    const [faqs, setFaqs] = useState<FaqItem[]>([]);
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

    // FETCH FAQS
    const fetchFaqs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await faqService.getAllFaqs();

            console.log("FAQ API Response:", response);

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
                setFaqs(
                    Array.isArray(result.data) ? result.data : []
                );

                setError("");
            } else {
                setFaqs([]);
                setError(
                    result?.message || "Unable to retrieve FAQs."
                );
            }

        } catch (error: any) {
            console.error("FAQ fetching error:", error);

            setFaqs([]);

            setError(
                error.response?.data?.message ||
                "Something went wrong while fetching FAQs."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    // SEARCH FAQS
    const filteredFaqs = faqs.filter((faq) => {
        const keyword = search.toLowerCase().trim();

        return (
            faq.question?.toLowerCase().includes(keyword) ||
            faq.answer?.toLowerCase().includes(keyword)
        );
    });

    // CREATE FAQ
    const handleCreate = () => {
        router.push("/admin/faq/create");
    };

    // EDIT FAQ
    const handleEdit = (id: number) => {
        router.push(`/admin/faq/edit/${id}`);
    };

    // DELETE FAQ
    const handleDelete = async (id: number) => {

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

        if (!result.isConfirmed) {
            return;
        }

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

            const apiResult = await faqService.deleteFaq(id);

            console.log("DELETE FAQ RESPONSE:", apiResult);

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

                await fetchFaqs();

            } else {

                await Toast.fire({
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
        <section className="faq tm-admin-page">

            <div className="container">

                {/* PAGE HEADER */}

                <div className="tm-admin-header">

                    <div>

                        <span className="tm-admin-eyebrow">
                            CONTENT MANAGEMENT
                        </span>

                        <h1>FAQs</h1>

                        <p>
                            Manage frequently asked questions and answers
                            displayed on your website.
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
                            onClick={handleCreate}
                        >

                            <i className="bi bi-plus-lg"></i>

                            Add New FAQ

                        </button>

                    </div>

                </div>

                {/* SUMMARY */}

                <div className="tm-course-summary">

                    <div className="tm-course-summary-icon">

                        <i className="bi bi-question-circle-fill"></i>

                    </div>

                    <div>

                        <span>Total FAQs</span>

                        <h3>{faqs.length}</h3>

                    </div>

                </div>

                {/* FAQ TABLE CARD */}

                <div className="tm-table-card">

                    <div className="tm-table-header">

                        <div>

                            <h2>All FAQs</h2>

                            <p>
                                View and manage all your frequently asked questions.
                            </p>

                        </div>

                        <div className="tm-table-search">

                            <i className="bi bi-search"></i>

                            <input
                                type="text"
                                placeholder="Search FAQs..."
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

                    {/* TABLE */}

                    <div className="tm-table-responsive">

                        <table className="tm-admin-table">

                            <thead>

                                <tr>

                                    <th>SL NO</th>

                                    <th>QUESTION</th>

                                    <th>ANSWER</th>

                                    <th>ACTIONS</th>

                                </tr>

                            </thead>

                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td colSpan={4}>

                                            <div className="tm-table-status">

                                                <div className="tm-spinner"></div>

                                                <p>Loading FAQs...</p>

                                            </div>

                                        </td>

                                    </tr>

                                ) : error ? (

                                    <tr>

                                        <td colSpan={4}>

                                            <div className="tm-table-status tm-error-status">

                                                <i className="bi bi-exclamation-circle"></i>

                                                <p>{error}</p>

                                                <button
                                                    type="button"
                                                    className="tm-btn tm-btn-outline"
                                                    onClick={fetchFaqs}
                                                >

                                                    <i className="bi bi-arrow-clockwise"></i>

                                                    Retry

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ) : filteredFaqs.length === 0 ? (

                                    <tr>

                                        <td colSpan={4}>

                                            <div className="tm-table-status">

                                                <i className="bi bi-question-circle"></i>

                                                <h4>

                                                    {search
                                                        ? "No matching FAQs found"
                                                        : "No FAQs available"}

                                                </h4>

                                                <p>

                                                    {search
                                                        ? "Try searching with another keyword."
                                                        : "Add your first FAQ to get started."}

                                                </p>

                                            </div>

                                        </td>

                                    </tr>

                                ) : (

                                    filteredFaqs.map((faq, index) => (

                                        <tr key={faq.id}>

                                            <td>

                                                <span className="tm-table-number">

                                                    {String(index + 1).padStart(2, "0")}

                                                </span>

                                            </td>

                                            <td>

                                                <div className="tm-course-text">

                                                    <h4>{faq.question}</h4>

                                                </div>

                                            </td>

                                            <td>

                                                <div className="tm-faq-answer">

                                                    {faq.answer
                                                        ? faq.answer.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
                                                        : "No answer available"}

                                                </div>

                                            </td>

                                            <td>

                                                <div className="tm-table-actions">

                                                    <button
                                                        type="button"
                                                        className="tm-action-btn tm-edit-btn"
                                                        title="Edit FAQ"
                                                        onClick={() => handleEdit(faq.id)}
                                                    >

                                                        <i className="bi bi-pencil-square"></i>

                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="tm-action-btn tm-delete-btn"
                                                        title="Delete FAQ"
                                                        onClick={() => handleDelete(faq.id)}
                                                    >

                                                        <i className="bi bi-trash3-fill"></i>

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* TABLE FOOTER */}

                    {!loading && !error && filteredFaqs.length > 0 && (

                        <div className="tm-table-footer">

                            <p>

                                Showing <strong>{filteredFaqs.length}</strong> of{" "}

                                <strong>{faqs.length}</strong> FAQs

                            </p>

                            <span>

                                <i className="bi bi-check-circle-fill"></i>

                                FAQ management

                            </span>

                        </div>

                    )}

                </div>

            </div>

        </section>
    );
}

export default Faq;