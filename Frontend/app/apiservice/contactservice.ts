import apiService from "./apiservice";

export interface ContactItem {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    created_at: string;
    updated_at: string;
}

export interface ContactFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

const contactService = {

    create: async (data: ContactFormData) => {
        const response = await apiService.post("/contact", data);
        return response.data;
    },

    getAll: async () => {
        const response = await apiService.post("/admin/contacts/all");
        return response.data;
    },

    getById: async (id: number) => {
        const response = await apiService.post("/admin/contacts/view", {
            id,
        });
        return response.data;
    },
    delete: async (id: number) => {
        const response = await apiService.post(
            `/admin/contacts/${id}/delete`
        );
        return response.data;
    },
};

export default contactService;