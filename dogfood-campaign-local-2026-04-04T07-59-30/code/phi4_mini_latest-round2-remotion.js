import { Composition, useCurrentFrame, waitFor, useVideoConfig } from 'remotion';
import React, { useState, useEffect, useCallback } from 'react';

// --- Style Component for Visual Structure ---
const TypingText = ({ text, speedMs = 50 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isTyping, setIsTyping] = useState(true);

  // Use a dedicated interval for typing simulation
  useEffect(() => {
    if (!isTyping || displayedText.length >= text.length) return;

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(prev.length));
    }, speedMs);

    return () => clearInterval(interval);
  }, [isTyping, text, displayedText, speedMs]);

  // Handle cursor blinking using a separate interval
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 300); // Blink rate (300ms)

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <h1 style={{ fontSize: 48, fontWeight: 'bold', fontFamily: 'monospace' }}>
      {displayedText}
      <span 
        style={{ 
          borderRight: '2px solid black', 
          animation: 'blink 1s step-end infinite', // CSS animation for blinking
          display: cursorVisible ? 'inline-block' : 'none' 
        }}
      />
    </h1>
  );
};

// --- Main Component ---
const TypingVideo = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Configuration
  const mainText = "Hello Remotion!";
  const subtitleText = "Animating text and fading in subtitles.";
  const typingDurationFrames = 60; // Time for the main text to type (e.g., 3 seconds at 20fps)
  const subtitleFadeInStartFrame = typingDurationFrames + 30; // Start fading subtitle after typing finishes
  const subtitleFadeInDurationFrames = 30;

  // Determine if the subtitle should be visible and how opaque it should be
  let subtitleOpacity = 0;
  if (frame >= subtitleFadeInStartFrame && frame < subtitleFadeInStartFrame + subtitleFadeInDurationFrames) {
    // Calculate opacity based on elapsed time in the fade window
    const fadeProgress = (frame - subtitleFadeInStartFrame) / subtitleFadeInDurationFrames;
    subtitleOpacity = Math.min(1, fadeProgress);
  } else if (frame >= subtitleFadeInStartFrame + subtitleFadeInDurationFrames) {
    subtitleOpacity = 1;
  }

  // Inject the blinking cursor CSS animation keyframes dynamically
  // Note: In a real project, this would ideally be in a global CSS file.
  const styleSheet = `
    @keyframes blink {
      0%, 100% { border-color: black; opacity: 1; }
      50% { border-color: transparent; opacity: 0; }
    }
  `;

  return (
    <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    }}>
      {/* Apply the custom animation styles */}
      <style>{styleSheet}</style> 
      
      {/* Main Typing Animation */}
      <div style={{ marginBottom: 30 }}>
        <TypingText text={mainText} speedMs={50} />
      </div>

      {/* Subtitle Fade-In */}
      <h2 
        style={{ 
          fontSize: 24, 
          color: '#333', 
          opacity: subtitleOpacity, // Controlled by Remotion time
          transition: 'opacity 0.3s ease-out'
        }}
      >
        {subtitleText}
      </h2>
    </div>
  );
};

// --- Composition Wrapper ---
export const RemotionRoot = () => (
  <>
    <Composition
      id={`TypingVideo-${Date.now()}`}
      component={TypingVideo}
      durationInFrames={120} // Total video duration (e.g., 6 seconds at 20fps)
      width={1280}
      height={720}
    />
  </>
);