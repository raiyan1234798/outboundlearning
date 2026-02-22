'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
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
    const maxWatchedRef = useRef(initialPosition);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [tabWarning, setTabWarning] = useState(false);
    const [watchPercent, setWatchPercent] = useState(0);
    const [hasCompleted, setHasCompleted] = useState(false);
    const controlsTimerRef = useRef<NodeJS.Timeout>(null);

    const speeds = [1, 1.25, 1.5, 2];

    // Demo video URL if none provided
    const actualUrl = videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

    // Tab switch detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isPlaying) {
                videoRef.current?.pause();
                setIsPlaying(false);
                setTabWarning(true);
            }
        };

        const handleBlur = () => {
            if (isPlaying) {
                videoRef.current?.pause();
                setIsPlaying(false);
                setTabWarning(true);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
        };
    }, [isPlaying]);

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
        const container = videoRef.current?.parentElement;
        if (!container) return;
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            container.requestFullscreen();
        }
    };

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

    const dismissTabWarning = () => {
        setTabWarning(false);
        videoRef.current?.play();
        setIsPlaying(true);
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
    const maxWatchedPercent = watchPercent;

    return (
        <>
            {/* Tab Warning Overlay */}
            {tabWarning && (
                <div className="tab-warning-overlay">
                    <div className="tab-warning-content">
                        <div className="warning-icon"><FiAlertTriangle /></div>
                        <h3>Video Paused</h3>
                        <p>
                            The video was paused because you switched tabs or minimized the window.
                            Please stay on this tab to continue watching.
                        </p>
                        <button className="btn-primary-custom" onClick={dismissTabWarning}>
                            Resume Video
                        </button>
                    </div>
                </div>
            )}

            <div
                className="video-player-container"
                onMouseMove={resetControlsTimer}
                onMouseLeave={() => isPlaying && setShowControls(false)}
            >
                <video
                    ref={videoRef}
                    src={actualUrl}
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
                    style={{ cursor: 'pointer' }}
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
                        opacity: showControls || !isPlaying ? 1 : 0,
                        transition: 'opacity 0.3s',
                    }}
                >
                    {/* Progress Bar */}
                    <div className="video-progress" onClick={handleProgressClick} style={{ cursor: 'pointer' }}>
                        {/* Max watched indicator */}
                        <div
                            style={{
                                position: 'absolute',
                                height: '100%',
                                width: `${maxWatchedPercent}%`,
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '2px',
                            }}
                        />
                        <div className="progress-watched" style={{ width: `${progressPercent}%` }} />
                    </div>

                    <div className="video-controls-bar">
                        <div className="video-controls-left">
                            <button className="video-control-btn" onClick={togglePlay}>
                                {isPlaying ? <HiOutlinePause /> : <HiOutlinePlay />}
                            </button>
                            <button className="video-control-btn" onClick={toggleMute}>
                                {isMuted ? <HiOutlineVolumeOff /> : <HiOutlineVolumeUp />}
                            </button>
                            <span className="video-time">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        <div className="video-controls-right">
                            {/* Watch percentage */}
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                                {watchPercent}% watched
                            </span>

                            {/* Speed */}
                            <div className="speed-selector">
                                <button className="speed-btn" onClick={() => setShowSpeedMenu(!showSpeedMenu)}>
                                    {speed}x
                                </button>
                                <div className={`speed-menu ${showSpeedMenu ? 'show' : ''}`}>
                                    {speeds.map(s => (
                                        <button
                                            key={s}
                                            className={`speed-option ${speed === s ? 'active' : ''}`}
                                            onClick={() => changeSpeed(s)}
                                        >
                                            {s}x
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button className="video-control-btn" onClick={toggleFullscreen}>
                                <HiOutlineArrowsExpand />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lesson Info Bar */}
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
        </>
    );
}
