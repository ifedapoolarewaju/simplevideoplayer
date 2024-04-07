"use client";
import React, { useRef, useState } from "react";
import "./VideoSelector.css";
import pressplay from "@/assets/playicon.png";
import { useVideoContext } from "../VideoContextProvider/VideoContextProvider";
import { useRouter } from "next/navigation";

function VideoSelector() {
  const { setSelectedVideo } = useVideoContext();
  const [dragActive, setDragActive] = useState(false);
  const fileField = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const onClick = () => {
    if (!fileField.current) {
      return;
    }
    // reset value, so 'onChange' always works
    fileField.current.value = "";
    fileField.current.click();
  };

  const onFileAdded = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const file = e.target.files[0];
    const videoName = file.name;
    const objectURL = URL.createObjectURL(file);
    setSelectedVideo((prev) => {
      return {
        ...prev,
        videoUrl: objectURL,
        videoName,
      };
    });

    router.push("/screen");
  };

  const onDrag = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("dragging");
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files || !e.dataTransfer.files[0]) {
      return;
    }

    const file = e.dataTransfer.files[0];
    const videoName = file.name;
    const objectURL = URL.createObjectURL(file);
    setSelectedVideo((prev) => {
      return {
        ...prev,
        videoUrl: objectURL,
        videoName,
      };
    });

    router.push("/screen");
  };

  return (
    <div
      onDrop={onDrop}
      onDragEnter={onDrag}
      onDragOver={onDrag}
      onDragLeave={onDrag}
      className="VideoSelector"
    >
      <div
        className={`border-2 border-pink-500 absolute -inset-1/4 ${
          !dragActive ? "hidden" : ""
        } `}
      />
      <h2 className=" my-[0.83em] font-bold text-2xl text-center box-border ">
        Why download a video player when you can simply play your videos with
        the browser?
      </h2>
      <h5 className="mb-7 text-sm font-bold ">
        Your videos will not be uploaded anywhere, it is all happening on your
        computer.
      </h5>
      <button onClick={onClick} className="default-button">
        <img
          className="inline-block align-top"
          src={pressplay.src}
          width="30px"
          alt="Press Play icon"
        />
        &nbsp;
        <span>Select a video file</span>
      </button>
      <input
        type="file"
        ref={fileField}
        hidden={true}
        accept="video/mp4,video/x-m4v,video/*,.mkv"
        onChange={onFileAdded}
      />
    </div>
  );
}

export default VideoSelector;
