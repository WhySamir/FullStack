import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { darkTheme, lightTheme } from "./Theme.ts";
import "./index.css";

import { setUser } from "./Redux/auth.ts";
import { RootState } from "./Redux/store.ts";

import Header from "./Components/Navbar.tsx";
import Maingrid from "./Components/LandingVidoes.tsx";
import Sidebar from "./Components/Sidebar.tsx";
import Signin from "./Components/User/Signin.tsx";
import Signup from "./Components/User/Signup.tsx";
import api from "./Api/axios.ts";
import WatchVideo from "./Components/WatchVideo.tsx";
import ChannelProfile from "./Components/ChannelProfile.tsx";

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
      <div className="flex flex-col  w-full h-full">
        <Header toggleSidebar={toggleSidebar} />

        <div className="relative  flex   sm:gap-0.5">
          <Sidebar isCollapsed={isCollapsed} />
          <div className="w-full sm:px-4 relative  lg:pt-[1rem] 2xl:pt-[4rem]">
            <Routes>
              <Route
                path="/"
                element={<Maingrid isCollapsed={isCollapsed} />}
              />

              <Route path="/watch/:vidId" element={<WatchVideo />} />
              <Route path="/username" element={<ChannelProfile />} />
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
