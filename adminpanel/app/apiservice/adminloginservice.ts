import apiService from "./apiservice";

const adminLoginService = {

    login: async (data: {
        email: string;
        password: string;
    }) => {
        return await apiService.post("/login", data);
    },

    logout: async () => {
        try {
            return await apiService.post("/admin/logout");
        } finally {
            sessionStorage.removeItem("access_token");
            sessionStorage.removeItem("user");
        }
    },
    getAdmin: async () => {
        return await apiService.get("/admin/profile");
    },

};

export default adminLoginService;