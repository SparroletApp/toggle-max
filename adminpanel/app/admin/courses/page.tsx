"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import courseService from "@/app/apiservice/coursesservice";
import Swal from "sweetalert2";
import "./courses.css";

interface Course {
    id: number;
    title: string;
    description: string;
    months: number;
    days: number;
    badge: string;
    image: string | null;
    image_url: string | null;
    key_points: any[];
    curriculum_title: string;
}


function Courses() {

    const router = useRouter();
    const getPlainText = (html: string) => {
        if (!html) return "";

        const temp = document.createElement("div");
        temp.innerHTML = html;

        return (temp.textContent || temp.innerText || "")
            .replace(/\s+/g, " ")
            .trim();
    };
    const [courses, setCourses] = useState<Course[]>([]);
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

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await courseService.getAllCourses();

            console.log("API Response:", response);

            let result = response;
            if (typeof result === "string") {
                result = JSON.parse(
                    result.replace(/```(?:json|php)?|```/g, "").trim()
                );
            }
            if (result?.data?.success !== undefined) {
                result = result.data;
            }
            if (result?.success === true) {
                setCourses(Array.isArray(result.data) ? result.data : []);

                setError("");

            } else {

                setCourses([]);
                setError(result?.message || "Unable to retrieve courses.");
            }

        } catch (error: any) {

            console.error("Course fetching error:", error);

            setCourses([]);

            setError(
                error.response?.data?.message ||
                "Something went wrong while fetching courses."
            );

        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter((course) =>
        course.title?.toLowerCase().includes(search.toLowerCase()) ||
        course.description?.toLowerCase().includes(search.toLowerCase()) ||
        course.badge?.toLowerCase().includes(search.toLowerCase())
    );

    const handleView = (title: string) => {
        const slug = title
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");

        router.push(`/admin/courses/view/${encodeURIComponent(slug)}`);
    };

    const handleEdit = (title: string) => {
        const slug = title.trim().replace(/\s+/g, "-");
        router.push(`/admin/courses/edit/${encodeURIComponent(slug)}`);
    };

    const handleDelete = async (id: number) => {

        const result = await Swal.fire({
            title: "Delete Course?",
            text: "Are you sure you want to delete this course? Its image will also be deleted. This action cannot be undone.",
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
                title: "Deleting Course...",
                text: "Please wait while we delete the course.",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const apiResult = await courseService.deleteCourse(id);

            console.log("DELETE COURSE RAW RESPONSE:", apiResult);

            let response: any = apiResult;

            if (typeof response === "string") {

                const cleanedResponse = response
                    .replace(/^```(?:php|json)?\s*/i, "")
                    .replace(/\s*```$/, "")
                    .trim();

                response = JSON.parse(cleanedResponse);
            }

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
                        "Course deleted successfully!",
                });
                await fetchCourses();

            } else {
                await Toast.fire({
                    icon: "error",
                    title:
                        response?.message ||
                        "Unable to delete course.",
                });
            }

        } catch (error: any) {

            console.error("Course deletion error:", error);

            Swal.close();
            Toast.fire({
                icon: "error",
                title:
                    error.response?.data?.message ||
                    "Something went wrong while deleting the course.",
            });
        }
    };

    return (
        <section className="courses tm-admin-page">
            <div className="tm-admin-header">

                <div>
                    <span className="tm-admin-eyebrow">
                        CONTENT MANAGEMENT
                    </span>

                    <h1>Courses</h1>

                    <p>
                        Manage your courses, descriptions, curriculum and details.
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
                        onClick={() => router.push("/admin/courses/create")}
                    >
                        <i className="bi bi-plus-lg"></i>
                        Add New Course
                    </button>

                </div>

            </div>
            <div className="tm-course-summary">

                <div className="tm-course-summary-icon">
                    <i className="bi bi-mortarboard-fill"></i>
                </div>

                <div>
                    <span>Total Courses</span>
                    <h3>{courses.length}</h3>
                </div>

            </div>
            <div className="tm-table-card">

                <div className="tm-table-header">

                    <div>
                        <h2>All Courses</h2>
                        <p>View and manage all your available courses.</p>
                    </div>

                    <div className="tm-table-search">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            placeholder="Search courses..."
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
                                <th>COURSE DETAILS</th>
                                <th>DURATION</th>
                                <th>BADGE</th>
                                <th>KEY POINTS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>
                                    <td colSpan={6}>
                                        <div className="tm-table-status">
                                            <div className="tm-spinner"></div>
                                            <p>Loading courses...</p>
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
                                                className="tm-btn tm-btn-outline"
                                                onClick={fetchCourses}
                                            >
                                                <i className="bi bi-arrow-clockwise"></i>
                                                Retry
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                            ) : filteredCourses.length === 0 ? (

                                <tr>
                                    <td colSpan={6}>
                                        <div className="tm-table-status">
                                            <i className="bi bi-journal-x"></i>

                                            <h4>
                                                {search
                                                    ? "No matching courses found"
                                                    : "No courses available"}
                                            </h4>

                                            <p>
                                                {search
                                                    ? "Try searching with another keyword."
                                                    : "Add your first course to get started."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                            ) : (

                                filteredCourses.map((course, index) => (

                                    <tr key={course.id}>
                                        <td>
                                            <span className="tm-table-number">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="tm-course-info">

                                                <div className="tm-course-image">

                                                    {course.image_url ? (
                                                        <img
                                                            src={course.image_url}
                                                            alt={course.title}
                                                        />
                                                    ) : (
                                                        <i className="bi bi-mortarboard-fill"></i>
                                                    )}

                                                </div>

                                                <div className="tm-course-text">
                                                    <h4>{course.title}</h4>

                                                    <div
                                                        className="tm-course-description"
                                                        title={getPlainText(course.description)}
                                                        dangerouslySetInnerHTML={{
                                                            __html: course.description || "No description available",
                                                        }}
                                                    />
                                                </div>

                                            </div>
                                        </td>
                                        <td>
                                            <div className="tm-duration">
                                                <i className="bi bi-clock"></i>

                                                <span>
                                                    {course.months || 0} Months
                                                    <small>
                                                        {course.days || 0} Days / Week
                                                    </small>
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            {course.badge ? (
                                                <span className="tm-course-badge">
                                                    {course.badge}
                                                </span>
                                            ) : (
                                                <span className="tm-no-badge">
                                                    No Badge
                                                </span>
                                            )}
                                        </td>

                                        <td>
                                            <span className="tm-keypoints">
                                                <i className="bi bi-list-check"></i>
                                                {course.key_points?.length || 0} Points
                                            </span>
                                        </td>


                                        <td>
                                            <div className="tm-table-actions">

                                                <button
                                                    type="button"
                                                    className="tm-action-btn tm-view-btn"
                                                    title="View Course"
                                                   onClick={() => handleView(course.title)}
                                                >
                                                    <i className="bi bi-eye-fill"></i>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="tm-action-btn tm-edit-btn"
                                                    title="Edit Course"
                                                    onClick={() => handleEdit(course.title)}
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="tm-action-btn tm-delete-btn"
                                                    title="Delete Course"
                                                    onClick={() => handleDelete(course.id)}
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
                {!loading && !error && filteredCourses.length > 0 && (
                    <div className="tm-table-footer">

                        <p>
                            Showing <strong>{filteredCourses.length}</strong> of{" "}
                            <strong>{courses.length}</strong> courses
                        </p>

                        <span>
                            <i className="bi bi-check-circle-fill"></i>
                            Course management
                        </span>

                    </div>
                )}

            </div>

        </section>
    );
}

export default Courses;