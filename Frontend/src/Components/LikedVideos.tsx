import { FC, useEffect, useRef, useState } from "react";
import { Play, Shuffle, MoreVertical, Trash, Share2 } from "lucide-react";

import { getLikedVideos, toggleLike_Dislike } from "../Api/like";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { formatDuration, timeAgo } from "../Utilis/FormatDuration";
import { useNavigate } from "react-router-dom";
import { FastAverageColor } from "fast-average-color";
import { VideoProps } from "../types/videosInterface";

interface PlaylistPageProps {
  playlistTitle: string;
  playlistThumbnail: string;
  creatorName: string;
  totalVideos: number;
  lastUpdated: string;
  videos: VideoProps[];
}

const PlaylistInfoPanel: FC<{
  playlistThumbnail: string;
  playlistTitle: string;
  creatorName: string;
  totalVideos: number;
  lastUpdated: string;
}> = ({
  playlistThumbnail,
  playlistTitle,
  creatorName,
  totalVideos,
  lastUpdated,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [bgColor, setBgColor] = useState("rgb(0,0,0)");

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const fac = new FastAverageColor();

    if (img.complete) {
      fac.getColorAsync(img).then((color) => {
        setBgColor(color.rgb);
      });
    } else {
      img.addEventListener("load", () => {
        fac.getColorAsync(img).then((color) => {
          setBgColor(color.rgb);
        });
      });
    }
  }, [playlistThumbnail]);

  return (
    <div
      className="mx-2 sm:mx-0 mt-14 sm:mt-16 sticky  top-18 sm:top-20  p-6 rounded-2xl flex flex-col items-start space-y-4 w-full h-[86vh]"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${bgColor}, rgba(0,0,0,1))`,
        // Fallback background color
        backgroundColor: bgColor,
      }}
    >
      <img
        src={playlistThumbnail}
        alt="Playlist Thumbnail"
        className="rounded-lg  h-44 cursor-pointer w-full object-cover"
        ref={imgRef}
        crossOrigin="anonymous"
      />
      <div className="text-white">
        <h1 className="text-2xl mb-3 cursor-default font-bold">
          {playlistTitle}
        </h1>
        <p className="text-sm cursor-default  font-bold mt-1">{creatorName}</p>
        <p className="text-xs mt-1">
          {totalVideos} videos • No views • Updated {lastUpdated}
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 bg-white bg-opacity-20 rounded-full">
          <Share2 size={20} />
        </button>
      </div>
      <div className="flex flex-row  text-xs sm:text-sm items-center space-x-2 lg:space-x-4 w-full">
        <button className="flex items-center   justify-center bg-white text-black  font-semibold rounded-full sm:px-6 py-2 w-full">
          <Play className="mr-2 h-3 w-3 sm:h-6 sm:w-6" /> Play all
        </button>
        <button className="flex items-center justify-center bg-gray-600 text-white font-semibold rounded-full px-6 py-2 w-full">
          <Shuffle strokeWidth={1} className="mr-2 h-3 w-3 sm:h-6 sm:w-6" />{" "}
          Shuffle
        </button>
      </div>
    </div>
  );
};

const PlaylistVideoList: FC<{
  videos: VideoProps[];
  onVideoRemoved: () => void;
}> = ({ videos, onVideoRemoved }) => {
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const removeLike = async (videoId: string) => {
    try {
      await toggleLike_Dislike({
        ObjId: videoId,
        type: "like",
        contentType: "Video",
      });
      onVideoRemoved();
    } catch (error) {
      console.error("Like dislike action failed:", error);
    }
  };

  return (
    <>
      <div className="mt-16 sm:mt-20 flex flex-col  w-full h-full overflow-y-auto ">
        {videos?.map((video, idx: number) => (
          <div
            onClick={() => navigate(`/watch/${video._id}?playlist=liked`)}
            key={video._id || idx}
            className={`  flex items-start space-x-2  rounded-lg  p-2 transition ${
              openModalIndex !== idx ? "hover:bg-neutral-800" : ""
            } `}
          >
            <div className="flex items-center justify-center text-sm h-full px-1.5 text-white ">
              {idx + 1}
            </div>
            <div className="w-50 aspect-video cursor-pointer relative flex-shrink-0">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover bg-neutral-900 rounded-lg"
              />
              <span className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs rounded px-1">
                {formatDuration(video.duration)}
              </span>
            </div>
            <div className="flex flex-col   text-white w-full">
              <h3 className="text-sm mb-2 font-semibold cursor-pointer line-clamp-3 text-ellipsis">
                {video.title}
              </h3>
              <p className="text-xs text-neutral-400 cursor-pointer">
                {video.owner.username} • {video.views} views •{" "}
                {timeAgo(video.createdAt)}
              </p>
            </div>
            <div className="ml-auto relative place-content-center  h-full">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenModalIndex(openModalIndex === idx ? null : idx);
                }}
                className="cursor-pointer"
              >
                <MoreVertical size={20} className="text-neutral-400" />
              </div>
              {openModalIndex === idx && (
                <div className="absolute top-24 right-2 z-50 bg-neutral-600 flex flex-col items-start rounded-xl w-64 shadow-lg">
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLike(video._id);
                      setOpenModalIndex(null);
                    }}
                    className="flex items-center px-3 cursor-pointer text-white text-sm font-semibold hover:bg-neutral-500  py-2 w-full mt-2"
                  >
                    <Trash className="mr-5" />
                    Remove from Liked Videos
                  </li>
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="flex items-center mb-2 cursor-pointer px-3 text-white text-sm font-semibold hover:bg-neutral-500 py-2 w-full mt-2"
                  >
                    <Share2 strokeWidth={1} className="mr-5" />
                    Share
                  </li>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const PlaylistPage: FC<PlaylistPageProps & { onVideoRemoved: () => void }> = ({
  playlistTitle,
  playlistThumbnail,
  creatorName,
  totalVideos,
  lastUpdated,
  videos,
  onVideoRemoved,
}) => {
  return (
    <div className="flex flex-col lg:flex-row h-[80vh] space-x-1">
      <div className=" lg:w-[30rem]">
        <PlaylistInfoPanel
          playlistTitle={playlistTitle}
          playlistThumbnail={playlistThumbnail}
          creatorName={creatorName}
          totalVideos={totalVideos}
          lastUpdated={lastUpdated}
        />
      </div>
      <div className="w-full">
        <PlaylistVideoList videos={videos} onVideoRemoved={onVideoRemoved} />
      </div>
    </div>
  );
};
interface likedVideosProps {
  totalVideoLikes: number;
  data: VideoProps[];
  lastUpdated: string;
}
const PlaylistPageWrapper = () => {
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [likedVideos, setLikedVideos] = useState<likedVideosProps | null>(null);
  const getLikedVideo = async () => {
    try {
      const response = await getLikedVideos();
      console.log(response);
      const { data, totalVideoLikes, lastUpdated } = response;
      setLikedVideos({ data, totalVideoLikes, lastUpdated });

      console.log(likedVideos);
    } catch (error) {
      console.error("Failed to fetch liked videos:", error);
    }
  };
  useEffect(() => {
    if (authUser) {
      getLikedVideo();
    }
  }, [authUser]);

  if (!likedVideos || !authUser) return <div>Loading...</div>;
  if (!likedVideos || likedVideos.data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-lg">
        No liked videos yet.
      </div>
    );
  }
  return (
    <PlaylistPage
      playlistTitle="Liked videos"
      playlistThumbnail={likedVideos.data[0].thumbnail}
      creatorName={authUser.username}
      totalVideos={likedVideos.totalVideoLikes}
      lastUpdated={timeAgo(likedVideos.lastUpdated)}
      videos={likedVideos.data}
      onVideoRemoved={getLikedVideo}
    />
  );
};

export { PlaylistPage, PlaylistPageWrapper };
