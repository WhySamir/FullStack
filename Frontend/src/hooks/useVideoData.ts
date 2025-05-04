// hooks/useVideoData.ts
import { useEffect, useState } from "react";
import { getVidById } from "../Api/videoApis";
import { VideoProps } from "../types/videosInterface";

export const useVideoData = (vidId?: string) => {
  const [video, setVideo] = useState<VideoProps | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVideo = async () => {
    if (!vidId) return;
    try {
      const response = await getVidById({ vidId });
      setVideo(response.data);
    }catch (error) {
      console.error("Error not found vid Id",error)}
       finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [vidId]);

  return { video, loading, refreshVideo: fetchVideo };
};