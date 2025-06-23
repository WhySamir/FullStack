import { EllipsisVertical, Share2, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
import { getUserChannelProfile } from "../Api/authApi";
import { formatDate, timeAgo } from "../Utilis/FormatDuration";
import { increaseVidViews, userAllvideo } from "../Api/videoApis";
import { selectVid } from "../Redux/videos";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { toggleSubscribe } from "../Api/subscriber";
import { setNavigating } from "../Redux/navigations";
import RedLoader from "./Stdio/Common/RedLoader";
import { VideoProps } from "../types/videosInterface";

interface channelprops {
  avatar: string;
  channelsSubscribedCount: number;
  coverImage: string;
  email: string;
  fullName: string;
  isSubscribed: boolean;
  subscribersCount: number;
  username: string;
  _id: string;
  videosCount: number;
  createdAt: string;
}

const ChannelProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isNavigating } = useSelector((state: RootState) => state.navigation);

  const { authUser } = useSelector((state: RootState) => state.auth);
  const [channelData, setChannelData] = useState<channelprops>();
  const { username } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copy, setcopy] = useState<boolean>();
  const [videos, setVideos] = useState<VideoProps[]>([]);

  useEffect(() => {
    const fetchChannelAndVideos = async () => {
      if (!username) return;

      try {
        dispatch(setNavigating(true));
        const response = await getUserChannelProfile(username);
        const channel = response.data;
        setChannelData(channel);
        // Now fetch videos using the channel's userId
        const videosResponse = await userAllvideo({
          userId: channel._id,
        });

        if (videosResponse) {
          setVideos(videosResponse.data);
        } else {
          console.log("Error fetching videos");
        }
      } catch (err) {
        console.error("Error fetching channel profile or videos:", err);
      } finally {
        setTimeout(() => {
          dispatch(setNavigating(false));
        }, 900);
      }
    };

    fetchChannelAndVideos();
  }, [username, dispatch]);

  console.log("channeldata:", channelData);
  const handleVid = async (videoId: string) => {
    await increaseVidViews({ vidId: videoId });
    dispatch(selectVid(videoId));
    navigate(`/watch/${videoId}`);
  };

  const handleShare = (shareUrl: string) => {
    setcopy(true);
    navigator.clipboard.writeText(shareUrl);
    setTimeout(() => {
      setcopy(false);
    }, 2000);
  };

  const handleSubscribe = async () => {
    if (!authUser?._id || !channelData?._id) return;

    try {
      // Pass CHANNEL ID to the API call
      await toggleSubscribe(channelData._id);

      setChannelData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          isSubscribed: !prev.isSubscribed,
          subscribersCount: prev.isSubscribed
            ? prev.subscribersCount - 1
            : prev.subscribersCount + 1,
        };
      });
    } catch (err) {
      console.error("Subscribe error", err);
    }
  };
  const [tab, setTab] = useState<Number>(0);
  const handleTab = (idx: Number) => {
    setTab(idx);
  };

  useEffect(() => {
    setTimeout(() => {
      if (channelData?.coverImage !== "") {
        const removeSkeleton = document.getElementById("removeSkeleton");
        if (removeSkeleton) {
          removeSkeleton.remove();
        }
      }
    }, 1000);
  }, [channelData?.coverImage]);

  return (
    <>
      {isNavigating && <RedLoader />}
      <div className="mt-12   text-white py-4 ">
        {/* Profile Section */}
        {!channelData?.coverImage && (
          <div
            id="removeSkeleton"
            className="mb-6 px-3  sm:ml-16 bg-neutral-700 h-30 sm:h-48  rounded-2xl"
          ></div>
        )}
        {channelData?.coverImage && (
          <>
            <div
              style={{ backgroundImage: `url(${channelData.coverImage})` }}
              className=" mb-6 mx-3 sm:ml-16 bg-cover bg-center bg-no-repeat h-30 sm:h-48 rounded-lg sm:rounded-2xl "
            ></div>
          </>
        )}
        <div className="flex space-x-4 items-center px-3 sm:pl-16">
          {channelData?.avatar ? (
            <div className="w-24 aspect-square sm:w-44">
              <img
                src={channelData?.avatar}
                className="w-full h-full object-cover rounded-full  "
                alt="User Avatar"
              />
            </div>
          ) : (
            <div className="w-24 aspect-square sm:w-44">
              <UserCircle className="w-full h-full object-cover rounded-full " />
            </div>
          )}
          <div className="flex flex-col items-start sm:w-full sm:space-y-2  ">
            <h2 className=" text-xl sm:text-3xl lg:text-4xl  font-bold">
              {channelData?.fullName}
            </h2>
            <div className="flex flex-col items-start sm:flex-row sm:space-x-2">
              <p className="text-sm ">@{channelData?.username}</p>
              <p className="text-sm text-gray-400">
                {channelData?.subscribersCount} subscribers •{" "}
                {channelData?.videosCount} video
              </p>
            </div>
            <div className="hidden sm:block">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex text-xs pb-2 px-6 sm:px-0 cursor-pointer"
              >
                <p className="text-gray-400 sm:text-sm">
                  More about this channel{" "}
                  <span className="text-white">...more</span>{" "}
                </p>
              </button>
              {channelData?._id !== authUser?._id ? (
                <div className="mt-3 sm:mt-0 px-3 sm:px-0 flex-grow  flex justify-start w-full sm:w-full">
                  <button
                    onClick={handleSubscribe}
                    className="overflow-hidden whitespace-nowrap text-ellipsis text-sm font-medium cursor-pointer h-9   w-1/2 sm:w-auto  justify-center items-center  px-3 py-1    rounded-[2.5rem] flex bg-[#222222] hover:bg-[#333333] "
                  >
                    <span className=" w-full overflow-hidden whitespace-nowrap text-ellipsis">
                      {channelData?.isSubscribed ? "Subscribed" : "Subscribe"}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="mt-3 sm:mt-0 px-3 sm:px-0 flex-grow  flex space-x-2 justify-start w-full sm:w-full">
                  <button
                    onClick={() => navigate(`/stdio/channel/dashboard`)}
                    className="overflow-hidden whitespace-nowrap text-ellipsis text-sm font-medium cursor-pointer h-9   w-1/2 sm:w-auto  justify-center items-center  px-3 py-1    rounded-[2.5rem] flex bg-[#222222] hover:bg-[#333333] "
                  >
                    <span className=" w-full overflow-hidden whitespace-nowrap text-ellipsis">
                      Customize Channel
                    </span>
                  </button>
                  <button
                    onClick={() => navigate(`/stdio/channel/content`)}
                    className="overflow-hidden whitespace-nowrap text-ellipsis text-sm font-medium cursor-pointer h-9   w-1/2 sm:w-auto  justify-center items-center  px-3 py-1    rounded-[2.5rem] flex bg-[#222222] hover:bg-[#333333] "
                  >
                    <span className=" w-full overflow-hidden whitespace-nowrap text-ellipsis">
                      Manage videos
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="block sm:hidden">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex text-xs py-2 px-6 sm:px-0"
          >
            <p className="text-gray-400">
              More about this channel{" "}
              <span className="text-white">...more</span>{" "}
            </p>
          </button>
          <div className="mt-3 sm:mt-0 px-3 sm:px-0 flex-grow  flex space-x-2 justify-start w-full sm:w-full">
            <button
              onClick={() => navigate(`/notAvailableStdio`)}
              className="overflow-hidden whitespace-nowrap text-ellipsis text-sm font-medium cursor-pointer h-9   w-1/2 sm:w-auto  justify-center items-center  px-3 py-1    rounded-[2.5rem] flex bg-[#222222] hover:bg-[#333333] "
            >
              <span className=" w-full overflow-hidden whitespace-nowrap text-ellipsis">
                Customize Channel
              </span>
            </button>
            <button
              onClick={() => navigate(`/notAvailableStdio`)}
              className="overflow-hidden whitespace-nowrap text-ellipsis text-sm font-medium cursor-pointer h-9   w-1/2 sm:w-auto  justify-center items-center  px-3 py-1    rounded-[2.5rem] flex bg-[#222222] hover:bg-[#333333] "
            >
              <span className=" w-full overflow-hidden whitespace-nowrap text-ellipsis">
                Manage videos
              </span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 sm:pl-16 flex justify-evenly sm:justify-start  space-x-8 border-b border-gray-700 mt-4 ">
          <button
            onClick={() => handleTab(0)}
            className={`pb-2 ${
              tab === 0 ? "border-b-2" : "text-gray-400"
            } border-white`}
          >
            Videos
          </button>
          {/* <button
            onClick={() => handleTab(1)}
            className={`pb-2 ${
              tab === 1 ? "border-b-2" : "text-gray-400"
            } border-white`}
          >
            Playlists
          </button> */}
          {/* <button
            onClick={() => handleTab(2)}
            className={`pb-2 ${
              tab === 2 ? "border-b-2" : "text-gray-400"
            } border-white`}
          >
            Posts
          </button> */}
          {/* <button
            onClick={() => handleTab(3)}
            className={`pb-2 ${
              tab === 3 ? "border-b-2" : "text-gray-400"
            } border-white`}
          >
            Search
          </button> */}
        </div>

        {/* Video List */}
        <div className="px-4 sm:pl-16 mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center sm:place-items-start">
            {videos.length > 0 ? (
              videos.map((video, idx) => (
                <div
                  onClick={() => handleVid(video?._id)}
                  key={video._id || idx}
                  className="flex flex-col space-y-2 max-w-70 sm:w-full md:w-72 lg:w-80 xl:w-96 cursor-pointer"
                >
                  <div className="aspect-video bg-gray-700 rounded-md  h-38   ">
                    <img
                      src={video.thumbnail}
                      className="w-full h-full object-cover rounded-md"
                      alt="Video Thumbnail"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5 flex flex-col">
                      <h3 className=" text-xs sm:text-sm font-semibold line-clamp-2 sm:line-clamp-3 xl:line-clamp-none   overflow-hidden h-full  w-full min-h-[1.4rem]">
                        {video.title}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {video.views || 0} views • {timeAgo(video.createdAt)}
                      </p>
                    </div>
                    <div className="h-5 w-5 flex items-center justify-center">
                      <EllipsisVertical />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">No videos yet.</div>
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-10 flex justify-center items-center  bg-opacity-50">
            <div className="bg-neutral-700 p-5 rounded-lg w-72 sm:w-96">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">About</h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="text-gray-400 hover:text-white" />
                </button>
              </div>

              <div className="mt-3 space-y-5 text-sm text-gray-200 font-semibold">
                <h1 className="text-xl font-semibold text-white ">
                  Channel Details
                </h1>
                <p>
                  🌐{" "}
                  <a
                    className="pl-2"
                    href={`${import.meta.env.VITE_FRONTEND_BASE_URL}/username/${
                      channelData?.username
                    }`}
                  >
                    {`${import.meta.env.VITE_FRONTEND_BASE_URL}/username/${
                      channelData?.username
                    }`}{" "}
                  </a>
                </p>
                <p>
                  📅
                  <span className="pl-2">
                    {" "}
                    {formatDate(channelData?.createdAt!)}
                  </span>
                </p>
                <p>
                  👤
                  <span className="pl-2">
                    {channelData?.subscribersCount} subscriber
                  </span>
                </p>
                <p>
                  📹
                  <span className="pl-2">
                    {" "}
                    {channelData?.videosCount} videos{" "}
                  </span>
                </p>
                <p>
                  👀<span className="pl-2"> {channelData?.email} </span>
                </p>
              </div>

              <button
                onClick={() =>
                  handleShare(
                    `${import.meta.env.VITE_FRONTEND_BASE_URL}/username/${
                      channelData?.username
                    }`
                  )
                }
                className="mt-6 flex  space-x-1.5 overflow-hidden whitespace-nowrap text-ellipsis text-sm font-medium cursor-pointer h-9   w-1/2 sm:w-[110px]  justify-center items-center  px-3 py-1    rounded-[2.5rem]  bg-neutral-600 hover:bg-[#333333] "
              >
                {!copy ? (
                  <>
                    <Share2 />
                    <span className="font-semibold w-full overflow-hidden whitespace-nowrap text-ellipsis">
                      Copy Url
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-semibold w-full overflow-hidden whitespace-nowrap text-ellipsis">
                    Copied
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChannelProfile;
