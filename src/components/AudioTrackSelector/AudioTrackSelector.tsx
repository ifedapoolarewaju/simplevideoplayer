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

    useEffect(() => {
        if (!video) return;

        const updateAudioTracks = () => {
            const tracks: AudioTrack[] = [];
            const videoWithAudio = video as VideoElementWithAudioTracks;
            
            // Check if audioTracks is supported
            setIsSupported('audioTracks' in video);
            
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
            
            // Log for debugging
            console.log('Audio tracks detected:', tracks.length, tracks);
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
        
        setIsOpen(false);
    };

    // Don't render if there's only one or no audio tracks, or if not supported
    if (!isSupported || audioTracks.length <= 1) {
        return null;
    }

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