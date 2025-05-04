import { AlignJustify, LogOut, Search, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
// import { Video } from "../../types/videosInterface";
import { handleLogout } from "../../Api/authApi";
import { logout } from "../../Redux/auth";

interface HeaderProps {
  toggleSidebar: () => void;
}
const Navbar: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { authUser } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // const { videos } = useSelector((state: RootState) => state.vid);

  // const filteredVideos = videos.filter((video: Video) =>
  //   video.title.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const handlelogout = async () => {
    await handleLogout();

    dispatch(logout());
    setIsMenuOpen(false);
    navigate("/");
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };
  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <nav className="shadow-xl  fixed left-0 right-6 top-0 z-50 border-box h-[8vh]  px-5 w-full flex items-center justify-between   ">
        <div className="flex items-center justify-between gap-2  ">
          <button
            onClick={toggleSidebar}
            className="hidden cursor-pointer hover:bg-neutral-800 py-2 px-2 rounded-full  sm:flex"
          >
            <AlignJustify />
          </button>

          <button
            onClick={() => navigate("/")}
            className="relative inline-block group sm:my-[18px] sm:mx-4"
          >
            <div className="flex flex-shrink-0 items-center caret-transparent ">
              <img src="/MIcon.svg" alt="WatchFree" className="h-full w-full" />
            </div>

            <div className="absolute top-0 right-[-1.2rem]  text-[8px] sm:text-[.6em] opacity-80 px-1 rounded-sm">
              NP
            </div>
          </button>
        </div>
        <div className="forinput text-md hidden sm:flex items-center gap-2 ">
          <div className="relative">
            <input
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              onKeyDown={handleSearch}
              type="text"
              className=" w-[20vw] sm:w-[36vw]  sm:h-full border border-neutral-700 rounded-4xl mx-2 pl-4 pr-2 py-[0.5rem]   focus:outline-none focus:border-blue-600"
              placeholder={"Search"}
            />
            <button
              onClick={handleSearchClick}
              className="absolute inset-y-0 right-6 sm:right-8 flex items-center pl-2"
            >
              <Search size={24} />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* <button
          // onClick={handleCreateClick}
          className="cursor-pointer justify-center items-center  px-3 py-2 space-x-[1px]  rounded-[2.5rem] hidden sm:flex bg-neutral-700 hover:bg-neutral-600"
        >
          <Plus className="h-6 w-6" />
          <span className=" flex text-white/90 text-xs md:font-medium">
            Create
          </span>
        </button> */}
          <div
            className="relative"
            // ref={menuRef}
          >
            <div
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:ml-3 relative microphone  w-9 h-9 items-center hidden sm:flex justify-center rounded-full bg-neutral-700"
            >
              <img
                className="rounded-full object-cover  w-full h-full"
                src={authUser?.avatar}
                alt="Profile"
              />
            </div>
            {isMenuOpen && (
              <div className="absolute right-0 top-12 w-48 bg-neutral-800 rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="px-4 py-2 w-full hover:bg-neutral-700 cursor-pointer flex items-center gap-2"
                >
                  <User size={16} />
                  <span>Profile</span>
                </button>
                <button
                  onClick={handlelogout}
                  className="px-4 py-2 w-full hover:bg-neutral-700 cursor-pointer flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Username
                </label>
                <input
                  type="text"
                  defaultValue={authUser?.username}
                  className="w-full bg-neutral-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  className="w-full bg-neutral-700 rounded px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={authUser?.username || ""}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 rounded hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
