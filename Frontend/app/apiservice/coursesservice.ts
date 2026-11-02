import api from "./apiservice";

export interface CourseKeyPoint {
    title: string;
    name: string;
    description: string;
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
    curriculum_points: string[] | null;
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
    curriculum_points?: string[];
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}   

export const getCourses = async (): Promise<Course[]> => {
    const response = await api.get<ApiResponse<Course[]>>(
        "/courses"
    );

    return response.data.data;
};

export const getCourseById = async (
    id: number | string
): Promise<Course> => {
    const response = await api.get<ApiResponse<Course>>(
        `/courses/${id}`
    );

    return response.data.data;
};
