import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getallvideos } from "../Api/videoApis";
import { incrementNavigationCount, setNavigating } from "../Redux/navigations";
import { selectVid } from "../Redux/videos";
import { formatDuration, timeAgo } from "../Utilis/FormatDuration";
import { VideoProps } from "../types/videosInterface";

export const RecommendVid = () => {
  const [playlists, setplaylists] = useState<VideoProps[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const handlePlaylist = async () => {
      const response = await getallvideos();
      console.log(response);
      setplaylists(response.data);
    };
    handlePlaylist();
  }, []);
  const handleVid = (videoId: string) => {
    dispatch(setNavigating(true));
    dispatch(incrementNavigationCount());

    navigate(`/watch/${videoId}`);
    dispatch(selectVid(videoId));
  };
  return (
    <>
      <div className="flex flex-col xs:flex-wrap xs:mx-3 xs:justify-between  xs:flex-row lg:flex-row ">
        {playlists != null &&
          playlists.map((video, i) => (
            <Link
              to={`/watch/${video._id}`}
              key={video._id || i}
              className="w-full xs:w-[48%]     lg:w-full flex flex-col sm:flex-row pl-0.5  items-center space-x-0.5 cursor-pointer caret-transparent"
              onClick={() => handleVid(video?._id)}
            >
              <div className="thumbnail relative h-[90%] xs:h-[8rem] sm:h-21 w-full sm:w-auto  xl:h-24 aspect-video  my-2 sm:rounded-xl">
                <img
                  src={video.thumbnail}
                  className="h-full w-full xs:rounded-lg object-cover"
                  alt=""
                />
                <span className="absolute right-0.5 bottom-0.5 bg-black/50 bg-opacity-75 text-white text-[0.7rem] font-semibold px-1  rounded">
                  {formatDuration(video.duration)}
                </span>
              </div>
              <div className="flex pl-2 flex-col justify-start gap-2  h-full ">
                <div className="items-start  font-[500]  leading-6  lg:w-[16vw] lg:max-w-[20vw] overflow-hidden text-ellipsis break-words line-clamp-2">
                  {video.title}
                </div>
                <div className="flex flex-col ">
                  <p className="text-xs text-gray-300 lg:w-[16vw] lg:max-w-[20vw] overflow-hidden text-ellipsis break-words line-clamp-2 ">
                    {video.owner.username}
                  </p>
                  <div className="flex gap-2 sm:gap-1 md:gap-2 sm:text-xs md:text-sm">
                    <p>{video.views} views</p>
                    {timeAgo(video.createdAt)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
};
