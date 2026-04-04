import { Composition, useCurrentFrame, Dimensions } from 'remotion';
import React, { useState, useEffect } from 'react';

// --- Constants ---
const TYPING_TEXT = "Hello, Remotion!";
const SUBTITLE_TEXT = "Animation complete. Welcome to video generation.";
const TYPING_DURATION_FRAMES = 60; // 2 seconds at 30fps
const SUBTITLE_FADE_DELAY_FRAMES = 60; // Wait 2 seconds after typing stops
const TOTAL_DURATION_FRAMES = TYPING_DURATION_FRAMES + SUBTITLE_FADE_DELAY_FRAMES + 60; // Extra time for subtitle fade

// --- Component ---
const TypingVideo = () => {
  const frame = useCurrentFrame();
  const [typedText, setTypedText] = useState('');

  // 1. Typing Simulation Logic
  useEffect(() => {
    if (frame < TYPING_DURATION_FRAMES) {
      const currentTypingLength = Math.min(Math.ceil(frame / 2), TYPING_TEXT.length);
      setTypedText(TYPING_TEXT.substring(0, currentTypingLength));
    } else {
      // Pause typing visualization after the duration
      setTypedText(TYPING_TEXT);
    }
  }, [frame]);

  // 2. Subtitle Visibility and Fade
  const subtitleOpacity = Math.min(1, Math.max(0, (frame - (TYPING_DURATION_FRAMES + SUBTITLE_FADE_DELAY_FRAMES)) / 30));
  const showSubtitle = frame >= TYPING_DURATION_FRAMES + SUBTITLE_FADE_DELAY_FRAMES;

  // 3. Cursor Blinking
  const cursorVisible = Math.floor(frame / 10) % 2 === 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '20px',
      fontFamily: 'monospace',
      color: '#333',
      textAlign: 'center',
    }}>
      {/* Main Typing Text */}
      <h1
        style={{
          fontSize: '4rem',
          margin: '0 0 10px 0',
          whiteSpace: 'pre-wrap',
          borderRight: cursorVisible ? '2px solid black' : 'none',
          animation: 'blink 1s linear infinite',
        }}
      >
        {typedText}{' '}{cursorVisible ? '|' : ''}
      </h1>

      {/* Subtitle */}
      <div
        style={{
          fontSize: '1.5rem',
          color: '#666',
          opacity: subtitleOpacity,
          transition: 'opacity 0.5s ease-out',
          marginTop: '30px',
          maxWidth: '800px',
        }}
      >
        {showSubtitle ? SUBTITLE_TEXT : ''}
      </div>

      {/* Keyframe Animation Definition (Inline for simplicity in single file) */}
      <style jsx global>{`
        @keyframes blink {
          50% {
            border-color: transparent;
          }
        }
      `}</style>
    </div>
  );
};

// --- Main Composition ---
export const RemotionRoot = () => {
  return (
    <Composition
      id="TypingVideo"
      component={TypingVideo}
      durationInFrames={TOTAL_DURATION_FRAMES}
      fps={30}
      width={1280}
      height={720}
    />
  );
};

// To run this component in a real environment, you would export RemotionRoot
// and use it in your index.tsx/jsx.
// Example usage in index.tsx:
// <RemotionRoot />