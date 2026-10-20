'use client';

import React, { useEffect, useRef } from 'react';
import './AmbientLight.css';

type AmbientLightProps = {
    video: HTMLVideoElement | null;
    enabled: boolean;
    containerRef: React.RefObject<HTMLDivElement>;
};

const AmbientLight: React.FC<AmbientLightProps> = ({
    video,
    enabled,
    containerRef,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!enabled || !video) return;

        let animationFrameId: number;
        let lastDrawTime = 0;
        const FPS_INTERVAL = 1000 / 20; // 20 FPS: smooth glow with low GPU/CPU usage

        const updatePosition = () => {
            if (!canvasRef.current || !containerRef.current) return;
            const container = containerRef.current;
            const rect = container.getBoundingClientRect();

            const isFullscreen = document.fullscreenElement !== null;
            if (isFullscreen) {
                canvasRef.current.style.top = '0px';
                canvasRef.current.style.left = '0px';
                canvasRef.current.style.width = '100vw';
                canvasRef.current.style.height = '100vh';
                return;
            }

            const containerWidth = rect.width;
            const containerHeight = rect.height;

            // Determine actual video aspect ratio
            let videoRatio = 16 / 9;
            if (video && video.videoWidth && video.videoHeight) {
                videoRatio = video.videoWidth / video.videoHeight;
            }

            const containerRatio = containerWidth / containerHeight;
            let videoWidth = containerWidth;
            let videoHeight = containerHeight;

            // Check if object-fit is cover or fill
            const isFilled =
                video?.style.objectFit === 'cover' ||
                video?.style.objectFit === 'fill';

            if (!isFilled) {
                if (containerRatio > videoRatio) {
                    // Pillarboxed: container is wider than video
                    videoHeight = containerHeight;
                    videoWidth = containerHeight * videoRatio;
                } else {
                    // Letterboxed: container is taller than video
                    videoWidth = containerWidth;
                    videoHeight = containerWidth / videoRatio;
                }
            }

            // If custom maxWidth or maxHeight was set (e.g. 4:3 or 21:9 modes)
            if (video?.style.maxWidth) {
                const maxW = parseFloat(video.style.maxWidth);
                if (!isNaN(maxW) && maxW > 0) {
                    videoWidth = Math.min(videoWidth, maxW);
                }
            }
            if (video?.style.maxHeight) {
                const maxH = parseFloat(video.style.maxHeight);
                if (!isNaN(maxH) && maxH > 0) {
                    videoHeight = Math.min(videoHeight, maxH);
                }
            }

            // Center the ambient canvas behind the actual video
            const leftOffset =
                rect.left + window.scrollX + (containerWidth - videoWidth) / 2;
            const topOffset =
                rect.top + window.scrollY + (containerHeight - videoHeight) / 2;

            canvasRef.current.style.left = `${Math.round(leftOffset)}px`;
            canvasRef.current.style.top = `${Math.round(topOffset)}px`;
            canvasRef.current.style.width = `${Math.round(videoWidth)}px`;
            canvasRef.current.style.height = `${Math.round(videoHeight)}px`;
        };

        const draw = () => {
            if (!canvasRef.current || !video || video.readyState < 2) return;
            const ctx = canvasRef.current.getContext('2d', { alpha: false });
            if (!ctx) return;
            try {
                ctx.drawImage(
                    video,
                    0,
                    0,
                    canvasRef.current.width,
                    canvasRef.current.height
                );
            } catch {
                // Ignore any drawing errors
            }
        };

        const loop = (currentTime: number) => {
            animationFrameId = requestAnimationFrame(loop);

            if (currentTime - lastDrawTime < FPS_INTERVAL) {
                return;
            }
            lastDrawTime = currentTime;

            if (!video.paused && !video.ended) {
                draw();
            }
        };

        // Initialize position and draw initial frame if available
        updatePosition();
        draw();

        animationFrameId = requestAnimationFrame(loop);

        const handleResize = () => {
            updatePosition();
            draw();
        };

        const handleSeekedOrPause = () => {
            draw();
        };

        // Observe style changes on video (e.g. when aspect ratio is switched)
        const observer = new MutationObserver(() => {
            updatePosition();
            draw();
        });
        observer.observe(video, {
            attributes: true,
            attributeFilter: ['style', 'class'],
        });

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleResize);
        document.addEventListener('fullscreenchange', handleResize);
        video.addEventListener('loadedmetadata', handleResize);
        video.addEventListener('seeked', handleSeekedOrPause);
        video.addEventListener('pause', handleSeekedOrPause);
        video.addEventListener('play', handleSeekedOrPause);

        return () => {
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleResize);
            document.removeEventListener('fullscreenchange', handleResize);
            video.removeEventListener('loadedmetadata', handleResize);
            video.removeEventListener('seeked', handleSeekedOrPause);
            video.removeEventListener('pause', handleSeekedOrPause);
            video.removeEventListener('play', handleSeekedOrPause);
        };
    }, [video, enabled, containerRef]);

    if (!enabled) return null;

    return (
        <canvas
            ref={canvasRef}
            className='ambient-light-canvas'
            width={32}
            height={18}
            aria-hidden='true'
        />
    );
};

export default AmbientLight;
