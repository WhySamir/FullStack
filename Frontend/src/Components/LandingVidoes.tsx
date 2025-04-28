import { useRef, useEffect, useState } from "react";
import Video from "./VideoComponents/AllVideos";
import { PlaySquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";

import { getallvideos } from "../Api/videoApis";
import { upload } from "../Redux/videos";
import RedLoader from "./RedLoader";
import SkeletonLandingVid from "./VideoComponents/SkeletonLandingVid";

interface ObjItem {
  text: string;
}
const objectPlay: ObjItem[] = [
  { text: "All" },
  { text: "Music" },
  { text: "Gaming" },
  { text: "T-Series" },
  { text: "APIs" },
  { text: "Thrillers" },
  { text: "AI" },
  { text: "Movies" },
  { text: "Movies" },
  { text: "Movies" },
  { text: "Movies" },
  { text: "Movies" },
  { text: "Movies" },
  { text: "Movies" },
  { text: "Movies" },
  { text: "Movies" },
  { text: "Movies" },
  { text: "Movies" },
];

interface MaingridProps {
  isCollapsed: boolean;
}
const Maingrid: React.FC<MaingridProps> = ({ isCollapsed }) => {
  const dispatch = useDispatch();

  const { isAuthenticated, authUser } = useSelector(
    (state: RootState) => state.auth
  );
  const { videos } = useSelector((state: RootState) => state.vid);
  const [loading, setLoading] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState<Boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<Boolean>(true);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const tolerance = 5;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth + tolerance < scrollWidth - 1);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll(); // Initial check
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  useEffect(() => {
    let loaderTimeout: ReturnType<typeof setTimeout>;
    const getAllUserVideos = async () => {
      if (authUser?._id) {
        try {
          const response = await getallvideos();
          console.log(response.data);
          dispatch(upload(response.data));
        } catch (error) {
          console.error("Error fetching videos:", error);
        }
      }
    };
    getAllUserVideos();
    loaderTimeout = setTimeout(() => {
      setLoading(false);
    }, 900);

    return () => clearTimeout(loaderTimeout);
  }, [authUser, dispatch]);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -150,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 150,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 500);
    }
  };

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
          <div className="relative  sm:mt-14 w-full  caret-transparent  sm:flex hidden">
            {showLeftArrow && (
              <div className="absolute flex  -left-2 top-1/2  -translate-y-1/2 bg-gradient-to-r from-[#16181b] to-transparent/80 w-20  h-12 rounded-full z-20 ">
                <button
                  onClick={scrollLeft}
                  className=" flex items-center justify-center    text-xl   bg-[#16181b]  text-white h-12 w-12 rounded-full z-10 hover:bg-neutral-600"
                >
                  &lt;
                </button>
                {/* <div className="absolute top-1/8 left-9 rounded-[0.22rem] bg-[#16181b]   w-8 h-10"></div> */}
              </div>
            )}
            <div
              ref={containerRef}
              onScroll={checkScroll}
              className={`relative  flex space-x-4 overflow-x-scroll scrollbar-hidden
                ${
                  isCollapsed
                    ? "sm:max-w-[80vw] md:max-w-[85vw] lg:max-w-[86vw] xl:max-w-[90vw]"
                    : "sm:max-w-[56vw] md:max-w-[65vw] lg:max-w-[72vw] xl:max-w-[80vw]"
                }
                  `}
            >
              {objectPlay.map((e, id) => (
                <div
                  key={id}
                  className=" text-white  flex-shrink-0  whitespace-nowrap  bg-neutral-700 cursor-pointer   hover:bg-neutral-400 py-1.5 px-4 font-[500] rounded-lg "
                >
                  {e.text}
                </div>
              ))}
            </div>
            {showRightArrow && (
              <div className="absolute right-1 top-1/2 -translate-y-1/2  bg-gradient-to-l from-[#16181b] to-transparent/80   h-12 w-20 rounded-full z-20 ">
                <button
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 flex justify-center  items-center text-xl -translate-y-1/2 bg-[#16181b] text-white  h-12 w-12 rounded-full z-10 hover:bg-neutral-600"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
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
