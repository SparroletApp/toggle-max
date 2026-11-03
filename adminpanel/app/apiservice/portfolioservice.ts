import apiService from "./apiservice";

const portfolioService = {

    getAll: async () => {
        return await apiService.get("/admin/portfolio");
    },

    getById: async (id: number) => {
        return await apiService.get(`/admin/portfolio/${id}`);
    },

    create: async (data: FormData) => {
        return await apiService.post("/admin/portfolio", data);
    },

    update: async (id: number, data: FormData) => {
        return await apiService.post(`/admin/portfolio/${id}`, data);
    },

    delete: async (id: number) => {
        return await apiService.post(`/admin/portfolio/${id}/delete`, {});
    }

};

export default portfolioService;