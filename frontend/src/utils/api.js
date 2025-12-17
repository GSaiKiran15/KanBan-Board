import axios from "axios";

// Configure axios to use the backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export default apiClient;
