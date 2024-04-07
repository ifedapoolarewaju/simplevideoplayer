import React, { useRef, useEffect, useState } from "react";
import KeyboardVideoControls from "../CustomVideoControls/CustomVideoControls";
import VideoControls from "../VideoControls/VideoControls";
import "./VideoPlayer.css";

type VideoPlayerProps = {
  videoSrc: string;
  subtitleSrc: string;
  videoName: string;
};

function VideoPlayer(props: VideoPlayerProps) {
  const { videoSrc, subtitleSrc, videoName } = props;
  const video = useRef<HTMLVideoElement>(null);
  const [keyboardControls, setKeyboardControls] =
    useState<React.JSX.Element | null>(null);
  const [videoPlayerControls, setVideoControls] =
    useState<React.JSX.Element | null>(null);

  const videoContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (video.current) {
      setKeyboardControls(<KeyboardVideoControls video={video.current} />);
    }

    if (video.current && videoContainer.current) {
      setVideoControls(
        <VideoControls
          videoName={videoName}
          video={video.current}
          videoContainer={videoContainer.current}
        />
      );
    }
  }, [video]);

  return (
    <div className="VideoPlayer" ref={videoContainer}>
      <video src={videoSrc} ref={video} autoPlay>
        <track kind="subtitles" src={subtitleSrc} default />
      </video>
      {videoPlayerControls}
      {keyboardControls}
    </div>
  );
}

export default VideoPlayer;
