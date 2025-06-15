import { useEffect, useState } from "react";
import Video from "./AllVideos";
import { PlaySquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

import { getallvideos } from "../../Api/videoApis";
import { upload } from "../../Redux/videos";
import RedLoader from "../Common/RedLoader";
import SkeletonLandingVid from "./SkeletonLandingVid";
import ScrollableCategories from "./ScrollableCategories";

interface MaingridProps {
  isCollapsed: boolean;
}
const Maingrid: React.FC<MaingridProps> = ({ isCollapsed }) => {
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { videos } = useSelector((state: RootState) => state.vid);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let loaderTimeout: ReturnType<typeof setTimeout>;
    const getAllUserVideos = async () => {
      try {
        const response = await getallvideos();
        console.log(response.data);
        const shuffledVideos = [...response.data].sort(
          () => Math.random() - 0.5
        );
        dispatch(upload(shuffledVideos));
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    getAllUserVideos();
    loaderTimeout = setTimeout(() => {
      setLoading(false);
    }, 900);

    return () => clearTimeout(loaderTimeout);
  }, [dispatch]);

  return (
    <>
      {loading && <RedLoader />}
      {loading ? (
        <>
          <div className="mt-12 sm:mt-24 transition-all duration-500 flex flex-col sm:grid grid-cols-12 gap-y-2  ">
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
      ) : isAuthenticated ? (
        <>
          {/* <div className="relative w-full h-full"> */}
          <ScrollableCategories isCollapsed={isCollapsed} />
          {/* </div> */}

          <div className="mt-12 sm:mt-5  transition-all duration-500 flex flex-col sm:grid grid-cols-12 gap-y-2  ">
            {videos != null
              ? videos.map((video: any, i) => (
                  <div
                    key={video._id || i}
                    className={`2xl:col-span-3 ${
                      isCollapsed ? "xl:col-span-3" : "xl:col-span-4"
                    }  lg:col-span-4  md:col-span-6  col-span-12 cursor-pointer caret-transparent`}
                  >
                    <Video video={video} />
                  </div>
                ))
              : ""}
          </div>
        </>
      ) : (
        <div className="flex h-[calc(96vh)] flex-col justify-center items-center space-y-6 ">
          <div className="icon text-white">
            <PlaySquare size={100} />
          </div>
          <h1 className="text-white text-center align-middle sm:text-2xl">
            Enjoy your favorite videos
          </h1>
          <h2 className="text-sm">
            Sign in to access videos that you’ve liked or saved
          </h2>
          <Link
            to="/signin"
            className="signin cursor-pointer gap-1 hover:bg-blue-400 rounded-full border-[0.1px] flex items-center px-3 py-1 border-gray-600"
          >
            <div className="border  flex items-center justify-center border-blue-900 text-blue-900 rounded-full circle w-5 h-5">
              <User size={16} />
            </div>
            <div className="text-blue-900 font-semibold tracking-[-0.01em]">
              Sign in
            </div>
          </Link>
        </div>
      )}
    </>
  );
};

export default Maingrid;
