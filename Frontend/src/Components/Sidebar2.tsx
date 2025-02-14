import React, { memo } from "react";
import {
  Home,
  Clapperboard,
  History,
  PlaySquare,
  Clock,
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

interface SidebarItem {
  icon: JSX.Element;
  text: string;
}

interface SidebarProps {
  isCollapsed: boolean;
}

const sidebarItems: SidebarItem[] = [
  { icon: <Home />, text: "Home" },
  { icon: <Clapperboard />, text: "Shorts" },
  { icon: <Compass />, text: "Explore" },
  { icon: <Youtube />, text: "Subscriptions" },
  { icon: <ListVideo />, text: "All Subscriptions" },
  { icon: <History />, text: "History" },
  { icon: <PlaySquare />, text: "Playlist" },
  { icon: <Clock />, text: "Watch Later" },
  { icon: <ThumbsUp />, text: "Liked Videos" },
  { icon: <Flame />, text: "Trending" },
  { icon: <Music />, text: "Music" },
  { icon: <Gamepad2 />, text: "Gaming" },
  { icon: <Trophy />, text: "Sports" },
  { icon: <Settings />, text: "Settings" },
  { icon: <HelpCircle />, text: "Help" },
];

const SidebarItem: React.FC<{ item: SidebarItem; isCollapsed: boolean }> = memo(
  ({ item }) => (
    <div
      className={` flex items-center py-2  hover:bg-neutral-800 rounded-lg cursor-pointer transition-all duration-300 justify-center" 
        `}
    >
      <div className={` pl-4 flex items-center space-x-6`}>
        <span className="w-6 h-6">{item.icon}</span>
        <span className="w-32">{item.text}</span>
      </div>
    </div>
  )
);

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  return (
    <div
      style={{
        position: "sticky",
        top: "3rem",
        maxHeight: "calc(100vh - 4rem)",
      }}
      className={`h-[90vh] hidden sm:flex  flex-col bg-[#16181b] text-white  ${
        isCollapsed ? "w-20 " : "pl-2 pr-2 w-56"
      } transform transition-transform duration-500 ease-in-out flex-shrink-0   overflow-y-auto  scrollbar-thin scrollbar-thumb-[#4a4a4a] scrollbar-track-[#16181b]`}
    >
      <div className="rounded-lg flex flex-col justify-center space-y-2 ">
        {sidebarItems.map(
          (item, index) =>
            !isCollapsed && (
              <SidebarItem key={index} item={item} isCollapsed={isCollapsed} />
            )
        )}
        {isCollapsed && (
          <>
            <div
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "justify-between"
              } py-4 hover:bg-neutral-800 rounded-lg cursor-pointer transition ease-in-out delay-150  duration-200`}
            >
              <div className="flex flex-col items-center space-y-2">
                <span className="w-6 h-6">
                  <Home />
                </span>
                <span className="text-xs">Home</span>
              </div>
            </div>
            <div
              className={` flex items-center ${
                isCollapsed ? "justify-center" : "justify-between"
              } py-4 hover:bg-neutral-800 rounded-lg cursor-pointer transition ease-in-out delay-150  duration-200`}
            >
              <div className="flex flex-col items-center space-y-2">
                <span className="w-6 h-6">
                  <Clapperboard />
                </span>
                <span className="text-xs">Shorts</span>
              </div>
            </div>
            <div
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "justify-between"
              } py-4 hover:bg-neutral-800 rounded-lg cursor-pointer transition ease-in-out delay-150  duration-200`}
            >
              <div className="flex flex-col items-center space-y-2">
                <span className="w-6 h-6">
                  <PlaySquare />
                </span>
                <span className="text-xs">Subscriptions</span>
              </div>
            </div>
            <div
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "justify-between"
              } py-4 hover:bg-neutral-800 rounded-lg cursor-pointer transition ease-in-out delay-150  duration-200`}
            >
              <div className="flex flex-col items-center space-y-2">
                <span className="w-6 h-6">
                  <User />
                </span>
                <span className="text-xs">You</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
