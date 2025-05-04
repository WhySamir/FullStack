import { Filter, Edit2, BarChart2, PlayCircle, Trash } from "lucide-react";

import { useState } from "react";
import { deletedVidById } from "../../../Api/videoApis";
import { formatDate, formatDuration } from "../../../Utilis/FormatDuration";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { deleteVideo } from "../../../Redux/userallVideos";
import { useNavigate } from "react-router-dom";

const Content = () => {
  const dispatch = useDispatch();
  const { videos } = useSelector((state: RootState) => state.userVideo);
  const [selectedTab, setSelectedTab] = useState("Videos");
  const [hoveredVideo, setHoveredVideo] = useState<Number | null>(null);

  const navigate = useNavigate();
  const tabs = ["Videos", "Posts", "Playlists"];

  const handleDeleteVideo = async (vidId: string) => {
    try {
      await deletedVidById({ vidId });
      dispatch(deleteVideo(vidId));
    } catch (error) {
      console.error(error);
    }
  };
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
            <span>Lists</span>
          </button>
          <div className="ml-auto mr-5 flex items-center">
            <span className="mr-4">Rows per page: 30</span>
            <span>1-2 of 2</span>
          </div>
        </div>
        {selectedTab === "Videos" && (
          <>
            <div className=" rounded">
              <div className="sm:text-xs lg:text-sm pl-6 pr-4 grid grid-cols-12 font-semibold   items-center text-[0.9rem] leading-6 text-gray-400 p-2  border-b border-gray-700">
                <div className="col-span-3  md:col-span-5">Video</div>
                <div className="col-span-2 flex justify-center items-center">
                  isPublished
                </div>
                <div className="col-span-2 md:col-span-1 ">Date</div>
                <div className="col-span-1 ">Views</div>
                <div className="col-span-3 md:col-span-2 sm:text-xxs lg:text-sm flex justify-center items-center ">
                  Comments
                </div>
                <div className="col-span-1">Likes</div>
              </div>
              {videos.map((video, index) => (
                <div
                  key={index}
                  className={`sm:text-xs text-sm pl-6 pr-4  grid grid-cols-12 items-start p-3 hover:bg-gray-900 `}
                  onMouseEnter={() => setHoveredVideo(index)}
                  onMouseLeave={() => setHoveredVideo(null)}
                >
                  <div className="col-span-3  md:col-span-5 flex items-start">
                    <div className="md:col-span-4 relative md:mr-2 lg:mr-3">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-30 md:w-32 h-16 object-cover rounded"
                      />

                      <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                        {formatDuration(video?.duration)}
                      </span>
                    </div>
                    <div
                      className={`hidden md:block md:col-span-1  w-[10vw] md:w-[40%] lg:w-[80%] flex-wrap h-full ${
                        video.isPublished ? "opacity-70" : ""
                      }`}
                    >
                      <h1 className=" text-xs w-full max-w-full overflow-hidden text-ellipsis break-words line-clamp-1 ">
                        {" "}
                        {video.title}
                      </h1>
                      <div className="font-medium text-xs relative">
                        {hoveredVideo === index && (
                          <div
                            className={` absolute mt-2 top-full  left-0 flex space-x-2 transition-opacity visible `}
                          >
                            <div className="lg:block hidden bg-gray-700 rounded-full p-2 hover:bg-gray-800 cursor-pointer">
                              <Edit2 className="w-4 h-4 text-gray-300 hover:text-white" />
                            </div>
                            <button
                              onClick={() =>
                                navigate(
                                  `/stdio/channel/analytics?videoId=${video._id}`
                                )
                              }
                              className="lg:block hidden bg-gray-700 rounded-full p-2 hover:bg-gray-800 cursor-pointer"
                            >
                              <BarChart2 className="w-4 h-4 text-gray-300 hover:text-white" />
                            </button>

                            <button
                              onClick={() => navigate(`/watch/${video._id}`)}
                              className=" lg:block hidden bg-gray-700 rounded-full p-2 hover:bg-gray-800 cursor-pointer"
                            >
                              <PlayCircle className="w-4 h-4 text-gray-300 hover:text-white" />
                            </button>
                            <button
                              onClick={() => handleDeleteVideo(video._id)}
                              className="bg-gray-700 rounded-full p-2 hover:bg-gray-800 cursor-pointer"
                            >
                              <Trash className="w-4 h-4 text-gray-300 hover:text-white" />
                            </button>
                          </div>
                        )}
                      </div>

                      <h1
                        className={`text-xs max-w-full flex-wrap h-full  overflow-hidden text-ellipsis break-words line-clamp-2  mt-1 ${
                          hoveredVideo === index ? "invisible" : "visible"
                        }`}
                      >
                        {video?.description}
                      </h1>
                    </div>
                  </div>
                  <div className="col-span-2  font-[500] flex justify-center items-center text-xxs lg:text-xs ">
                    {video.isPublished === true ? "Published" : "Draft"}
                  </div>
                  <div className="col-span-2 md:col-span-1 font-[500] text-xxs lg:text-xs ">
                    {formatDate(video.createdAt)}
                  </div>
                  <div className="col-span-1  text-xxs lg:text-xs font-[500] flex justify-center items-center">
                    {video.views !== undefined ? (
                      video.views
                    ) : (
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <div className="col-span-3 text-xxs lg:text-xs  md:col-span-2 flex justify-center items-center font-[500]">
                    {video?.commentCount}
                  </div>
                  <div className="col-span-1  font-[500] text-xxs lg:text-xs">
                    {video.likesCount}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {selectedTab === "Posts" && (
          <>
            <div className=" rounded">
              <div className="pl-6 pr-4 flex justify-between md:grid grid-cols-12 font-semibold   items-center text-[0.9rem] leading-6 text-gray-400 p-2  border-b border-gray-700">
                <div className="col-span-5">Posts</div>
                <div className="col-span-2 ">isPublished</div>
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
                    {/* Create a post */}
                    Coming Soon...
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {selectedTab === "Playlists" && (
          <>
            <div className="text-center items-center text-lg font-semibold flex justify-center h-[60vh]">
              Coming Soon...
            </div>
            {/* <div className=" rounded">
              <div className="pl-6 pr-4 grid grid-cols-12 font-semibold   items-center text-[0.9rem] leading-6 text-gray-400 p-2  border-b border-gray-700">
                <div className="col-span-4 md:col-span-5 ">Playlist</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2 text-xs md:text-sm">isPublished</div>
                <div className="col-span-3 md:col-span-2 text-xs md:text-sm">
                  Last Updated
                </div>
                <div className="col-span-1 text-xs md:text-sm">Video Count</div>
              </div>
              {videos.map((video, index) => (
                <div
                  key={index}
                  className={`pl-6 pr-4 grid grid-cols-12 items-start p-3 hover:bg-gray-900 ${
                    video?.isPublished ? "opacity-70" : ""
                  }`}
                  onMouseEnter={() => setHoveredVideo(index)}
                  onMouseLeave={() => setHoveredVideo(null)}
                >
                  <div className="col-span-4 md:col-span-5 flex items-start">
                    <div className="col-span-3 md:col-span-4 relative mr-4">
                      <img
                        loading="eager"
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-24 md:w-32 h-16 object-cover rounded"
                      />

                      <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                        {formatDuration(video?.duration)}
                      </span>
                    </div>
                    <div className="col-span-1   ">
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
                        {video?.description}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm  ">Playlists</div>
                  <div className="col-span-2 text-sm ">
                    {video.isPublished ? "True" : "False"}
                  </div>
                  <div className="col-span-3  text-sm font-[500] flex items-center">
                    {formatDate(video?.createdAt)}
                  </div>

                  <div className=" col-span-1 text-sm font-semibold">
                    {video.isPublished}
                  </div>
                </div>
              ))}
            </div> */}
          </>
        )}
      </div>
    </>
  );
};

export default Content;
