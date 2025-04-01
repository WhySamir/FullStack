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
    watchHistory: any[];
    subscribersCount:number;
    __v: number;
  }
interface AuthState {
    isAuthenticated: boolean;
    authUser: User | null;
  }

  const initialState: AuthState = {
    isAuthenticated: false,
    authUser: null,
  };
 
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
          subscribersCount: action.payload.subscribersCount || 0
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
  });
  export const { login, logout,setUser,register } = authSlice.actions;
  export default authSlice.reducer;
  