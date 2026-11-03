"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import faqService from "@/app/apiservice/faqservice";
import "./create-faq.css";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
});

interface FaqForm {
    question: string;
    answer: string;
}

function CreateFaq() {
    const router = useRouter();

    const [formData, setFormData] = useState<FaqForm>({
        question: "",
        answer: "",
    });

    const [loading, setLoading] = useState(false);

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const showToast = (
        icon: "success" | "error" | "warning" | "info",
        title: string
    ) => {
        Toast.fire({
            icon,
            title,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        setLoading(true);

        const apiResult = await faqService.createFaq({
            question: formData.question.trim(),
            answer: formData.answer.trim(),
        });

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
                title: "FAQ created successfully!",
            });

            setTimeout(() => {
                router.push("/admin/faq");
            }, 1000);
        } else {
            Toast.fire({
                icon: "error",
                title: response?.message || "Unable to create FAQ.",
            });
        }
    } catch (error: any) {
        console.error("FAQ creation error:", error);

        Toast.fire({
            icon: "error",
            title:
                error.response?.data?.message ||
                "Something went wrong while creating the FAQ.",
        });
    } finally {
        setLoading(false);
    }
};

    return (
        <section className="create-faq tm-admin-page">

            <div className="container">
                <div className="tm-admin-header">

                    <div>

                        <span className="tm-admin-eyebrow">
                            CONTENT MANAGEMENT
                        </span>

                        <h1>Create FAQ</h1>

                        <p>
                            Add a frequently asked question and its answer
                            to your website.
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
                <div className="tm-form-card">

                    <div className="tm-form-card-header">

                        <div className="tm-form-card-icon">
                            <i className="bi bi-question-circle-fill"></i>
                        </div>

                        <div>

                            <h2>FAQ Information</h2>

                            <p>
                                Enter the question and its corresponding answer.
                            </p>

                        </div>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="row">
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
                                        placeholder="Enter the frequently asked question"
                                        value={formData.question}
                                        onChange={handleChange}
                                        maxLength={500}
                                        required
                                    />

                                    <div className="tm-form-hint">
                                        Write a clear and simple question.
                                    </div>

                                </div>

                            </div>

                            <div className="col-12">

                                <div className="tm-form-group">

                                    <label htmlFor="answer">
                                        Answer
                                        <span className="tm-required">*</span>
                                    </label>

                                    <textarea
                                        id="answer"
                                        name="answer"
                                        className="tm-form-control create-faq-answer"
                                        placeholder="Enter the answer for this question"
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

                        <div className="tm-form-actions">

                            <button
                                type="button"
                                className="tm-btn tm-btn-back"
                                onClick={() => router.push("/admin/faq")}
                                disabled={loading}
                            >

                                Cancel

                            </button>

                            <button
                                type="submit"
                                className="tm-btn tm-btn-primary"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm"></span>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-lg"></i>
                                        Create FAQ
                                    </>
                                )}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </section>
    );
}

export default CreateFaq;