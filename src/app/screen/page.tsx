'use client';

import SubtitleSelector from '@/components/SubtitleSelector/SubtitleSelector';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer';
import React, { useState } from 'react';
import eject from '@/assets/ejecticon.png';
import Fork from '@/components/Fork/Fork';
import logo from '@/assets/logo.png';
import { useVideoContext } from '@/components/VideoContextProvider/VideoContextProvider';
import { redirect, useRouter } from 'next/navigation';

const Screen = () => {
    const [cutTheLights, setCutTheLights] = useState(false);
    const { videoUrl, videoName, subtitleSrc } = useVideoContext();
    const router = useRouter();
    if (!videoUrl.length) {
        redirect('/');
    }

    const visibility = cutTheLights ? 'hidden' : 'visible';
    const cursor = cutTheLights ? 'none' : 'auto';
    const enableCutTheLights = () => setCutTheLights(true);
    const disableCutTheLights = () => setCutTheLights(false);
    const exitVideo = () => router.push('/');

    return (
        <div
            className='App'
            onMouseMove={disableCutTheLights}
            style={{ cursor }}
        >
            <header className='App-header' style={{ visibility }}>
                <div className='App-logo flex content-center items-center'>
                    <div className='App-icon'>
                        <img src={logo.src} width='15px' alt='logo' />
                    </div>
                    <span className='App-name'>Simple Video Player</span>
                </div>
                <Fork />
            </header>
            <div className='App-body'>
                <VideoPlayer
                    videoName={videoName}
                    videoSrc={videoUrl}
                    subtitleSrc={subtitleSrc}
                />
                <div className='App-Video-Actions' style={{ visibility }}>
                    <SubtitleSelector />
                    <button
                        onClick={enableCutTheLights}
                        className='default-button'
                    >
                        Cut the lights
                    </button>
                    <button onClick={exitVideo} className='default-button'>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                            }}
                        >
                            <span>Exit&nbsp;|&nbsp; Eject</span>
                            <img
                                src={eject.src}
                                width='10px'
                                height='10px'
                                alt='eject'
                            />
                        </div>
                    </button>
                    <p>
                        SRT and WebVTT Subtitle files supported &nbsp;|&nbsp;
                        Press <b>Arrow Keys</b> for Volume and Skips
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Screen;
