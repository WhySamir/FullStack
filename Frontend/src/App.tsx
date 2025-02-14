import { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
// import { useNavigate } from "react-router-dom";

import { fetchCurrentUser, refreshAccessToken } from "./Api/authApi.ts";
import "./index.css";
//use skeleton instead of spinner and uselayout effect interceptors use axios than fetch
// import { useDispatch } from "react-redux";
import { setUser } from "./Redux/auth.ts";

import Header from "./Components/Header.tsx";
import Maingrid from "./Components/Maingrid.tsx";
import Sidebar2 from "./Components/Sidebar2.tsx";
import Signin from "./Components/Signin.tsx";
import Signup from "./Components/Signup.tsx";
import { useDispatch } from "react-redux";

function App() {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  // const [isAuthChecked, setIsAuthChecked] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        let userData = await fetchCurrentUser();
        if (!userData) {
          await refreshAccessToken();
          userData = await fetchCurrentUser();
        }
        if (userData) {
          console.log(userData.data);
          dispatch(setUser(userData.data));
          // navigate("/");
        }
      } catch (error: unknown) {}
    };
    checkAuth();
  }, []);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <div className="flex flex-col px-1 sm:pr-4 md:pr-8 w-full h-full">
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
