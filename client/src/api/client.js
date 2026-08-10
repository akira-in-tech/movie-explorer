import axios from "axios";

// Centralized axios instance: one place to change the API origin, and
// withCredentials so the httpOnly auth cookie is sent on every request.
// Defaults to a relative baseURL so requests hit "/api/..." — in dev this
// is forwarded to the backend by the Vite proxy (see vite.config.js), and
// in production it assumes the API is served from the same origin unless
// VITE_API_URL is set.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  withCredentials: true,
});

export default api;
