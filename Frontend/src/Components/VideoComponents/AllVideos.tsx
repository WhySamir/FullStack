import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { selectVid } from "../../Redux/videos";
import { setNavigating } from "../../Redux/navigations";
const Video: React.FC<any> = ({ video }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<number | null>(null);

  const [isHovered, setIsHovered] = useState(false);

  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

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
    try {
      dispatch(setNavigating(true));
      // await increaseVidViews({ vidId: video._id });
      dispatch(selectVid(video._id));
      // setTimeout(() => {
      navigate(`/watch/${video._id}`);
      // }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  const handleImgError = () => {
    setImgError(true);
  };

  const handleImgLoad = () => {
    setImgLoaded(true);
  };
  return (
    <>
      <div className="pb-3 sm:p-2  w-full  flex  flex-col items-start cursor-pointer">
        <Link
          to={`/watch/${video._id}`}
          onClick={handleVid}
          className="relative  w-full sm:rounded-lg  mb-2  aspect-video  overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {!isHovered && video.thumbnail && (
            <img
              src={video.thumbnail}
              onError={handleImgError}
              onLoad={handleImgLoad}
              className="h-full w-full object-cover sm:rounded-lg"
              alt="video thumbnail"
            />
          )}
          {/* //video */}
          {(!imgLoaded || imgError || !video.thumbnail) && (
            <div className="absolute inset-0 bg-neutral-700 animate-pulse rounded-lg" />
          )}
          {isHovered && (
            <video
              ref={videoRef}
              muted
              src={video.videoFile}
              style={{ display: isHovered ? "block" : "none" }}
              className="w-full h-full object-cover rounded-lg"
              controls
              autoPlay
              playsInline
            />
          )}
          <span className="absolute bottom-2 right-2 bg-black/50 bg-opacity-75 text-white text-xs font-semibold px-1  rounded">
            {formatDuration(video.duration)}
          </span>
        </Link>

        <div
          className="pl-2 flex  gap-x-2.5 items-start w-full "
          onMouseOver={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="h-9 w-9   rounded-full overflow-hidden flex-shrink-0"
            onClick={() => navigate(`/username/${video.owner.username}`)}
          >
            <img
              src={video.owner?.avatar}
              className="object-cover w-full h-full "
              alt=""
            />
          </div>
          <Link
            to={`/watch/${video._id}`}
            onClick={handleVid}
            className=" text-white flex flex-col flex-grow"
          >
            <h3 className=" text-xs sm:text-sm font-semibold line-clamp-2 sm:line-clamp-3 xl:line-clamp-none   overflow-hidden h-full  w-full min-h-[1.4rem]">
              {video.title}
            </h3>
            <p className="text-gray-400 text-xs md:text-sm">
              {video.owner?.username}
            </p>
            <p className="text-gray-500 text-xs">
              {video.views} views •{new Date(video.createdAt).toDateString()}
            </p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Video;
