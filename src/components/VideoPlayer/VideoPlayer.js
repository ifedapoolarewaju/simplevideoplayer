import React, { useRef, useEffect, useState } from 'react';
import KeyboardVideoControls from '../CustomVideoControls/CustomVideoControls';
import './VideoPlayer.css';

function VideoPlayer(props) {
  const { videoSrc, subtitleSrc } = props;
  const video = useRef(null);
  const [keyboardControls, setKeyboardControls] = useState(null);
  useEffect(() => {
    if (video.current) {
      setKeyboardControls(<KeyboardVideoControls video={video.current} />);
    }
  }, [video])

  return (
    <div className="VideoPlayer">
      <video src={videoSrc} controls ref={video}>
        <track kind="subtitles" src={subtitleSrc} default />
      </video>
      {keyboardControls}
    </div>
  );
}

export default VideoPlayer;
