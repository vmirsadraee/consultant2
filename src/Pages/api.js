import axios from "axios";

// آدرس پایه شما
export const API_URL = "https://consultant2-b.vercel.app";

const api = axios.create({
  baseURL: API_URL
});

export default api;
