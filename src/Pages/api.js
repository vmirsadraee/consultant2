import axios from "axios";

// آدرس پایه شما
export const API_URL = "https://consultant2-b.vercel.app";

const api = axios.create({
  baseURL: API_URL
});

export default api;
// آدرس پایه شما
export const API_URL2 = "https://consultant2-b.vercel.app/download-excel";

const api2 = axios.create({
  baseURL: API_URL2
});

export default api2;
