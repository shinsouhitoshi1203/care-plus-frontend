import env from "@/config/env";
import axios from "axios";

const apiClient = axios.create({
  baseURL: env.baseAPI,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
