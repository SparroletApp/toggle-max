"use client";

import { useState } from "react";
import "./contact-us.css";

function ContactUs() {
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    async function handleContactSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const form = event.currentTarget;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        setLoading(true);
        setStatusMessage("");
        setIsSuccess(false);

        const formData = new FormData(form);

        const payload = {
            firstName: String(formData.get("firstName") || ""),
            lastName: String(formData.get("lastName") || ""),
            email: String(formData.get("email") || ""),
            phone: String(formData.get("phone") || ""),
            subject: String(formData.get("subject") || ""),
            message: String(formData.get("message") || ""),
        };

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                setStatusMessage(
                    result.message ||
                    "Unable to send your message. Please try again."
                );
                return;
            }

            setIsSuccess(true);
            setStatusMessage(
                result.message ||
                "Thank you for contacting us! Your message has been sent."
            );

            form.reset();
        } catch (error) {
            console.error("Contact form submission error:", error);

            setStatusMessage(
                "Unable to send your message. Please check your connection and try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="contact">
            <div className="contact-header">
                <div className="container">
                    <div className="contact-breadcrumb">
                        <a href="/">Home</a>
                        <i className="bi bi-chevron-right"></i>
                        <span>Contact Us</span>
                    </div>

                    <div className="contact-header-content">
                        <span className="contact-eyebrow">
                            WE ARE HERE TO HELP
                        </span>

                        <h1>Contact Us</h1>

                        <p>
                            Have questions about our UI/UX design courses? Connect with our team to <br />
                            learn more about our programs, training opportunities, and career support.
                        </p>
                    </div>
                </div>
            </div>


            <div className="contact-content">
                <div className="container">
                    <div className="contact-panel">

                        <div className="contact-information">
                            <span className="contact-section-label">
                                GET IN TOUCH
                            </span>

                            <h2>We&apos;d Love to Hear From You</h2>

                            <p className="contact-information-description">
                                Our team is ready to help you find the right UI/UX design course to build your creative skills and achieve your career goals.
                            </p>

                            <div className="contact-details">
                                <div className="contact-detail">
                                    <div className="contact-detail-icon">
                                        <i className="bi bi-geo-alt-fill"></i>
                                    </div>

                                    <div className="contact-detail-content">
                                        <h3>Our Location</h3>
                                        <p>
                                            Ullampilly Building, Second Floor, Seaport -
                                            Airport Rd, behind Olimugal Juma Masjid,
                                            Thrikkakara, Vazhakkala, Kakkanad, Kochi,
                                            Keralam 682030
                                        </p>
                                    </div>
                                </div>

                                <div className="contact-detail">
                                    <div className="contact-detail-icon">
                                        <i className="bi bi-telephone-fill"></i>
                                    </div>

                                    <div className="contact-detail-content">
                                        <h3>Call Us</h3>
                                        <a href="tel:+91 6282089962">
                                            +91 62820 89962
                                        </a>
                                        <span>Customer Care</span>
                                    </div>
                                </div>

                                <div className="contact-detail">
                                    <div className="contact-detail-icon">
                                        <i className="bi bi-envelope-fill"></i>
                                    </div>

                                    <div className="contact-detail-content">
                                        <h3>Email Us</h3>
                                        <a href="mailto:info@rayloop.com">
                                           info@rayloop.com
                                        </a>
                                       
                                    </div>
                                </div>
                            </div>

                            <div className="contact-social">
                                <h3>Follow Our Journey</h3>

                                <div className="contact-social-links">
                                    <a
                                        href="https://www.facebook.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Facebook"
                                    >
                                        <i className="bi bi-facebook"></i>
                                    </a>

                                    <a
                                        href="https://www.instagram.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Instagram"
                                    >
                                        <i className="bi bi-instagram"></i>
                                    </a>

                                    <a
                                        href="https://www.linkedin.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="LinkedIn"
                                    >
                                        <i className="bi bi-linkedin"></i>
                                    </a>

                                    <a
                                        href="https://www.youtube.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="YouTube"
                                    >
                                        <i className="bi bi-youtube"></i>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="contact-form-section">
                            <div className="contact-form-heading">
                                <span className="contact-section-label">
                                    LET&apos;S START A CONVERSATION
                                </span>

                                <h2>Send Us a Message</h2>

                                <p>
                                    Fill in your details and we&apos;ll get
                                    back to you as soon as possible.
                                </p>
                            </div>

                            <form
                                className="contact-form"
                                onSubmit={handleContactSubmit}
                            >
                                <div className="row contact-form-row">
                                    <div className="col-md-6 col-12">
                                        <label htmlFor="first-name">
                                            First Name
                                        </label>

                                        <input
                                            type="text"
                                            id="first-name"
                                            name="firstName"
                                            placeholder="Enter first name"
                                            autoComplete="given-name"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="col-md-6 col-12">
                                        <label htmlFor="last-name">
                                            Last Name
                                        </label>

                                        <input
                                            type="text"
                                            id="last-name"
                                            name="lastName"
                                            placeholder="Enter last name"
                                            autoComplete="family-name"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="col-md-6 col-12">
                                        <label htmlFor="email">
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="col-md-6 col-12">
                                        <label htmlFor="phone">
                                            Phone Number
                                        </label>

                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            placeholder="+91 6238742481"
                                            autoComplete="tel"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="subject">
                                            Subject
                                        </label>

                                        <select
                                            id="subject"
                                            name="subject"
                                            defaultValue=""
                                            required
                                            disabled={loading}
                                        >
                                            <option value="" disabled>
                                                Select your enquiry
                                            </option>

                                            <option value="product-enquiry">
                                                Product Enquiry
                                            </option>

                                            <option value="bulk-order">
                                                Bulk Order
                                            </option>

                                            <option value="quotation">
                                                Request a Quote
                                            </option>

                                            <option value="partnership">
                                                Business Partnership
                                            </option>

                                            <option value="other">
                                                Other
                                            </option>
                                        </select>
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="message">
                                            Your Message
                                        </label>

                                        <textarea
                                            id="message"
                                            name="message"
                                            placeholder="Tell us how we can help you..."
                                            rows={4}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {statusMessage && (
                                    <div
                                        role="status"
                                        aria-live="polite"
                                        className={`contact-status ${isSuccess
                                            ? "contact-status-success"
                                            : "contact-status-error"
                                            }`}
                                    >
                                        <i
                                            className={`bi ${isSuccess
                                                ? "bi-check-circle-fill"
                                                : "bi-exclamation-circle-fill"
                                                }`}
                                        ></i>

                                        <span>{statusMessage}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="contact-submit-button"
                                    disabled={loading}
                                >
                                    <span>
                                        {loading
                                            ? "Sending Message..."
                                            : "Send Message"}
                                    </span>

                                    <span className="contact-submit-icon">
                                        <i
                                            className={`bi ${loading
                                                ? "bi-arrow-repeat contact-loading-icon"
                                                : "bi-arrow-right"
                                                }`}
                                        ></i>
                                    </span>
                                </button>

                                <div className="contact-form-note">
                                    <i className="bi bi-shield-check"></i>
                                    <span>
                                        Your information is treated with care.
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="contact-map-section">
                <div className="contact-map-heading">
                    <span className="contact-section-label">
                        FIND US
                    </span>

                    <h2>Visit Our Facility</h2>

                    <p>
                        We welcome your enquiries about our surgical glove
                        manufacturing facility in Kochi, Kerala.
                    </p>
                </div>

                <div className="contact-map-frame">
                 
<iframe
    src="https://maps.google.com/maps?q=Ullampilly%20Building%2C%20Second%20Floor%2C%20Seaport%20-%20Airport%20Rd%2C%20behind%20Olimugal%20Juma%20Masjid%2C%20Thrikkakara%2C%20Vazhakkala%2C%20Kakkanad%2C%20Kochi%2C%20Kerala%20682030&t=&z=15&ie=UTF8&iwloc=&output=embed"
    title="Togglemax Education Location"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
></iframe>

                </div>
            </div>
        </section>
    );
}

export default ContactUs;