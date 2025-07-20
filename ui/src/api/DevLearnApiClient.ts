import { ApiClient } from "./client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const apiClient = new ApiClient(API_BASE_URL);
