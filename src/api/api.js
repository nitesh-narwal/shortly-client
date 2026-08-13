import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Attach the JWT automatically so call sites don't each repeat
// `Authorization: Bearer ${token}` - just call api.get/post/etc directly.
api.interceptors.request.use((config) => {
    const raw = localStorage.getItem("JWT_TOKEN");
    if (raw) {
        try {
            const token = JSON.parse(raw);
            if (token) {
                config.headers = config.headers || {};
                if (!config.headers.Authorization) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch {
            // malformed value in storage - ignore, request goes out unauthenticated
        }
    }
    return config;
});

// The backend's GlobalExceptionHandler returns a consistent
// { timestamp, status, error, message, path, fieldErrors } shape for most failures,
// and a distinct { message, passwordRequired: true } shape for locked short links.
// Normalize both into predictable fields every catch block can read without
// re-deriving `error.response?.data?.message` everywhere.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const data = error.response?.data;
        error.friendlyMessage =
            (typeof data === "string" ? data : data?.message) ||
            error.message ||
            "Something went wrong. Please try again.";
        error.passwordRequired = Boolean(data?.passwordRequired);
        error.fieldErrors = data?.fieldErrors || null;
        return Promise.reject(error);
    }
);

export default api;
