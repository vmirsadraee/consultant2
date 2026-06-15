import axios from "axios";

export const BASE_URL = "https://consultant2-b.vercel.app/";

const api = axios.create({
  baseURL: BASE_URL
});

export default api;

//  http://localhost:5000  https://consultant2-peach.vercel.app/tablea1403/befor