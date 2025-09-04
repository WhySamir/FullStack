import { createAsyncThunk, createSlice,PayloadAction } from "@reduxjs/toolkit";
import api from "../Api/axios";
import { refreshAuth } from "./refreshAuth";
interface User {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    coverImage: string;
    createdAt: string;
    updatedAt: string;
    subscribersCount:number;
    watchHistory: any[];
    __v: number;
  }
interface AuthState {
    isAuthenticated: boolean;
    authUser: User | null;
    isAuthChecked: boolean; // New property to track auth check status
  }

  const initialState: AuthState = {
    isAuthenticated: false,
    authUser: null,
    isAuthChecked: false,
  };
export const verifyAuth = createAsyncThunk(
  "auth/verify",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/check-session", {
        withCredentials: true,
      });
      console.log("Auth response:", response.data);
      return {
        user: response.data.user, 
        isAuthenticated: response.data.isAuthenticated
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      register(state, action:PayloadAction<User>) {
        state.isAuthenticated = true;
        state.authUser = action.payload;
      },
      login(state, action:PayloadAction<User>) {
        state.isAuthenticated = true;
        state.authUser ={
          ...action.payload,
        };
      },
      logout(state) {
        state.isAuthenticated = false;
        state.authUser = null;
      },
      setUser(state, action: PayloadAction<User>) {
        state.isAuthenticated = true;
        state.authUser = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(refreshAuth.pending, (state) => {
          state.isAuthChecked = false;
        })
        .addCase(refreshAuth.fulfilled, (state, action) => {
          state.isAuthenticated = action.payload.isAuthenticated; // Use server's flag
          state.authUser = action.payload.user; // Assign extracted user
          state.isAuthChecked = true;
        })
        .addCase(refreshAuth.rejected, (state) => {
          state.isAuthenticated = false;
          state.authUser = null;
          state.isAuthChecked = true;
        });
    },
  });
  export const { login, logout,setUser,register } = authSlice.actions;
  export default authSlice.reducer;
  