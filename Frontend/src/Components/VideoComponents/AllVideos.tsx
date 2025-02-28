import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { selectVid } from "../../Redux/videos";

const Video: React.FC<any> = ({ video }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser } = useSelector((state: RootState) => state.auth);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<number | null>(null);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setIsHovered(true);
      videoRef.current?.play();
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };
  const handleVid = () => {
    navigate(`/watch/${video._id}`);
    dispatch(selectVid(video._id));
  };
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  return (
    <>
      <div
        className="p-2 max-w-full w-full  flex  flex-col items-start "
        onClick={handleVid}
      >
        <div
          className="relative  w-full rounded-lg  mb-2  aspect-video  overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* //video */}
          {!isHovered && (
            <img
              src={video.thumbnail}
              className="h-full w-full object-cover rounded-lg"
              alt="video thumbnail"
            />
          )}
          <video
            ref={videoRef}
            muted
            src={video.videoFile}
            style={{ display: isHovered ? "block" : "none" }}
            className="w-full h-full object-cover rounded-lg"
            controls
          />
          <span className="absolute bottom-1 right-2 bg-black/50 bg-opacity-75 text-white text-xs font-semibold px-1  rounded">
            {formatDuration(video.duration)}
          </span>
        </div>

        <div className="flex  gap-x-3 items-start w-full">
          <div className="h-9 w-9  sm:h-11 sm:w-11 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={authUser?.avatar}
              className="object-cover w-full h-full "
              alt=""
            />
          </div>
          <div className=" text-white flex flex-col flex-grow">
            <h3 className=" text-xs sm:text-sm font-semibold line-clamp-2 sm:line-clamp-3 xl:line-clamp-none   overflow-hidden h-full  w-full min-h-[1.4rem]">
              {video.title}
            </h3>
            <p className="text-gray-400 text-xs">{authUser?.username}</p>
            <p className="text-gray-500 text-xs">
              {video.views} views •{new Date(video.createdAt).toDateString()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Video;
