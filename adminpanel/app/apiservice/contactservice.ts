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

    // CREATE CONTACT ENQUIRY
    create: async (data: ContactFormData) => {

        const response = await apiService.post("/contact", data);

        return response.data;

    },

    // GET ALL CONTACT ENQUIRIES
    getAll: async () => {

        const response = await apiService.post("/admin/contacts/all", {});

        console.log("GET ALL CONTACT AXIOS RESPONSE:", response);

        // If API service already returns a string
        if (typeof response === "string") {
            return response;
        }

        return response.data;

    },

    // GET CONTACT BY ID
    getById: async (id: number) => {

        const response = await apiService.post(
            "/admin/contacts/view",
            { id }
        );

        return response.data;

    },

    delete: async (id: number) => {

        const response = await apiService.post(
            `/admin/contacts/${id}/delete`,
            {}
        );
        console.log("DELETE CONTACT RESPONSE:", response);

        return typeof response === "string"
            ? response
            : response.data;

    },

};

export default contactService;