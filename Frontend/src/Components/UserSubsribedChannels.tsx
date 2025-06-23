import { useEffect, useState } from "react";
import { getUserSubcribedChannel, toggleSubscribe } from "../Api/subscriber";
import { RootState } from "../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Bell } from "lucide-react";
import { setNavigating } from "../Redux/navigations";
import RedLoader from "./Stdio/Common/RedLoader";

interface Channel {
  _id: string;
  email: string;
  fullName: string;
  username: string;
  avatar: string;
}

interface Subscription {
  channel: Channel;
  avatar: string;
  subscriberCount: number;
  videoCount: number;
  isSubscribed: boolean; // Add this if API supports it
}

const UserSubscribedChannels = () => {
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [userSubscribedChannels, setUserSubscribedChannels] = useState<
    Subscription[]
  >([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!authUser) return;

    const fetchUserSubscriptions = async () => {
      try {
        setLoadingVideos(true);
        dispatch(setNavigating(true));
        const response = await getUserSubcribedChannel(authUser._id);
        await new Promise((resolve) => setTimeout(resolve, 800));
        const subscriptionsWithStatus = response.data.map(
          (channel: Subscription) => ({
            ...channel,
            isSubscribed: true,
          })
        );

        setUserSubscribedChannels(subscriptionsWithStatus);
      } catch (error) {
        console.error("Failed to fetch subscriptions", error);
        setLoadingVideos(false);
        dispatch(setNavigating(false));
      } finally {
        setLoadingVideos(false);
        dispatch(setNavigating(false));
      }
    };

    fetchUserSubscriptions();
  }, [authUser, dispatch]);

  const handleSubscribe = async (channelId: string) => {
    try {
      await toggleSubscribe(channelId);
      setUserSubscribedChannels((prev) =>
        prev.map((item) =>
          item.channel._id === channelId
            ? {
                ...item,
                isSubscribed: !item.isSubscribed,
                subscriberCount:
                  item.subscriberCount + (item.isSubscribed ? -1 : 1),
              }
            : item
        )
      );
    } catch (error) {
      console.error("Subscription toggle failed:", error);
    }
  };
  // if (!loadingVideos && userSubscribedChannels.length === 0) {
  //   return <div className="hero px-4 mt-3">No Subscribed Channels</div>;
  // }

  return (
    <div className="mt-12 sm:mt-14 px-4 py-2 w-full flex flex-col items-center justify-center">
      <div className="w-[60vw] items-start flex flex-col justify-center text-white">
        <h1 className="text-4xl my-3 font-bold mb-6">All subscriptions</h1>

        {loadingVideos ? (
          <div className="w-full">
            <RedLoader />
          </div>
        ) : userSubscribedChannels.length > 0 ? (
          userSubscribedChannels.map((channel) => (
            <div
              key={channel.channel._id}
              className="flex items-center mx-auto w-full justify-between mb-6 border-b border-gray-700 pb-4"
            >
              <div className="flex gap-4">
                <img
                  src={channel.channel.avatar}
                  alt={channel.channel.username}
                  className="w-16 h-16 sm:w-28 sm:h-28 rounded-full object-cover"
                />
                <div className="items-start flex flex-col justify-center">
                  <h2 className="text-lg font-semibold">
                    {channel.channel.username}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {channel.channel.fullName} · {channel.subscriberCount}{" "}
                    subscribers
                  </p>
                  <p className="mt-1 text-sm text-gray-300">
                    {channel.videoCount} videos
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleSubscribe(channel.channel._id)}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                  channel.isSubscribed
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-blue-600 text-white hover:bg-blue-500"
                }`}
              >
                <Bell className="w-4 h-4" />
                {channel.isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>
          ))
        ) : (
          <div className="flex items-center w-full justify-center h-100 relative text-white text-lg">
            No subscriptions found
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSubscribedChannels;
