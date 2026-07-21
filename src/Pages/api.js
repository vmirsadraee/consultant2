import axios from "axios";

export const API_URL = "https://consultant2-b.vercel.app";

export const api = axios.create({
  baseURL: API_URL,
});

// فقط آدرس دانلود
export const DOWNLOAD_URL =  "https://consultant2-b.vercel.app/download-excel";

export default api;