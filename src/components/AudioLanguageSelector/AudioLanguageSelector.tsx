'use client';

import React, { useEffect, useRef, useState } from 'react';
import './AudioLanguageSelector.css';

type AudioTrackOption = {
    id: number;
    label: string;
    isDefault: boolean;
};

type AudioLanguageSelectorProps = {
    video: HTMLVideoElement | null;
    videoSrc: string;
    videoName: string;
};

function getTrackLabel(
    name: string | null,
    language: string,
    index: number
) {
    const languageName =
        language !== 'und'
            ? new Intl.DisplayNames(
                  [typeof navigator === 'undefined' ? 'en' : navigator.language],
                  { type: 'language' }
              ).of(language)
            : undefined;
    const displayName =
        name && !/^(audio|track)\s*\d*$/i.test(name.trim())
            ? name.trim()
            : null;

    if (
        displayName &&
        languageName &&
        displayName.toLocaleLowerCase() !== languageName.toLocaleLowerCase()
    ) {
        return `${displayName} · ${languageName}`;
    }

    return displayName || languageName || name || `Audio ${index + 1}`;
}

function getOutputFormat(fileName: string) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'mkv') return 'mkv';
    if (extension === 'webm') return 'webm';
    if (extension === 'mov') return 'mov';
    return 'mp4';
}

