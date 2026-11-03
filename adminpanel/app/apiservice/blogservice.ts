import apiService from "./apiservice";

const blogService = {

    getAllBlogs: async () => {
        return await apiService.get("/blogs");
    },

    getBlogById: async (id: number) => {
        return await apiService.get(`/blogs/${id}`);
    },

    createBlog: async (data: FormData) => {
        return await apiService.post("/admin/blogs", data);
    },

    updateBlog: async (id: number, data: FormData) => {
        data.set("id", id.toString());

        return await apiService.post(`/admin/blogs/${id}`, data);
    },

    deleteBlog: async (id: number) => {
        return await apiService.post(`/admin/blogs/${id}/delete`, {
            id,
        });
    },

};

export default blogService;