import axios from "axios"
import { getCookieToken } from "./auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Authorization': `Bearer ${getCookieToken()}` }
});

export default api