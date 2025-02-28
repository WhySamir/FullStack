import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { useEffect, useState } from "react";

const WatchVideo = () => {
  const { videos, vidId } = useSelector((state: RootState) => state.vid);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const video = videos.find((vid) => vid._id === vidId);
  useEffect(() => {
    if (video?.videoFile && video.videoFile instanceof File) {
      const url = URL.createObjectURL(video.videoFile);
      setVideoURL(url);

      return () => URL.revokeObjectURL(url); // Cleanup when component unmounts
    }
  }, [video]);

  if (!video) return <p>Video not found</p>;

  return (
    <div className="text-white">
      <h1>{video.title}</h1>
      {videoURL && <video src={videoURL} controls />}
    </div>
  );
};
export default WatchVideo;
