import apiService from "./apiservice";

const COURSE_API = "/courses";
const ADMIN_COURSE_API = "/admin/courses";

const courseService = {

    getAllCourses: async () => {
        return await apiService.get(COURSE_API);
    },

    getCourseById: async (id: number | string) => {
        return await apiService.get(`${COURSE_API}/${id}`);
    },

    addCourse: async (formData: FormData) => {
        return await apiService.post(
            ADMIN_COURSE_API,
            formData
        );
    },

    updateCourse: async (
        id: number | string,
        formData: FormData
    ) => {
        return await apiService.post(
            `${ADMIN_COURSE_API}/${id}`,
            formData
        );
    },

    deleteCourse: async (id: number | string) => {
        return await apiService.post(
            `${ADMIN_COURSE_API}/${id}/delete`
        );
    },

};

export default courseService;
