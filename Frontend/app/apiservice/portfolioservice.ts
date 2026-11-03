import apiService from "./apiservice";

const portfolioService = {

    getAll: async () => {
        return await apiService.get("/portfolio");
    },

    getById: async (id: number) => {
        return await apiService.get(`/portfolio/${id}`);
    },

};

export default portfolioService;