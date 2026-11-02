
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "./courses.css";
import { Course, getCourses } from "../apiservice/coursesservice";

function Courses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const fetchCourses = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getCourses();

                if (active) {
                    setCourses(data);
                }
            } catch (err) {
                console.error("Failed to fetch courses:", err);

                if (active) {
                    setError("Unable to load courses. Please try again later.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchCourses();

        return () => {
            active = false;
        };
    }, []);

    return (
        <div className="course-section">
            <div className="aboutus-top">
                <div className="aboutus-overlay">
                    <div className="container">
                        <div className="aboutus-content">
                            <span className="aboutus-subtitle">
                                EXPLORE OUR PROGRAMS
                            </span>

                            <h1>Our Courses</h1>

                            <p>
                                <Link href="/">Home</Link>
                                <i className="bi bi-chevron-right"></i>
                                <span>Courses</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="courses-wrapper">
                <div className="courses-container container">
                    <div className="courses-highlight">
                        <div className="courses-highlight-icon">
                            <i className="bi bi-briefcase-fill"></i>
                        </div>

                        <div className="courses-highlight-content">
                            <h3>100% Job-Oriented Training</h3>

                            <p>
                                Learn UI designing, UX designing, Figma, Adobe
                                XD, and industry-focused design practices
                                through practical training.
                            </p>
                        </div>
                    </div>

                    <div className="courses-topbar">
                        <div>
                            <h3>Our Learning Programs</h3>
                            <p>
                                Explore a course that matches your goals.
                            </p>
                        </div>

                        <span className="courses-mode">
                            <i className="bi bi-laptop"></i>
                            Offline &amp; Online
                        </span>
                    </div>

                    {loading && (
                        <div className="courses-status">
                            <i className="bi bi-arrow-repeat"></i>
                            <p>Loading courses...</p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="courses-status courses-error">
                            <i className="bi bi-exclamation-circle"></i>
                            <p>{error}</p>

                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {!loading && !error && courses.length === 0 && (
                        <div className="courses-status">
                            <i className="bi bi-journal-x"></i>
                            <p>No courses available right now.</p>
                        </div>
                    )}

                    {!loading && !error && courses.length > 0 && (
                        <div className="courses-grid">
                            {courses.map((course) => {
                                const duration = [
                                    course.months
                                        ? `${course.months} ${course.months === 1
                                            ? "Month"
                                            : "Months"
                                        }`
                                        : null,
                                    course.days
                                        ? `${course.days} ${course.days === 1
                                            ? "Day"
                                            : "Days"
                                        }`
                                        : null,
                                ]
                                    .filter(Boolean)
                                    .join(" ");

                                const slug = course.title
                                    .toLowerCase()
                                    .trim()
                                    .replace(/[^a-z0-9]+/g, "-")
                                    .replace(/^-|-$/g, "");

                                return (
                                    <Link
                                        href={`/courses/${slug}?id=${course.id}`}
                                        className="course-card course-card-link"
                                        key={course.id}
                                        aria-label={`View ${course.title} course`}
                                    >
                                        <div className="course-card-image">
                                            {course.image_url ? (
                                                <img
                                                    src={course.image_url}
                                                    alt={course.title}
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="course-image-placeholder">
                                                    <i className="bi bi-image"></i>
                                                </div>
                                            )}

                                            <span className="course-category">
                                                {course.badge || "DESIGN PROGRAM"}
                                            </span>

                                            {course.badge?.toLowerCase() ===
                                                "popular" && (
                                                    <span className="course-featured">
                                                        <i className="bi bi-star-fill"></i>
                                                        Popular
                                                    </span>
                                                )}
                                        </div>

                                        <div className="course-card-content">
                                            <div className="course-duration">
                                                {duration && (
                                                    <span>
                                                        <i className="bi bi-clock"></i>
                                                        {duration}
                                                    </span>
                                                )}

                                                <span>
                                                    <i className="bi bi-calendar-week"></i>
                                                    5 Days a Week
                                                </span>
                                            </div>

                                            <h4>{course.title}</h4>

                                            <p className="course-description">
                                                {course.description ||
                                                    "Explore this course to learn more about the curriculum and practical training."}
                                            </p>

                                            <div className="course-tags">
                                                {course.key_points
                                                    ?.slice(0, 3)
                                                    .map((point, index) => (
                                                        <span
                                                            key={`${course.id}-${index}`}
                                                        >
                                                            {point.name ||
                                                                point.title}
                                                        </span>
                                                    ))}
                                            </div>

                                            <div className="course-card-footer">
                                                <span className="course-learning">
                                                    <i className="bi bi-mortarboard"></i>
                                                    Practical Learning
                                                </span>

                                                <span className="course-enquire">
                                                    View Course
                                                    <i className="bi bi-arrow-up-right"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    <div className="courses-bottom">
                        <div>
                            <h3>Ready to start your design journey?</h3>
                            <p>
                                Connect with us to find the right course for
                                your career goals.
                            </p>
                        </div>

                        <Link
                            href="/contact-us"
                            className="courses-contact-btn"
                        >
                            Contact Us
                            <i className="bi bi-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Courses;
