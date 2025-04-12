import { handleLogout } from "../Api/authApi.ts";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/auth.ts";
import { RootState } from "../Redux/store.ts";
import {
  AlignJustify,
  Bell,
  // LifeBuoy,
  Mic,
  Pencil,
  Plus,
  Search,
  Upload,
  User,
} from "lucide-react";
import { darkTheme, lightTheme } from "../Theme.ts";
import UploadVideo from "./VideoComponents/UploadModal.tsx";

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
  const { darkMode } = useSelector((state: RootState) => state.theme);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [uploadPopup, setUploadPopup] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuRef2 = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (
        menuRef2.current &&
        !menuRef2.current.contains(event.target as Node)
      ) {
        setIsOpen2(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleCreateClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Stop event propagation
    setIsOpen2((prev) => !prev);
  };
  const handleAvatarClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Stop event propagation
    setIsOpen((prev) => !prev);
  };

  const handlelogout = async () => {
    await handleLogout();
    dispatch(logout());
    setIsOpen(false);
  };

  return (
    <>
      <nav
        className="  fixed left-0 right-6 top-0 z-50 border-box h-[8vh]  px-5 w-full flex items-center justify-between "
        style={darkTheme}
      >
        <div className="flex items-center justify-between gap-2  ">
          <button
            onClick={toggleSidebar}
            className="hidden cursor-pointer hover:bg-neutral-800 py-2 px-2 rounded-full  sm:flex"
          >
            <AlignJustify />
          </button>

          <div className="relative inline-block group sm:my-[18px] sm:mx-4">
            <a
              href="/"
              className="flex flex-shrink-0 items-center caret-transparent "
            >
              <img src="/MIcon.svg" alt="WatchFree" className="h-full w-full" />
            </a>

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
              className="bg-neutral-800 w-[20vw] sm:w-[36vw]  sm:h-full border border-neutral-700 rounded-4xl mx-2 pl-4 pr-2 py-[0.5rem]   focus:outline-none focus:border-blue-600"
              placeholder={"Search"}
            />
            <span className="absolute inset-y-0 right-6 sm:right-8 flex items-center pl-2">
              <Search
                className={`${darkMode ? "text-white" : "text-black"}`}
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
            className="relative user ml-1 flex justify-center gap-2 md:gap-4 caret-transparent items-center"
            style={darkMode ? darkTheme : lightTheme}
          >
            <div className="relative  " ref={menuRef2}>
              <button
                onClick={handleCreateClick}
                className="cursor-pointer justify-center items-center  px-3 py-2 gap-[0.4px]  rounded-[2.5rem] hidden sm:flex bg-neutral-700 hover:bg-neutral-600"
              >
                <Plus />
                <span className=" flex text-white/90 text-xs md:font-medium">
                  Create
                </span>
              </button>
              {isOpen2 && (
                <div
                  className=" absolute cursor-pointer -right-[4vw]  top-[6.2vh] w-[11rem] shadow-lg rounded-lg  bg-[#282828]  z-50"
                  // style={darkMode ? darkTheme : lightTheme}
                >
                  {" "}
                  <ul className="cursor-pointer hidden sm:flex flex-col  space-y-3 py-2">
                    <li
                      onClick={() => setUploadPopup(!uploadPopup)}
                      className="mt-1 py-1 flex space-x-3 text-white/90 hover:bg-neutral-600 px-4 rounded"
                    >
                      <Upload />
                      <span> Upload video</span>
                    </li>
                    {/* <li className="py-1 flex space-x-3 text-white/90 hover:bg-neutral-600 px-4 rounded">
                      // <LifeBuoy />
                      <span>Go live</span>
                    </li> */}
                    <li className="py-1 flex space-x-3 text-white/90 hover:bg-neutral-600 px-4 rounded">
                      <Pencil />
                      <span className="cursor-pointer"> Create Post </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <Bell />
            <div className="relative" ref={menuRef}>
              <div
                onClick={handleAvatarClick}
                className="md:ml-3 relative microphone  w-9 h-9 items-center hidden sm:flex justify-center rounded-full bg-neutral-700"
              >
                <img
                  className="rounded-full object-cover w-full h-full"
                  src={authUser?.avatar}
                  alt=""
                />
              </div>
              {isOpen && (
                <div
                  className=" absolute cursor-pointer right-[4vw]  top-0 w-64 bg-[#282828] shadow-lg rounded-lg p-4 z-50"
                  // style={darkMode ? darkTheme : lightTheme}
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
                  <ul className="cursor-pointer text-white/90">
                    <li className="py-1 hover:bg-neutral-600 px-2 rounded">
                      Google Account
                    </li>
                    <li className="py-1 hover:bg-neutral-600 px-2 rounded">
                      Switch Account
                    </li>
                    <li
                      onClick={handlelogout}
                      className="py-1 hover:bg-neutral-600 px-2 rounded"
                    >
                      Sign Out
                    </li>
                    <hr className="my-2 border-neutral-600" />
                    <li className="py-1 hover:bg-neutral-600 px-2 rounded">
                      YouTube Studio
                    </li>
                    <li className="py-1 hover:bg-neutral-600 px-2 rounded">
                      Purchases and Memberships
                    </li>
                    <li className="py-1 hover:bg-neutral-600 px-2 rounded">
                      Your Data in YouTube
                    </li>
                    <li className="py-1 hover:bg-neutral-600 px-2 rounded">
                      Settings
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex sm:hidden">
              {" "}
              <Search
                className=" ml-1 "
                style={darkMode ? darkTheme : lightTheme}
                size={24}
              />
            </div>
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
      </nav>
      {uploadPopup && <UploadVideo setUploadPopup={setUploadPopup} />}
    </>
  );
};

export default Header;
