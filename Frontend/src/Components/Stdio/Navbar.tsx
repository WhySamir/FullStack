import { AlignJustify, Plus, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
interface HeaderProps {
  toggleSidebar: () => void;
}
const Navbar: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { authUser } = useSelector((state: RootState) => state.auth);
  return (
    //shadow-neutral-500
    <nav className="shadow-xl  fixed left-0 right-6 top-0 z-50 border-box h-[8vh]  px-5 w-full flex items-center justify-between   ">
      <div className="flex items-center justify-between gap-2  ">
        <button
          onClick={toggleSidebar}
          className="hidden cursor-pointer hover:bg-neutral-800 py-2 px-2 rounded-full  sm:flex"
        >
          <AlignJustify />
        </button>

        <div className="relative inline-block group sm:my-[18px] sm:mx-4">
          <div className="flex flex-shrink-0 items-center caret-transparent ">
            <img src="/MIcon.svg" alt="WatchFree" className="h-full w-full" />
          </div>

          <div className="absolute top-0 right-[-1.2rem]  text-[8px] sm:text-[.6em] opacity-80 px-1 rounded-sm">
            NP
          </div>
        </div>
      </div>
      <div className="forinput text-md hidden sm:flex items-center gap-2 ">
        <div className="relative">
          <input
            type="text"
            className=" w-[20vw] sm:w-[36vw]  sm:h-full border border-neutral-700 rounded-4xl mx-2 pl-4 pr-2 py-[0.5rem]   focus:outline-none focus:border-blue-600"
            placeholder={"Search"}
          />
          <span className="absolute inset-y-0 right-6 sm:right-8 flex items-center pl-2">
            <Search size={24} />
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          // onClick={handleCreateClick}
          className="cursor-pointer justify-center items-center  px-3 py-2 space-x-[1px]  rounded-[2.5rem] hidden sm:flex bg-neutral-700 hover:bg-neutral-600"
        >
          <Plus className="h-6 w-6" />
          <span className=" flex text-white/90 text-xs md:font-medium">
            Create
          </span>
        </button>
        <div
          className="relative"
          // ref={menuRef}
        >
          <div
            // onClick={handleAvatarClick}
            className="md:ml-3 relative microphone  w-9 h-9 items-center hidden sm:flex justify-center rounded-full bg-neutral-700"
          >
            <img
              className="rounded-full object-cover  w-full h-full"
              src={authUser?.avatar}
              alt=""
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
