"use client";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

export type Video = {
  videoUrl: string;
  videoName: string;
  subtitleSrc: string;
};
export const videoContext = createContext<
  | (Video & { setSelectedVideo: React.Dispatch<React.SetStateAction<Video>> })
  | null
>(null);

const VideoContextProvider = ({ children }: PropsWithChildren) => {
  const [video, setVideo] = useState<Video>({
    videoUrl: "",
    videoName: "",
    subtitleSrc: "",
  });

  const selectedVideo = { ...video, setSelectedVideo: setVideo };

  return (
    <videoContext.Provider value={selectedVideo}>
      {children}
    </videoContext.Provider>
  );
};

export default VideoContextProvider;

export const useVideoContext = () => {
  const context = useContext(videoContext);
  if (context === null) {
    throw new Error("Context must be use within context provider");
  }

  return context;
};
