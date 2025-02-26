
import axios from "axios";
import { store } from "../Redux/store";
import { logout } from "../Redux/auth";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1", 
  withCredentials: true, 
});
//not understood properly
api.interceptors.response.use(
  (response) => {
    // console.log('Request Headers:', response.headers);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
        //401 error so refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as retried

      try {
        await axios.post(
          `${originalRequest.baseURL}/users/refresh-token`,
          {}, 
          {
            withCredentials: true, 
          }
        );

        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;