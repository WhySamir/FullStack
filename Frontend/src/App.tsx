import { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { darkTheme, lightTheme } from "./Theme.ts";
import "./index.css";

import { setUser } from "./Redux/auth.ts";
import { RootState } from "./Redux/store.ts";

import Header from "./Components/Header.tsx";
import Maingrid from "./Components/Maingrid.tsx";
import Sidebar from "./Components/Sidebar.tsx";
import Signin from "./Components/User/Signin.tsx";
import Signup from "./Components/User/Signup.tsx";
import api from "./Api/axios.ts";
import WatchVideo from "./Components/WatchVideo.tsx";

function App() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const sessionResponse = await api.get("/users/check-session");
        if (sessionResponse.data.isAuthenticated) {
          dispatch(setUser(sessionResponse.data.user));
        }
      } catch (error: any) {
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
          <Sidebar isCollapsed={isCollapsed} />
          <div className="w-full px-4 mt-3  ">
            <Routes>
              <Route
                path="/"
                element={<Maingrid isCollapsed={isCollapsed} />}
              />

              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/watch/:vidId" element={<WatchVideo />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
