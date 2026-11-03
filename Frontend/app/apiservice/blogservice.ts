import apiService from "./apiservice";

export interface BlogItem {
    id: number;
    badge_title: string | null;
    title: string;
    desc: string | null;
    main_image: string | null;
    images: string[] | null;
    questions_answers: {
        question: string;
        answer: string;
    }[] | null;
    created_at?: string;
    updated_at?: string;
    main_image_url?: string | null;
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

const blogService = {
    getAllBlogs: async (): Promise<BlogItem[]> => {
        const response = await apiService.get("/blogs");

        const result = parseResponse<BlogItem[]>(response.data);

        if (result?.success && Array.isArray(result.data)) {
            return result.data;
        }

        throw new Error(result?.message || "Unable to fetch blogs.");
    },

    getBlogById: async (id: number | string): Promise<BlogItem> => {
        const response = await apiService.get(`/blogs/${id}`);

        const result = parseResponse<BlogItem>(response.data);

        if (result?.success && result.data) {
            return result.data;
        }

        throw new Error(result?.message || "Unable to fetch blog.");
    },
};

export default blogService;