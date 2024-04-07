import React, { useEffect, useState, useRef } from "react";

import { fullscreenIcon } from "@/assets/expand";
import { disableFullscreenIcon } from "@/assets/compress";
import { playIcon } from "@/assets/play";
import { pauseIcon } from "@/assets/pause";
import { secondsToTime } from "../CustomVideoControls/time";
import "./VideoControls.css";

type VideoControlsProps = {
  video: HTMLVideoElement;
  videoContainer: HTMLDivElement;
  videoName: string;
};

let timeoutHandle: number = 0;
const mutedIcon = (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="volume-mute"
    className="svg-inline--fa w-[20px] fa-volume-mute fa-w-16"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path
      fill="#ffffff"
      d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zM461.64 256l45.64-45.64c6.3-6.3 6.3-16.52 0-22.82l-22.82-22.82c-6.3-6.3-16.52-6.3-22.82 0L416 210.36l-45.64-45.64c-6.3-6.3-16.52-6.3-22.82 0l-22.82 22.82c-6.3 6.3-6.3 16.52 0 22.82L370.36 256l-45.63 45.63c-6.3 6.3-6.3 16.52 0 22.82l22.82 22.82c6.3 6.3 16.52 6.3 22.82 0L416 301.64l45.64 45.64c6.3 6.3 16.52 6.3 22.82 0l22.82-22.82c6.3-6.3 6.3-16.52 0-22.82L461.64 256z"
    ></path>
  </svg>
);

const speakerIcon = (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="volume-up"
    className=" w-[20px] svg-inline--fa fa-volume-up fa-w-18"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 576 512"
  >
    <path
      fill="#ffffff"
      d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zm233.32-51.08c-11.17-7.33-26.18-4.24-33.51 6.95-7.34 11.17-4.22 26.18 6.95 33.51 66.27 43.49 105.82 116.6 105.82 195.58 0 78.98-39.55 152.09-105.82 195.58-11.17 7.32-14.29 22.34-6.95 33.5 7.04 10.71 21.93 14.56 33.51 6.95C528.27 439.58 576 351.33 576 256S528.27 72.43 448.35 19.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.54 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z"
    ></path>
  </svg>
);
const VideoControls = (props: VideoControlsProps) => {
  const { video, videoContainer, videoName } = props;
  const [pausePlayIcon, setPauseplayIcon] = useState(pauseIcon);
  const [muteUnmuteIcon, setMuteUnmuteIcon] = useState(speakerIcon);
  const [enableDisableFullscreenIcon, setEnableDisableFullscreenIcon] =
    useState(fullscreenIcon);
  const [totalDuration, setTotalDuration] = useState(secondsToTime(0));
  const [realTime, setRealTime] = useState(secondsToTime(0));

  const progress = useRef<HTMLDivElement>(null);
  const volumeSlider = useRef<HTMLInputElement>(null);
  const seek = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const videoStorageKey = `vid--name--${videoName}`;

  const playVideo = () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };
  const stopVideo = () => (video.currentTime = video.duration);

  useEffect(() => {
    video.addEventListener("loadedmetadata", () => {
      const timeLeftOff = localStorage.getItem(videoStorageKey);
      if (timeLeftOff !== null) {
        video.currentTime = Number(timeLeftOff);
      }

      setTotalDuration(secondsToTime(video.duration));
    });
    video.addEventListener("timeupdate", () => {
      if (!progress.current) return;
      setRealTime(secondsToTime(video.currentTime));
      const progressWidth = (video.currentTime / video.duration) * 100;
      progress.current.style.width = `${progressWidth}%`;
      localStorage.setItem(videoStorageKey, String(video.currentTime));
    });
    video.addEventListener("ended", () => {
      setPauseplayIcon(playIcon);
      localStorage.removeItem(videoStorageKey);
    });
    video.addEventListener("pause", () => {
      setPauseplayIcon(playIcon);
    });
    video.addEventListener("play", () => {
      setPauseplayIcon(pauseIcon);
    });
    video.addEventListener("click", () => {
      playVideo();
    });
    videoContainer.addEventListener("mousemove", () => {
      showControls();
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }

      timeoutHandle = window.setTimeout(hideControls, 10000);
    });
  }, [video, videoContainer]);

  useEffect(() => {
    const adjustControlPosition = () => {
      if (!controls?.current) return;
      if (document.fullscreenElement === null) {
        controls.current.style.top = "";
        setEnableDisableFullscreenIcon(fullscreenIcon);
      } else {
        controls.current.style.top = "90%";
        setEnableDisableFullscreenIcon(disableFullscreenIcon);
      }
    };

    document.addEventListener("fullscreenchange", adjustControlPosition);
    // remove event listener after unmounting
    return () => {
      document.removeEventListener("keydown", adjustControlPosition);
    };
  }, []);

  const showControls = () => {
    controls.current?.classList.remove("hide");
  };

  const hideControls = () => {
    controls.current?.classList.add("hide");
  };

  const muteVideo = () => {
    video.muted = !video.muted;
    setMuteUnmuteIcon(video.muted ? mutedIcon : speakerIcon);
  };

  const volumeChange = () => {
    if (!volumeSlider?.current) return;
    video.volume = Number(volumeSlider.current.value);
    setMuteUnmuteIcon(video.volume === 0 ? mutedIcon : speakerIcon);
  };

  const toggleFullscreen = () => {
    if (!controls.current) return;
    if (document.fullscreenElement === null) {
      videoContainer.requestFullscreen();
      controls.current.style.top = "90%";
    } else {
      document.exitFullscreen();
      controls.current.style.top = "";
    }
    setEnableDisableFullscreenIcon(
      document.fullscreenElement ? fullscreenIcon : disableFullscreenIcon
    );
  };

  const scrub = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!seek.current) return;
    const seekPercentage =
      (e.nativeEvent.offsetX / seek.current.offsetWidth) * 100;
    video.currentTime = (video.duration * seekPercentage) / 100;
  };

  return (
    <div>
      <div className="controls hide" ref={controls}>
        <div className="progress-bar" onClick={scrub} ref={seek}>
          <div className="progress-fill" ref={progress}></div>
        </div>
        <div className="controls-grid">
          <div className="time">
            {realTime} / {totalDuration}
          </div>
          <button
            onClick={playVideo}
            className="control-button flex justify-center items-start  "
          >
            {pausePlayIcon}
          </button>
          <button
            onClick={stopVideo}
            className="control-button flex justify-center items-start "
          >
            <svg
              className="click w-[15px]"
              fill="#ffffff"
              viewBox="0 0 277.33 277.33"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <g>
                  {" "}
                  <path d="M231.677,0H45.665C20.45,0,0,20.442,0,45.657v186.021c0,25.207,20.45,45.652,45.665,45.652h186.012 c25.223,0,45.653-20.445,45.653-45.652V45.657C277.338,20.434,256.899,0,231.677,0z"></path>{" "}
                </g>{" "}
              </g>
            </svg>
          </button>
          <button
            onClick={muteVideo}
            className="control-button flex justify-center items-start"
          >
            {muteUnmuteIcon}
          </button>
          <input
            type="range"
            ref={volumeSlider}
            className="volume "
            min={0}
            max={1}
            step="0.1"
            defaultValue={1}
            onChange={volumeChange}
          />
          <button
            onClick={toggleFullscreen}
            className="control-button flex justify-center items-start"
          >
            {enableDisableFullscreenIcon}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;
