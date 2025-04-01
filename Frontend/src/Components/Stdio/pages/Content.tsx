import {
  Filter,
  Edit2,
  BarChart2,
  PlayCircle,
  MoreHorizontal,
} from "lucide-react";

import { useState } from "react";
const Content = () => {
  const videos = [
    {
      thumbnail: "https://via.placeholder.com/160x90",
      title: "Ninja Fight",
      hashtag: "#ninjaaarashi2highlights",
      duration: "8:14",
      visibility: "Public",
      restrictions: "_",
      date: "23 Mar 2025",
      views: 30,
      comments: 0,
      likes: "-",
    },
    {
      thumbnail: "https://via.placeholder.com/160x90",
      title: "6 Never Trust A Stranger Reddit Creepy Story Y...",
      duration: "0:04",
      visibility: "Draft",
      restrictions: "_",
      isDraft: true,
    },
  ];
  const [selectedTab, setSelectedTab] = useState("Videos");
  const [hoveredVideo, setHoveredVideo] = useState<Number | null>(null);

  const tabs = ["Videos", "Posts", "Playlists"];

  return (
    <>
      <div className="pl-6 pr-4 flex justify-between  items-center h-[12vh]">
        <h1 className="text-white font-semibold text-3xl">Channel content</h1>
      </div>
      <div className=" text-white  ">
        <div className="pl-6 pr-4 flex mb-2 space-x-8 border-b border-gray-700 ">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={` py-2 ${
                selectedTab === tab
                  ? "font-semibold border-b-2 border-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex my-1.5 items-center  text-sm  border-b border-gray-700">
          <button className="pl-6 pr-4  flex items-center p-3  mr-4 gap-4 ">
            <Filter className="w-4 h-4 mr-2 " />
            <span>Filter</span>
          </button>
          <div className="ml-auto mr-5 flex items-center">
            <span className="mr-4">Rows per page: 30</span>
            <span>1-2 of 2</span>
          </div>
        </div>
        {selectedTab === "Videos" && (
          <>
            <div className=" rounded">
              <div className="pl-6 pr-4 grid grid-cols-12 font-semibold   items-center text-[0.9rem] leading-6 text-gray-400 p-2  border-b border-gray-700">
                <div className="col-span-5">Video</div>
                <div className="col-span-2 ">Visibility</div>
                <div className="col-span-1">Date</div>
                <div className="col-span-1">Views</div>
                <div className="col-span-2">Comments</div>
                <div className="col-span-1">Likes</div>
              </div>
              {videos.map((video, index) => (
                <div
                  key={index}
                  className={`pl-6 pr-4 grid grid-cols-12 items-start p-3 hover:bg-gray-900 ${
                    video.isDraft ? "opacity-70" : ""
                  }`}
                  onMouseEnter={() => setHoveredVideo(index)}
                  onMouseLeave={() => setHoveredVideo(null)}
                >
                  <div className="col-span-5 flex items-start">
                    <div className="col-span-4 relative mr-4">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-32 h-16 object-cover rounded"
                      />

                      <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                        {video.duration}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <h1 className=" text-xs "> {video.title}</h1>
                      <div className="font-medium text-xs relative">
                        {hoveredVideo === index && (
                          <div
                            className={` absolute mt-2 top-full  left-0 flex space-x-2 transition-opacity visible `}
                          >
                            <div className="lg:block hidden bg-gray-700 rounded-full p-2 hover:bg-gray-800 cursor-pointer">
                              <Edit2 className="w-4 h-4 text-gray-300 hover:text-white" />
                            </div>
                            <div className="lg:block hidden bg-gray-700 rounded-full p-2 hover:bg-gray-800 cursor-pointer">
                              <BarChart2 className="w-4 h-4 text-gray-300 hover:text-white" />
                            </div>

                            <div className=" lg:block hidden bg-gray-700 rounded-full p-2 hover:bg-gray-800 cursor-pointer">
                              <PlayCircle className="w-4 h-4 text-gray-300 hover:text-white" />
                            </div>
                            <div className="bg-gray-700 rounded-full p-2 hover:bg-gray-800 cursor-pointer">
                              <MoreHorizontal className="w-4 h-4 text-gray-300 hover:text-white" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div
                        className={`text-xs mt-1 ${
                          hoveredVideo === index ? "invisible" : "visible"
                        }`}
                      >
                        {video?.hashtag}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm cc ">
                    {video.visibility || "Draft"}
                  </div>
                  <div className="col-span-1 text-sm ">
                    {video.date || "Draft"}
                  </div>
                  <div className="col-span-1  text-sm font-[500] flex items-center">
                    {video.views !== undefined ? (
                      video.views
                    ) : (
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <div className="col-span-2 text-sm font-[500]">
                    {video?.comments}
                  </div>
                  <div className="col-span-1 text-sm font-semibold">
                    {video.restrictions || "/-"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {selectedTab === "Posts" && (
          <>
            <div className=" rounded">
              <div className="pl-6 pr-4 grid grid-cols-12 font-semibold   items-center text-[0.9rem] leading-6 text-gray-400 p-2  border-b border-gray-700">
                <div className="col-span-5">Posts</div>
                <div className="col-span-2 ">Visibility</div>
                <div className="col-span-1">Date</div>
                <div className="col-span-1">Responses</div>
                <div className="col-span-2">Comments</div>
                <div className="col-span-1">Likes</div>
              </div>
              <div className="space-y-4 ">
                <div className="min-h-100 justify-center rounded-xl p-6 flex flex-col items-center text-center">
                  {/* Image */}
                  <div className="w-80 h-70 mb-4">
                    <img
                      src="/createpost.png"
                      alt="Create Post"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Text */}
                  <p className="text-gray-400 text-sm mb-4">
                    Use a post to update your viewers with polls, images and
                    more
                  </p>

                  {/* Button */}
                  <button className="bg-white text-black font-semibold px-4 py-2 rounded-full hover:bg-gray-200">
                    Create a post
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {selectedTab === "Playlists" && (
          <>
            <div className=" rounded">
              <div className="pl-6 pr-4 grid grid-cols-12 font-semibold   items-center text-[0.9rem] leading-6 text-gray-400 p-2  border-b border-gray-700">
                <div className="col-span-5">Playlist</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2 ">Visibility</div>
                <div className="col-span-2">Last Updated</div>
                <div className="col-span-1">Video count</div>
              </div>
              {videos.map((video, index) => (
                <div
                  key={index}
                  className={`pl-6 pr-4 grid grid-cols-12 items-start p-3 hover:bg-gray-900 ${
                    video?.isDraft ? "opacity-70" : ""
                  }`}
                  onMouseEnter={() => setHoveredVideo(index)}
                  onMouseLeave={() => setHoveredVideo(null)}
                >
                  <div className="col-span-5 flex items-start">
                    <div className="col-span-4 relative mr-4">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-32 h-16 object-cover rounded"
                      />

                      <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                        {video.duration}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <h1 className=" text-xs "> {video.title}</h1>
                      <div className="font-medium text-xs relative">
                        {hoveredVideo === index && (
                          <div
                            className={` absolute mt-2 top-full  left-0 flex space-x-2 transition-opacity visible `}
                          >
                            <div className="lg:block hidden bg-gray-700 rounded-full p-2 hover:bg-gray-800 cursor-pointer">
                              <Edit2 className="w-4 h-4 text-gray-300 hover:text-white" />
                            </div>
                            <div className="lg:block hidden bg-gray-700 rounded-full p-2 hover:bg-gray-800 cursor-pointer">
                              <BarChart2 className="w-4 h-4 text-gray-300 hover:text-white" />
                            </div>

                            <div className=" lg:block hidden bg-gray-700 rounded-full p-2 hover:bg-gray-800 cursor-pointer">
                              <PlayCircle className="w-4 h-4 text-gray-300 hover:text-white" />
                            </div>
                            <div className="bg-gray-700 rounded-full p-2 hover:bg-gray-800 cursor-pointer">
                              <MoreHorizontal className="w-4 h-4 text-gray-300 hover:text-white" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div
                        className={`text-xs mt-1 ${
                          hoveredVideo === index ? "invisible" : "visible"
                        }`}
                      >
                        {video?.hashtag}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm  ">Playlists</div>
                  <div className="col-span-2 text-sm ">
                    {video?.visibility || "Draft"}
                  </div>
                  <div className="col-span-2  text-sm font-[500] flex items-center">
                    {video?.date}
                  </div>

                  <div className="col-span-1 text-sm font-semibold">
                    {video.restrictions || "/-"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Content;
