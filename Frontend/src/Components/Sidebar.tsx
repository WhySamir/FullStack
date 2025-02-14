import { AlignJustify } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="flex flex-col w-full my-[18px]">
      <div className="items-center flex gap-4 ">
        <AlignJustify />
        <div className="relative inline-block group">
          <div className="flex flex-shrink-0 items-center">
            <img src="./MIcon.svg" alt="Logo" className="h-full w-full" />
          </div>
          <div className="absolute top-0 right-[-1.2rem] text-white text-[8px] sm:text-[.6em] opacity-80 px-1 rounded-sm">
            NP
          </div>
        </div>
      </div>
      <div
        className={` transform transition-transform duration-500 ease-in-out w-64  hidden sm:flex flex-shrink-0   overflow-y-auto h-full p-2   flex-col space-y-4`}
        style={{
          position: "sticky",
          top: "7rem",
          maxHeight: "calc(100vh - 8rem)",
        }}
      >
        <div className="mb-4">
          <p className="text-white mb-2">Home</p>
          <p className="text-white mb-2">Shorts</p>
          <p className="text-white mb-2">Subscriptions</p>
        </div>
        {/* Divider */}
        <hr className="mb-4" />

        {/* You Section */}
        <div className="mb-4">
          <button className="w-full text-left text-white flex justify-between items-center">
            You {">"}
          </button>

          <div className="pt-2">
            <p>History</p>
            <p>Playlist</p>
            <p>Your Videos</p>
            <p>Watch Later</p>
            <p>Liked Videos</p>
          </div>
        </div>
        <hr />

        <div className="mb-4">
          <h1>Subscriptions</h1>
          <button className="w-full text-left text-white flex justify-between items-center">
            All Subscriptions
          </button>

          {/* )} */}
        </div>
        <hr />

        <div className="mb-4 text-white">
          <h1>Explore</h1>
          <button className="w-full text-left text-white flex justify-between items-center">
            Trending
          </button>

          <button className="w-full text-left text-white flex justify-between items-center">
            Music
          </button>

          <button className="w-full text-left text-white flex justify-between items-center">
            Gaming
          </button>
          <button className="w-full text-left text-white flex justify-between items-center">
            Sports
          </button>
        </div>
        <hr />

        <div className="mb-4">
          <button className="w-full text-left text-white flex justify-between items-center">
            Settings
          </button>
          <button className="w-full text-left text-white flex justify-between items-center">
            Help
          </button>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default Sidebar;
