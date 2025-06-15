// import { Pencil, Upload } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../Redux/store";
import { formatDuration } from "../../../Utilis/FormatDuration";
import { useEffect, useState } from "react";
import RedLoader from "../../Common/RedLoader";

// ✅ Simple Skeleton Component
const SkeletonBox = ({ className = "" }) => (
  <div className={`bg-gray-700 animate-pulse rounded ${className}`}></div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { videos } = useSelector((state: RootState) => state.userVideo);
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [latestVideo, setLatestVideo] = useState<any>(null);
  const [topVideo, setTopVideo] = useState<any>(null);
  const [checkingVideos, setCheckingVideos] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (videos.length > 0) {
        setLatestVideo(videos[0]);
        const top = videos.reduce((prev, current) =>
          (current.views ?? 0) > (prev.views ?? 0) ? current : prev
        );
        setTopVideo(top);
      } else {
        setLatestVideo(null);
        setTopVideo(null);
      }
      setCheckingVideos(false);
    }, 700); // 👈 Simulate delay

    return () => clearTimeout(timeout);
  }, [videos]);

  return (
    <>
      {checkingVideos && <RedLoader />}
      <div className="pl-6 pr-4 mb-3">
        {/* Header */}
        <div className="flex justify-between items-center h-[12vh]">
          <h1 className="text-white font-semibold text-3xl">
            Channel dashboard
          </h1>
          <div className="flex gap-3">
            {/* <div className="h-9 w-9 flex items-center justify-center rounded-full border border-neutral-100">
              <Upload />
            </div>
            <div className="h-9 w-9 flex items-center justify-center rounded-full border border-neutral-100">
              <Pencil />
            </div> */}
          </div>
        </div>

        <div className="text-white">
          <div className="grid xl:grid-cols-3 space-y-6 xl:space-x-6 h-full">
            {/* Latest Video Performance */}
            <div className="border border-gray-700 rounded-lg py-6 px-4 xl:px-6">
              <h2 className="text-xl font-[500] mb-4">
                Latest video performance
              </h2>

              {checkingVideos ? (
                <>
                  <SkeletonBox className="h-44 xl:h-48 w-full mb-4" />
                  <div className="grid grid-cols-3 gap-2">
                    <SkeletonBox className="h-6" />
                    <SkeletonBox className="h-6" />
                    <SkeletonBox className="h-6" />
                  </div>
                  <SkeletonBox className="h-5 mt-6 w-32" />
                  <SkeletonBox className="h-8 mt-4 w-40" />
                </>
              ) : latestVideo ? (
                <>
                  <div className="relative bg-green-900/50 h-44 xl:h-48 w-64 xl:w-full rounded-lg overflow-hidden">
                    <img
                      src={latestVideo.thumbnail}
                      alt={latestVideo.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 text-sm text-gray-300">
                    <div className="text-center">
                      <span>{latestVideo.views ?? 0}</span>
                      <p className="text-xs">Views</p>
                    </div>
                    <div className="text-center">
                      <span>{latestVideo.likesCount ?? 0}</span>
                      <p className="text-xs">Likes</p>
                    </div>
                    <div className="text-center">
                      <span>{latestVideo.commentCount ?? 0}</span>
                      <p className="text-xs">Comments</p>
                    </div>
                  </div>
                  <div className="w-full h-[1px] my-4 bg-gray-700"></div>
                  <div className="px-4 pt-2">
                    {formatDuration(latestVideo.duration)}s
                  </div>
                  <button
                    onClick={() =>
                      navigate(
                        `/stdio/channel/analytics?videoId=${latestVideo._id}`
                      )
                    }
                    className="mt-3 w-auto px-4 py-1.5 rounded-[2.5rem] flex items-center justify-center bg-blue-600 hover:bg-blue-700"
                  >
                    Go to video analytics
                  </button>
                </>
              ) : (
                <p className="text-gray-500">No videos uploaded yet.</p>
              )}
            </div>

            {/* Channel Analytics */}
            <div className="border border-gray-700 rounded-xl p-4 max-h-100">
              <h2 className="text-lg font-semibold mb-4">Channel analytics</h2>
              {checkingVideos ? (
                <>
                  <SkeletonBox className="h-6 w-1/2 mb-2" />
                  <SkeletonBox className="h-8 w-1/3 mb-4" />
                  <SkeletonBox className="h-6 w-full mb-2" />
                  <SkeletonBox className="h-6 w-full mb-2" />
                </>
              ) : videos.length === 0 ? (
                <p className="text-gray-500">No videos uploaded yet.</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400">Current subscribers</p>
                    <p className="text-2xl font-bold">
                      {authUser?.subscribersCount}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Summary</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-gray-400">Views</p>
                        <p>
                          {videos.reduce((acc, v) => acc + (v.views ?? 0), 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Watch time (hours)</p>
                        <p>0.4</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Top video</h3>
                    {topVideo ? (
                      <div className="flex justify-between items-center">
                        <p>{topVideo.title}</p>
                        <p>{topVideo.views ?? 0} Views</p>
                      </div>
                    ) : (
                      <p className="text-gray-500">No videos yet</p>
                    )}
                  </div>
                  {topVideo && (
                    <button
                      onClick={() =>
                        navigate(
                          `/stdio/channel/analytics?videoId=${topVideo._id}`
                        )
                      }
                      className="w-auto xl:mt-9  px-4 py-1.5 rounded-[2.5rem] flex items-center justify-center bg-blue-600 hover:bg-blue-700"
                    >
                      Go to channel analytics
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Posts (Static for now) */}
            <div className="space-y-4">
              <div className="border border-gray-700 rounded-xl p-6 flex flex-col items-center text-center">
                <div className="border border-gray-700 border-dashed rounded-xl p-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 mb-4">
                    <img
                      src="/createpost.png"
                      alt="Create Post"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Create your first post to start a conversation and get
                    feedback from your community.
                  </p>
                  <button className="bg-white text-black font-semibold px-4 py-2 rounded-full hover:bg-gray-200">
                    Coming Soon...
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
