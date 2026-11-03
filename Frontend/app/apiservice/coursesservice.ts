import api from "./apiservice";

export interface CourseKeyPoint {
    title: string;
    name?: string;
    description?: string;
}

export interface CourseCurriculumPoint {
    title: string;
    desc: string;
    points: string[];
}

export interface Course {
    id: number;
    title: string;
    description: string | null;
    key_points: CourseKeyPoint[] | null;
    months: number | null;
    days: number | null;
    image: string | null;
    image_url: string | null;
    badge: string | null;
    curriculum_title: string | null;
    curriculum_description: string | null;
    curriculum_points: CourseCurriculumPoint[] | null;
    created_at?: string;
    updated_at?: string;
}

export interface CoursePayload {
    title: string;
    description?: string | null;
    key_points?: CourseKeyPoint[];
    months?: number | null;
    days?: number | null;
    image?: File | null;
    badge?: string | null;
    curriculum_title?: string | null;
    curriculum_description?: string | null;
    curriculum_points?: CourseCurriculumPoint[];
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

const parseResponse = <T,>(response: any): ApiResponse<T> => {
    let result = response;
    if (typeof result === "string") {
        result = result
            .replace(/^```(?:php|json)?\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        result = JSON.parse(result);
    }

    return result;
};

export const getCourses = async (): Promise<Course[]> => {
    const response = await api.get("/courses");

    console.log("Courses API response:", response.data);

    const result = parseResponse<Course[]>(response.data);

    if (result?.success && Array.isArray(result.data)) {
        return result.data;
    }

    return [];
};

export const getCourseById = async (
    id: number | string
): Promise<Course> => {
    const response = await api.get(`/courses/${id}`);

    const result = parseResponse<Course>(response.data);

    if (result?.success && result.data) {
        return result.data;
    }

    throw new Error(result?.message || "Unable to fetch course.");
};