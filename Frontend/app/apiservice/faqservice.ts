import apiService from "./apiservice";

const faqService = {

    getAllFaqs: async () => {
        return await apiService.get("/faqs");
    },


};

export default faqService;