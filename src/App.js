import React, { useState } from "react";
import logo from "./logo.png";
import VideoSelector from "./components/VideoSelector/VideoSelector";
import SubtitleSelector from "./components/SubtitleSelector/SubtitleSelector";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";
import Fork from "./components/Fork/Fork";
import "./App.css";

function App() {
  const [videoSelected, setVideoSelected] = useState(false);
  const [cutTheLights, setCutTheLights] = useState(false);
  const [subtitleSrc, setSubtitleSrc] = useState("");
  const [videoSrc, setVideoSrc] = useState("");
  const [videoName, setVideoName] = useState("");
  const onVidoePicked = (videoUrl, videoName) => {
    setVideoSrc(videoUrl);
    setVideoName(videoName);
    setVideoSelected(true);
  };

  const visibility = cutTheLights ? "hidden" : "visible";
  const cursor = cutTheLights ? "none" : "auto";
  const enableCutTheLights = () => setCutTheLights(true);
  const disableCutTheLights = () => setCutTheLights(false);

  let body = (
    <>
      <VideoSelector onVideoPicked={onVidoePicked} />
      <div className="App-Feature-Notes">
        <div>
          <p>
            <b>FEATURES</b>
          </p>
          <p>1. You can add subtitle files (SRT or WebVTT).</p>
          <p>2. Easy to use keyboard controls</p>
          <p>3. Increase volume to 400% (like you do in VLC)</p>
        </div>

        <div>
          <p>
            <b>WHY WAS THIS BUILT?</b>
          </p>
          <p>
            1.{" "}
            <a
              href="https://github.com/ifedapoolarewaju/simplevideoplayer#why-did-i-build-this"
              target="_blank"
              rel="noopener noreferrer"
            >
              An abridged version of why Simple Video Player was built.
            </a>
          </p>
          <p>
            2.{" "}
            <a
              href="https://ifedapo.com/posts/play-in-the-chrome-sandbox"
              target="_blank"
              rel="noopener noreferrer"
            >
              A more detailed version of why Simple Video Player was built.
            </a>
          </p>
        </div>
      </div>
    </>
  );
  if (videoSelected) {
    body = (
      <>
        <VideoPlayer
          videoName={videoName}
          videoSrc={videoSrc}
          subtitleSrc={subtitleSrc}
        />
        <div className="App-Video-Actions" style={{ visibility }}>
          <SubtitleSelector onSubtitlePicked={setSubtitleSrc} />
          <button onClick={enableCutTheLights} className="default-button">
            Cut the lights
          </button>
          <p>
            SRT and WebVTT Subtitle files supported &nbsp;|&nbsp; Press{" "}
            <b>Arrow Keys</b> for Volume and Skips
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="App" onMouseMove={disableCutTheLights} style={{ cursor }}>
      <header className="App-header" style={{ visibility }}>
        <div className="App-logo">
          <div className="App-icon">
            <img src={logo} width="15px" alt="logo" />
          </div>
          <span className="App-name">Simple Video Player</span>
        </div>
        <Fork />
      </header>
      <div className="App-body">{body}</div>
    </div>
  );
}

export default App;
