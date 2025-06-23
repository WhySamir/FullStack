import { useEffect, useState } from "react";
import { getUserSubcribedChannel } from "../Api/subscriber";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { userAllvideo } from "../Api/videoApis";
import Video from "./VideoComponents/AllVideos";
import { useNavigate } from "react-router-dom";
import { setNavigating } from "../Redux/navigations";
import RedLoader from "./Stdio/Common/RedLoader";
import SkeletonLandingVid from "./VideoComponents/SkeletonLandingVid";

interface Collapse {
  isCollapsed: boolean;
}

const UserSubscription: React.FC<Collapse> = ({ isCollapsed }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showEmpty, setShowEmpty] = useState(false);

  const { authUser } = useSelector((state: RootState) => state.auth);
  const [userSubscribedChannels, setUserSubscribedChannels] = useState<any[]>(
    []
  );
  const [loadingVideos, setLoadingVideos] = useState(false);

  const { isNavigating } = useSelector((state: RootState) => state.navigation);

  const [subscribedChannelsVideos, setSubscribedChannelsVideos] = useState<
    any[]
  >([]);

  useEffect(() => {
    if (!authUser) return;

    const fetchUserSubscriptions = async () => {
      setLoadingVideos(true);
      dispatch(setNavigating(true));
      try {
        const response = await getUserSubcribedChannel(authUser._id);
        console.log(response.data);
        setUserSubscribedChannels(response.data);
      } catch (error) {
        console.error("Failed to fetch subscriptions", error);
      } finally {
        setLoadingVideos(false);
        dispatch(setNavigating(false));
      }
    };

    fetchUserSubscriptions();
  }, [authUser, dispatch]);
  //aba userSubscribedChannels i.e id bata video nikalne

  useEffect(() => {
    if (userSubscribedChannels.length === 0) {
      console.log("no subscribed channels found");
      setLoadingVideos(false);
      dispatch(setNavigating(false));

      return;
    }
    const fetchVideosFromSubscribedChannels = async () => {
      setLoadingVideos(true);
      try {
        const videoRequests = userSubscribedChannels.map((obj) => {
          const result = userAllvideo({ userId: `${obj.channel._id}` });
          return result;
        });

        const responses = await Promise.all(videoRequests);

        const allVideos = responses.flatMap((res) => {
          return Array.isArray(res.data) ? res.data : [];
        }); // Merge all video arrays
        console.log("All subscribed channel videos:", allVideos);

        setSubscribedChannelsVideos(allVideos);
      } catch (error) {
        console.error("Failed to fetch subscribed channel videos", error);
        setLoadingVideos(false);
      } finally {
        setLoadingVideos(false);
        dispatch(setNavigating(false));
      }
    };

    fetchVideosFromSubscribedChannels();
  }, [userSubscribedChannels, dispatch]);

  useEffect(() => {
    if (!loadingVideos && subscribedChannelsVideos.length === 0) {
      const timer = setTimeout(() => {
        setShowEmpty(true);
      }, 2000); // 1 second delay

      return () => clearTimeout(timer);
    } else {
      setShowEmpty(false);
    }
  }, [loadingVideos, subscribedChannelsVideos]);

  return (
    <>
      {isNavigating || loadingVideos ? (
        <>
          <RedLoader />
          <div className="mt-12 sm:mt-30 flex flex-col sm:grid grid-cols-12 gap-y-2  ">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={idx}
                className={`2xl:col-span-3 ${
                  isCollapsed ? "xl:col-span-3" : "xl:col-span-4"
                }  lg:col-span-4  md:col-span-6  col-span-12 cursor-pointer caret-transparent`}
              >
                <SkeletonLandingVid />
              </div>
            ))}
          </div>
        </>
      ) : showEmpty ? (
        <div className="hero px-4 mt-3 text-white flex items-center justify-center h-[calc(96vh)]">
          No Subscribed Videos
        </div>
      ) : (
        <>
          <div className="mt-12 sm:mt-14 flex items-center justify-between  px-4 py-2">
            <h2 className="text-white text-lg font-bold">Latest</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/channels")}
                className="text-blue-500 font-medium cursor-pointer"
              >
                Manage
              </button>
            </div>
          </div>

          <div className="mt-3   flex flex-col sm:grid grid-cols-12 gap-y-2  ">
            {subscribedChannelsVideos != null
              ? subscribedChannelsVideos.map((video, i) => (
                  <div
                    key={video._id || i}
                    className={`2xl:col-span-3 ${
                      isCollapsed ? "xl:col-span-3" : "xl:col-span-4"
                    }  lg:col-span-4  md:col-span-6  col-span-12 cursor-pointer caret-transparent`}
                  >
                    <Video video={video} />
                  </div>
                ))
              : "No subscribed videos found"}
          </div>
        </>
      )}
    </>
  );
};

export default UserSubscription;