export default function AudioLanguageSelector({
    video,
    videoSrc,
    videoName,
}: AudioLanguageSelectorProps) {
    const [tracks, setTracks] = useState<AudioTrackOption[]>([]);
    const [selectedTrack, setSelectedTrack] = useState(0);
    const [status, setStatus] = useState('Reading audio tracks…');
    const [busy, setBusy] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuContainer = useRef<HTMLDivElement>(null);
    const sourceBlob = useRef<Blob | null>(null);
    const activeOutputUrl = useRef<string | null>(null);
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            if (activeOutputUrl.current) {
                URL.revokeObjectURL(activeOutputUrl.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!video) return;

        let cancelled = false;
        const loadTracks = async () => {
            try {
                const response = await fetch(videoSrc);
                if (!response.ok) {
                    throw new Error('Could not read the selected video file.');
                }
                const blob = await response.blob();
                const { ALL_FORMATS, BlobSource, Input } = await import(
                    'mediabunny'
                );
                const input = new Input({
                    formats: ALL_FORMATS,
                    source: new BlobSource(blob),
                });

                try {
                    const inputTracks = await input.getAudioTracks();
                    const options = await Promise.all(
                        inputTracks.map(async (track) => {
                            const [name, language, disposition] =
                                await Promise.all([
                                    track.getName(),
                                    track.getLanguageCode(),
                                    track.getDisposition(),
                                ]);
                            return {
                                id: track.id,
                                label: getTrackLabel(
                                    name,
                                    language,
                                    track.number - 1
                                ),
                                isDefault:
                                    disposition.default || disposition.primary,
                            };
                        })
                    );

                    if (cancelled) return;
                    sourceBlob.current = blob;
                    setTracks(options);
                    const defaultIndex = options.findIndex(
                        (track) => track.isDefault
                    );
                    setSelectedTrack(defaultIndex >= 0 ? defaultIndex : 0);
                    setStatus(
                        options.length
                            ? ''
                            : 'No audio tracks were found in this file.'
                    );
                } finally {
                    input.dispose();
                }
            } catch (error) {
                if (cancelled) return;
                setStatus(
                    error instanceof Error
                        ? error.message
                        : 'Could not read audio tracks from this file.'
                );
            }
        };

        void loadTracks();
        return () => {
            cancelled = true;
        };
    }, [video, videoSrc]);

    useEffect(() => {
        if (!menuOpen) return;

        const closeOnOutsideClick = (event: PointerEvent) => {
            if (
                event.target instanceof Node &&
                !menuContainer.current?.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setMenuOpen(false);
        };

        document.addEventListener('pointerdown', closeOnOutsideClick);
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.removeEventListener('pointerdown', closeOnOutsideClick);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [menuOpen]);

    const selectAudioTrack = async (trackIndex: number) => {
        if (
            !video ||
            !sourceBlob.current ||
            trackIndex === selectedTrack ||
            busy
        ) {
            return;
        }

        const nextTrack = tracks[trackIndex];
        const previousSrc = video.src;
        const previousOutputUrl = activeOutputUrl.current;
        const previousTime = video.currentTime;
        const wasPlaying = !video.paused;
        let sourceSwitchStarted = false;
        setBusy(true);
        setStatus('Preparing audio track…');
        video.pause();

        try {
            const {
                ALL_FORMATS,
                BlobSource,
                BufferTarget,
                Conversion,
                Input,
                MkvOutputFormat,
                MovOutputFormat,
                Mp4OutputFormat,
                Output,
                WebMOutputFormat,
            } = await import('mediabunny');

            const input = new Input({
                formats: ALL_FORMATS,
                source: new BlobSource(sourceBlob.current),
            });
            const formatType = getOutputFormat(videoName);
            const format =
                formatType === 'mkv'
                    ? new MkvOutputFormat()
                    : formatType === 'webm'
                      ? new WebMOutputFormat()
                      : formatType === 'mov'
                        ? new MovOutputFormat()
                        : new Mp4OutputFormat();
            const target = new BufferTarget();
            const output = new Output({ format, target });

            try {
                const conversion = await Conversion.init({
                    input,
                    output,
                    audio: (track) => ({
                        discard: track.id !== nextTrack.id,
                    }),
                });

                if (!conversion.isValid) {
                    throw new Error(
                        'This file’s audio and video tracks cannot be combined in a browser-playable file.'
                    );
                }

                conversion.onProgress = (progress) => {
                    if (mounted.current) {
                        setStatus(
                            `Preparing audio track… ${Math.round(progress * 100)}%`
                        );
                    }
                };
                await conversion.execute();

                if (!target.buffer) {
                    throw new Error('The selected audio track could not be prepared.');
                }

                const nextUrl = URL.createObjectURL(
                    new Blob([target.buffer], { type: format.mimeType })
                );

                await new Promise<void>((resolve, reject) => {
                    const cleanup = () => {
                        video.removeEventListener('loadedmetadata', onLoaded);
                        video.removeEventListener('error', onError);
                    };
                    const onLoaded = () => {
                        cleanup();
                        video.currentTime = Math.min(
                            previousTime,
                            Number.isFinite(video.duration)
                                ? video.duration
                                : previousTime
                        );
                        activeOutputUrl.current = nextUrl;
                        if (previousOutputUrl) {
                            URL.revokeObjectURL(previousOutputUrl);
                        }
                        setSelectedTrack(trackIndex);
                        setStatus('');
                        if (wasPlaying) {
                            void video.play().catch(() => {
                                setStatus(
                                    'Track changed. Press Play to resume playback.'
                                );
                            });
                        }
                        resolve();
                    };
                    const onError = () => {
                        cleanup();
                        URL.revokeObjectURL(nextUrl);
                        const restorePosition = () => {
                            video.removeEventListener(
                                'loadedmetadata',
                                restorePosition
                            );
                            video.currentTime = Math.min(
                                previousTime,
                                Number.isFinite(video.duration)
                                    ? video.duration
                                    : previousTime
                            );
                            if (wasPlaying) {
                                void video.play().catch(() => {
                                    setStatus(
                                        'Audio track was not changed. Press Play to resume playback.'
                                    );
                                });
                            }
                        };
                        video.addEventListener(
                            'loadedmetadata',
                            restorePosition,
                            { once: true }
                        );
                        video.src = previousSrc;
                        video.load();
                        reject(
                            new Error(
                                'The browser could not play the file with the selected audio track.'
                            )
                        );
                    };

                    video.addEventListener('loadedmetadata', onLoaded, {
                        once: true,
                    });
                    video.addEventListener('error', onError, { once: true });
                    sourceSwitchStarted = true;
                    video.src = nextUrl;
                    video.load();
                });
            } finally {
                input.dispose();
            }
        } catch (error) {
            setStatus(
                error instanceof Error
                    ? error.message
                    : 'Could not switch audio tracks.'
            );
            if (wasPlaying && video.paused && !sourceSwitchStarted) {
                void video.play().catch(() => {
                    setStatus(
                        'Audio track was not changed. Press Play to resume playback.'
                    );
                });
            }
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className='AudioLanguageSelector' ref={menuContainer}>
            <button
                type='button'
                className='AudioTrackToggle'
                onClick={() => setMenuOpen((open) => !open)}
                disabled={tracks.length === 0 || busy}
                aria-label={`Audio tracks${tracks[selectedTrack] ? `, selected ${tracks[selectedTrack].label}` : ''}`}
                aria-expanded={menuOpen}
                aria-controls='AudioTrackMenu'
                title={
                    tracks[selectedTrack]
                        ? `Audio: ${tracks[selectedTrack].label}`
                        : 'Audio tracks unavailable'
                }
            >
                <svg
                    aria-hidden='true'
                    viewBox='0 0 24 24'
                    width='20'
                    height='20'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.8'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                >
                    <path d='M4 6h13M4 11h10M4 16h7' />
                    <path d='M18 14v5a2 2 0 1 1-2-2h2m0-3 3-1v6a2 2 0 1 1-2-2h2' />
                </svg>
            </button>
            {menuOpen && tracks.length > 0 && (
                <div
                    id='AudioTrackMenu'
                    className='AudioTrackMenu'
                    role='group'
                    aria-label='Available audio tracks'
                >
                    <p className='AudioTrackMenuTitle'>Audio track</p>
                    {tracks.map((track, index) => {
                        const isSelected = index === selectedTrack;
                        return (
                            <button
                                type='button'
                                key={track.id}
                                className={`AudioTrackOption${isSelected ? ' selected' : ''}`}
                                onClick={() => {
                                    void selectAudioTrack(index);
                                    setMenuOpen(false);
                                }}
                                disabled={isSelected || busy}
                                aria-pressed={isSelected}
                            >
                                <span>{track.label}</span>
                                {isSelected && (
                                    <span className='AudioTrackCheck' aria-hidden='true'>
                                        ✓
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
            {status && (
                <p
                    className='AudioLanguageStatus'
                    role={busy ? 'status' : 'alert'}
                >
                    {status}
                </p>
            )}
        </div>
    );
}
