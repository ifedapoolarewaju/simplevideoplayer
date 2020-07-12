import React, { useState } from 'react';
import logo from './logo.png';
import VideoSelector from './components/VideoSelector/VideoSelector'
import SubtitleSelector from './components/SubtitleSelector/SubtitleSelector'
import VideoPlayer from './components/VideoPlayer/VideoPlayer'
import Fork from './components/Fork/Fork'
import './App.css';

function App() {
  const [videoSelected, setVideoSelected] = useState(false)
  const [cutTheLights, setCutTheLights] = useState(false)
  const [subtitleSrc, setSubtitleSrc] = useState('')
  const [videoSrc, setVideoSrc] = useState('')
  const onVidoePicked = (videoUrl) => {
    setVideoSrc(videoUrl)
    setVideoSelected(true)
  }

  const visibility = cutTheLights ? 'hidden' : 'visible';
  const cursor = cutTheLights ? 'none' : 'auto';
  const enableCutTheLights = () => setCutTheLights(true)
  const disableCutTheLights = () => setCutTheLights(false)

  let body = (
    <>
      <VideoSelector onVideoPicked={onVidoePicked} />
      <p>You can also add subtitle files (SRT or WebVTT) to your video.</p>
      <p>Why was this built? See <a href="https://github.com/ifedapoolarewaju/simplevideoplayer#why-did-i-build-this" target="_blank" rel="noopener noreferrer">Motivation here.</a></p>
    </>
  )
  if (videoSelected) {
    body = (
      <>
        <VideoPlayer videoSrc={videoSrc} subtitleSrc={subtitleSrc} />
        <div className="App-Video-Actions" style={{ visibility }}>
          <SubtitleSelector onSubtitlePicked={setSubtitleSrc} />
          <button onClick={enableCutTheLights}>Cut the lights</button>
          <p>SRT and WebVTT Subtitle files supported.</p>
        </div>
      </>
    )
  }

  return (
    <div className="App" onMouseMove={disableCutTheLights} style={{ cursor }}>
      <header className="App-header" style={{ visibility }}>
        <div className="App-logo">
          <div className="App-icon">
            <img src={logo} width="20px" alt="logo" />
          </div>
          <span className="App-name">Simple Video Player</span>
        </div>
        <Fork />
      </header>
      <div className="App-body">
        {body}
      </div>
    </div>
  );
}

export default App;
