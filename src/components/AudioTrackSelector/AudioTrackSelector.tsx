import React, { useEffect, useState } from 'react';
import './AudioTrackSelector.css';

type AudioTrackSelectorProps = {
    video: HTMLVideoElement | null;
};

type AudioTrack = {
    id: string;
    label: string;
    language: string;
    enabled: boolean;
};

// Extend HTMLVideoElement type to include audioTracks
interface VideoElementWithAudioTracks extends HTMLVideoElement {
    audioTracks?: {
        length: number;
        [index: number]: {
            id: string;
            label: string;
            language: string;
            enabled: boolean;
        };
        addEventListener?: (type: string, listener: () => void) => void;
        removeEventListener?: (type: string, listener: () => void) => void;
    };
}

function AudioTrackSelector({ video }: AudioTrackSelectorProps) {
    const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [showUnsupportedMessage, setShowUnsupportedMessage] = useState(false);

    useEffect(() => {
        if (!video) return;

        const updateAudioTracks = () => {
            const tracks: AudioTrack[] = [];
            const videoWithAudio = video as VideoElementWithAudioTracks;
            
            // Check if audioTracks is supported
            const apiSupported = 'audioTracks' in video;
            setIsSupported(apiSupported);
            
            // Get audio tracks from the video element
            if (videoWithAudio.audioTracks && videoWithAudio.audioTracks.length > 0) {
                for (let i = 0; i < videoWithAudio.audioTracks.length; i++) {
                    const track = videoWithAudio.audioTracks[i];
                    tracks.push({
                        id: track.id || `track-${i}`,
                        label: track.label || `Audio Track ${i + 1}`,
                        language: track.language || 'unknown',
                        enabled: track.enabled,
                    });
                }
            }
            
            setAudioTracks(tracks);
            
            // Log for debugging - this helps users understand what's happening
            if (apiSupported) {
                console.log('Simple Video Player: Audio tracks detected:', tracks.length, tracks);
                if (tracks.length > 1) {
                    console.log('Simple Video Player: Multiple audio tracks available for switching');
                }
            } else {
                console.log('Simple Video Player: AudioTracks API not supported in this browser');
            }
        };

        // Listen for when metadata is loaded
        video.addEventListener('loadedmetadata', updateAudioTracks);
        
        // Also check immediately in case metadata is already loaded
        if (video.readyState >= 1) {
            updateAudioTracks();
        }

        // Listen for audio track changes if supported
        const videoWithAudio = video as VideoElementWithAudioTracks;
        if (videoWithAudio.audioTracks && videoWithAudio.audioTracks.addEventListener) {
            const handleTrackChange = () => updateAudioTracks();
            videoWithAudio.audioTracks.addEventListener('change', handleTrackChange);
            
            return () => {
                video.removeEventListener('loadedmetadata', updateAudioTracks);
                if (videoWithAudio.audioTracks && videoWithAudio.audioTracks.removeEventListener) {
                    videoWithAudio.audioTracks.removeEventListener('change', handleTrackChange);
                }
            };
        }

        return () => {
            video.removeEventListener('loadedmetadata', updateAudioTracks);
        };
    }, [video]);

    const selectAudioTrack = (trackId: string) => {
        if (!video) return;
        const videoWithAudio = video as VideoElementWithAudioTracks;
        if (!videoWithAudio.audioTracks) return;

        // Disable all tracks first
        for (let i = 0; i < videoWithAudio.audioTracks.length; i++) {
            if (videoWithAudio.audioTracks[i]) {
                videoWithAudio.audioTracks[i].enabled = false;
            }
        }

        // Enable the selected track
        for (let i = 0; i < videoWithAudio.audioTracks.length; i++) {
            if (videoWithAudio.audioTracks[i] && 
                (videoWithAudio.audioTracks[i].id === trackId || `track-${i}` === trackId)) {
                videoWithAudio.audioTracks[i].enabled = true;
                break;
            }
        }

        // Update state
        setAudioTracks(prev => prev.map(track => ({
            ...track,
            enabled: track.id === trackId
        })));
        
        console.log('Simple Video Player: Switched to audio track:', trackId);
        setIsOpen(false);
    };

    const handleButtonClick = () => {
        if (audioTracks.length > 1) {
            setIsOpen(!isOpen);
        } else if (isSupported && audioTracks.length <= 1) {
            // Show message about no multiple tracks
            console.log('Simple Video Player: No multiple audio tracks detected in this video');
        } else {
            // Show unsupported message
            setShowUnsupportedMessage(true);
            setTimeout(() => setShowUnsupportedMessage(false), 3000);
        }
    };

    // Always render if there's a video, but show different states
    if (!video) {
        return null;
    }

    // If not supported, show a disabled button with explanation on hover/click
    if (!isSupported) {
        return (
            <div className="audio-track-selector">
                <button 
                    className="audio-track-button control-button disabled"
                    onClick={handleButtonClick}
                    title="Audio track switching requires browser support for audioTracks API (limited availability)"
                >
                    <svg
                        className="w-[20px]"
                        fill="#888888"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                </button>
                
                {showUnsupportedMessage && (
                    <div className="audio-track-dropdown">
                        <div className="audio-track-header">Audio Track Switching</div>
                        <div className="audio-track-message">
                            Your browser doesn&apos;t support the audioTracks API needed for switching between multiple audio tracks. This feature requires specific browser support.
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // If supported but no multiple tracks
    if (audioTracks.length <= 1) {
        return (
            <div className="audio-track-selector">
                <button 
                    className="audio-track-button control-button disabled"
                    onClick={handleButtonClick}
                    title={audioTracks.length === 1 ? "Only one audio track available" : "No audio tracks detected"}
                >
                    <svg
                        className="w-[20px]"
                        fill="#888888"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                </button>
            </div>
        );
    }

    // Multiple tracks available - show active selector
    return (
        <div className="audio-track-selector">
            <button 
                className="audio-track-button control-button"
                onClick={() => setIsOpen(!isOpen)}
                title={`Select Audio Track (${audioTracks.length} available)`}
            >
                <svg
                    className="w-[20px]"
                    fill="#ffffff"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
            </button>
            
            {isOpen && (
                <div className="audio-track-dropdown">
                    <div className="audio-track-header">Audio Tracks</div>
                    {audioTracks.map((track) => (
                        <button
                            key={track.id}
                            className={`audio-track-option ${track.enabled ? 'active' : ''}`}
                            onClick={() => selectAudioTrack(track.id)}
                        >
                            <span className="track-label">{track.label}</span>
                            {track.language !== 'unknown' && (
                                <span className="track-language">({track.language})</span>
                            )}
                            {track.enabled && <span className="track-indicator">✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AudioTrackSelector;