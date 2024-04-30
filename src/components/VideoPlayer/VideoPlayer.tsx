import React, { useRef, useEffect, useState } from 'react';
import KeyboardVideoControls from '../CustomVideoControls/CustomVideoControls';
import VideoControls from '../VideoControls/VideoControls';
import './VideoPlayer.css';

type VideoPlayerProps = {
    videoSrc: string;
    subtitleSrc: string;
    videoName: string;
};

function VideoPlayer(props: VideoPlayerProps) {
    const { videoSrc, subtitleSrc, videoName } = props;
    const [video, setVideo] = useState<HTMLVideoElement | null>(null);
    const [keyboardControls, setKeyboardControls] =
        useState<React.JSX.Element | null>(null);
    const [videoPlayerControls, setVideoControls] =
        useState<React.JSX.Element | null>(null);

    const videoContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setKeyboardControls(
            <KeyboardVideoControls video={video} setVideo={setVideo} />
        );
        if (video) {
            let track = document.createElement('track');
            track.kind = 'subtitles';
            track.src = subtitleSrc;
            track.default = true;
            video.src = videoSrc;
            video.autoplay = true;
            video.appendChild(track);
        }

        if (video && videoContainer.current) {
            videoContainer.current.appendChild(video);
            setVideoControls(
                <VideoControls
                    videoName={videoName}
                    video={video}
                    videoContainer={videoContainer.current}
                />
            );
        }
    }, [videoContainer, video]);

    return (
        <div className='VideoPlayer' ref={videoContainer}>
            {videoPlayerControls}
            {keyboardControls}
        </div>
    );
}

export default VideoPlayer;
