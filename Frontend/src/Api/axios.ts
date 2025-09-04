
import axios from "axios";
import { store } from "../Redux/store";
import { refreshAuth } from "../Redux/refreshAuth";
// import { store } from "../Redux/store";
// import { logout } from "../Redux/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      try {
        await store.dispatch(refreshAuth());
        return api(error.config); // retry original request
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);


  export default api;