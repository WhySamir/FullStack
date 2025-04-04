import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";

import Navbar from "./Components/Stdio/Navbar";
import Sidebar from "./Components/Stdio/Sidebar";
import LoadingSpinner from "./Components/Common/LoadingSpinner";
import { setUser } from "./Redux/auth";
import api from "./Api/axios";
import { useDispatch } from "react-redux";

// Lazy load route components
const Dashboard = lazy(() => import("./Components/Stdio/pages/Dashboard"));
const Content = lazy(() => import("./Components/Stdio/pages/Content"));
const Analytics = lazy(() => import("./Components/Stdio/pages/Analytics"));
const Community = lazy(() => import("./Components/Stdio/pages/Community"));
const NotFound = lazy(() => import("./Components/Stdio/pages/NotFound"));

const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="relative mt-[8vh] flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto  ">
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

const Stdio: React.FC = () => {
  const dispatch = useDispatch();

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
  }, [dispatch]);
  return (
    <Routes>
      <Route path="/channel" element={<AppLayout />}>
        <Route
          index
          element={<Navigate to="/stdio/channel/dashboard" replace />}
        />
        {/* using / global routing */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="content" element={<Content />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="community" element={<Community />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default Stdio;
