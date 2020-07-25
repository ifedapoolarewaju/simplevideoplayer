import React, { useState, useEffect } from 'react';
import { getAmplifier } from './volume';
import { secondsToTime } from './time'
import './CustomVideoControls.css';

function CustomVideoControls(props) {
  const { video } = props;
  const [volumeMultiplier, setVolumeMultiplier] = useState(1);
  const [showVolume, setShowVolume] = useState(false);
  const [showVideoTime, setShowVideoTime] = useState(false);
  const [amplifier, setAmplifier] = useState(null);

  const displayVolume = () => {
    setShowVolume(true);
    setTimeout(() => {
      setShowVolume(false)
    }, 3000);
  }

  const displayVideoTime = () => {
    setShowVideoTime(true);
    setTimeout(() => {
      setShowVideoTime(false)
    }, 3000);
  }

  useEffect(() => {
    setAmplifier(getAmplifier(video));
  }, [video]);

  // volume control
  useEffect(() => {
    if (!amplifier) {
      return;
    }

    const adjustVolume = (e) => {
      const UP_KEY = 38;
      const DOWN_KEY = 40;
      if (e.keyCode !== UP_KEY && e.keyCode !== DOWN_KEY) {
        return;
      }
  
      e.preventDefault();
      if (e.keyCode === UP_KEY) {
        if (video.volume < 1) {
          // regular volume increase
          video.volume = Math.min(video.volume + 0.1, 1);
        } else if (volumeMultiplier < 4) {
          // vlc type volume amplification
          const newVolumeMultiplier = Math.min(volumeMultiplier + 0.1, 4);
          setVolumeMultiplier(newVolumeMultiplier);
          amplifier.amplify(newVolumeMultiplier);
        }
      } else if (e.keyCode === DOWN_KEY) {
        if (volumeMultiplier > 1) {
          // bring volume amplification down towards 1
          const newVolumeMultiplier = Math.max(volumeMultiplier - 0.1, 1)
          setVolumeMultiplier(newVolumeMultiplier);
          amplifier.amplify(newVolumeMultiplier);
        } else if (video.volume > 0) {
          // bring volume down towards 0
          video.volume = Math.max(video.volume - 0.1, 0);
        }
      }
  
      displayVolume();
    }
  
    document.addEventListener('keydown', adjustVolume);
    // remove event listener after unmounting
    return () => {
      document.removeEventListener('keydown', adjustVolume);
    }
  }, [video, amplifier, volumeMultiplier]);

  // video time control
  useEffect(() => {
    const adjustVideoTime = (e) => {
      const FORWARD_KEY = 39;
      const BACKWARD_KEY = 37;
      if (e.keyCode !== FORWARD_KEY && e.keyCode !== BACKWARD_KEY) {
        return;
      }
  
      e.preventDefault();
      if (e.keyCode === FORWARD_KEY) {
        // move forward by 0.5 seconds
        video.currentTime = Math.min(video.duration, video.currentTime + 0.5);
      } else if (e.keyCode === BACKWARD_KEY) {
        // move backward by 0.5 seconds
        video.currentTime = Math.max(0, video.currentTime - 0.5);
      }
  
      displayVideoTime();
    }

    document.addEventListener('keydown', adjustVideoTime);
    // remove event listener after unmounting
    return () => {
      document.removeEventListener('keydown', adjustVideoTime);
    }
  }, [video]);

  if (showVolume) {
    return (
      <div className="CustomVideoControls">
        {(video.volume * volumeMultiplier * 100).toFixed(0)}%
      </div>
    );
  }

  if (showVideoTime) {
    return (
      <div className="CustomVideoControls">
        {secondsToTime(video.currentTime)} / {secondsToTime(video.duration)}
      </div>
    );
  }

  return null;
}

export default CustomVideoControls;
