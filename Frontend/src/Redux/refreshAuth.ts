import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api/axios";
import { store } from "./store";
import { logout } from "./auth";
import { AxiosError } from "axios";

export const refreshAuth = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/refresh-token", {}, { withCredentials: true });
      return {
        user: response.data.user || null,
        isAuthenticated: true,
      };
    } catch (error:unknown) {
          const axiosError = error as AxiosError;
        store.dispatch(logout());
      return rejectWithValue(axiosError.response?.data || axiosError.message);
    }
  }
);
