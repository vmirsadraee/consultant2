import axios from "axios";

export const API_URL = "https://consultant2-b.vercel.app";

export const api = axios.create({
  baseURL: API_URL
});

export const API_URL2 = "https://consultant2-b.vercel.app/download-excel";

export const api2 = axios.create({
  baseURL: API_URL2
});

export default api;
