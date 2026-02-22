'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import screenfull from 'screenfull';
import { isMobile } from 'react-device-detect';
import disableDevtool from 'disable-devtool';

import {
    HiOutlinePlay,
    HiOutlinePause,
    HiOutlineVolumeUp,
    HiOutlineVolumeOff,
    HiOutlineArrowsExpand,
} from 'react-icons/hi';
import { FiAlertTriangle } from 'react-icons/fi';
import { formatTime } from '@/lib/demoData';

interface VideoPlayerProps {
    videoUrl?: string;
    lessonTitle: string;
    onProgress: (percent: number, currentTime: number) => void;
    onComplete: () => void;
    initialPosition?: number;
    completionThreshold?: number; // default 90
}

export default function VideoPlayer({
    videoUrl,
    lessonTitle,
    onProgress,
    onComplete,
    initialPosition = 0,
    completionThreshold = 90,
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const maxWatchedRef = useRef(initialPosition);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [tabWarning, setTabWarning] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [watchPercent, setWatchPercent] = useState(0);
    const [hasCompleted, setHasCompleted] = useState(false);
    const controlsTimerRef = useRef<NodeJS.Timeout>(null);

    const speeds = [1, 1.25, 1.5, 2];

    // Demo video URL if none provided
    const actualUrl = videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';


    // Auto-hide controls
    const resetControlsTimer = useCallback(() => {
        setShowControls(true);
        if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
        controlsTimerRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    }, [isPlaying]);

    // Handle timeupdate
    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video) return;

        const ct = video.currentTime;
        const dur = video.duration || 1;

        // Prevent seeking ahead of max watched
        if (ct > maxWatchedRef.current + 2) {
            video.currentTime = maxWatchedRef.current;
            return;
        }

        if (ct > maxWatchedRef.current) {
            maxWatchedRef.current = ct;
        }

        setCurrentTime(ct);
        const percent = Math.round((maxWatchedRef.current / dur) * 100);
        setWatchPercent(percent);
        onProgress(percent, ct);

        // Check completion
        if (percent >= completionThreshold && !hasCompleted) {
            setHasCompleted(true);
            onComplete();
        }
    };

    const handleLoadedMetadata = () => {
        const video = videoRef.current;
        if (video) {
            setDuration(video.duration);
            if (initialPosition > 0) {
                video.currentTime = initialPosition;
                maxWatchedRef.current = initialPosition;
            }
        }

        // Anti-download logic
        const blockDownloads = (e: any) => {
            e.preventDefault();
            return false;
        };
        if (video) {
            video.addEventListener('contextmenu', blockDownloads);
        }
    };

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;
        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
        setIsPlaying(!isPlaying);
        resetControlsTimer();
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(!isMuted);
    };

    const changeSpeed = (s: number) => {
        const video = videoRef.current;
        if (!video) return;
        video.playbackRate = s;
        setSpeed(s);
        setShowSpeedMenu(false);
    };

    const toggleFullscreen = () => {
        const container = containerRef.current;
        if (!container) return;

        // If mobile, try specific logic, else use screenfull
        if (screenfull.isEnabled) {
            screenfull.toggle(container);
            setIsFullscreen(!screenfull.isFullscreen);
        } else if (videoRef.current && (videoRef.current as any).webkitEnterFullscreen) {
            (videoRef.current as any).webkitEnterFullscreen(); // For iOS Safari
        }
    };

    // Listen to fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            if (screenfull.isEnabled) {
                setIsFullscreen(screenfull.isFullscreen);
            }
        };

        if (screenfull.isEnabled) {
            screenfull.on('change', handleFullscreenChange);
        }

        return () => {
            if (screenfull.isEnabled) {
                screenfull.off('change', handleFullscreenChange);
            }
        };
    }, []);

    // Block seeking on progress bar click
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const video = videoRef.current;
        if (!video || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        const seekTo = percent * duration;

        // Only allow seeking backwards or to already-watched positions
        if (seekTo <= maxWatchedRef.current) {
            video.currentTime = seekTo;
            setCurrentTime(seekTo);
        }
    };


    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
    const maxWatchedPercent = watchPercent;

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div
                className="video-player-container"
                onMouseMove={resetControlsTimer}
                onMouseLeave={() => isPlaying && setShowControls(false)}
                style={{ flex: 1, position: 'relative', background: 'black', overflow: 'hidden' }}
            >
                {/* Security Overlay - Blocks extension interactions and right clicks */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 10,
                    background: 'transparent',
                    pointerEvents: isPlaying ? 'none' : 'auto' // allow click to play initially
                }} onClick={!isPlaying ? togglePlay : undefined} />

                {/* The actual video */}
                <video
                    ref={videoRef}
                    src={actualUrl}
                    controlsList="nodownload nofullscreen noremoteplayback"
                    disablePictureInPicture
                    disableRemotePlayback
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => {
                        setIsPlaying(false);
                        if (!hasCompleted && watchPercent >= completionThreshold) {
                            setHasCompleted(true);
                            onComplete();
                        }
                    }}
                    onClick={togglePlay}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        cursor: 'pointer',
                        // CSS prevention tricks
                        pointerEvents: showControls ? 'auto' : 'none', // Allow clicks only when controls are visible
                        WebkitTouchCallout: 'none',
                        WebkitUserSelect: 'none',
                        userSelect: 'none'
                    }}
                    playsInline
                    onContextMenu={(e) => e.preventDefault()}
                />

                {/* Play overlay when paused */}
                {!isPlaying && (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(0,0,0,0.3)',
                            cursor: 'pointer',
                            zIndex: 15
                        }}
                        onClick={togglePlay}
                    >
                        <div style={{
                            width: '68px',
                            height: '68px',
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '28px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        }}>
                            <HiOutlinePlay />
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div
                    className="video-controls"
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '20px 16px 12px',
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                        opacity: showControls || !isPlaying ? 1 : 0,
                        transition: 'opacity 0.3s',
                        zIndex: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}
                >
                    {/* Progress Bar */}
                    <div
                        onClick={handleProgressClick}
                        style={{
                            height: '6px',
                            background: 'rgba(255,255,255,0.3)',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            position: 'relative'
                        }}>
                        {/* Max watched indicator */}
                        <div
                            style={{
                                position: 'absolute',
                                height: '100%',
                                width: `${maxWatchedPercent}%`,
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '3px',
                            }}
                        />
                        <div style={{
                            height: '100%',
                            width: `${progressPercent}%`,
                            background: 'var(--primary)',
                            borderRadius: '3px',
                            position: 'relative'
                        }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                background: 'white',
                                borderRadius: '50%',
                                position: 'absolute',
                                right: '-6px',
                                top: '-3px',
                                boxShadow: '0 0 4px rgba(0,0,0,0.5)'
                            }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <button onClick={togglePlay} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', display: 'flex' }}>
                                {isPlaying ? <HiOutlinePause /> : <HiOutlinePlay />}
                            </button>
                            <button onClick={toggleMute} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer', display: 'flex' }}>
                                {isMuted ? <HiOutlineVolumeOff /> : <HiOutlineVolumeUp />}
                            </button>
                            <span style={{ color: 'white', fontSize: '12px', fontFamily: 'monospace' }}>
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            {/* Watch percentage */}
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                                {watchPercent}% watched
                            </span>

                            {/* Speed */}
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                                    style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', fontSize: '13px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    {speed}x
                                </button>
                                <div style={{
                                    position: 'absolute',
                                    bottom: '100%',
                                    right: 0,
                                    background: 'rgba(0,0,0,0.9)',
                                    borderRadius: '8px',
                                    padding: '8px',
                                    display: showSpeedMenu ? 'flex' : 'none',
                                    flexDirection: 'column',
                                    gap: '4px',
                                    marginBottom: '8px'
                                }}>
                                    {speeds.map(s => (
                                        <button
                                            key={s}
                                            style={{
                                                background: speed === s ? 'var(--primary)' : 'transparent',
                                                color: 'white',
                                                border: 'none',
                                                padding: '4px 12px',
                                                borderRadius: '4px',
                                                fontSize: '13px',
                                                cursor: 'pointer',
                                                textAlign: 'center'
                                            }}
                                            onClick={() => changeSpeed(s)}
                                        >
                                            {s}x
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button onClick={toggleFullscreen} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer', display: 'flex' }}>
                                <HiOutlineArrowsExpand />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lesson Info Bar - Only show when NOT in fullscreen */}
            {!isFullscreen && (
                <div style={{
                    background: 'white',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0 0 var(--border-radius) var(--border-radius)',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px'
                }}>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{lessonTitle}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            Speed: {speed}x • {watchPercent >= completionThreshold ? '✅ Completed' : `Watch ${completionThreshold}% to complete`}
                        </div>
                    </div>
                    {hasCompleted && (
                        <span className="badge-custom success" style={{ fontSize: '12px' }}>
                            ✓ Lesson Complete
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
