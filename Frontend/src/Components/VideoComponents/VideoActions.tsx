// components/VideoActions.tsx
import {
  ThumbsDown,
  ThumbsUp,
  Share2,
  Download,
  Loader,
  Ellipsis,
} from "lucide-react";
import { VideoProps } from "../../types/videosInterface";
import { ShareModal } from "../ShareVideo";
import { useState } from "react";

interface VideoActionsProps {
  video: VideoProps;
  onLike: () => void;
  onDislike: () => void;
  isLiked: boolean;
  isDisliked: boolean;
  authUser: any;
}

export const VideoActions = ({
  video,
  onLike,
  onDislike,
  isLiked,
  isDisliked,
  authUser,
}: VideoActionsProps) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const handleDownload = async () => {
    if (!authUser) {
      alert("Please sign in to download.");
      return;
    }
    if (!video || isDownloading) return;

    setIsDownloading(true);

    const startTime = Date.now();

    try {
      const response = await fetch(video.videoFile);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `video-${video._id}.mp4`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(1000 - elapsed, 0);

      setTimeout(() => {
        setIsDownloading(false);
      }, remainingTime);
    }
  };

  return (
    <div className="flex gap-2 xs:gap-0 xs:justify-normal xs:space-x-6 sm:space-x-2">
      <div className=" md:mx-1 w-24 xs:w-30 md:w-34 h-7 sm:h-9 cursor-pointer font-semibold items-center rounded-[2.5rem] flex bg-neutral-600">
        <button
          onClick={onLike}
          className="w-full h-full rounded-l-[2.5rem] hover:bg-neutral-500 px-2 sm:px-3 flex items-center text-white/90 text-xs md:font-medium"
        >
          <ThumbsUp
            fill={`${isLiked ? "white" : "transparent"}`}
            className={`w-3 h-3 sm:w-4.5 sm:h-4.5 `}
          />
          <span className="sm:text-sm w-auto md:text-[16px] ml-2.5 ">
            {video.likesCount ?? 0}
          </span>
        </button>
        <div className="border-r-2 border-white/30 h-[80%]" />
        <button
          onClick={onDislike}
          className="h-full px-4 text-lg hover:bg-neutral-500 rounded-r-[2.5rem] flex items-center text-white/90 sm:text-xs md:font-semibold"
        >
          <ThumbsDown
            fill={`${isDisliked ? "white" : "transparent"}`}
            className={`w-3 h-3 sm:w-4.5 sm:h-4.5 `}
          />
        </button>
      </div>
      <div className="relative hidden lg:block xl:hidden">
        <button
          onClick={() => setOpenModal(!openModal)}
          className="h-7  sm:h-9 cursor-pointer justify-between font-bold items-center rounded-[2.5rem] flex bg-neutral-600"
        >
          <span className="w-full h-full rounded-[2.5rem] hover:bg-neutral-500 px-3 flex items-center gap-2 text-white/90 text-xs md:font-medium">
            <Ellipsis className="w-3 h-3 sm:w-5 sm:h-5" />
          </span>
        </button>
        {openModal && (
          <div className="absolute top-12 right-0 z-50 bg-neutral-700 rounded-xl w-48 shadow-xl flex flex-col text-white text-sm font-medium xl:hidden">
            <button
              onClick={() => {
                setShowShareModal(true);
                setOpenModal(false);
              }}
              className="flex items-center w-full px-4 py-2 hover:bg-neutral-600"
            >
              <Share2 className="mr-3 w-4 h-4" />
              Share
            </button>
            <button
              onClick={() => {
                handleDownload();
                setOpenModal(false);
              }}
              className="flex items-center w-full px-4 py-2 hover:bg-neutral-600"
            >
              <Download className="mr-3 w-4 h-4" />
              Download
            </button>
          </div>
        )}
      </div>

      {/* Share2 */}
      <button
        onClick={() => {
          setShowShareModal(true);
        }}
        className="h-7  sm:h-9 cursor-pointer justify-between font-bold items-center rounded-[2.5rem] flex lg:hidden xl:flex bg-neutral-600"
      >
        <span className="w-full h-full rounded-[2.5rem] hover:bg-neutral-500 px-3 flex items-center gap-2 text-white/90 text-xs md:font-medium">
          <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
          <p className="text-xs md:text-[16px] font-semibold">Share</p>
        </span>
      </button>
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        videoId={video._id} // Pass your actual video ID here
      />

      {/* Download */}
      <button
        onClick={handleDownload}
        className="h-7 sm:h-9  cursor-pointer justify-between font-bold items-center rounded-[2.5rem] flex lg:hidden xl:flex bg-neutral-600 "
      >
        <span className="w-full h-full rounded-[2.5rem] hover:bg-neutral-500 px-3 flex items-center gap-2 text-white/90 text-xs md:font-medium overflow-hidden whitespace-nowrap text-ellipsis ">
          <Download className="w-3 h-3 sm:w-6 sm:h-6" />
          <p className="text-xs md:text-[16px] font-semibold overflow-hidden whitespace-nowrap text-ellipsis w-full ">
            Download
          </p>
        </span>
      </button>

      {isDownloading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50 transition-opacity duration-300 ease-in-out">
          <div className="flex flex-col items-center p-6 bg-neutral-800 rounded-xl shadow-xl scale-95 animate-fadeIn">
            <Loader className="w-8 h-8 animate-spin text-blue-400" />
            <p className="mt-3 text-sm text-white/80">Downloading video...</p>
          </div>
        </div>
      )}
    </div>
  );
};
