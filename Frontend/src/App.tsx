import { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { darkTheme, lightTheme } from "./Theme.ts";
import { fetchCurrentUser, refreshAccessToken } from "./Api/authApi.ts";
import "./index.css";
//use skeleton instead of spinner and uselayout effect interceptors use axios than fetch
// import { useDispatch } from "react-redux";
//styled-components in some other project
import { setUser, login } from "./Redux/auth.ts";
import { setTheme, RootState2 } from "./Redux/darkmode.ts";

import Header from "./Components/Header.tsx";
import Maingrid from "./Components/Maingrid.tsx";
import Sidebar2 from "./Components/Sidebar2.tsx";
import Signin from "./Components/Signin.tsx";
import Signup from "./Components/Signup.tsx";
import { RootState } from "./Redux/auth.ts";
import api from "./Api/axios.ts";
function App() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state: RootState2) => state.theme);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Step 1: Check if the user has a valid session
        const sessionResponse = await api.get("/users/check-session");
        if (!sessionResponse.data.isAuthenticated) {
          return; // No valid session, skip fetching user data
        }

        // Step 2: Update Redux store with user data
        dispatch(setUser(sessionResponse.data.user));
      } catch (error: any) {
        // Handle errors silently if not logged in
        if (error.response?.status !== 401) {
          console.error("Auth check failed:", error);
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, dispatch]);
  useEffect(() => {
    const theme = darkMode ? darkTheme : lightTheme;
    for (const [key, value] of Object.entries(theme)) {
      document.body.style[key as keyof typeof theme] = value;
    }
  }, [darkMode]);

  // dispatch(setTheme());
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <div className="flex flex-col px-1 sm:pr-4 md:pr-8 w-full h-[100vh]">
        <Header toggleSidebar={toggleSidebar} />

        <div className="relative flex   gap-0.5">
          <Sidebar2 isCollapsed={isCollapsed} />
          <div className="relative    w-full px-4 mt-3  ">
            <Routes>
              <Route
                path="/"
                element={<Maingrid isCollapsed={isCollapsed} />}
              />

              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
