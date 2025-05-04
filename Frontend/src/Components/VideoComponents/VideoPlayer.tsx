// components/VideoPlayer.tsx
import { useRef } from "react";
import { VideoProps } from "../../types/videosInterface";

interface VideoPlayerProps {
  video: VideoProps;
  onHeightChange: (height: number) => void;
}

export const VideoPlayer = ({ video, onHeightChange }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const updateHeight = () => {
    if (videoRef.current) {
      onHeightChange(videoRef.current.clientHeight);
    }
  };

  return (
    <div className="sticky top-[3.42rem] sm:top-[3.48rem] z-10 lg:static aspect-video bg-black sm:rounded-xl overflow-hidden shadow-2xl">
      <video
        ref={videoRef}
        src={video.videoFile}
        onLoadedMetadata={updateHeight}
        controls
        autoPlay
        playsInline
        className="w-screen lg:w-full h-full object-cover"
      />
    </div>
  );
};
