
import axios, { AxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Accept: "application/json",
    },
});

api.interceptors.request.use(
    (config) => {

        if (typeof window !== "undefined") {

            const token = sessionStorage.getItem("access_token");

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

        }

        if (config.data instanceof FormData) {

            config.headers.delete?.("Content-Type");

            if (config.headers && !config.headers.delete) {
                delete config.headers["Content-Type"];
            }

        } else if (config.data && !(config.data instanceof FormData)) {

            config.headers.set?.(
                "Content-Type",
                "application/json"
            );

        }

        return config;

    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,
    (error) => {

        if (error.response?.status === 401) {

            if (typeof window !== "undefined") {

                sessionStorage.removeItem("access_token");
                sessionStorage.removeItem("user");

            }

        }

        return Promise.reject(error);

    }
);

const apiService = {

    get: async (
        url: string,
        config?: AxiosRequestConfig
    ) => {

        const response = await api.get(url, config);

        return response.data;

    },

    post: async (
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ) => {

        const response = await api.post(url, data, config);

        return response.data;

    },

    put: async (
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ) => {

        const response = await api.put(url, data, config);

        return response.data;

    },

    delete: async (
        url: string,
        config?: AxiosRequestConfig
    ) => {

        const response = await api.delete(url, config);

        return response.data;

    },

};

export default apiService;
