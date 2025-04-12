import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { darkTheme, lightTheme } from "./Theme.ts";
import "./index.css";

import { verifyAuth } from "./Redux/auth.ts";
import { AppDispatch, RootState } from "./Redux/store.ts";

import Header from "./Components/Navbar.tsx";
import Maingrid from "./Components/LandingVidoes.tsx";
import Sidebar from "./Components/Sidebar.tsx";
import Signin from "./Components/User/Signin.tsx";
import Signup from "./Components/User/Signup.tsx";
import WatchVideo from "./Components/WatchVideo.tsx";
import ChannelProfile from "./Components/ChannelProfile.tsx";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  useEffect(() => {
    dispatch(verifyAuth());
  }, [dispatch, isAuthenticated]);

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
