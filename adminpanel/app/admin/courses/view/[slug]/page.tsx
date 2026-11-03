"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import courseService from "@/app/apiservice/coursesservice";
import "./courses-view.css";

interface KeyPoint {
    title: string;
}

interface Curriculum {
    title: string;
    desc: string;
    points: string[];
}

interface Course {
    id: number;
    title: string;
    description: string;
    months: number;
    days: number;
    badge: string;
    image: string | null;
    image_url: string | null;
    key_points: KeyPoint[];
    curriculum_points: Curriculum[];
}

const parseJSON = (value: any) => {
    if (typeof value !== "string") return value;

    try {
        return JSON.parse(value);
    } catch {
        return [];
    }
};

const slugify = (value: string) => {
    return value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
};

const getPlainText = (html: string) => {
    if (!html || typeof window === "undefined") return "";

    const element = document.createElement("div");
    element.innerHTML = html;

    return (element.textContent || element.innerText || "")
        .replace(/\s+/g, " ")
        .trim();
};

export default function ViewCourse() {

    const router = useRouter();
    const params = useParams();

    const slug = decodeURIComponent(params.slug as string);

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const fetchCourse = async () => {

        try {

            setLoading(true);
            setError("");

            const apiResult = await courseService.getAllCourses();

            let response = apiResult;

            if (typeof response === "string") {
                response = JSON.parse(
                    response.replace(/^```(?:json|php)?\s*/i, "")
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

            if (!response?.success) {
                throw new Error(
                    response?.message || "Unable to retrieve courses."
                );
            }

            const courses = Array.isArray(response.data)
                ? response.data
                : [];

            const selectedCourse = courses.find((item: any) => {

                const itemSlug = slugify(item.title || "");

                return itemSlug === slug.toLowerCase();

            });

            if (!selectedCourse) {
                throw new Error("Course not found.");
            }
            const rawKeyPoints = parseJSON(
                selectedCourse.key_points ??
                selectedCourse.keyPoints ??
                []
            );

            const formattedKeyPoints: KeyPoint[] = Array.isArray(rawKeyPoints)
                ? rawKeyPoints.map((item: any) => ({
                    title:
                        typeof item === "string"
                            ? item
                            : item.title || "",
                })).filter((item: KeyPoint) => item.title.trim())
                : [];
            const rawCurriculum = parseJSON(
                selectedCourse.curriculum_points ??
                selectedCourse.curriculum ??
                []
            );

            const formattedCurriculum: Curriculum[] =
                Array.isArray(rawCurriculum)
                    ? rawCurriculum.map((item: any) => ({
                        title: item.title || "",
                        desc: item.desc || "",
                        points: Array.isArray(item.points)
                            ? item.points.map((point: any) =>
                                typeof point === "string"
                                    ? point
                                    : point.title || ""
                            ).filter((point: string) => point.trim())
                            : [],
                    }))
                    : [];

            setCourse({

                id: selectedCourse.id,

                title: selectedCourse.title || "",

                description:
                    selectedCourse.description ||
                    selectedCourse.desc ||
                    "",

                months: Number(selectedCourse.months) || 0,

                days: Number(selectedCourse.days) || 0,

                badge: selectedCourse.badge || "",

                image:
                    selectedCourse.image || null,

                image_url:
                    selectedCourse.image_url ||
                    selectedCourse.image ||
                    null,

                key_points: formattedKeyPoints,

                curriculum_points: formattedCurriculum,

            });

        } catch (err: any) {

            console.error("View course error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load course details."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        if (slug) {
            fetchCourse();
        }

    }, [slug]);
    const handleEdit = () => {

        if (!course) return;

        router.push(
            `/admin/courses/edit/${encodeURIComponent(slugify(course.title))}`
        );

    };

    if (loading) {

        return (
            <section className="course-view-page">

                <div className="course-view-status">

                    <div className="course-view-spinner"></div>

                    <h3>Loading Course Details</h3>

                    <p>Please wait while we retrieve the course information.</p>

                </div>

            </section>
        );

    }

    if (error || !course) {

        return (
            <section className="course-view-page container">

                <div className="course-view-status course-view-error">

                    <div className="course-error-icon">
                        <i className="bi bi-journal-x"></i>
                    </div>

                    <h3>Course Not Found</h3>

                    <p>{error || "The requested course could not be found."}</p>

                    <div className="course-error-actions">

                        <button
                            type="button"
                            className="cv-btn cv-btn-primary"
                            onClick={fetchCourse}
                        >
                            <i className="bi bi-arrow-clockwise"></i>
                            Try Again
                        </button>

                        <button
                            type="button"
                            className="cv-btn cv-btn-outline"
                            onClick={() => router.push("/admin/courses")}
                        >
                            Back to Courses
                        </button>

                    </div>

                </div>

            </section>
        );

    }

    return (

        <section className="course-view-page">
            <div className="container">

                <div className="course-view-container">
                    <div className="cv-page-header">

                        <div className="cv-header-actions">

                            <button
                                type="button"
                                className="cv-btn cv-btn-outline"
                                onClick={() => router.push("/admin/courses")}
                            >
                                <i className="bi bi-arrow-left"></i>
                                Back to Courses
                            </button>

                            <button
                                type="button"
                                className="cv-btn cv-btn-primary"
                                onClick={handleEdit}
                            >
                                <i className="bi bi-pencil-square"></i>
                                Edit Course
                            </button>

                        </div>

                    </div>
                    <div className="cv-hero-card">

                        <div className="cv-hero-content">

                            <div className="cv-hero-top">

                                {course.badge && (

                                    <span className="cv-course-badge">
                                        <i className="bi bi-patch-check-fill"></i>
                                        {course.badge}
                                    </span>

                                )}

                                <span className="cv-course-status">
                                    <span></span>
                                    Course Available
                                </span>

                            </div>

                            <h2>{course.title}</h2>

                            <p className="cv-hero-description">
                                {getPlainText(course.description) ||
                                    "Explore this course and discover everything you will learn."}
                            </p>

                            <div className="cv-hero-stats">

                                <div className="cv-hero-stat">

                                    <div className="cv-stat-icon">
                                        <i className="bi bi-calendar3"></i>
                                    </div>

                                    <div>
                                        <strong>{course.months}</strong>
                                        <span>Months Duration</span>
                                    </div>

                                </div>

                                <div className="cv-hero-stat">

                                    <div className="cv-stat-icon">
                                        <i className="bi bi-calendar-check"></i>
                                    </div>

                                    <div>
                                        <strong>{course.days}</strong>
                                        <span>Days / Week</span>
                                    </div>

                                </div>

                                <div className="cv-hero-stat">

                                    <div className="cv-stat-icon">
                                        <i className="bi bi-list-check"></i>
                                    </div>

                                    <div>
                                        <strong>{course.key_points.length}</strong>
                                        <span>Key Benefits</span>
                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="cv-hero-image">

                            {course.image_url ? (

                                <img
                                    src={course.image_url}
                                    alt={course.title}
                                />

                            ) : (

                                <div className="cv-no-image">
                                    <i className="bi bi-mortarboard-fill"></i>
                                    <span>Course Image</span>
                                </div>

                            )}

                            <div className="cv-image-label">
                                <i className="bi bi-book-half"></i>
                                Learning Program
                            </div>

                        </div>

                    </div>
                    <div className="cv-section-card">

                        <div className="cv-section-heading">

                            <div className="cv-section-icon">
                                <i className="bi bi-file-earmark-text"></i>
                            </div>

                            <div>
                                <h3>About This Course</h3>
                                <p>
                                    Detailed information about the learning program.
                                </p>
                            </div>

                        </div>

                        {course.description ? (

                            <div
                                className="cv-rich-content"
                                dangerouslySetInnerHTML={{
                                    __html: course.description,
                                }}
                            />

                        ) : (

                            <div className="cv-empty-content">
                                No course description available.
                            </div>

                        )}

                    </div>
                    <div className="cv-section-card">

                        <div className="cv-section-heading">

                            <div className="cv-section-icon">
                                <i className="bi bi-stars"></i>
                            </div>

                            <div>
                                <h3>What You'll Learn</h3>
                                <p>
                                    Explore the skills and benefits included in this course.
                                </p>
                            </div>

                            <span className="cv-count-badge">
                                {course.key_points.length} Points
                            </span>

                        </div>

                        {course.key_points.length > 0 ? (

                            <div className="cv-keypoints-grid">

                                {course.key_points.map((point, index) => (

                                    <div
                                        className="cv-keypoint-card"
                                        key={index}
                                    >

                                        <div className="cv-keypoint-number">
                                            {String(index + 1).padStart(2, "0")}
                                        </div>

                                        <div className="cv-keypoint-check">
                                            <i className="bi bi-check-lg"></i>
                                        </div>

                                        <h4>{point.title}</h4>

                                    </div>

                                ))}

                            </div>

                        ) : (

                            <div className="cv-empty-content">
                                No key points added to this course.
                            </div>

                        )}

                    </div>
                    <div className="cv-section-card cv-curriculum-section">

                        <div className="cv-section-heading">

                            <div className="cv-section-icon">
                                <i className="bi bi-journals"></i>
                            </div>

                            <div>
                                <h3>Course Curriculum</h3>
                                <p>
                                    Explore the modules and topics covered in this course.
                                </p>
                            </div>

                            <span className="cv-count-badge">
                                {course.curriculum_points.length} Modules
                            </span>

                        </div>

                        {course.curriculum_points.length > 0 ? (

                            <div className="cv-module-list">

                                {course.curriculum_points.map((module, index) => (

                                    <div
                                        className="cv-module-card"
                                        key={index}
                                    >
                                        <div className="cv-module-header">

                                            <div className="cv-module-number">
                                                {String(index + 1).padStart(2, "0")}
                                            </div>

                                            <div className="cv-module-title">

                                                <span>
                                                    MODULE {String(index + 1).padStart(2, "0")}
                                                </span>

                                                <h4>{module.title}</h4>

                                            </div>

                                            <div className="cv-module-topic-count">
                                                <i className="bi bi-list-ul"></i>
                                                {module.points.length} Topics
                                            </div>

                                        </div>
                                        {module.desc && (

                                            <div
                                                className="cv-module-description cv-rich-content"
                                                dangerouslySetInnerHTML={{
                                                    __html: module.desc,
                                                }}
                                            />

                                        )}
                                        {module.points.length > 0 && (

                                            <div className="cv-module-topics">

                                                <h5>
                                                    <i className="bi bi-bookmark-check"></i>
                                                    Topics Covered
                                                </h5>

                                                <div className="cv-topics-grid">

                                                    {module.points.map((point, pointIndex) => (

                                                        <div
                                                            className="cv-topic-item"
                                                            key={pointIndex}
                                                        >

                                                            <i className="bi bi-check-circle-fill"></i>

                                                            <span>{point}</span>

                                                        </div>

                                                    ))}

                                                </div>

                                            </div>

                                        )}

                                    </div>

                                ))}

                            </div>

                        ) : (

                            <div className="cv-empty-content">
                                No curriculum modules available.
                            </div>

                        )}

                    </div>
                    <div className="cv-bottom-actions">

                        <div>
                            <h4>Want to make changes?</h4>
                            <p>
                                Update the course information, benefits or curriculum.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="cv-btn cv-btn-primary"
                            onClick={handleEdit}
                        >
                            <i className="bi bi-pencil-square"></i>
                            Edit This Course
                        </button>

                    </div>

                </div>
            </div>
        </section>

    );

}