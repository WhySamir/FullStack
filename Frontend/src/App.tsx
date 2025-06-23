import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { darkTheme, lightTheme } from "./Theme.ts";
import "./index.css";

import { verifyAuth } from "./Redux/auth.ts";
import { AppDispatch, RootState } from "./Redux/store.ts";

import Header from "./Components/Navbar.tsx";
import Maingrid from "./Components/VideoComponents/LandingVidoes.tsx";
import Sidebar from "./Components/Sidebar.tsx";
import Signin from "./Components/User/Signin.tsx";
import Signup from "./Components/User/Signup.tsx";
import WatchVideo from "./Components/VideoComponents/WatchVideo.tsx";
import ChannelProfile from "./Components/ChannelProfile.tsx";
import UserSubscription from "./Components/UserSubscriptionVid.tsx";
import UserSubsribedChannels from "./Components/UserSubsribedChannels.tsx";
import RedLoader from "./Components/Stdio/Common/RedLoader.tsx";
import { PlaylistPageWrapper } from "./Components/LikedVideos.tsx";
import SearchedVideos from "./Components/SearchedVideos.tsx";
import ComingSoon from "./Components/ComingSoon.tsx";
import NotAUHome from "./Components/VideoComponents/NotAUHome.tsx";
import { ProtectedRoute } from "./ProtectedRoute.tsx";
import { PublicRoute } from "./PublicRoute.tsx";
import NotFound from "./NotFound.tsx";
function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const navigationCount = useSelector(
    (state: RootState) => state.navigation.navigationCount
  );

  useEffect(() => {
    dispatch(verifyAuth());
    setLoading(false);
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    const theme = darkMode ? darkTheme : lightTheme;
    for (const [key, value] of Object.entries(theme)) {
      document.body.style[key as keyof typeof theme] = value;
    }
  }, [darkMode]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <div className="flex flex-col  w-full h-full">
        {loading && <RedLoader />}
        <Header toggleSidebar={toggleSidebar} />

        <div className="relative  flex   sm:gap-0.5">
          <Sidebar isCollapsed={isCollapsed} />
          <div className="w-full sm:px-4 relative  lg:pt-[1rem] 2xl:pt-[4rem]">
            <Routes>
              <Route
                path="/"
                element={<Maingrid isCollapsed={isCollapsed} />}
              />
              <Route
                path="/home"
                element={<NotAUHome isCollapsed={isCollapsed} />}
              />

              <Route
                path="/search"
                element={<SearchedVideos isCollapsed={isCollapsed} />}
              />
              <Route
                path="/watch/:vidId"
                element={<WatchVideo key={navigationCount} />}
              />
              <Route
                path="/username/:username"
                element={
                  <ProtectedRoute>
                    <ChannelProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/signin"
                element={
                  <PublicRoute>
                    <Signin />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                }
              />
              <Route
                path="/userSubscriptions"
                element={
                  <ProtectedRoute>
                    <UserSubscription isCollapsed={isCollapsed} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/channels"
                element={
                  <ProtectedRoute>
                    <UserSubsribedChannels />
                  </ProtectedRoute>
                }
              />
              <Route path="/commingsoon" element={<ComingSoon />} />
              <Route
                path="/likedvideos"
                element={
                  <PublicRoute>
                    <PlaylistPageWrapper />
                  </PublicRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
