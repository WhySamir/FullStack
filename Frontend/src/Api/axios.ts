
import axios from "axios";
// import { store } from "../Redux/store";
// import { logout } from "../Redux/auth";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1", 
  withCredentials: true, 
});

  export default api;