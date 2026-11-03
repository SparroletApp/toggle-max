"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import contactService, {
    ContactItem,
} from "@/app/apiservice/contactservice";

import "./contact.css";

function Contact() {

    const router = useRouter();

    const [contacts, setContacts] = useState<ContactItem[]>([]);
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

    const fetchContacts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await contactService.getAll();

            console.log("CONTACT API RAW RESPONSE:", response);

            let result: any = response;

            // Handle string response
            if (typeof result === "string") {

                const cleanedResponse = result
                    .replace(/^\s*`{3,}\s*`?\s*(?:php|json)?\s*/i, "")
                    .replace(/\s*`{3,}\s*$/i, "")
                    .trim();

                result = JSON.parse(cleanedResponse);
            }

            // Handle nested response
            if (
                result?.success === undefined &&
                result?.data?.success !== undefined
            ) {
                result = result.data;
            }

            console.log("CONTACT API PARSED RESPONSE:", result);

            if (
                result?.success === true ||
                result?.success === "true"
            ) {

                setContacts(
                    Array.isArray(result.data) ? result.data : []
                );

                setError("");

            } else {

                setContacts([]);

                setError(
                    result?.message || "Unable to retrieve contact enquiries."
                );

            }

        } catch (error: any) {

            console.error("CONTACT FETCH ERROR:", error);

            setContacts([]);

            setError(
                error?.response?.data?.message ||
                "Something went wrong while fetching contact enquiries."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    // SEARCH CONTACTS
    const filteredContacts = contacts.filter((contact) => {

        const keyword = search.toLowerCase();

        const fullName =
            `${contact.first_name || ""} ${contact.last_name || ""}`
                .toLowerCase();

        return (
            fullName.includes(keyword) ||
            contact.email?.toLowerCase().includes(keyword) ||
            contact.phone?.toLowerCase().includes(keyword) ||
            contact.subject?.toLowerCase().includes(keyword) ||
            contact.message?.toLowerCase().includes(keyword)
        );

    });

// ESCAPE HTML TO PREVENT HTML INJECTION
const escapeHtml = (value: string) => {
    return value.replace(/[&<>"']/g, (char) => {
        const entities: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;",
        };

        return entities[char];
    });
};

const handleView = async (contact: ContactItem) => {

    const formattedDate = contact.created_at
        ? new Date(contact.created_at).toLocaleString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "N/A";

    await Swal.fire({

        title: "Contact Enquiry Details",

        html: `
            <div class="tm-contact-popup">

                <div class="tm-contact-popup-header">
                    <div class="tm-contact-popup-avatar">
                        <i class="bi bi-person-fill"></i>
                    </div>

                    <div class="tm-contact-popup-user">
                        <h3>${escapeHtml(
                            `${contact.first_name || ""} ${contact.last_name || ""}`.trim()
                        )}</h3>
                        <p>${escapeHtml(contact.email || "No email provided")}</p>
                    </div>
                </div>

                <div class="tm-contact-popup-details">

                    <div class="tm-contact-popup-row">
                        <span>
                            <i class="bi bi-telephone-fill"></i>
                            Phone Number
                        </span>
                        <strong>${escapeHtml(contact.phone || "Not specified")}</strong>
                    </div>

                    <div class="tm-contact-popup-row">
                        <span>
                            <i class="bi bi-chat-left-text-fill"></i>
                            Subject
                        </span>
                        <strong>${escapeHtml(contact.subject || "General Enquiry")}</strong>
                    </div>

                    <div class="tm-contact-popup-row">
                        <span>
                            <i class="bi bi-calendar-event-fill"></i>
                            Submitted On
                        </span>
                        <strong>${escapeHtml(formattedDate)}</strong>
                    </div>

                </div>

                <div class="tm-contact-popup-message">

                    <h4>
                        <i class="bi bi-envelope-paper-fill"></i>
                        Message
                    </h4>

                    <p>${escapeHtml(contact.message || "No message provided.")}</p>

                </div>

            </div>
        `,

        width: "600px",

        showConfirmButton: true,

        confirmButtonText: '<i class="bi bi-check-circle"></i> Close',

        confirmButtonColor: "#6668e7",

        customClass: {
            popup: "tm-contact-swal-popup",
            title: "tm-contact-swal-title",
            confirmButton: "tm-contact-swal-confirm",
        },

        buttonsStyling: false,

    });

};


    const handleDelete = async (id: number) => {

        const result = await Swal.fire({

            title: "Delete Enquiry?",

            text: "Are you sure you want to delete this contact enquiry? This action cannot be undone.",

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

                title: "Deleting Enquiry...",

                text: "Please wait while we delete the enquiry.",

                allowOutsideClick: false,

                allowEscapeKey: false,

                showConfirmButton: false,

                didOpen: () => {
                    Swal.showLoading();
                },

            });

            const apiResult = await contactService.delete(id);

            console.log("DELETE CONTACT RAW RESPONSE:", apiResult);

            let response: any = apiResult;

            // Handle string response
            if (typeof response === "string") {

                const cleanedResponse = response
                    .replace(/^```(?:php|json)?\s*/i, "")
                    .replace(/\s*```$/, "")
                    .trim();

                response = JSON.parse(cleanedResponse);

            }

            // Handle nested response
            if (
                response?.success === undefined &&
                response?.data?.success !== undefined
            ) {
                response = response.data;
            }

            console.log("FINAL DELETE RESPONSE:", response);

            Swal.close();

            if (
                response?.success === true ||
                response?.success === "true"
            ) {

                await Toast.fire({

                    icon: "success",

                    title:
                        response.message ||
                        "Contact enquiry deleted successfully!",

                });

                await fetchContacts();

            } else {

                await Toast.fire({

                    icon: "error",

                    title:
                        response?.message ||
                        "Unable to delete contact enquiry.",

                });

            }

        } catch (error: any) {

            console.error("Contact deletion error:", error);

            Swal.close();

            Toast.fire({

                icon: "error",

                title:
                    error?.response?.data?.message ||
                    "Something went wrong while deleting the enquiry.",

            });

        }

    };

    return (

        <section className="contact tm-admin-page">

            <div className="container">

                {/* PAGE HEADER */}
                <div className="tm-admin-header">

                    <div>

                        <span className="tm-admin-eyebrow">
                            ENQUIRY MANAGEMENT
                        </span>

                        <h1>Contact Enquiries</h1>

                        <p>
                            View and manage enquiries submitted through
                            your website contact form.
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

                    </div>

                </div>

                {/* SUMMARY CARD */}
                <div className="tm-course-summary">

                    <div className="tm-course-summary-icon">

                        <i className="bi bi-envelope-fill"></i>

                    </div>

                    <div>

                        <span>Total Enquiries</span>

                        <h3>{contacts.length}</h3>

                    </div>

                </div>

                {/* CONTACT TABLE */}
                <div className="tm-table-card">

                    <div className="tm-table-header">

                        <div>

                            <h2>All Enquiries</h2>

                            <p>
                                View and manage all website contact enquiries.
                            </p>

                        </div>

                        {/* SEARCH */}
                        <div className="tm-table-search">

                            <i className="bi bi-search"></i>

                            <input
                                type="text"
                                placeholder="Search enquiries..."
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

                                    <th>CONTACT DETAILS</th>

                                    <th>PHONE</th>

                                    <th>SUBJECT</th>

                                    <th>DATE</th>

                                    <th>ACTIONS</th>

                                </tr>

                            </thead>

                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td colSpan={6}>

                                            <div className="tm-table-status">

                                                <div className="tm-spinner"></div>

                                                <p>Loading enquiries...</p>

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
                                                    onClick={fetchContacts}
                                                >

                                                    <i className="bi bi-arrow-clockwise"></i>

                                                    Retry

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ) : filteredContacts.length === 0 ? (

                                    <tr>

                                        <td colSpan={6}>

                                            <div className="tm-table-status">

                                                <i className="bi bi-envelope"></i>

                                                <h4>

                                                    {search
                                                        ? "No matching enquiries found"
                                                        : "No enquiries available"}

                                                </h4>

                                                <p>

                                                    {search
                                                        ? "Try searching with another keyword."
                                                        : "Website contact enquiries will appear here."}

                                                </p>

                                            </div>

                                        </td>

                                    </tr>

                                ) : (

                                    filteredContacts.map((contact, index) => (

                                        <tr key={contact.id}>

                                            {/* SL NO */}
                                            <td>

                                                <span className="tm-table-number">

                                                    {String(index + 1).padStart(2, "0")}

                                                </span>

                                            </td>

                                            {/* CONTACT DETAILS */}
                                            <td>

                                                <div className="tm-contact-info">

                                                    <div className="tm-contact-avatar">

                                                        <i className="bi bi-person-fill"></i>

                                                    </div>

                                                    <div className="tm-course-text">

                                                        <h4>

                                                            {contact.first_name}{" "}
                                                            {contact.last_name}

                                                        </h4>

                                                        <p>
                                                            {contact.email}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* PHONE */}
                                            <td>

                                                <span className="tm-contact-phone">

                                                    <i className="bi bi-telephone-fill"></i>

                                                    {contact.phone || "Not specified"}

                                                </span>

                                            </td>

                                            {/* SUBJECT */}
                                            <td>

                                                <span className="tm-course-badge">

                                                    {contact.subject || "General Enquiry"}

                                                </span>

                                            </td>

                                            {/* DATE */}
                                            <td>

                                                <span className="tm-contact-date">

                                                    {contact.created_at
                                                        ? new Date(contact.created_at).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                            }
                                                        )
                                                        : "N/A"}

                                                </span>

                                            </td>

                                            {/* ACTIONS */}
                                            <td>

                                                <div className="tm-table-actions">

                                                    <button
                                                        type="button"
                                                        className="tm-action-btn tm-view-btn"
                                                        title="View Enquiry"
                                                       onClick={() => handleView(contact)}
                                                    >

                                                        <i className="bi bi-eye-fill"></i>

                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="tm-action-btn tm-delete-btn"
                                                        title="Delete Enquiry"
                                                        onClick={() => handleDelete(contact.id)}
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
                    {!loading && !error && filteredContacts.length > 0 && (

                        <div className="tm-table-footer">

                            <p>

                                Showing <strong>{filteredContacts.length}</strong> of{" "}

                                <strong>{contacts.length}</strong> enquiries

                            </p>

                            <span>

                                <i className="bi bi-check-circle-fill"></i>

                                Enquiry management

                            </span>

                        </div>

                    )}

                </div>

            </div>

        </section>

    );

}

export default Contact;