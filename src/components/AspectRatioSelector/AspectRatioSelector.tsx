import React, { useState } from 'react';
import { aspectRatioIcon } from '@/assets/aspectratio';
import './AspectRatioSelector.css';

export type AspectRatioMode = 'fit' | 'fill' | 'stretch' | '4:3' | '21:9';

const ASPECT_RATIO_MODES: { mode: AspectRatioMode; label: string }[] = [
    { mode: 'fit', label: 'FIT' },
    { mode: 'fill', label: 'FILL' },
    { mode: 'stretch', label: 'STRETCH' },
    { mode: '4:3', label: '4:3' },
    { mode: '21:9', label: '21:9' },
];

type AspectRatioSelectorProps = {
    video: HTMLVideoElement;
    videoContainer: HTMLDivElement;
};

function AspectRatioSelector(props: AspectRatioSelectorProps) {
    const { video, videoContainer } = props;
    const [currentIndex, setCurrentIndex] = useState(0);

    const applyAspectRatio = (mode: AspectRatioMode) => {
        // Reset all custom styles first
        video.style.objectFit = '';
        video.style.width = '';
        video.style.height = '';
        video.style.maxWidth = '';
        video.style.maxHeight = '';

        switch (mode) {
            case 'fit':
                // Default: show full video, black bars if needed
                video.style.objectFit = 'contain';
                video.style.width = '100%';
                video.style.height = '100%';
                break;
            case 'fill':
                // Fill the container, crop edges if needed
                video.style.objectFit = 'cover';
                video.style.width = '100%';
                video.style.height = '100%';
                break;
            case 'stretch':
                // Stretch to fill, may distort
                video.style.objectFit = 'fill';
                video.style.width = '100%';
                video.style.height = '100%';
                break;
            case '4:3':
                // Force 4:3 ratio centered in container
                video.style.objectFit = 'contain';
                video.style.height = '100%';
                video.style.width = '';
                video.style.maxWidth = `${videoContainer.clientHeight * (4 / 3)}px`;
                video.style.margin = '0 auto';
                video.style.display = 'block';
                break;
            case '21:9':
                // Force 21:9 ultrawide ratio centered in container
                video.style.objectFit = 'contain';
                video.style.width = '100%';
                video.style.height = '';
                video.style.maxHeight = `${videoContainer.clientWidth * (9 / 21)}px`;
                video.style.position = 'relative';
                video.style.top = '50%';
                video.style.transform = 'translateY(-50%)';
                break;
        }
    };

    const cycleAspectRatio = () => {
        const nextIndex = (currentIndex + 1) % ASPECT_RATIO_MODES.length;
        setCurrentIndex(nextIndex);
        applyAspectRatio(ASPECT_RATIO_MODES[nextIndex].mode);
    };

    return (
        <button
            onClick={cycleAspectRatio}
            className='aspect-ratio-button'
            title={`Aspect Ratio: ${ASPECT_RATIO_MODES[currentIndex].label}`}
        >
            {aspectRatioIcon}
            <span className='aspect-ratio-label'>
                {ASPECT_RATIO_MODES[currentIndex].label}
            </span>
        </button>
    );
}

export default AspectRatioSelector;

