import React, { useRef, useEffect, useState } from 'react';
import KeyboardVideoControls from '../CustomVideoControls/CustomVideoControls';
import VideoControls from '../VideoControls/VideoControls';
import './VideoPlayer.css';

function VideoPlayer(props) {
    const { videoSrc, subtitleSrc, videoName } = props;
    const video = useRef(null);
    const [keyboardControls, setKeyboardControls] = useState(null);
    const [videoPlayerControls, setVideoControls] = useState(null);

    const videoContainer = useRef(null);

    useEffect(() => {
        if (video.current) {
            setKeyboardControls(
                <KeyboardVideoControls video={video.current} />
            );
        }

        if (video.current) {
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
        <div className='VideoPlayer' ref={videoContainer}>
            <video src={videoSrc} ref={video} autoPlay>
                <track kind='subtitles' src={subtitleSrc} default />
            </video>
            {videoPlayerControls}
            {keyboardControls}
        </div>
    );
}

export default VideoPlayer;
