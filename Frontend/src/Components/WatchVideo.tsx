import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { formatDuration } from "../Utilis/FormatDuration";
import { getVidById, userAllvideo } from "../Api/videoApis";
import { timeAgo } from "../Utilis/FormatDuration";
import { useSelector } from "react-redux";
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

  useEffect(() => {
    const getVideoById = async () => {
      if (!vidId) {
        return;
      }

      try {
        const response = await getVidById({ vidId });
        setVideo(response.data);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    getVideoById();
  }, [vidId]);

  const handlePlaylistToggle = () => {
    setplayOpen(!playOpen);
  };
  if (!video) return <p>Video not found</p>;

  return (
    <div className="px-[4vw] relative  text-white grid grid-cols-12 gap-8 items-start ">
      <div className="grid col-span-8 place-content-center  ">
        <video
          ref={videoRef}
          src={video.videoFile}
          onLoadedMetadata={updateHeight}
          controls
          className="  rounded-xl"
        />

        <div className="flex items-center mt-3 caret-transparent text-white">
          <div className="w-full ">
            <h1 className="font-bold text-lg leading-6">{video.title}</h1>
            <div className="mt-3 flex items-center justify-between ">
              <div className="flex">
                <img
                  src={video.owner.avatar}
                  alt="Uploader Avatar"
                  className="w-10 h-10 rounded-full mr-2 object-cover"
                />
                <div>
                  <p className="leading-4 font-semibold">
                    {video.owner.username}
                  </p>
                  <p className="text-sm">Subscribers</p>
                </div>
                <div
                  // onClick={handleCreateClick}
                  className="cursor-pointer  my-0.5 ml-[4vw] items-center  px-3   rounded-[2.5rem] flex bg-white   hover:bg-neutral-300"
                >
                  <span className=" flex tracking-tight text-neutral-900  font-[500] md:font-medium">
                    Subscribe
                  </span>
                </div>
              </div>
              <div className="flex justify-between space-x-2">
                <div className="w-36 h-9 cursor-pointer justify-between font-semibold items-center        rounded-[2.5rem] flex bg-neutral-600 ">
                  <span className="w-full  h-full  rounded-l-[2.5rem] hover:bg-neutral-500  px-3   flex items-center text-white/90 text-xs md:font-medium">
                    <ThumbsUp />
                    <span className=" text-[16px] mx-2.5  "> 0</span>
                  </span>
                  <div className="border-r-2 border-white/40 h-[80%] "></div>
                  <div className=" h-full  px-4 text-lg  hover:bg-neutral-500 rounded-r-[2.5rem] flex items-center text-white/90 sm:text-xs md:font-semibold">
                    <ThumbsDown />
                  </div>
                </div>
                <div className=" h-9 cursor-pointer justify-between font-bold items-center        rounded-[2.5rem] flex bg-neutral-600 ">
                  <span className=" w-full  h-full  rounded-[2.5rem] hover:bg-neutral-500  px-4  flex items-center gap-2 text-white/90 text-xs md:font-medium">
                    <Share2 />
                    <p className="text-[16px] font-semibold">Share</p>
                  </span>
                </div>
                <div className=" h-9 cursor-pointer justify-between font-bold items-center        rounded-[2.5rem] flex bg-neutral-600 ">
                  <span className="w-full  h-full  rounded-[2.5rem] hover:bg-neutral-500  px-4   flex items-center gap-2 text-white/90 text-xs md:font-medium">
                    <Download />
                    <p className="text-[16px] font-semibold">Download</p>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="w-full mt-3 p-3 bg-[#242828] rounded-lg flex flex-col overflow-auto"
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
                        className="w-10 h-10 rounded-full mr-2 object-cover"
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

        <Comments vidId={vidId || ""} />
      </div>
      <div className="grid  col-span-4 overflow-y-auto overflow-x-hidden">
        {playOpen ? (
          <div
            className=" bg-black  border border-white/40 rounded-xl w-full overflow-y-auto overflow-hidden "
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
        <div className="flex flex-col justify-items-start mt-3 ">
          <RecommendVid />
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

  return (
    <>
      <div className="flex flex-col  ">
        <div
          className=" flex items-center justify-between py-3 pr-4  bg-[#212121]"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10, //only if overlapps !
          }}
        >
          <div className="text-white flex flex-col pb-3 ml-4  caret-transparent ">
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
                <div className="title font-[500]  leading-5  w-[16vw] max-w-[20vw] overflow-hidden text-ellipsis break-words line-clamp-2">
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

  return (
    <>
      <div className="flex flex-col  ">
        {playlists != null &&
          playlists.map((video, i) => (
            <div
              key={video._id || i}
              className="flex pl-2  items-center space-x-2 cursor-pointer caret-transparent"
            >
              <div className="thumbnail relative h-21 aspect-video  my-2 rounded-xl">
                <img
                  src={video.thumbnail}
                  className="h-full w-full rounded-lg "
                  alt=""
                />
                <span className="absolute right-0.5 bottom-0.5 bg-black/50 bg-opacity-75 text-white text-[0.7rem] font-semibold px-1  rounded">
                  {formatDuration(video.duration)}
                </span>
              </div>
              <div className="flex pl-2 flex-col justify-evenly h-full  py-2">
                <div className="items-start title font-[500]  leading-5  w-[16vw] max-w-[20vw] overflow-hidden text-ellipsis break-words line-clamp-2">
                  {video.title}
                </div>
                <div className="flex flex-col ">
                  <p className="text-xs text-gray-300 ">
                    {video.owner.username}
                  </p>
                  <div className="flex gap-2">
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
