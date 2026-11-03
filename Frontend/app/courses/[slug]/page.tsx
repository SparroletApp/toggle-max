"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
    Course,
    getCourseById,
} from "@/app/apiservice/coursesservice";

import "./course-view.css";

function CourseView() {
    const searchParams = useSearchParams();
    const courseId = searchParams.get("id");

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) {
                setError("Course ID is missing.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await getCourseById(courseId);

                setCourse(response);
            } catch (err: any) {
                console.error("Course fetch error:", err);

                setError(
                    err?.message || "Unable to load course details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    if (loading) {
        return (
            <section className="courses-view">
                <div className="container text-center py-5">
                    <div className="spinner-border text-primary"></div>
                    <p className="mt-3">Loading course details...</p>
                </div>
            </section>
        );
    }

    if (error || !course) {
        return (
            <section className="courses-view">
                <div className="container text-center py-5">
                    <i className="bi bi-exclamation-circle fs-1 text-danger"></i>
                    <h3 className="mt-3">Course Not Found</h3>
                    <p>{error || "The requested course could not be found."}</p>

                    <Link href="/courses" className="courses-view-primary-btn">
                        Back to Courses
                    </Link>
                </div>
            </section>
        );
    }

    const courseHighlights = [
        {
            icon: "bi-palette",
            title: "Practical Learning",
            description: "Learn through practical exercises and real-world assignments.",
        },
        {
            icon: "bi-people",
            title: "Expert Guidance",
            description: "Improve your skills with guidance from experienced mentors.",
        },
        {
            icon: "bi-bezier2",
            title: "Industry Skills",
            description: "Develop skills that are relevant to the industry.",
        },
        {
            icon: "bi-briefcase",
            title: "Career Development",
            description: "Build confidence and prepare for professional opportunities.",
        },
    ];

    const curriculumPoints = course.curriculum_points || [];

    const courseImage =
        course.image_url ||
        (course.image
            ? `${process.env.NEXT_PUBLIC_API_URL || ""}/storage/${course.image}`
            : "/uiux.jpg");

    return (
        <section className="courses-view">
            <div className="courses-view-container container">

                {/* HERO SECTION */}
                <div className="courses-view-hero">

                    <div className="courses-view-content">
                        <span className="courses-view-label">
                            <span></span>
                            {course.badge || "DESIGN PROGRAM"}
                        </span>

                        <h1>
                            {course.title}
                        </h1>

                        <div
                            className="courses-view-description"
                            dangerouslySetInnerHTML={{
                                __html:
                                    course.description ||
                                    "Explore this course and develop your professional skills through practical training.",
                            }}
                        />

                        <div className="courses-view-meta">

                            <div>
                                <span className="courses-view-meta-icon">
                                    <i className="bi bi-clock"></i>
                                </span>

                                <div>
                                    <small>Course Duration</small>
                                    <strong>
                                        {course.months
                                            ? `${course.months} Months`
                                            : "Flexible Duration"}
                                    </strong>
                                </div>
                            </div>

                            <div>
                                <span className="courses-view-meta-icon">
                                    <i className="bi bi-calendar-week"></i>
                                </span>

                                <div>
                                    <small>Class Schedule</small>
                                    <strong>
                                        {course.days
                                            ? `${course.days} Days a Week`
                                            : "Flexible Schedule"}
                                    </strong>
                                </div>
                            </div>

                            <div>
                                <span className="courses-view-meta-icon">
                                    <i className="bi bi-laptop"></i>
                                </span>

                                <div>
                                    <small>Learning Mode</small>
                                    <strong>Online & Offline</strong>
                                </div>
                            </div>

                        </div>

                        <div className="courses-view-actions">
                            <Link
                                href="/contact-us"
                                className="courses-view-primary-btn"
                            >
                                Enquire About Course
                                <i className="bi bi-arrow-up-right"></i>
                            </Link>

                            <a
                                href="#course-curriculum"
                                className="courses-view-secondary-btn"
                            >
                                Explore Curriculum
                                <i className="bi bi-arrow-down"></i>
                            </a>
                        </div>

                        <div className="courses-view-note">
                            <i className="bi bi-patch-check-fill"></i>
                            Practical, job-oriented training
                        </div>
                    </div>

                    <div className="courses-view-image-wrapper">
                        <div className="courses-view-image">
                            <img
                                src={courseImage}
                                alt={course.title}
                            />

                            <div className="courses-view-image-badge">
                                <span className="courses-view-badge-icon">
                                    <i className="bi bi-brush"></i>
                                </span>

                                <div>
                                    <strong>Design Your Future</strong>
                                    <span>Learn. Create. Grow.</span>
                                </div>
                            </div>
                        </div>

                        <div className="courses-view-decoration courses-view-decoration-one"></div>
                        <div className="courses-view-decoration courses-view-decoration-two"></div>
                    </div>

                </div>

                {/* HIGHLIGHTS */}
                <div className="courses-view-highlights">
                    {courseHighlights.map((item, index) => (
                        <div
                            className="courses-view-highlight"
                            key={item.title}
                        >
                            <div className="courses-view-highlight-top">
                                <span className="courses-view-highlight-icon">
                                    <i className={`bi ${item.icon}`}></i>
                                </span>

                                <span className="courses-view-highlight-number">
                                    0{index + 1}
                                </span>
                            </div>

                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>

                {/* COURSE OVERVIEW AND CURRICULUM */}
                <div className="courses-view-overview">

                    <div className="courses-view-overview-content">
                        <span className="courses-view-section-label">
                            ABOUT THE PROGRAM
                        </span>

                        <h2>
                            Learn to Develop
                            <span> Your Professional Skills</span>
                        </h2>

                        <div
                            className="courses-view-overview-description"
                            dangerouslySetInnerHTML={{
                                __html:
                                    course.curriculum_description ||
                                    course.description ||
                                    "Learn through structured lessons, practical assignments and real-world projects.",
                            }}
                        />

                        <Link
                            href="/contact-us"
                            className="courses-view-text-link"
                        >
                            Start Your Learning Journey
                            <i className="bi bi-arrow-right"></i>
                        </Link>
                    </div>

                    <div
                        className="courses-view-topics"
                        id="course-curriculum"
                    >
                        <div className="courses-view-topics-heading">
                            <span className="courses-view-topics-icon">
                                <i className="bi bi-journal-check"></i>
                            </span>

                            <div>
                                <span>WHAT YOU WILL LEARN</span>

                                <h3>
                                    {course.curriculum_title || "Course Curriculum"}
                                </h3>
                            </div>
                        </div>

                        <div className="courses-view-topics-list">

                            {curriculumPoints.length > 0 ? (
                                curriculumPoints.map((item, index) => (
                                    <div
                                        className="courses-view-topic"
                                        key={index}
                                    >
                                        <span className="courses-view-topic-check">
                                            <i className="bi bi-check2"></i>
                                        </span>

                                        <span>{item.title}</span>

                                        <small>
                                            {String(index + 1).padStart(2, "0")}
                                        </small>
                                    </div>
                                ))
                            ) : course.key_points?.length ? (
                                course.key_points.map((item, index) => (
                                    <div
                                        className="courses-view-topic"
                                        key={index}
                                    >
                                        <span className="courses-view-topic-check">
                                            <i className="bi bi-check2"></i>
                                        </span>

                                        <span>{item.title}</span>

                                        <small>
                                            {String(index + 1).padStart(2, "0")}
                                        </small>
                                    </div>
                                ))
                            ) : (
                                <p>No curriculum details available yet.</p>
                            )}

                        </div>

                        <div className="courses-view-topics-footer">
                            <i className="bi bi-lightbulb"></i>
                            Learn through practical exercises and projects.
                        </div>
                    </div>
                </div>

                {/* CURRICULUM DETAILS */}
                {curriculumPoints.length > 0 && (
                    <div className="courses-view-curriculum-details">

                        {curriculumPoints.map((item, index) => (
                            <div
                                className="courses-view-curriculum-item"
                                key={index}
                            >
                                <h3>
                                    {String(index + 1).padStart(2, "0")}. {item.title}
                                </h3>

                                {item.desc && (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: item.desc,
                                        }}
                                    />
                                )}

                                {item.points?.length > 0 && (
                                    <ul>
                                        {item.points.map((point, pointIndex) => (
                                            <li key={pointIndex}>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}

                    </div>
                )}

                {/* CTA */}
                <div className="courses-view-cta">
                    <div className="courses-view-cta-icon">
                        <i className="bi bi-rocket-takeoff"></i>
                    </div>

                    <div className="courses-view-cta-content">
                        <h3>
                            Ready to start learning {course.title}?
                        </h3>

                        <p>
                            Take the first step toward your career with Togglemax.
                        </p>
                    </div>

                    <Link
                        href="/contact-us"
                        className="courses-view-cta-btn"
                    >
                        Enquire Now
                        <i className="bi bi-arrow-right"></i>
                    </Link>
                </div>

            </div>
        </section>
    );
}

export default CourseView;