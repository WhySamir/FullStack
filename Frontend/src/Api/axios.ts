
import axios from "axios";
// import { store } from "../Redux/store";
// import { logout } from "../Redux/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
});

  export default api;