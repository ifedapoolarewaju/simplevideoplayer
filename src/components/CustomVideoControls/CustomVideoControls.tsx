import React, { useState, useEffect } from 'react';
import { Amplifier, getAmplifier } from './volume';
import { secondsToTime } from './time';
import './CustomVideoControls.css';

type CustomVideoControlsProps = {
    setVideo: React.Dispatch<React.SetStateAction<HTMLVideoElement | null>>;
    video: HTMLVideoElement | null;
};

function CustomVideoControls(props: CustomVideoControlsProps) {
    const { video, setVideo } = props;
    const [volumeMultiplier, setVolumeMultiplier] = useState(1);
    const [showVolume, setShowVolume] = useState(false);
    const [showVideoTime, setShowVideoTime] = useState(false);
    const [amplifier, setAmplifier] = useState<Amplifier | null>(null);

    const displayVolume = () => {
        setShowVolume(true);
        setTimeout(() => {
            setShowVolume(false);
        }, 3000);
    };

    const displayVideoTime = () => {
        setShowVideoTime(true);
        setTimeout(() => {
            setShowVideoTime(false);
        }, 3000);
    };

    const playVideo = () => {
        if (video?.paused) {
            video.play();
        } else {
            video?.pause();
        }
    };

    useEffect(() => {
        if (!video) {
            setAmplifier(getAmplifier(setVideo));
        }
    }, []);

    // volume control
    useEffect(() => {
        if (!amplifier) {
            return;
        }

        const adjustVolume = (e: KeyboardEvent) => {
            if (!video) return;
            const UP_KEY = 'ArrowUp';
            const DOWN_KEY = 'ArrowDown';
            if (e.code !== UP_KEY && e.code !== DOWN_KEY) {
                return;
            }
            e.preventDefault();

            if (e.code === UP_KEY) {
                if (video.volume < 1) {
                    // regular volume increase
                    video.volume = Math.min(video.volume + 0.1, 1);
                } else if (volumeMultiplier < 4) {
                    // vlc type volume amplification
                    const newVolumeMultiplier = Math.min(
                        volumeMultiplier + 0.1,
                        4
                    );
                    setVolumeMultiplier(newVolumeMultiplier);
                    amplifier.amplify(newVolumeMultiplier);
                }
            } else if (e.code === DOWN_KEY) {
                if (volumeMultiplier > 1) {
                    // bring volume amplification down towards 1
                    const newVolumeMultiplier = Math.max(
                        volumeMultiplier - 0.1,
                        1
                    );
                    setVolumeMultiplier(newVolumeMultiplier);
                    amplifier.amplify(newVolumeMultiplier);
                } else if (video.volume > 0) {
                    // bring volume down towards 0
                    video.volume = Math.max(video.volume - 0.1, 0);
                }
            }

            displayVolume();
        };

        document.addEventListener('keydown', adjustVolume);
        // remove event listener after unmounting
        return () => {
            document.removeEventListener('keydown', adjustVolume);
        };
    }, [video, amplifier, volumeMultiplier]);

    // video time control
    useEffect(() => {
        if (!video) return;
        const adjustVideoTime = (e: KeyboardEvent) => {
            const FORWARD_KEY = 'ArrowRight';
            const BACKWARD_KEY = 'ArrowLeft';
            if (e.code !== FORWARD_KEY && e.code !== BACKWARD_KEY) {
                return;
            }

            e.preventDefault();
            if (e.code === FORWARD_KEY) {
                // move forward by 0.5 seconds
                video.currentTime = Math.min(
                    video.duration,
                    video.currentTime + 0.5
                );
            } else if (e.code === BACKWARD_KEY) {
                // move backward by 0.5 seconds
                video.currentTime = Math.max(0, video.currentTime - 0.5);
            }

            displayVideoTime();
        };

        document.addEventListener('keydown', adjustVideoTime);
        // remove event listener after unmounting
        return () => {
            document.removeEventListener('keydown', adjustVideoTime);
        };
    }, [video]);

    // spacebar play-pause control
    useEffect(() => {
        const playOrPause = (e: KeyboardEvent) => {
            const SPACEBAR_KEY = 'Space';
            if (e.code !== SPACEBAR_KEY) {
                return;
            }
            e.preventDefault();
            if (e.code === SPACEBAR_KEY) {
                playVideo();
            }
        };
        document.addEventListener('keydown', playOrPause);
        // remove event listener after unmounting
        return () => {
            document.removeEventListener('keydown', playOrPause);
        };
    }, [video]);

    if (showVolume && video) {
        return (
            <div className='CustomVideoControls'>
                {(video.volume * volumeMultiplier * 100).toFixed(0)}%
            </div>
        );
    }

    if (showVideoTime && video) {
        return (
            <div className='CustomVideoControls'>
                {secondsToTime(video.currentTime)} /{' '}
                {secondsToTime(video.duration)}
            </div>
        );
    }

    return null;
}

export default CustomVideoControls;
