import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { selectVid } from "../../Redux/videos";
import { increaseVidViews } from "../../Api/videoApis";

const Video: React.FC<any> = ({ video }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  const handleVid = async () => {
    await increaseVidViews({ vidId: video._id });
    dispatch(selectVid(video._id));
    navigate(`/watch/${video._id}`);
  };
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  return (
    <>
      <div
        className="pb-3 sm:p-2 max-w-full w-full  flex  flex-col items-start cursor-pointer"
        onClick={handleVid}
      >
        <div
          className="relative  w-full sm:rounded-lg  mb-2  aspect-video  overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* //video */}
          {!isHovered && (
            <img
              src={video.thumbnail}
              className="h-full w-full object-cover sm:rounded-lg"
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
          <span className="absolute bottom-2 right-2 bg-black/50 bg-opacity-75 text-white text-xs font-semibold px-1  rounded">
            {formatDuration(video.duration)}
          </span>
        </div>

        <div className="pl-2 flex  gap-x-2.5 items-start w-full">
          <div className="h-9 w-9   rounded-full overflow-hidden flex-shrink-0">
            <img
              src={video.owner?.avatar}
              className="object-cover w-full h-full "
              alt=""
            />
          </div>
          <div className=" text-white flex flex-col flex-grow">
            <h3 className=" text-xs sm:text-sm font-semibold line-clamp-2 sm:line-clamp-3 xl:line-clamp-none   overflow-hidden h-full  w-full min-h-[1.4rem]">
              {video.title}
            </h3>
            <p className="text-gray-400 text-xs">{video.owner?.username}</p>
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
