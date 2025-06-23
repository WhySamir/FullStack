import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ScrollableCategories from "./VideoComponents/ScrollableCategories";
import Video from "./VideoComponents/AllVideos";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { getallvideos } from "../Api/videoApis";
import { upload } from "../Redux/videos";
import RedLoader from "./Stdio/Common/RedLoader";
import SkeletonLandingVid from "./VideoComponents/SkeletonLandingVid";

interface Collape {
  isCollapsed: boolean;
}

const SearchedVideos: React.FC<Collape> = ({ isCollapsed }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const query =
    new URLSearchParams(location.search).get("q")?.toLowerCase() || "";

  const { videos } = useSelector((state: RootState) => state.vid);
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await getallvideos();
        dispatch(upload(res.data));
      } catch (err) {
        console.error("Failed to fetch videos on refresh:", err);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchVideos();
  }, [dispatch, query]); // 👈 WATCH `query` here!

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(query) ||
      video.hashtag.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <ScrollableCategories isCollapsed={isCollapsed} />
      {loading ? (
        <>
          <RedLoader />
          <div className="mt-8 transition-all duration-500 flex flex-col sm:grid grid-cols-12 gap-y-2">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={idx}
                className={`2xl:col-span-3 ${
                  isCollapsed ? "xl:col-span-3" : "xl:col-span-4"
                } lg:col-span-4 md:col-span-6 col-span-12`}
              >
                <SkeletonLandingVid />
              </div>
            ))}
          </div>
        </>
      ) : filteredVideos.length > 0 ? (
        <div className="mt-12 sm:mt-5 transition-all duration-500 flex flex-col sm:grid grid-cols-12 gap-y-2">
          {filteredVideos.map((video, i) => (
            <div
              key={video._id || i}
              className={`2xl:col-span-3 ${
                isCollapsed ? "xl:col-span-3" : "xl:col-span-4"
              } lg:col-span-4 md:col-span-6 col-span-12 cursor-pointer caret-transparent`}
            >
              <Video video={video} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white mt-8 text-center text-lg">
          No videos found for "{query}"
        </p>
      )}
    </div>
  );
};

export default SearchedVideos;
