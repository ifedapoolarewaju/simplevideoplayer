import React, { useEffect, useState, useRef } from 'react';
import playIcon from '../../play.svg';
import stopIcon from '../../stop.svg';
import speakerIcon from '../../volume-up.svg';
import fullscreenIcon from '../../expand.svg';
import disableFullscreenIcon from '../../compress.svg';
import pauseIcon from '../../pause.svg';
import mutedIcon from '../../volume-mute.svg';
import { secondsToTime } from '../CustomVideoControls/time';
import './VideoControls.css';

let timeoutHandle = null;

const VideoControls = (props) => {
    const { video, videoContainer, videoName } = props;
    const [pausePlayIcon, setPauseplayIcon] = useState(pauseIcon);
    const [muteUnmuteIcon, setMuteUnmuteIcon] = useState(speakerIcon);
    const [enableDisableFullscreenIcon, setEnableDisableFullscreenIcon] =
        useState(fullscreenIcon);
    const [totalDuration, setTotalDuration] = useState(secondsToTime(0));
    const [realTime, setRealTime] = useState(secondsToTime(0));

    const progress = useRef(null);
    const volumeSlider = useRef(null);
    const seek = useRef(null);
    const controls = useRef(null);

    const playVideo = () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };
    const stopVideo = () => (video.currentTime = video.duration);

    useEffect(() => {
        video.addEventListener('loadedmetadata', () => {
            const timeLeftOff = localStorage.getItem(videoName);
            if (timeLeftOff !== null) {
                video.currentTime = Number(timeLeftOff);
            }

            setTotalDuration(secondsToTime(video.duration));
        });
        video.addEventListener('timeupdate', () => {
            setRealTime(secondsToTime(video.currentTime));
            const progressWidth = (video.currentTime / video.duration) * 100;
            progress.current.style.width = `${progressWidth}%`;
            localStorage.setItem(
                `vid--name--${videoName}`,
                String(video.currentTime)
            );
        });
        video.addEventListener('ended', () => {
            setPauseplayIcon(playIcon);
            localStorage.removeItem(videoName);
        });
        video.addEventListener('pause', () => {
            setPauseplayIcon(playIcon);
        });
        video.addEventListener('play', () => {
            setPauseplayIcon(pauseIcon);
        });
        video.addEventListener('click', () => {
            playVideo();
        });
        videoContainer.addEventListener('mousemove', () => {
            showControls();
            if (timeoutHandle) {
                clearTimeout(timeoutHandle);
            }

            timeoutHandle = setTimeout(hideControls, 10000);
        });
    }, [video, videoContainer]);

    useEffect(() => {
        const adjustControlPosition = () => {
            if (!controls?.current) return;
            if (document.fullscreenElement === null) {
                controls.current.style.top = '';
                setEnableDisableFullscreenIcon(fullscreenIcon);
            } else {
                controls.current.style.top = '90%';
                setEnableDisableFullscreenIcon(disableFullscreenIcon);
            }
        };

        document.addEventListener('fullscreenchange', adjustControlPosition);
        // remove event listener after unmounting
        return () => {
            document.removeEventListener('keydown', adjustControlPosition);
        };
    }, []);

    const showControls = () => {
        controls.current?.classList.remove('hide');
    };

    const hideControls = () => {
        controls.current?.classList.add('hide');
    };

    const muteVideo = () => {
        video.muted = !video.muted;
        setMuteUnmuteIcon(video.muted ? mutedIcon : speakerIcon);
    };

    const volumeChange = () => {
        video.volume = volumeSlider.current.value / 1;
        setMuteUnmuteIcon(video.volume === 0 ? mutedIcon : speakerIcon);
    };

    const toggleFullscreen = () => {
        if (document.fullscreenElement === null) {
            videoContainer.requestFullscreen();
            controls.current.style.top = '90%';
        } else {
            document.exitFullscreen();
            controls.current.style.top = '';
        }
        setEnableDisableFullscreenIcon(
            document.fullscreenElement ? fullscreenIcon : disableFullscreenIcon
        );
    };

    const scrub = (e) => {
        const seekPercentage =
            (e.nativeEvent.offsetX / seek.current.offsetWidth) * 100;
        video.currentTime = (video.duration * seekPercentage) / 100;
    };

    return (
        <div>
            <div className='controls hide' ref={controls}>
                <div className='progress-bar' onClick={scrub} ref={seek}>
                    <div className='progress-fill' ref={progress}></div>
                </div>
                <div className='controls-grid'>
                    <div className='time'>
                        {realTime} / {totalDuration}
                    </div>
                    <button onClick={playVideo} className='control-button'>
                        <img
                            src={pausePlayIcon}
                            width='15px'
                            alt='play'
                            className='click'
                        />
                    </button>
                    <button onClick={stopVideo} className='control-button'>
                        <img
                            src={stopIcon}
                            width='15px'
                            alt='stop'
                            className='click'
                        />
                    </button>
                    <button onClick={muteVideo} className='control-button'>
                        <img
                            src={muteUnmuteIcon}
                            width='20px'
                            alt='mute'
                            className='click'
                        />
                    </button>
                    <input
                        type='range'
                        ref={volumeSlider}
                        className='volume'
                        min={0}
                        max={1}
                        step='0.1'
                        defaultValue={1}
                        onChange={volumeChange}
                    />
                    <button
                        onClick={toggleFullscreen}
                        className='control-button'
                    >
                        <img
                            src={enableDisableFullscreenIcon}
                            width='16px'
                            alt='fullscreen'
                            className='click'
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoControls;
