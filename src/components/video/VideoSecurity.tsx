'use client';

import React, { useEffect, useState } from 'react';

export default function VideoSecurity({ children }: { children: React.ReactNode }) {
    const [isScreenRecording, setIsScreenRecording] = useState(false);

    useEffect(() => {
        // Prevention mechanism using navigator constraints and visibility
        const checkScreenShare = () => {
            // Check document visibility
            if (document.visibilityState === 'hidden') {
                // setIsScreenRecording(true); 
            }
        };

        // Listen for visibility changes
        document.addEventListener('visibilitychange', checkScreenShare);
        
        // Listen for standard copy/paste events
        const preventCopy = (e: ClipboardEvent) => {
            e.preventDefault();
            return false;
        };
        document.addEventListener('copy', preventCopy);
        document.addEventListener('cut', preventCopy);

        // Basic Keyboard Shortcuts prevention (PrtScn, Cmd+Shift+3/4)
        const preventShortcuts = (e: KeyboardEvent) => {
            // Print Screen
            if (e.key === 'PrintScreen') {
                navigator.clipboard.writeText(''); // Clear clipboard immediately
                setIsScreenRecording(true);
                setTimeout(() => setIsScreenRecording(false), 3000);
            }
            // Cmd/Ctrl + Shift + (3, 4, 5) - macOS screen record shortcuts
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) {
                navigator.clipboard.writeText('');
                setIsScreenRecording(true);
                setTimeout(() => setIsScreenRecording(false), 3000);
            }
        };
        
        window.addEventListener('keyup', preventShortcuts);
        window.addEventListener('keydown', (e) => {
             // Block standard save commands Cmd+S / Ctrl+S
             if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                 e.preventDefault();
             }
        });

        checkScreenShare();

        return () => {
            document.removeEventListener('visibilitychange', checkScreenShare);
            document.removeEventListener('copy', preventCopy);
            document.removeEventListener('cut', preventCopy);
            window.removeEventListener('keyup', preventShortcuts);
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {isScreenRecording ? (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'black',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                        <line x1="2" y1="3" x2="22" y2="17"></line>
                    </svg>
                    <h3 style={{ margin: 0 }}>Screen Capture Detected</h3>
                    <p style={{ margin: 0, color: '#9ca3af' }}>Please disable screen capture to continue.</p>
                </div>
            ) : (
                <div style={{ 
                    width: '100%', 
                    height: '100%',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                }}>
                    {/* Security Overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        zIndex: 999,
                        background: 'transparent',
                        pointerEvents: 'none'
                    }} />
                    {children}
                </div>
            )}
        </div>
    );
}
