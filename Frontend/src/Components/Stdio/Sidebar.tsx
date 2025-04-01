import { UserCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { icon: "📊", label: "Dashboard", path: "/stdio/channel/dashboard" },
    { icon: "📹", label: "Content", path: "/stdio/channel/content" },
    { icon: "📈", label: "Analytics", path: "/stdio/channel/analytics" },
    // { icon: "👥", label: "Community", path: "./community" },
    { icon: "📝", label: "Subtitles", path: "/stdio/channel/subtitles" },
    { icon: "©️", label: "Copyright", path: "/stdio/channel/copyright" },
    { icon: "💰", label: "Earn", path: "/stdio/channel/earn" },
    // {
    //   icon: "🎨",
    //   label: "Customisation",
    //   path: "/stdio/channel/customisation",
    // },
    // { icon: "⚙️", label: "Settings", path: "/settings" },
    // { icon: "❓", label: "Send feedback", path: "/feedback" },
  ];

  return (
    <div className="w-64 h-full flex flex-col  pl-3 pr-2  border-r border-r-gray-700">
      <div className="mt-6 flex flex-col items-center mb-4">
        <UserCircle className="h-22 w-22  sm:h-28 sm:w-28 " />
        <div>
          <h2 className="mt-2 text-white font-bold">Your channel</h2>
          <p className="text-gray-400">Samir Shakya11</p>
        </div>
      </div>
      <nav className="overflow-y-auto h-[92vh]">
        {menuItems.map((item) => (
          //NavLink is used instead of Link because it applies an active style when the link is selected.
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-3 text-white hover:bg-gray-700 rounded-lg font-semibold   ${
                isActive ? "bg-gray-800" : ""
              }`
            }
          >
            <span className="mr-4">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
