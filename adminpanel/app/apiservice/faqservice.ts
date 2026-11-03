import apiService from "./apiservice";

const faqService = {

    getAllFaqs: async () => {
        return await apiService.get("admin/faqs");
    },

    getFaqById: async (id: number) => {
        return await apiService.get(`admin/faqs/${id}`);
    },

    createFaq: async (data: {
        question: string;
        answer: string;
    }) => {
        return await apiService.post("/admin/faqs", data);
    },

    updateFaq: async (
        id: number,
        data: {
            question: string;
            answer: string;
        }
    ) => {
        return await apiService.post(`/admin/faqs/${id}`, data);
    },

    deleteFaq: async (id: number) => {
        return await apiService.post(`/admin/faqs/${id}/delete`);
    },

};

export default faqService;