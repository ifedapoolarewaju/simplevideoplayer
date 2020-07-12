import React from 'react';
import './VideoPlayer.css';

function VideoPlayer(props) {
  const { videoSrc, subtitleSrc } = props
  return (
    <div className="VideoPlayer">
      <video src={videoSrc} controls>
        <track kind="subtitles" src={subtitleSrc} default />
      </video>
    </div>
  );
}

export default VideoPlayer;
