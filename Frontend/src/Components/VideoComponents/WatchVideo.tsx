import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { timeAgo } from "../../Utilis/FormatDuration";
import { VideoPlayer } from "./VideoPlayer";
import { VideoActions } from "./VideoActions";
import { useVideoData } from "../../hooks/useVideoData";
import Comments from "../Comments";
import { Playlists } from "../Playlists";
import { RecommendVid } from "../RecommendVid";
import { toggleSubscribe } from "../../Api/subscriber";
import { getLikedVideos, toggleLike_Dislike } from "../../Api/like";

import { SkeletonWatchVid } from "./SkeletonWatchVid";
import RedLoader from "../Common/RedLoader";
import { VideoProps } from "../../types/videosInterface";
import { ChevronDown } from "lucide-react";
import { increaseVidViews } from "../../Api/videoApis";

const WatchVideo = () => {
  const { vidId } = useParams();
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [vidHeight, setVidHeight] = useState<number>();

  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [dislikes, setDislikes] = useState<Record<string, boolean>>({});
  const [subscribed, setSubscribed] = useState<Record<string, boolean>>({});
  const [playOpen, setPlayOpen] = useState(true);
  const { video: fetchedVideo, loading } = useVideoData(vidId);
  const [localVideo, setLocalVideo] = useState<VideoProps | null>(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const playlistType = searchParams.get("playlist");
  const [playlistVideos, setPlaylistVideos] = useState<VideoProps[]>([]);
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [vidId]);

  useEffect(() => {
    const getLikedVid = async () => {
      try {
        const response = await getLikedVideos();
        console.log("Fetched liked videos:", response);
        setPlaylistVideos(response.data);
        setPlaylistTitle("Liked Videos");
        setPlaylistDescription("Your liked videos playlist.");
      } catch (error) {
        console.error("Failed to fetch liked videos:", error);
      }
    };

    if (playlistType === "liked") {
      getLikedVid();
    }
  }, [playlistType, authUser]);

  useEffect(() => {
    if (fetchedVideo) {
      // console.log(fetchedVideo);
      increaseVidViews({ vidId: fetchedVideo._id });
      setLocalVideo(fetchedVideo);
      setLikes({ [fetchedVideo._id]: fetchedVideo.isLikedByUser });
      setDislikes({ [fetchedVideo._id]: fetchedVideo.isDislikedByUser });
      setSubscribed({ [fetchedVideo._id]: fetchedVideo.isSubscribedByUser });
    }
  }, [fetchedVideo]);

  const handlePlaylistToggle = () => setPlayOpen(!playOpen);

  const handleSubscribe = async (videoId: string) => {
    if (!authUser) {
      alert("Please sign in to subscribe.");
      return;
    }
    if (!localVideo) return;
    try {
      await toggleSubscribe(localVideo.owner._id);
      const isNowSubscribed = !subscribed[videoId];

      setSubscribed((prev) => ({ ...prev, [videoId]: isNowSubscribed }));
      setLocalVideo((prev) =>
        prev
          ? {
              ...prev,
              subscribersCount:
                prev.subscribersCount + (isNowSubscribed ? 1 : -1),
            }
          : prev
      );
    } catch (error) {
      console.error("Subscription failed:", error);
    }
  };

  if (loading)
    return (
      <>
        <RedLoader />
        <SkeletonWatchVid />
      </>
    );
  if (!localVideo) return <p>Video not found</p>;

  return (
    <div className="mt-14">
      <div className="sm:mx-auto sm:max-w-[1400px] h-full sm:px-6 lg:pl-8 text-white">
        <div className="flex flex-col lg:grid grid-cols-12 items-start">
          <div className="flex flex-col lg:col-span-8 lg:mr-6">
            <VideoPlayer video={localVideo} onHeightChange={setVidHeight} />

            <VideoMetadata
              video={localVideo}
              setVideo={setLocalVideo}
              subscribed={subscribed}
              onSubscribe={handleSubscribe}
              authUser={authUser}
              likes={likes}
              dislikes={dislikes}
              setLikes={setLikes}
              setDislikes={setDislikes}
            />

            <VideoDescription video={localVideo} />
            <div className="px-2 xs:px-4 sm:px-0 sm:hidden lg:block w-full sm:mb-8">
              <Comments vidId={localVideo._id || ""} />
            </div>
          </div>
          <div className=" flex flex-col lg:col-span-4  mt-8 lg:mt-0 space-y-4 ">
            {playlistVideos &&
              playlistVideos.length > 0 &&
              (playOpen ? (
                <Playlists
                  playlistTitle={playlistTitle}
                  playlistDescription={playlistDescription}
                  playlistVideos={playlistVideos}
                  vidHeight={vidHeight}
                  handlePlaylistToggle={handlePlaylistToggle}
                  currentVideoId={localVideo?._id || ""}
                />
              ) : (
                <div
                  className="  border border-white/40 rounded-xl w-full overflow-hidden flex items-center justify-between  pr-4 rounded-t-xl bg-[#212121]"
                  style={{ height: " 4rem" }}
                  onClick={handlePlaylistToggle}
                >
                  <div className="text-white flex flex-col  ml-4  caret-transparent ">
                    <h1 className="font-semibold ">{playlistTitle}</h1>
                    <p className="text-sm text-gray-300">
                      {playlistDescription}
                    </p>
                  </div>
                  <div className="h-9 w-9 p-1 rounded-full hover:bg-neutral-600 items-center flex">
                    <ChevronDown strokeWidth={1} size={36} />
                  </div>
                </div>
              ))}
            <div className=" flex flex-col justify-items-start mt-4 lg:mt-0 ">
              <RecommendVid />
            </div>
          </div>
          <div className="px-2 xs:px-4 sm:px-0 hidden sm:block lg:hidden w-full sm:mb-8">
            <Comments vidId={vidId || ""} />
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoMetadata = ({
  video,
  setVideo,
  subscribed,
  onSubscribe,
  authUser,
  likes,
  setLikes,
  dislikes,
  setDislikes,
}: {
  video: VideoProps;
  setVideo: React.Dispatch<React.SetStateAction<VideoProps | null>>;
  subscribed: Record<string, boolean>;
  onSubscribe: (videoId: string) => void;
  authUser: any;
  likes: Record<string, boolean>;
  setLikes: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  dislikes: Record<string, boolean>;
  setDislikes: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) => {
  const handleVideoLike = async (videoId: string) => {
    if (!authUser) {
      alert("Please sign in to like.");
      return;
    }
    if (!video) return;
    const wasLiked = likes[videoId];

    try {
      const response = await toggleLike_Dislike({
        ObjId: videoId,
        type: "like",
        contentType: "Video",
      });

      setLikes((prev) => ({ ...prev, [videoId]: response.isLikedByUser }));
      setDislikes((prev) => ({
        ...prev,
        [videoId]: response.isDislikedByUser,
      }));
      setVideo((prev) =>
        prev
          ? {
              ...prev,
              likesCount: response.totalLikes,
              isLikedByUser: response.isLikedByUser,
              isDislikedByUser: response.isDislikedByUser,
            }
          : prev
      );
    } catch (error) {
      setLikes((prev) => ({ ...prev, [videoId]: wasLiked }));
    }
  };

  const handleVideoDisLike = async (videoId: string) => {
    if (!authUser) {
      alert("Please sign in to dislike.");
      return;
    }
    if (!video) return;
    const wasDisliked = dislikes[videoId];

    try {
      const response = await toggleLike_Dislike({
        ObjId: videoId,
        type: "dislike",
        contentType: "Video",
      });

      setDislikes((prev) => ({
        ...prev,
        [videoId]: response.isDislikedByUser,
      }));
      setLikes((prev) => ({ ...prev, [videoId]: response.isLikedByUser }));
      setVideo((prev) =>
        prev
          ? {
              ...prev,
              likesCount: response.totalLikes,
              isLikedByUser: response.isLikedByUser,
              isDislikedByUser: response.isDislikedByUser,
            }
          : prev
      );
    } catch (error) {
      setDislikes((prev) => ({ ...prev, [videoId]: wasDisliked }));
    }
  };

  return (
    <div className="pl-1 w-full mt-3 caret-transparent ">
      <div className="w-full px-2.5 xs:px-3 sm:px-0">
        <h1 className="font-bold text-lg sm:leading-6">{video.title}</h1>
        <div className="mt-3 space-y-2 md:flex items-start justify-between ">
          <ChannelInfo
            video={video}
            subscribed={subscribed}
            onSubscribe={onSubscribe}
            authUser={authUser}
          />
          <VideoActions
            video={video}
            onLike={() => handleVideoLike(video._id)}
            onDislike={() => handleVideoDisLike(video._id)}
            isLiked={!!likes[video._id]}
            isDisliked={!!dislikes[video._id]}
            authUser={authUser}
          />
        </div>
      </div>
    </div>
  );
};

const ChannelInfo = ({
  video,
  subscribed,
  onSubscribe,
  authUser,
}: {
  video: VideoProps;
  subscribed: Record<string, boolean>;
  onSubscribe: (videoId: string) => void;
  authUser: any;
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-start sm:gap-2 justify-between">
      <div
        onClick={() => navigate(`/username/${video.owner.username}`)}
        className="flex gap-2 items-center"
      >
        <img
          src={video.owner.avatar}
          alt=" Avatar"
          className="sm:w-10 sm:h-10 w-8 h-8 rounded-full object-cover"
        />
        <div className="cursor-default md:w-20 lg:w-full overflow-hidden whitespace-nowrap text-ellipsis">
          <h3 className="font-semibold w-full overflow-hidden whitespace-nowrap text-ellipsis">
            {video.owner.username}
          </h3>
          <p className="text-xs">{video.subscribersCount} subscribers</p>
        </div>
      </div>
      {video.owner._id === authUser?._id ? (
        <div className="hidden sm:flex-grow sm:flex gap-1 xl:gap-2 justify-end  lg:ml-3">
          <button
            onClick={() => navigate(`/stdio/channel/analytics`)}
            className="cursor-pointer h-9   items-center  px-4 py-1    rounded-[2.5rem] flex bg-[#3EA6FF]   hover:bg-[#64B8FF]"
          >
            <span className="flex tracking-tight text-neutral-900 font-[500] md:font-medium">
              Analytics
            </span>
          </button>
          <button
            onClick={() => navigate(`/stdio/channel/content/${video._id}`)}
            className="cursor-pointer h-9   items-center  px-4 py-1    rounded-[2.5rem] flex bg-[#3EA6FF]   hover:bg-[#64B8FF]"
          >
            <span className="flex whitespace-nowrap tracking-tight text-neutral-900 font-[500] md:font-medium">
              Edit Video
            </span>
          </button>
        </div>
      ) : (
        <div className="sm:flex-grow flex justify-center sm:justify-end md:ml-[3vw] lg:ml-2 xl:ml-3">
          <button
            onClick={() => onSubscribe(video._id)}
            className={`${
              subscribed[video._id]
                ? "bg-neutral-500 "
                : "bg-white hover:bg-neutral-300"
            } cursor-pointer h-9   items-center  px-4 py-1    rounded-[2.5rem] flex    `}
          >
            <span
              className={`${
                subscribed[video._id] ? " text-white" : "text-neutral-900"
              } flex  tracking-tight text-neutral-900 font-[500] md:font-medium`}
            >
              {subscribed[video._id] ? "Subscribed" : "Subscribe"}{" "}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

const VideoDescription = ({ video }: { video: VideoProps }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="mx-2 xs:mx-3 sm:mx-0 mt-3 p-3 bg-[#242828] rounded-lg flex flex-col "
      style={{ minHeight: "5rem" }}
    >
      <div className="flex flex-col ">
        <div className="flex gap-3 font-semibold">
          {video.views} views
          <p>{timeAgo(video.createdAt)}</p>
        </div>
        <div className="text-sm line-clamp-3">{video.description}</div>
        <div
          onClick={() => {
            setExpanded(true);
          }}
          className={` ${
            expanded ? "hidden" : "block"
          } font-semibold cursor-pointer`}
        >
          ...more
        </div>
        {expanded && (
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
                    <p className="text-sm mt-1">
                      {video.subscribersCount} Subscribers
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="mt-6"
                onClick={() => {
                  setExpanded(false);
                }}
              >
                Show Less
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WatchVideo;
