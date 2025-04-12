import React, { memo } from "react";
import {
  Home,
  Clapperboard,
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
import { useLocation } from "react-router-dom";

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
  // { icon: <Clapperboard />, text: "Shorts" },
  { icon: <Compass />, text: "Explore", to: "/" },
  { icon: <Youtube />, text: "Subscriptions", to: "/" },
  { icon: <ListVideo />, text: "All Subscriptions", to: "/" },
  { icon: <History />, text: "History", to: "/" },
  { icon: <PlaySquare />, text: "Playlist", to: "/" },
  { icon: <ThumbsUp />, text: "Liked Videos", to: "/" },
  { icon: <Flame />, text: "Trending", to: "/" },
  { icon: <Music />, text: "Music", to: "/" },
  { icon: <Gamepad2 />, text: "Gaming", to: "/" },
  { icon: <Trophy />, text: "Sports", to: "/" },
  { icon: <Settings />, text: "Settings", to: "/" },
  { icon: <HelpCircle />, text: "Help", to: "/" },
];

const SidebarItem: React.FC<{ item: SidebarItem; isCollapsed: boolean }> = memo(
  ({ item }) => (
    <a
      href={item.to}
      className={` flex items-center py-2  hover:bg-neutral-800 rounded-lg cursor-pointer transition-all duration-300 justify-center" 
        `}
    >
      <div className={` pl-4 flex items-center space-x-6`}>
        <span className="w-6 h-6">{item.icon}</span>
        <span className="w-32">{item.text}</span>
      </div>
    </a>
  )
);

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const isWatchPage = location.pathname.startsWith("/watch/");
  return (
    <div
      style={{
        position: isWatchPage ? "fixed" : "sticky",
        top: isWatchPage ? "3.5rem" : "0rem",
        zIndex: isWatchPage ? 50 : "auto",
      }}
      className={`h-[100dvh] hidden sm:flex   flex-col bg-[#16181b] text-white caret-transparent  ${
        isCollapsed ? (isWatchPage ? " h-full" : "w-18 ") : "pl-2 pr-2 w-56"
      } transform transition-transform duration-500 ease-in-out flex-shrink-0   overflow-y-auto  sidebar
       ${isWatchPage ? "pt-2" : "pt-14 xl:pt-[4rem]"} `}
    >
      <div className="rounded-lg flex flex-col justify-center space-y-1 ">
        {!isCollapsed &&
          sidebarItems.map((item, index) => (
            <SidebarItem key={index} item={item} isCollapsed={isCollapsed} />
          ))}
      </div>
      {!isWatchPage && isCollapsed && (
        <>
          <div className="rounded-lg flex flex-col justify-center space-y-1 ">
            <div
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "justify-between"
              } py-4 hover:bg-neutral-800 rounded-lg cursor-pointer transition ease-in-out delay-150  duration-200`}
            >
              <a href="/" className="flex flex-col items-center space-y-1">
                <span className="w-6 h-6">
                  <Home />
                </span>
                <span className="text-[0.65rem]">Home</span>
              </a>
            </div>
            <div
              className={` flex items-center ${
                isCollapsed ? "justify-center" : "justify-between"
              } py-4 hover:bg-neutral-800 rounded-lg cursor-pointer transition ease-in-out delay-150  duration-200`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="w-6 h-6">
                  <Clapperboard />
                </span>
                <span className="text-[0.65rem]">Trending</span>
              </div>
            </div>
            <div
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "justify-between"
              } py-4 hover:bg-neutral-800 rounded-lg cursor-pointer transition ease-in-out delay-150  duration-200`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="w-6 h-6">
                  <PlaySquare />
                </span>
                <span className="text-[0.65rem]">Subscriptions</span>
              </div>
            </div>
            <div
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
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
