import { useSelector } from "react-redux";
import { RootState } from "../../Redux/auth";

interface VideoProps {
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  videoFile: string;
  isPublished: string;
  views: number;
  owner: string;
  updatedAt: string;
  createdAt: string;
  _id: string;
}
const Video: React.FC<{ video: VideoProps }> = ({ video }) => {
  const { authUser } = useSelector((state: RootState) => state.auth);

  // console.log(video);
  return (
    <>
      <div className="p-2 max-w-full   flex  flex-col items-start ">
        <div className=" w-full rounded-lg  mb-2">
          {/* //video */}
          {/* <img src={video.thumbnail} alt="" /> */}
          <video
            width={100}
            height={100}
            src={video.videoFile}
            className="w-full h-full object-cover rounded-lg"
            controls
          ></video>
        </div>

        <div className="flex  gap-x-3 items-start">
          <div className="h-9 w-9  sm:h-12 sm:w-12 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={authUser?.avatar}
              className="object-cover w-full h-full "
              alt=""
            />
          </div>
          <div className="relative text-white flex flex-col flex-grow">
            <h3 className="relative text-xs sm:text-sm font-semibold line-clamp-2 sm:line-clamp-3 xl:line-clamp-none   overflow-hidden h-full   w-full ">
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
