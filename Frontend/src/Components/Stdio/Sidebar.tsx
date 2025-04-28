import { UserCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "../../Redux/store";

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const { authUser } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    { icon: "📊", label: "Dashboard", path: "/stdio/channel/dashboard" },
    { icon: "📹", label: "Content", path: "/stdio/channel/content" },
    { icon: "📈", label: "Analytics", path: "/stdio/channel/analytics" },
    { icon: "📝", label: "Subtitles", path: "/stdio/channel/subtitles" },
    { icon: "©️", label: "Copyright", path: "/stdio/channel/copyright" },
    { icon: "💰", label: "Earn", path: "/stdio/channel/earn" },
    {
      icon: "🎨",
      label: "Customisation",
      path: "/stdio/channel/customisation",
    },
  ];

  return (
    <div
      className={`h-full scrollbar-hidden-x   flex flex-col border-r border-r-gray-700 transition-all duration-500 overflow-hidden
      ${isCollapsed ? "w-20" : "md:w-64 pl-3 pr-2"}
      `}
    >
      {/* Avatar Section */}
      <div
        className={`flex flex-col items-center transition-all duration-300 ${
          isCollapsed ? "h-18" : "h-48"
        } mt-6 `}
      >
        <div
          className={`transition-all duration-300   rounded-full overflow-hidden ${
            isCollapsed ? "w-12 h-12" : "w-28 h-28"
          }`}
        >
          {authUser?.avatar ? (
            <img
              src={authUser.avatar}
              className="w-full h-full object-cover rounded-full"
              alt="User Avatar"
            />
          ) : (
            <UserCircle className="w-full h-full text-white" />
          )}
        </div>

        {/* Channel name and username */}
        <div
          className={`flex flex-col items-center transform transition-all duration-400  ease-in-out  overflow-hidden ${
            isCollapsed
              ? "mt-0 max-h-0 opacity-0  scale-95 pointer-events-none "
              : " opacity-100  max-h-40 mt-3 translate-x-0 scale-100 delay-300"
          }`}
          style={{
            transitionDelay: isCollapsed ? "-300ms" : "100ms",
          }}
        >
          <h2 className="text-white font-bold ">Your channel</h2>
          <p className="text-gray-400 ellipis line-clamp-1 text-center">
            {authUser?.username || "No username found"}
          </p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="overflow-y-auto flex-1 px-3 scrollbar-hidden-x">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-3 text-white hover:bg-gray-700 rounded-lg font-semibold transition-all duration-300 ${
                isActive ? "bg-gray-800" : ""
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span
              className={`ml-4 transition-all duration-300 whitespace-nowrap ${
                isCollapsed
                  ? "opacity-0 scale-0 translate-x-[-10px]"
                  : "opacity-100 scale-100 translate-x-0"
              }`}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
