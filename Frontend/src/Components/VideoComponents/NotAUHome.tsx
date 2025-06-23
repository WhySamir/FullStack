import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useEffect, useState } from "react";
import { getallvideos } from "../../Api/videoApis";
import { upload } from "../../Redux/videos";
import Video from "./AllVideos";
import SkeletonLandingVid from "./SkeletonLandingVid";
import RedLoader from "../Stdio/Common/RedLoader";

interface MaingridProps {
  isCollapsed: boolean;
}

const NotAUHome: React.FC<MaingridProps> = ({ isCollapsed }) => {
  const { videos } = useSelector((state: RootState) => state.vid);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let loaderTimeout: ReturnType<typeof setTimeout>;
    const getAllUserVideos = async () => {
      try {
        const response = await getallvideos();
        console.log(response.data);
        dispatch(upload(response.data));
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
      ) : (
        <div className="mt-12 sm:mt-14  transition-all duration-500 flex flex-col sm:grid grid-cols-12 gap-y-2  ">
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
      )}
    </>
  );
};

export default NotAUHome;
