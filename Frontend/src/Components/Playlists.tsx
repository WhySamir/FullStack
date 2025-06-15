import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { incrementNavigationCount, setNavigating } from "../Redux/navigations";
import { selectVid } from "../Redux/videos";
import { Play, X } from "lucide-react";
import { formatDuration } from "../Utilis/FormatDuration";
import { VideoProps } from "../types/videosInterface";

interface PlaylistsProps {
  vidHeight?: number;
  handlePlaylistToggle: () => void;
  playlistVideos: any;
  playlistTitle: any;
  playlistDescription: any;
  currentVideoId: string;
}
export const Playlists: React.FC<PlaylistsProps> = ({
  vidHeight,
  handlePlaylistToggle,
  playlistVideos,
  playlistTitle,
  playlistDescription,
  currentVideoId,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleVid = (videoId: string) => {
    dispatch(setNavigating(true));
    dispatch(incrementNavigationCount());
    dispatch(selectVid(videoId));

    navigate(`/watch/${videoId}?playlist=liked`);
  };

  return (
    <>
      <div
        className="bg-black border border-white/40 rounded-xl w-full overflow-hidden "
        style={{ height: vidHeight }}
      >
        <div className="flex flex-col w-full h-full overflow-y-auto scrollbar-hidden">
          <div
            className=" flex items-start justify-between py-3 pr-4 pb-3  rounded-t-xl bg-[#212121]"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <div className="text-white flex flex-col  ml-4   caret-transparent ">
              <h1 className="font-semibold ">{playlistTitle}</h1>
              <p className="text-sm text-gray-300">{playlistDescription}</p>
            </div>
            <div className="h-9 w-9 p-1 rounded-full hover:bg-neutral-600 items-center flex">
              <X onClick={handlePlaylistToggle} strokeWidth={1} size={36} />
            </div>
          </div>
          {playlistVideos?.length === 0 && (
            <p className="text-white text-sm mt-20">
              No videos in this playlist.
            </p>
          )}

          {playlistVideos != null &&
            playlistVideos.map((video: VideoProps, i: number) => {
              const isActive = video._id === currentVideoId;

              return (
                <Link
                  to={`/watch/${video._id}?playlist=liked`}
                  key={video._id || i}
                  className={`flex pl-2 hover:bg-[#1D2521] ${
                    isActive ? "bg-[#1D2521]" : ""
                  } items-center space-x-2 cursor-pointer caret-transparent`}
                  onClick={() => handleVid(video._id)}
                >
                  {isActive ? (
                    <>
                      <Play
                        className="text-white"
                        fill="white"
                        strokeWidth={1}
                        size={16}
                      />
                    </>
                  ) : (
                    <Play strokeWidth={1} size={16} />
                  )}
                  <div className="thumbnail relative h-14 aspect-video  my-2 rounded-xl">
                    <img
                      src={video.thumbnail}
                      className="h-full w-full rounded-lg object-cover"
                      alt=""
                    />
                    <span className="absolute right-0.5 bottom-0.5 bg-black/50 bg-opacity-75 text-white text-[0.7rem] font-semibold px-1  rounded">
                      {formatDuration(video.duration)}
                    </span>
                  </div>
                  <div className="flex pl-2 flex-col justify-evenly h-full  py-2">
                    <div className="title font-[500]  leading-5  lg:w-[16vw] lg:max-w-[20vw] overflow-hidden text-ellipsis break-words line-clamp-2">
                      {video.title}
                    </div>
                    <p className="text-xs text-gray-300 ">
                      {video.owner.username}
                    </p>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </>
  );
};
