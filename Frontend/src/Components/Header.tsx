import { handleLogout } from "../Api/authApi.ts";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { logout, RootState } from "../Redux/auth.ts";

import { AlignJustify, Bell, Mic, Plus, Search, User } from "lucide-react";
import { RootState2 } from "../Redux/darkmode.ts";
import { darkTheme, lightTheme } from "../Theme.ts";

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
interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { isAuthenticated, authUser } = useSelector(
    (state: RootState) => state.auth
  );
  const { darkMode } = useSelector((state: RootState2) => state.theme);

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlelogout = async () => {
    await handleLogout();
    dispatch(logout());
    setIsOpen(false);
  };

  return (
    <>
      <nav>
        <div className="h-[8vh]  pl-6 w-full flex items-center justify-between  ">
          <div className="flex items-center justify-between gap-2 ">
            <button onClick={toggleSidebar} className="hidden sm:flex">
              <AlignJustify />
            </button>

            <div className="relative inline-block group sm:my-[18px] sm:mx-4">
              <div className="flex flex-shrink-0 items-center ">
                <img
                  src="./MIcon.svg"
                  alt="YouTube"
                  className="h-full w-full"
                />
              </div>

              <div
                className="absolute top-0 right-[-1.2rem]  text-[8px] sm:text-[.6em] opacity-80 px-1 rounded-sm"
                style={darkMode ? darkTheme : lightTheme}
              >
                NP
              </div>
            </div>
          </div>
          <div className="forinput text-md hidden sm:flex items-center gap-2 ">
            <div className="relative">
              <input
                type="text"
                className="bg-transparent w-[20vw] sm:w-[36vw]  sm:h-full border border-neutral-700 rounded-4xl mx-2 pl-4 pr-2 py-[0.6rem]   focus:outline-none focus:border-blue-700"
                placeholder={"Search"}
              />
              <span className="absolute inset-y-0 right-6 sm:right-8 flex items-center pl-2">
                <Search
                  className={`${darkMode ? "text-black" : "text-white"}`}
                  size={24}
                />
              </span>
            </div>

            <div
              className={`relative microphone w-8  h-8 items-center flex justify-center rounded-full   ${
                darkMode
                  ? "text-white border-0 bg-neutral-700"
                  : "text-black border-2"
              } `}
            >
              <Mic />
            </div>
          </div>
          {authUser !== null && isAuthenticated ? (
            <div
              className="relative user ml-1 flex justify-center gap-2 md:gap-4 items-center"
              style={darkMode ? darkTheme : lightTheme}
            >
              <div className="justify-center items-center  px-3 py-2 gap-[0.4px]  rounded-[2.5rem] hidden sm:flex bg-neutral-700 hover:bg-neutral-600">
                <Plus />
                <span className=" flex text-xs md:font-medium">Create</span>
              </div>
              <Bell />
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="md:ml-3 relative microphone  w-9 h-9 items-center hidden sm:flex justify-center rounded-full bg-neutral-700"
              >
                <img
                  className="rounded-full object-cover w-full h-full"
                  src={`${authUser?.avatar}`}
                  alt=""
                />
              </div>

              <div className="flex sm:hidden">
                {" "}
                <Search
                  className=" ml-1 "
                  style={darkMode ? darkTheme : lightTheme}
                  size={24}
                />
              </div>
              {isOpen && (
                <div
                  ref={menuRef}
                  className=" absolute right-[4vw]  top-0 w-64 bg-[#282828] shadow-lg rounded-lg p-4 z-50"
                  style={darkMode ? darkTheme : lightTheme}
                >
                  {" "}
                  <div className="flex space-x-2 items-start justify-start">
                    <div className=" relative  mt-1 w-12 h-12 items-center justify-center rounded-full ">
                      <img
                        className="rounded-full object-cover w-full h-full"
                        src={`${authUser.avatar}`}
                        alt=""
                      />
                    </div>
                    <div className="cursor-pointer tracking-[-0.02em]">
                      <p className=" leading-tight font-semibold capitalize text-white/90">
                        {authUser.fullName}
                      </p>
                      <p className="  text-sm  text-white/90">
                        @{authUser.username}
                      </p>
                      <p className="text-sm leading-[3] text-blue-400">
                        View your channel
                      </p>
                    </div>
                  </div>
                  <hr className="my-2 border-gray-600" />
                  <ul className="cursor-pointer">
                    <li className="py-1 hover:bg-gray-600 px-2 rounded">
                      Google Account
                    </li>
                    <li className="py-1 hover:bg-gray-600 px-2 rounded">
                      Switch Account
                    </li>
                    <li
                      onClick={handlelogout}
                      className="py-1 hover:bg-gray-600 px-2 rounded"
                    >
                      Sign Out
                    </li>
                    <hr className="my-2 border-gray-600" />
                    <li className="py-1 hover:bg-gray-600 px-2 rounded">
                      YouTube Studio
                    </li>
                    <li className="py-1 hover:bg-gray-600 px-2 rounded">
                      Purchases and Memberships
                    </li>
                    <li className="py-1 hover:bg-gray-600 px-2 rounded">
                      Your Data in YouTube
                    </li>
                    <li className="py-1 hover:bg-gray-600 px-2 rounded">
                      Settings
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="signin"
              className="signin cursor-pointer hover:bg-blue-400 gap-1 rounded-full border flex items-center px-3 py-1 border-gray-600"
            >
              <div className="border  flex items-center justify-center border-blue-900 text-blue-900 rounded-full circle w-5 h-5">
                <User size={16} />
              </div>
              <div className=" text-blue-900 font-semibold tracking-[-0.01em]">
                Sign in
              </div>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
