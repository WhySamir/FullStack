import { handleLogout } from "../Api/authApi.ts";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/auth.ts";
import { RootState } from "../Redux/store.ts";
import {
  AlignJustify,

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
import RedLoader from "./Common/RedLoader.tsx";
import { VideoProps } from "../types/videosInterface.ts";

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
  const navigate = useNavigate();
  const { isAuthenticated, authUser } = useSelector(
    (state: RootState) => state.auth
  );
  const { darkMode } = useSelector((state: RootState) => state.theme);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [uploadPopup, setUploadPopup] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuRef2 = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [loader, setloader] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { videos } = useSelector((state: RootState) => state.vid);
  const [avatarError, setAvatarError] = useState(false);
  const avatarUrl = authUser?.avatar;

  useEffect(() => {
    setAvatarError(false); // Reset error when avatar changes
  }, [avatarUrl]);

  const filteredVideos = videos.filter((video: VideoProps) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dispatch = useDispatch();
  const suggestionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showSuggestions) setHighlightedIndex(-1);
  }, [showSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    console.log("Avatar", authUser?.avatar);
    event.stopPropagation(); // Stop event propagation
    setIsOpen((prev) => !prev);
  };

  const handlelogout = async () => {
    setloader(true);
    await handleLogout();
    dispatch(logout());
    setIsOpen(false);
    setloader(false);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredVideos.slice(0, 5).length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredVideos.slice(0, 5).length - 1
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0) {
        const selected = filteredVideos[highlightedIndex];
        setSearchQuery(selected.title);
        navigate(`/search?q=${encodeURIComponent(selected.title)}`);
        setShowSuggestions(false);
      } else if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setShowSuggestions(false);
      }
    }
  };
  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  return (
    <>
      {loader && <RedLoader />}
      <nav
        className="  fixed left-0 right-6 top-0 z-50 border-box h-[3.4rem] bg-neutral-700  px-5 w-full flex items-center justify-between "
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
        <div
          className={`forinput text-md ${
            !isAuthenticated ? "lg:mr-24" : "lg:mr-0"
          } hidden sm:flex items-center gap-2`}
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setShowSuggestions(true);
                setSearchQuery(e.target.value);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleSearch}
              className="bg-neutral-800 w-[20vw] text-xs md:text-sm pr-14 sm:w-[36vw]  sm:h-full border border-neutral-700 rounded-4xl mx-2 pl-4  py-[0.5rem]   focus:outline-none focus:border-blue-600"
              placeholder={"Search"}
            />
            <button
              type="button"
              onClick={handleSearchClick}
              className="absolute inset-y-0 right-6 sm:right-8 flex items-center pl-2"
            >
              <Search
                className={` ${darkMode ? "text-white" : "text-black"}`}
                size={24}
              />
            </button>

            {searchQuery && showSuggestions && filteredVideos.length > 0 && (
              <div
                ref={suggestionRef}
                className="absolute z-50 top-full mt-1 w-[90%] ml-5 bg-neutral-800 border border-neutral-700 rounded shadow-lg"
              >
                {filteredVideos
                  .slice(0, 5)
                  .map((video: VideoProps, index: Number) => (
                    <div
                      key={video._id}
                      onClick={() => {
                        setSearchQuery(video.title);
                        navigate(
                          `/search?q=${encodeURIComponent(video.title)}`
                        );
                        setShowSuggestions(false);
                      }}
                      className={`px-4 py-2 cursor-pointer text-white ${
                        index === highlightedIndex
                          ? "bg-neutral-600"
                          : "hover:bg-neutral-700"
                      }`}
                    >
                      {video.title}
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div
            className={`relative hidden microphone w-8  h-8 items-center  justify-center rounded-full   ${
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
                className="cursor-pointer justify-center items-center   px-3 py-1.5 gap-[4px]  rounded-[2.5rem] hidden sm:flex bg-neutral-700 hover:bg-neutral-600"
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
                    <button
                      onClick={() => setUploadPopup(!uploadPopup)}
                      className="mt-1 py-1 flex space-x-3 text-white/90 hover:bg-neutral-600 px-4 rounded"
                    >
                      <Upload />
                      <span> Upload video</span>
                    </button>
                    {/* <li className="py-1 flex space-x-3 text-white/90 hover:bg-neutral-600 px-4 rounded">
                      // <LifeBuoy />
                      <span>Go live</span>
                    </li> */}
                    <button className="py-1 flex space-x-3 text-white/90 hover:bg-neutral-600 px-4 rounded">
                      <Pencil />
                      <span className="cursor-pointer"> Create Post </span>
                    </button>
                  </ul>
                </div>
              )}
            </div>
            {/* <Bell /> */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={handleAvatarClick}
                className="md:ml-3 relative  w-9 h-9 items-center hidden sm:flex justify-center rounded-full bg-neutral-700"
              >
                {avatarError || !avatarUrl ? (
                  <div className="bg-gray-500 rounded-full w-9 h-9 flex items-center justify-center">
                    <User className="text-white" size={24} />
                  </div>
                ) : (
                  <img
                    src={
                      avatarError
                        ? "https://eu.ui-avatars.com/api/?name=User"
                        : avatarUrl
                    }
                    onError={() => setAvatarError(true)}
                    alt="user avatar"
                    className="rounded-full object-cover w-full h-full"
                  />
                )}
              </button>
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
                      <p
                        onClick={() => {
                          navigate(`/username/${authUser.username}`);
                          setIsOpen(false);
                        }}
                        className="text-sm leading-[3] text-blue-400"
                      >
                        View your channel
                      </p>
                    </div>
                  </div>
                  <hr className="my-2 border-gray-600" />
                  <ul className="cursor-pointer text-white/90">
                    <li
                      className="py-1 hover:bg-neutral-600 px-2 rounded cursor-pointer"
                      onClick={() =>
                        window.open(
                          `https://myaccount.google.com?authuser=${authUser.email}`,
                          "_blank"
                        )
                      }
                    >
                      Google Account
                    </li>
                    <li
                      className="py-1 hover:bg-neutral-600 px-2 rounded cursor-pointer"
                      onClick={() => {
                        window.location.href =
                          "https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount" +
                          `?client_id=${
                            import.meta.env.VITE_GOOGLE_CLIENT_ID
                          }` +
                          `&redirect_uri=${encodeURIComponent(
                            import.meta.env.VITE_REDIRECT_URI
                          )}` +
                          "&response_type=code" +
                          "&scope=email%20profile" +
                          "&access_type=offline" +
                          "&prompt=consent" +
                          "&service=lso" +
                          "&o2v=2" +
                          "&flowName=GeneralOAuthFlow";
                      }}
                    >
                      Switch Account
                    </li>

                    <li
                      onClick={handlelogout}
                      className="py-1 hover:bg-neutral-600 px-2 rounded"
                    >
                      Sign Out
                    </li>
                    <hr className="my-2 border-neutral-600" />
                    <div className="py-1 hover:bg-neutral-600 px-2 rounded">
                      <Link
                        target="_blank"
                        to="/stdio/channel/content"
                        rel="noopener noreferrer"
                      >
                        WatchFree Studio
                      </Link>
                    </div>
                    <li
                      className="py-1 hover:bg-neutral-600 px-2 rounded cursor-pointer"
                      onClick={() => {
                        navigate("/commingsoon");
                        setIsOpen(false);
                      }}
                    >
                      Purchases and Memberships
                    </li>
                    {/* <li className="py-1 hover:bg-neutral-600 px-2 rounded">
                      Your Data in YouTube
                    </li> */}
                    <li
                      className="py-1 hover:bg-neutral-600 px-2 rounded cursor-pointer"
                      onClick={() => {
                        navigate("/commingsoon");
                        setIsOpen(false);
                      }}
                    >
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
            to="/signin"
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
