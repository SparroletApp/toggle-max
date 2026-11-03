"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

import "./courses-edit.css";
import courseService from "@/app/apiservice/coursesservice";

interface KeyPoint {
    title: string;
}

interface Curriculum {
    title: string;
    desc: string;
    points: string[];
}

interface CourseForm {
    title: string;
    desc: string;
    months: string;
    days: string;
    badge: string;
}

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
});



const JoditEditor = dynamic(
    () => import("jodit-react"),
    {
        ssr: false,
        loading: () => (
            <div className="jodit-loading">
                Loading editor...
            </div>
        ),
    }
);

const joditConfig = {
    readonly: false,
    height: 200,
    minHeight: 150,
    toolbar: true,
    spellcheck: true,
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    toolbarAdaptive: false,

    buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "paragraph",
        "|",
        "align",
        "|",
        "link",
        "table",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "fullsize",
    ],

    uploader: {
        insertImageAsBase64URI: true,
    },
};


const stripHtml = (value: string) => {
    return value
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&#160;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim();
};

export default function EditCourse() {

    const router = useRouter();
    const params = useParams();

    const slug = decodeURIComponent(
        params.slug as string
    );

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [courseId, setCourseId] = useState<number | string>("");
    const [formData, setFormData] = useState<CourseForm>({
        title: "",
        desc: "",
        months: "",
        days: "",
        badge: "",
    });
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");
    const [keyPoints, setKeyPoints] = useState<KeyPoint[]>([
        {
            title: "",
        },
    ]);


    const [curriculum, setCurriculum] = useState<Curriculum[]>([
        {
            title: "",
            desc: "",
            points: [""],
        },
    ]);
    const parseResponse = (apiResponse: any) => {

        let response = apiResponse;

        if (typeof response === "string") {

            const cleanedResponse = response
                .replace(/^```(?:php|json)?\s*/i, "")
                .replace(/\s*```$/, "")
                .trim();

            response = JSON.parse(cleanedResponse);
        }

        return response;
    };

    const fetchCourse = async () => {

        try {

            setLoading(true);

            const apiResult = await courseService.getAllCourses();

            console.log("API Response:", apiResult);

            let response = parseResponse(apiResult);

            if (
                response?.success === undefined &&
                response?.data?.success !== undefined
            ) {
                response = response.data;
            }

            if (!response?.success) {
                throw new Error(
                    response?.message || "Unable to load courses."
                );
            }

            const courses = Array.isArray(response.data)
                ? response.data
                : [];

            console.log("Courses:", courses);
            const course = courses.find((item: any) => {

                const courseSlug = item.title
                    ?.trim()
                    .toLowerCase()
                    .replace(/\s+/g, "-");

                return courseSlug === slug.toLowerCase();

            });

            if (!course) {
                throw new Error("Course not found.");
            }

            console.log("Selected Course:", course);

            setCourseId(course.id);

            setFormData({
                title: course.title || "",
                desc: course.description || course.desc || "",
                months: String(course.months ?? ""),
                days: String(course.days ?? ""),
                badge: course.badge || "",
            });

            setImagePreview(
                course.image_url || course.image || ""
            );

            let points = course.key_points ?? course.keyPoints ?? [];

            if (typeof points === "string") {

                try {
                    points = JSON.parse(points);
                } catch {
                    points = [];
                }

            }

            if (Array.isArray(points) && points.length > 0) {

                setKeyPoints(
                    points.map((point: any) => ({
                        title:
                            typeof point === "string"
                                ? point
                                : point.title || "",
                    }))
                );

            } else {

                setKeyPoints([
                    {
                        title: "",
                    },
                ]);

            }

            let modules = course.curriculum_points ?? [];

            if (typeof modules === "string") {

                try {
                    modules = JSON.parse(modules);
                } catch {
                    modules = [];
                }

            }

            console.log("Course Curriculum:", modules);

            if (Array.isArray(modules) && modules.length > 0) {

                setCurriculum(
                    modules.map((item: any) => ({
                        title: item.title || "",
                        desc: item.desc || "",

                        points:
                            Array.isArray(item.points) &&
                                item.points.length > 0
                                ? item.points.map((point: any) =>
                                    typeof point === "string"
                                        ? point
                                        : point.title || ""
                                )
                                : [""],
                    }))
                );

            } else {

                setCurriculum([
                    {
                        title: "",
                        desc: "",
                        points: [""],
                    },
                ]);

            }

        } catch (error: any) {

            console.error("Fetch course error:", error);

            Toast.fire({
                icon: "error",
                title: error.message || "Unable to load course.",
            });

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        if (slug) {
            fetchCourse();
        }

    }, [slug]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    const handleDescriptionChange = (value: string) => {

        setFormData((prev) => ({
            ...prev,
            desc: value,
        }));

    };

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {

            Toast.fire({
                icon: "error",
                title: "Please select a valid image.",
            });

            e.target.value = "";
            return;
        }

        setImage(file);

        setImagePreview(URL.createObjectURL(file));

    };

    const addKeyPoint = () => {

        setKeyPoints((prev) => [
            ...prev,
            {
                title: "",
            },
        ]);

    };

    const updateKeyPoint = (
        index: number,
        value: string
    ) => {

        setKeyPoints((prev) =>
            prev.map((point, i) =>
                i === index
                    ? {
                        ...point,
                        title: value,
                    }
                    : point
            )
        );

    };

    const removeKeyPoint = (index: number) => {

        if (keyPoints.length === 1) return;

        setKeyPoints((prev) =>
            prev.filter((_, i) => i !== index)
        );

    };

    const addCurriculum = () => {

        setCurriculum((prev) => [
            ...prev,
            {
                title: "",
                desc: "",
                points: [""],
            },
        ]);

    };

    const removeCurriculum = (index: number) => {

        if (curriculum.length === 1) return;

        setCurriculum((prev) =>
            prev.filter((_, i) => i !== index)
        );

    };

    const updateCurriculum = (
        index: number,
        field: "title" | "desc",
        value: string
    ) => {

        setCurriculum((prev) =>
            prev.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        [field]: value,
                    }
                    : item
            )
        );

    };

    const addCurriculumPoint = (index: number) => {

        setCurriculum((prev) =>
            prev.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        points: [...item.points, ""],
                    }
                    : item
            )
        );

    };

    const updateCurriculumPoint = (
        moduleIndex: number,
        pointIndex: number,
        value: string
    ) => {

        setCurriculum((prev) =>
            prev.map((item, i) =>
                i === moduleIndex
                    ? {
                        ...item,
                        points: item.points.map((point, j) =>
                            j === pointIndex ? value : point
                        ),
                    }
                    : item
            )
        );

    };

    const removeCurriculumPoint = (
        moduleIndex: number,
        pointIndex: number
    ) => {

        setCurriculum((prev) =>
            prev.map((item, i) =>
                i === moduleIndex && item.points.length > 1
                    ? {
                        ...item,
                        points: item.points.filter(
                            (_, j) => j !== pointIndex
                        ),
                    }
                    : item
            )
        );

    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (!formData.title.trim()) {

            Toast.fire({
                icon: "warning",
                title: "Please enter course title.",
            });

            return;
        }

        if (!stripHtml(formData.desc)) {

            Toast.fire({
                icon: "warning",
                title: "Please enter course description.",
            });

            return;
        }

        if (!formData.months || Number(formData.months) <= 0) {

            Toast.fire({
                icon: "warning",
                title: "Please enter valid duration.",
            });

            return;
        }

        if (!formData.days || Number(formData.days) <= 0) {

            Toast.fire({
                icon: "warning",
                title: "Please enter valid training days.",
            });

            return;
        }

        const validKeyPoints = keyPoints.filter(
            (point) => point.title.trim()
        );

        if (validKeyPoints.length === 0) {

            Toast.fire({
                icon: "warning",
                title: "Please add at least one key point.",
            });

            return;
        }

        const validCurriculum = curriculum
            .map((item) => ({
                title: item.title.trim(),

                desc: item.desc,

                points: item.points.filter(
                    (point) => point.trim()
                ),
            }))
            .filter(
                (item) =>
                    item.title &&
                    stripHtml(item.desc) &&
                    item.points.length > 0
            );

        if (validCurriculum.length === 0) {

            Toast.fire({
                icon: "warning",
                title: "Please add at least one valid curriculum module.",
            });

            return;
        }

        try {

            setSaving(true);

            const data = new FormData();

            data.append(
                "title",
                formData.title.trim()
            );
            data.append(
                "desc",
                formData.desc
            );

            data.append(
                "months",
                formData.months
            );

            data.append(
                "days",
                formData.days
            );

            data.append(
                "badge",
                formData.badge.trim()
            );
            if (image) {
                data.append("image", image);
            }

            data.append(
                "keyPoints",
                JSON.stringify(validKeyPoints)
            );

            data.append(
                "curriculum",
                JSON.stringify(validCurriculum)
            );

            console.log("Updating course:", {
                courseId,
                title: formData.title,
                description: formData.desc,
                keyPoints: validKeyPoints,
                curriculum: validCurriculum,
            });

            const apiResult = await courseService.updateCourse(
                courseId,
                data
            );

            const response = parseResponse(apiResult);

            const finalResponse =
                response?.success === undefined &&
                    response?.data?.success !== undefined
                    ? response.data
                    : response;

            if (
                finalResponse?.success === true ||
                finalResponse?.success === "true"
            ) {

                await Toast.fire({
                    icon: "success",
                    title:
                        finalResponse.message ||
                        "Course updated successfully!",
                });

                router.push("/admin/courses");

            } else {

                Toast.fire({
                    icon: "error",
                    title:
                        finalResponse?.message ||
                        "Unable to update course.",
                });

            }

        } catch (error: any) {

            console.error("Update course error:", error);

            Toast.fire({
                icon: "error",
                title:
                    error.response?.data?.message ||
                    error.message ||
                    "Something went wrong while updating the course.",
            });

        } finally {

            setSaving(false);

        }

    };

    if (loading) {

        return (
            <section className="edit-courses">

                <div className="edit-course-loading">

                    <div className="spinner-border"></div>

                    <p>Loading course details...</p>

                </div>

            </section>
        );

    }

    return (

        <section className="edit-courses">
            <div className="edit-course-container">
                <div className="edit-course-header">
                    
                    <button
                        type="button"
                        className="edit-back-btn"
                        onClick={() =>
                            router.push("/admin/courses")
                        }
                    >
                        <i className="bi bi-arrow-left"></i>
                        Back to Courses
                    </button>
                </div>

                <form
                    className="edit-course-form"
                    onSubmit={handleSubmit}
                >
                    <div className="edit-form-card">

                        <div className="edit-card-heading">

                            <div className="edit-heading-icon">
                                <i className="bi bi-journal-bookmark"></i>
                            </div>

                            <div>
                                <h3>Basic Information</h3>
                                <p>
                                    Manage the main information of your course.
                                </p>
                            </div>

                        </div>

                        <div className="row g-4">
                            <div className="col-lg-6 col-12">
                                <label className="edit-form-label">
                                    Course Title <span>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    className="edit-form-control"
                                    placeholder="Enter course title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-lg-6 col-12">
                                <label className="edit-form-label">
                                    Course Badge
                                </label>
                                <input
                                    type="text"
                                    name="badge"
                                    className="edit-form-control"
                                    placeholder="Example: Popular Course"
                                    value={formData.badge}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12">
                                <label className="edit-form-label">
                                    Course Description <span>*</span>
                                </label>
                                <div className="edit-jodit-editor">
                                    <JoditEditor
                                        value={formData.desc}
                                        config={{
                                            ...joditConfig,
                                            height: 150,
                                            minHeight: 150,
                                            readonly: false,
                                            placeholder: "Write your detailed course description here...",
                                            askBeforePasteHTML: false,
                                            askBeforePasteFromWord: false,
                                            defaultActionOnPaste: "insert_as_html",
                                        }}
                                        onChange={(newContent: string) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                desc: newContent,
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6 col-12">
                                <label className="edit-form-label">
                                    Duration (Months) <span>*</span>
                                </label>
                                <input
                                    type="number"
                                    name="months"
                                    className="edit-form-control"
                                    min="1"
                                    placeholder="Enter duration"
                                    value={formData.months}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-lg-6 col-12">

                                <label className="edit-form-label">
                                    Training Days <span>*</span>
                                </label>

                                <input
                                    type="number"
                                    name="days"
                                    className="edit-form-control"
                                    min="1"
                                    placeholder="Enter training days"
                                    value={formData.days}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>

                    </div>
                    <div className="edit-form-card">

                        <div className="edit-card-heading">

                            <div className="edit-heading-icon">
                                <i className="bi bi-image"></i>
                            </div>

                            <div>
                                <h3>Course Image</h3>
                                <p>
                                    Change the existing course image.
                                </p>
                            </div>

                        </div>

                        <div className="edit-image-section">

                            <div className="edit-image-preview">

                                {imagePreview ? (

                                    <img
                                        src={imagePreview}
                                        alt="Course preview"
                                    />

                                ) : (
                                    <div className="edit-image-placeholder">
                                        <i className="bi bi-image"></i>
                                        <span>No image available</span>
                                    </div>
                                )}
                            </div>
                            <div className="edit-image-upload">
                                <label
                                    htmlFor="courseImage"
                                    className="edit-upload-btn"
                                >
                                    <i className="bi bi-cloud-arrow-up"></i>
                                    Choose New Image
                                </label>
                                <input
                                    type="file"
                                    id="courseImage"
                                    accept="image/*"
                                    hidden
                                    onChange={handleImageChange}
                                />
                                <p>
                                    Upload a new image only if you want
                                    to replace the existing one.
                                </p>
                                {image && (
                                    <div className="edit-selected-file">
                                        <i className="bi bi-check-circle-fill"></i>
                                        {image.name}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="edit-form-card">
                        <div className="edit-card-heading edit-heading-between">
                            <div className="edit-heading-left">
                                <div className="edit-heading-icon">
                                    <i className="bi bi-list-check"></i>
                                </div>
                                <div>
                                    <h3>Course Key Points</h3>
                                    <p>
                                        Manage the main learning benefits.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="edit-add-btn"
                                onClick={addKeyPoint}
                            >
                                <i className="bi bi-plus-lg"></i>
                                Add Point
                            </button>
                        </div>
                        <div className="edit-dynamic-list">
                            {keyPoints.map((point, index) => (
                                <div
                                    className="edit-dynamic-row"
                                    key={index}
                                >
                                    <div className="edit-row-number">
                                        {String(index + 1).padStart(2, "0")}
                                    </div>
                                    <input
                                        type="text"
                                        className="edit-form-control"
                                        placeholder="Enter key point"
                                        value={point.title}
                                        onChange={(e) =>
                                            updateKeyPoint(
                                                index,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="edit-remove-btn"
                                        onClick={() =>
                                            removeKeyPoint(index)
                                        }
                                        title="Remove point"
                                    >
                                        <i className="bi bi-trash3"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="edit-form-card">
                        <div className="edit-card-heading edit-heading-between">
                            <div className="edit-heading-left">
                                <div className="edit-heading-icon">
                                    <i className="bi bi-journals"></i>
                                </div>
                                <div>
                                    <h3>Course Curriculum</h3>
                                    <p>
                                        Organize the modules and topics.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="edit-add-btn"
                                onClick={addCurriculum}
                            >
                                <i className="bi bi-plus-lg"></i>
                                Add Module
                            </button>

                        </div>

                        {curriculum.map((item, index) => (

                            <div
                                className="edit-curriculum-card"
                                key={index}
                            >

                                <div className="edit-module-header">

                                    <div className="edit-module-number">
                                        MODULE {String(index + 1).padStart(2, "0")}
                                    </div>

                                    <button
                                        type="button"
                                        className="edit-remove-btn"
                                        onClick={() =>
                                            removeCurriculum(index)
                                        }
                                        title="Remove module"
                                    >
                                        <i className="bi bi-trash3"></i>
                                    </button>

                                </div>

                                <div className="row g-3">
                                    <div className="col-12">

                                        <label className="edit-form-label">
                                            Module Title
                                        </label>

                                        <input
                                            type="text"
                                            className="edit-form-control"
                                            placeholder="Enter module title"
                                            value={item.title}
                                            onChange={(e) =>
                                                updateCurriculum(
                                                    index,
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>
                                    <div className="col-12">

                                        <label className="edit-form-label">
                                            Module Description
                                        </label>

                                        <div className="edit-jodit-editor">

                                            <JoditEditor
                                                value={item.desc}
                                                config={{
                                                    ...joditConfig,
                                                    height: 180,
                                                    placeholder:
                                                        "Describe this curriculum module...",
                                                }}
                                                onBlur={(value) =>
                                                    updateCurriculum(
                                                        index,
                                                        "desc",
                                                        value
                                                    )
                                                }
                                            />

                                        </div>

                                    </div>

                                    <div className="col-12">

                                        <div className="edit-topic-heading">

                                            <label className="edit-form-label">
                                                Module Topics
                                            </label>

                                            <button
                                                type="button"
                                                className="edit-add-topic-btn"
                                                onClick={() =>
                                                    addCurriculumPoint(index)
                                                }
                                            >
                                                <i className="bi bi-plus-lg"></i>
                                                Add Topic
                                            </button>

                                        </div>

                                        {item.points.map(
                                            (point, pointIndex) => (

                                                <div
                                                    className="edit-dynamic-row edit-topic-row"
                                                    key={pointIndex}
                                                >

                                                    <i className="bi bi-check-circle edit-topic-icon"></i>

                                                    <input
                                                        type="text"
                                                        className="edit-form-control"
                                                        placeholder="Enter topic"
                                                        value={point}
                                                        onChange={(e) =>
                                                            updateCurriculumPoint(
                                                                index,
                                                                pointIndex,
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                    <button
                                                        type="button"
                                                        className="edit-remove-btn"
                                                        onClick={() =>
                                                            removeCurriculumPoint(
                                                                index,
                                                                pointIndex
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-x-lg"></i>
                                                    </button>

                                                </div>

                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="edit-form-actions">

                        <button
                            type="button"
                            className="edit-cancel-btn"
                            onClick={() =>
                                router.push("/admin/courses")
                            }
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="edit-submit-btn"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <span className="spinner-border spinner-border-sm"></span>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check2-circle"></i>
                                    Update Course
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>

    );

}