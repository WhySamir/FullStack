import React, { memo } from "react";
import {
  Home,
  History,
  PlaySquare,
  ThumbsUp,
  Flame,
  Music,
  Gamepad2,
  Trophy,
  Settings,
  HelpCircle,
  User,
  Compass,
  Youtube,
  ListVideo,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";

interface SidebarItem {
  icon: JSX.Element;
  text: string;
  to: string;
}

interface SidebarProps {
  isCollapsed: boolean;
}

const sidebarItems: SidebarItem[] = [
  { icon: <Home />, text: "Home", to: "/" },
  {
    icon: <Compass />,
    text: "Explore",
    to: `/search?q=${encodeURIComponent("Explore".toLowerCase())}`,
  },
  { icon: <Youtube />, text: "Subscriptions", to: "/userSubscriptions" },
  { icon: <ListVideo />, text: "All Subscriptions", to: "/channels" },
  { icon: <History />, text: "History", to: "/" },
  // { icon: <PlaySquare />, text: "Playlist", to: "/" },
  { icon: <Youtube />, text: "Your Videos", to: "/stdio/channel/content" },
  { icon: <ThumbsUp />, text: "Liked Videos", to: "/likedvideos" },
  {
    icon: <Flame />,
    text: "Trending",
    to: `/search?q=${encodeURIComponent("Trending".toLowerCase())}`,
  },
  {
    icon: <Music />,
    text: "Music",
    to: `/search?q=${encodeURIComponent("Music".toLowerCase())}`,
  },
  {
    icon: <Gamepad2 />,
    text: "Gaming",
    to: `/search?q=${encodeURIComponent("Gaming".toLowerCase())}`,
  },
  {
    icon: <Trophy />,
    text: "Sports",
    to: `/search?q=${encodeURIComponent("Sports".toLowerCase())}`,
  },
  { icon: <Settings />, text: "Settings", to: "/commingsoon" },
  { icon: <HelpCircle />, text: "Help", to: "/commingsoon" },
];

const sidebarItemsNotAuthenciated: SidebarItem[] = [
  { icon: <Home />, text: "Home", to: "/home" },
  {
    icon: <Compass />,
    text: "Explore",
    to: `/search?q=${encodeURIComponent("Explore".toLowerCase())}`,
  },
  {
    icon: <Flame />,
    text: "Trending",
    to: `/search?q=${encodeURIComponent("Trending".toLowerCase())}`,
  },
  {
    icon: <Music />,
    text: "Music",
    to: `/search?q=${encodeURIComponent("Music".toLowerCase())}`,
  },
  {
    icon: <Gamepad2 />,
    text: "Gaming",
    to: `/search?q=${encodeURIComponent("Gaming".toLowerCase())}`,
  },
  {
    icon: <Trophy />,
    text: "Sports",
    to: `/search?q=${encodeURIComponent("Sports".toLowerCase())}`,
  },
  { icon: <Settings />, text: "Settings", to: "/commingsoon" },
  { icon: <HelpCircle />, text: "Help", to: "/commingsoon" },
];

const SidebarItem: React.FC<{ item: SidebarItem; isCollapsed: boolean }> = memo(
  ({ item }) => {
    const isExternal = item.text === "Your Videos";

    return (
      <>
        {isExternal ? (
          <Link
            to={item.to}
            target="_blank"
            className="flex  items-center py-2 hover:bg-neutral-800 rounded-lg cursor-pointer transition-all duration-300 justify-start"
          >
            <div className="pl-4  flex items-center space-x-6">
              <span className="w-4 h-4">{item.icon}</span>
              {<span className="w-32">{item.text}</span>}
            </div>
          </Link>
        ) : (
          <Link
            to={item.to}
            className={` flex items-center py-2  hover:bg-neutral-800 rounded-lg cursor-pointer transition-all duration-300 justify-center" 
        `}
          >
            <div className={` pl-4 flex items-center space-x-6`}>
              <span className="w-4 h-4">{item.icon}</span>
              <span className="w-32">{item.text}</span>
            </div>
          </Link>
        )}
      </>
    );
  }
);

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const isWatchPage = location.pathname.startsWith("/watch/");

  const navigate = useNavigate();
  const { authUser, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  return (
    <div
      style={{
        position: isWatchPage ? "fixed" : "sticky",
        top: isWatchPage ? "3.4rem" : "0rem",
        zIndex: isWatchPage ? 50 : "auto",
      }}
      className={`h-[100dvh] hidden sm:flex   flex-col bg-[#16181b] text-white caret-transparent  ${
        isCollapsed ? (isWatchPage ? " h-full" : "w-18 ") : "pl-2 pr-2 w-56"
      } transform transition-transform duration-500 ease-in-out flex-shrink-0   overflow-y-auto  sidebar
       ${isWatchPage ? "pt-2" : "pt-14 xl:pt-[4rem]"} `}
    >
      <div className="rounded-lg flex flex-col justify-center space-y-1 ">
        {isAuthenticated ? (
          <>
            {!isCollapsed &&
              sidebarItems.map((item, index) => (
                <SidebarItem
                  key={index}
                  item={item}
                  isCollapsed={isCollapsed}
                />
              ))}
          </>
        ) : (
          <>
            {!isCollapsed &&
              sidebarItemsNotAuthenciated.map((item, index) => (
                <SidebarItem
                  key={index}
                  item={item}
                  isCollapsed={isCollapsed}
                />
              ))}
          </>
        )}
      </div>
      {!isWatchPage && isCollapsed && (
        <>
          <div className="rounded-lg flex flex-col justify-center space-y-1 ">
            <div
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "justify-between"
              } py-4 hover:bg-neutral-800 rounded-lg cursor-pointer transition ease-in-out delay-150  duration-200`}
            >
              <Link
                to={`${isAuthenticated ? "/" : "/home"}`}
                className="flex flex-col items-center space-y-1"
              >
                <span className="w-6 h-6">
                  <Home />
                </span>
                <span className="text-[0.65rem]">Home</span>
              </Link>
            </div>
            <button
              onClick={() =>
                navigate(
                  `/search?q=${encodeURIComponent("Trending".toLowerCase())}`
                )
              }
              className={` flex items-center ${
                isCollapsed ? "justify-center" : "justify-between"
              } py-4 hover:bg-neutral-800 rounded-lg cursor-pointer transition ease-in-out delay-150  duration-200`}
            >
              <Link to="/" className="flex flex-col items-center space-y-1">
                <span className="w-6 h-6">
                  <Flame />
                </span>
                <span className="text-[0.65rem]">Trending</span>
              </Link>
            </button>
            {isAuthenticated ? (
              <>
                <div
                  className={`flex items-center ${
                    isCollapsed ? "justify-center" : "justify-between"
                  } py-4 hover:bg-neutral-800 rounded-lg cursor-pointer transition ease-in-out delay-150  duration-200`}
                >
                  <Link
                    to="/userSubscriptions"
                    className="flex flex-col items-center space-y-1"
                  >
                    <span className="w-6 h-6">
                      <PlaySquare />
                    </span>
                    <span className="text-[0.65rem]">Subscriptions</span>
                  </Link>
                </div>
                <Link
                  to={`/username/${authUser?.username}`}
                  className={`flex items-center ${
                    isCollapsed ? "justify-center" : "justify-between"
                  } py-4 hover:bg-neutral-800 rounded-lg cursor-pointer transition ease-in-out delay-150  duration-200`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="w-6 h-6">
                      <User />
                    </span>
                    <span className="text-[0.65rem]">You</span>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() =>
                    navigate(
                      `/search?q=${encodeURIComponent("Music".toLowerCase())}`
                    )
                  }
                  className={`flex items-center ${
                    isCollapsed ? "justify-center" : "justify-between"
                  } py-4 hover:bg-neutral-800 rounded-lg cursor-pointer transition ease-in-out delay-150  duration-200`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="w-6 h-6">
                      <Music />
                    </span>
                    <span className="text-[0.65rem]">Music</span>
                  </div>
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
