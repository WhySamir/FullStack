import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { formatDuration } from "../Utilis/FormatDuration";
import { getVidById, userAllvideo } from "../Api/videoApis";
import { timeAgo } from "../Utilis/FormatDuration";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";

import {
  ChevronDown,
  Download,
  Play,
  Share2,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";

import Comments from "./Comments";
import { toggleLike_Dislike } from "../Api/like";
import { selectVid } from "../Redux/videos";

interface VideoProps {
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  videoFile: string;
  isPublished: boolean;
  views: number | null;
  owner: {
    _id: string;
    username: string;
    avatar: string;
  };
  isLikedByUser: boolean;
  isDislikedByUser: boolean;
  likesCount: number;
  updatedAt: string;
  createdAt: string;
  _id: string;
}

const WatchVideo = () => {
  const { vidId } = useParams();
  const [video, setVideo] = useState<VideoProps | null>(null);
  const [vidHeight, setvidHeight] = useState<number>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playOpen, setplayOpen] = useState<boolean>(false);
  const [more, setMore] = useState(false);
  const [likes, setLikes] = useState<{ [key: string]: boolean }>({});
  const [dislikes, setDislikes] = useState<{ [key: string]: boolean }>({});

  const updateHeight = () => {
    if (videoRef.current) {
      const totalHeight = videoRef.current.clientHeight;
      setvidHeight(totalHeight);
    }
  };
  useEffect(() => {
    const handleResize = () => updateHeight();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getVideoById = async () => {
    if (!vidId) {
      return;
    }
    try {
      const response = await getVidById({ vidId });
      setVideo(response.data);
      setLikes({ [vidId]: response.data.isLikedByUser });
      setDislikes({ [vidId]: response.data.isDislikedByUser });
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  useEffect(() => {
    getVideoById();
  }, [vidId]);

  const handleVideoLike = async (videoId: string) => {
    if (!video) return;

    // Optimistically update UI
    setLikes((prev) => ({ ...prev, [videoId]: !prev[videoId] }));
    setDislikes((prev) => ({ ...prev, [videoId]: false }));

    // Adjust likesCount instantly
    setVideo((prev) =>
      prev
        ? {
            ...prev,
            likesCount: prev.likesCount + (likes[videoId] ? -1 : 1),
          }
        : prev
    );

    try {
      const response = await toggleLike_Dislike({
        ObjId: videoId,
        type: "like",
        contentType: "Video",
      });

      if (response.status === 200) {
        // Update state based on API response
        setLikes((prev) => ({ ...prev, [videoId]: response.isLikedByUser }));
        setDislikes((prev) => ({
          ...prev,
          [videoId]: response.isDislikedByUser,
        }));
        setVideo((prev) =>
          prev ? { ...prev, likesCount: response.totalLikes } : prev
        );
      } else {
        // Revert UI if API fails
        setLikes((prev) => ({ ...prev, [videoId]: !prev[videoId] }));
        setVideo((prev) =>
          prev
            ? {
                ...prev,
                likesCount: prev.likesCount - (likes[videoId] ? -1 : 1),
              }
            : prev
        );
      }
    } catch (error) {
      console.log("Error liking video", error);
      // Revert UI on error
      setLikes((prev) => ({ ...prev, [videoId]: !prev[videoId] }));
      setVideo((prev) =>
        prev
          ? {
              ...prev,
              likesCount: prev.likesCount - (likes[videoId] ? -1 : 1),
            }
          : prev
      );
    }
  };

  const handleVideoDisLike = async (videoId: string) => {
    if (!video) return;

    const wasDisliked = dislikes[videoId]; // Check if user already disliked
    const wasLiked = likes[videoId]; // Check if user liked before clicking dislike

    // Optimistic UI update
    setDislikes((prev) => ({ ...prev, [videoId]: !prev[videoId] }));
    setLikes((prev) => ({ ...prev, [videoId]: false }));

    // Adjust likes count immediately (only decrease if user was liking before)
    setVideo((prev) =>
      prev
        ? {
            ...prev,
            likesCount: prev.likesCount - (wasLiked ? 1 : 0),
          }
        : prev
    );

    try {
      const response = await toggleLike_Dislike({
        ObjId: videoId,
        type: "dislike",
        contentType: "Video",
      });

      if (response.status === 200) {
        setLikes((prev) => ({ ...prev, [videoId]: response.isLikedByUser }));
        setDislikes((prev) => ({
          ...prev,
          [videoId]: response.isDislikedByUser,
        }));
        setVideo((prev) =>
          prev ? { ...prev, likesCount: response.totalLikes } : prev
        );
      } else {
        // Revert UI if API fails
        setDislikes((prev) => ({ ...prev, [videoId]: wasDisliked }));
        setLikes((prev) => ({ ...prev, [videoId]: wasLiked }));
        setVideo((prev) =>
          prev
            ? {
                ...prev,
                likesCount: prev.likesCount + (wasLiked ? 1 : 0),
              }
            : prev
        );
      }
    } catch (error) {
      console.log("Error disliking video", error);
      // Revert UI if API fails
      setDislikes((prev) => ({ ...prev, [videoId]: wasDisliked }));
      setLikes((prev) => ({ ...prev, [videoId]: wasLiked }));
      setVideo((prev) =>
        prev
          ? {
              ...prev,
              likesCount: prev.likesCount + (wasLiked ? 1 : 0),
            }
          : prev
      );
    }
  };

  const handlePlaylistToggle = () => {
    setplayOpen(!playOpen);
  };
  if (!video) return <p>Video not found</p>;

  return (
    <div className="mt-14  ">
      <div className="sm:mx-auto sm:max-w-[1400px] h-full sm:px-6 lg:px-8   text-white">
        <div className="  flex flex-col lg:grid grid-cols-12  items-start   ">
          <div className="flex flex-col   lg:col-span-8  sm:place-content-center  lg:mr-6">
            <div className="aspect-video bg-black sm:rounded-xl overflow-hidden shadow-2xl">
              <video
                ref={videoRef}
                src={video.videoFile}
                onLoadedMetadata={updateHeight}
                controls
                className="w-full h-full object-cover"
              />
            </div>

            <div className=" w-full mt-3 caret-transparent ">
              <div className="w-full px-2.5 sm:px-0">
                <h1 className="font-bold text-lg sm:leading-6">
                  {video.title}
                </h1>
                <div className="mt-3 space-y-2 sm:flex items-start justify-between ">
                  <div className="flex items-start sm:gap-2 justify-between">
                    <div className="flex gap-2 items-center">
                      <img
                        src={video.owner.avatar}
                        alt=" Avatar"
                        className="sm:w-10 sm:h-10 w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="leading-4 font-semibold">
                          {video.owner.username}
                        </p>
                        <p className="text-xxs">Subscribers</p>
                      </div>
                    </div>
                    <div className="sm:flex-grow flex justify-center md:ml-[3vw] lg:ml-3">
                      <button
                        // onClick={handleCreateClick}
                        className="cursor-pointer h-9   items-center  px-4 py-1    rounded-[2.5rem] flex bg-white   hover:bg-neutral-300"
                      >
                        <span className=" flex tracking-tight text-neutral-900  font-[500] md:font-medium">
                          Subscribe
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="flex  justify-between xs:justify-normal xs:space-x-6 sm:space-x-2">
                    <div className="w-27 xs:w-30 md:w-36 h-9 cursor-pointer  font-semibold items-center  rounded-[2.5rem] flex bg-neutral-600 ">
                      <button
                        onClick={() => handleVideoLike(video._id)}
                        className="w-full  h-full  rounded-l-[2.5rem] hover:bg-neutral-500  px-2 sm:px-3   flex items-center text-white/90 text-xs md:font-medium"
                      >
                        <span
                          className={` ${
                            likes[video._id] ? "text-blue-500" : ""
                          }`}
                        >
                          <ThumbsUp size={20} />
                        </span>
                        <span className="text-sm md:text-[16px] mx-2.5  ">
                          {video.likesCount ?? 0}
                        </span>
                      </button>
                      <div className="border-r-2 border-white/30 h-[80%] "></div>
                      <button
                        onClick={() => handleVideoDisLike(video._id)}
                        className=" h-full  px-4 text-lg  hover:bg-neutral-500 rounded-r-[2.5rem] flex items-center text-white/90 sm:text-xs md:font-semibold"
                      >
                        <span
                          className={`${
                            dislikes[video._id] ? "text-blue-500" : ""
                          }`}
                        >
                          <ThumbsDown size={20} />
                        </span>
                      </button>
                    </div>
                    <div className=" h-9 cursor-pointer justify-between font-bold items-center        rounded-[2.5rem] flex bg-neutral-600 ">
                      <span className=" w-full  h-full  rounded-[2.5rem] hover:bg-neutral-500  px-3  flex items-center gap-2 text-white/90 text-xs md:font-medium">
                        <Share2 size={16} />
                        <p className="text-xs md:text-[16px] font-semibold">
                          Share
                        </p>
                      </span>
                    </div>
                    <div className=" h-9 cursor-pointer justify-between font-bold items-center        rounded-[2.5rem] flex bg-neutral-600 ">
                      <span className="w-full  h-full  rounded-[2.5rem] hover:bg-neutral-500  px-3   flex items-center gap-2 text-white/90 text-xs md:font-medium">
                        <Download size={16} />
                        <p className="text-xs md:text-[16px] font-semibold">
                          Download
                        </p>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="ml-2 mr-2 sm:ml-0 sm:mr-0 mt-3 p-3 bg-[#242828] rounded-lg flex flex-col "
              style={{ minHeight: "5rem" }}
            >
              <div className="flex flex-col ">
                <div className="flex gap-3 font-semibold">
                  {video.views} views
                  <p>{timeAgo(video.updatedAt)}</p>
                </div>
                <div className="text-sm line-clamp-3">{video.description}</div>
                <div
                  onClick={() => {
                    setMore(true);
                  }}
                  className={` ${
                    more ? "hidden" : "block"
                  } font-semibold cursor-pointer`}
                >
                  ...more
                </div>
                {more && (
                  <>
                    <div className="cursor-pointer">
                      <div className="mt-4 flex items-center justify-between ">
                        <div className="flex">
                          <img
                            src={video.owner.avatar}
                            alt="Uploader Avatar"
                            className="sm:w-10 sm:h-10 w-8 h-8 rounded-full mr-2 object-cover"
                          />
                          <div>
                            <p className="leading-4 font-semibold">
                              {video.owner.username}
                            </p>
                            <p className="text-sm">Subscribers</p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="mt-6"
                        onClick={() => {
                          setMore(false);
                        }}
                      >
                        Show Less
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className=" hidden lg:block">
              <Comments vidId={vidId || ""} />
            </div>
          </div>
          <div className=" flex flex-col lg:col-span-4  mt-8 lg:mt-0 space-y-6 ">
            {playOpen ? (
              <div
                className=" bg-black  border border-white/40 rounded-xl w-full  overflow-hidden "
                style={{ height: vidHeight }}
              >
                <Playlists handlePlaylistToggle={handlePlaylistToggle} />
              </div>
            ) : (
              <div
                className="  border border-white/40 rounded-xl w-full overflow-hidden flex items-center justify-between py-4 pr-4 rounded-t-xl bg-[#212121]"
                style={{ height: " 4rem" }}
                onClick={handlePlaylistToggle}
              >
                <div className="text-white flex flex-col  ml-4  caret-transparent ">
                  <h1 className="font-semibold ">Playlists Name</h1>
                  <p className="text-sm text-gray-300">WatchFree Mix</p>
                </div>
                <div className="h-9 w-9 p-1 rounded-full hover:bg-neutral-600 items-center flex">
                  <ChevronDown strokeWidth={1} size={36} />
                </div>
              </div>
            )}
            <div className=" flex flex-col justify-items-start mt-3 ">
              <RecommendVid />
            </div>
          </div>
          <div className="pl-2 pr-2 sm:pl-0 sm:pr-0 lg:hidden w-full mb-8">
            <Comments vidId={vidId || ""} />
          </div>
        </div>
      </div>
    </div>
  );
};
interface PlaylistsProps {
  handlePlaylistToggle: () => void;
}

const Playlists: React.FC<PlaylistsProps> = ({ handlePlaylistToggle }) => {
  const [playlists, setplaylists] = useState<Video[]>([]);
  const { authUser } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const handlePlaylist = async () => {
      if (authUser != null) {
        const response = await userAllvideo({ userId: authUser._id });
        console.log(response);
        setplaylists(response.data);
      }
    };
    handlePlaylist();
  }, []);
  const handleVid = (videoId: string) => {
    navigate(`/watch/${videoId}`);
    dispatch(selectVid(videoId));
  };

  return (
    <>
      <div className="flex flex-col w-full h-full overflow-y-auto ">
        <div
          className=" flex items-start justify-between py-3 pr-4 pb-3  rounded-t-xl bg-[#212121]"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div className="text-white flex flex-col  ml-4   caret-transparent ">
            <h1 className="font-semibold ">Playlists Name</h1>
            <p className="text-sm text-gray-300">
              Mixes are playlists youtube makes for you
            </p>
          </div>
          <div className="h-9 w-9 p-1 rounded-full hover:bg-neutral-600 items-center flex">
            <X onClick={handlePlaylistToggle} strokeWidth={1} size={36} />
          </div>
        </div>
        {playlists != null &&
          playlists.map((video, i) => (
            <div
              key={video._id || i}
              className="flex pl-2    hover:bg-[#1D2521] items-center space-x-2 cursor-pointer caret-transparent"
              onClick={() => handleVid(video._id)}
            >
              <Play strokeWidth={1} size={16} />
              <div className="thumbnail relative h-14 aspect-video  my-2 rounded-xl">
                <img
                  src={video.thumbnail}
                  className="h-full w-full rounded-lg object-cover"
                  alt=""
                />
                <span className="absolute right-0.5 bottom-0.5 bg-black/50 bg-opacity-75 text-white text-[0.7rem] font-semibold px-1  rounded">
                  {formatDuration(video.duration)}
                </span>
              </div>
              <div className="flex pl-2 flex-col justify-evenly h-full  py-2">
                <div className="title font-[500]  leading-5  lg:w-[16vw] lg:max-w-[20vw] overflow-hidden text-ellipsis break-words line-clamp-2">
                  {video.title}
                </div>
                <p className="text-xs text-gray-300 ">{video.owner.username}</p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

const RecommendVid = () => {
  const [playlists, setplaylists] = useState<Video[]>([]);
  const { authUser } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const handlePlaylist = async () => {
      if (authUser != null) {
        const response = await userAllvideo({ userId: authUser._id });
        console.log(response);
        setplaylists(response.data);
      }
    };
    handlePlaylist();
  }, []);
  const handleVid = (videoId: string) => {
    navigate(`/watch/${videoId}`);
    dispatch(selectVid(videoId));
  };
  return (
    <>
      <div className="flex flex-col xs:flex-wrap xs:gap-x-2  xs:flex-row lg:flex-row ">
        {playlists != null &&
          playlists.map((video, i) => (
            <div
              key={video._id || i}
              className="w-full xs:w-[48%]     lg:w-full flex flex-col sm:flex-row pl-0.5  items-center space-x-0.5 cursor-pointer caret-transparent"
              onClick={() => handleVid(video?._id)}
            >
              <div className="thumbnail relative h-[90%] xs:h-[8rem] sm:h-21 w-full sm:w-auto aspect-video  my-2 sm:rounded-xl">
                <img
                  src={video.thumbnail}
                  className="h-full w-full sm:rounded-lg "
                  alt=""
                />
                <span className="absolute right-0.5 bottom-0.5 bg-black/50 bg-opacity-75 text-white text-[0.7rem] font-semibold px-1  rounded">
                  {formatDuration(video.duration)}
                </span>
              </div>
              <div className="flex pl-2 flex-col justify-evenly h-full  py-2">
                <div className="items-start  font-[500]  leading-6  lg:w-[16vw] lg:max-w-[20vw] overflow-hidden text-ellipsis break-words line-clamp-2">
                  {video.title}
                </div>
                <div className="flex flex-col ">
                  <p className="text-xs text-gray-300 ">
                    {video.owner.username}
                  </p>
                  <div className="flex gap-2 sm:gap-1 md:gap-2 sm:text-xs md:text-sm">
                    <p>{video.views} views</p>
                    {timeAgo(video.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default WatchVideo;
interface Video {
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  videoFile: string;
  isPublished: boolean;
  views: number | null;
  owner: {
    _id: string;
    username: string;
    avatar: string;
  };
  updatedAt: string;
  createdAt: string;
  _id: string;
}
