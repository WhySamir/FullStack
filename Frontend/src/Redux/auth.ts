import { createSlice,PayloadAction } from "@reduxjs/toolkit";
interface User {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    coverImage: string;
    createdAt: string;
    updatedAt: string;
    watchHistory: [];
  }
interface AuthState {
    isAuthenticated: boolean;
    authUser: User | null;
  }

  const initialState: AuthState = {
    isAuthenticated: false,
    authUser: null,
  };
  interface RootState {
    auth: AuthState;
  }
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
        state.authUser = action.payload;
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
  });
  export const { login, logout,setUser,register } = authSlice.actions;
  export default authSlice.reducer;
  export type { RootState };