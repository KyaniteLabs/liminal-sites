import React, { useCallback } from 'react';
import { Composition, useCurrentFrame, waitFor } from 'remotion';

// --- Constants for Timing ---
const TYPING_DURATION = 100; // Time per character (ms)
const TYPING_TOTAL_CHARS = 30;
const TYPING_START_FRAME = 0;
const SUBTITLE_START_FRAME = 150;
const CURSOR_BLINK_RATE = 10; // Blink every 10 frames

// --- Helper Component: Blinking Cursor ---
const Cursor = () => {
  const frame = useCurrentFrame();
  // Blink every 10 frames (e.g., visible on frames 0-9, invisible on 10-19)
  const isVisible = Math.floor(frame / CURSOR_BLINK_RATE) % 2 === 0;

  return (
    <span
      style={{
        display: 'inline-block',
        width: '0.1em',
        height: '1.2em',
        backgroundColor: '#333',
        animation: 'blinking 1s linear infinite', // Fallback animation or use the visibility check
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s',
        verticalAlign: 'bottom',
      }}
    />
  );
};

// --- Main Component ---
const TypingVideo = () => {
  const frame = useCurrentFrame();

  // 1. Typing Logic
  const typingProgress = Math.min(1, frame / (TYPING_TOTAL_CHARS * TYPING_DURATION / 30));
  const currentChars = Math.floor(typingProgress * TYPING_TOTAL_CHARS);
  
  const mainText = "Welcome to Remotion! This text is being typed out.";
  const typedText = mainText.substring(0, currentChars);

  // 2. Subtitle Fade Logic
  const subtitle = "Remotion makes complex animations easy.";
  const subtitleOpacity = Math.min(1, Math.max(0, (frame - SUBTITLE_START_FRAME) / 150));

  // 3. Styles
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    padding: '50px',
    boxSizing: 'border-box',
  };

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#111',
    whiteSpace: 'pre-wrap', // Important to preserve space for the cursor
    margin: '0',
    minHeight: '1.2em',
    letterSpacing: '-0.05em',
  };

  const subtitleStyle = {
    fontSize: '1.5rem',
    color: '#555',
    marginTop: '30px',
    opacity: subtitleOpacity,
    transform: `translateY(${100 - subtitleOpacity * 100}px)`,
    transformOrigin: 'bottom',
    transition: 'opacity 0.3s ease-out',
  };

  return (
    <div style={containerStyle}>
      {/* Main Animated Text */}
      <h1 style={titleStyle}>
        {typedText}
        <Cursor />
      </h1>

      {/* Subtitle */}
      <p style={subtitleStyle}>
        {subtitle}
      </p>
    </div>
  );
};

// --- Composition Setup ---
export const RemotionRoot = () => {
  // Set the duration to allow the full animation cycle to play out
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Composition
        id="TypingAnimation"
        component={TypingVideo}
        durationInFrames={300} // 300 frames = 10 seconds @ 30fps
        width={1280}
        height={720}
      />
    </div>
  );
};

// Note: When running in a real Remotion setup, you would use <RemotionRoot /> in your index.tsx