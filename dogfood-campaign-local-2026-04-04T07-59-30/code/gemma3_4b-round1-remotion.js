import { Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import { useState, useEffect, useMemo } from 'react';

// --- Constants ---
const MAIN_TEXT = "Hello, world! This text is typing out.";
const SUBTITLE_TEXT = "Welcome to your animated video experience.";
const TYPING_DURATION_FRAMES = 120; // 5 seconds at 24fps

// --- Components ---

// Component for the animated typing text and cursor
const TypingText = ({ text, durationFrames }) => {
  const frame = useCurrentFrame();
  const typedCharacters = Math.min(text.length, Math.floor(frame / (durationFrames / text.length)));
  const displayedText = text.substring(0, typedCharacters);

  // Determine if the cursor should be visible (blinking effect)
  // Blink every 5 frames (approx 0.2 seconds)
  const isCursorVisible = (Math.floor(frame / 5) % 2 === 0);

  return (
    <div style={{ fontSize: '4rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
      {displayedText}
      {/* Cursor */}
      <span style={{ 
        display: 'inline-block', 
        width: '0.5em', 
        height: '1em', 
        backgroundColor: 'red', 
        animation: 'blink 0.5s step-end infinite',
        opacity: isCursorVisible ? 1 : 0
      }}></span>
      {/* Keyframe animation for blinking cursor (needs to be defined in a global CSS scope if used outside styled-components, but for simplicity here, we rely on opacity toggle) */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Component for the fading subtitle
const Subtitle = ({ text, fadeInFrames, totalDurationFrames }) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(1, Math.max(0, (frame - (totalDurationFrames - fadeInFrames)) / 30)); // Fade in over 30 frames
  const visible = frame >= (totalDurationFrames - fadeInFrames);

  return (
    <div 
      style={{ 
        fontSize: '2rem', 
        color: '#ccc', 
        opacity: opacity, 
        transition: 'opacity 0.3s' 
      }}
    >
      {text}
    </div>
  );
};

// --- Main Composition ---

export const AnimatedTypingVideo = () => {
  const { width, height } = useVideoConfig();
  
  // Calculate the frame count for the subtitle display
  const SUBTITLE_DISPLAY_DURATION = 60; // Show for 2.5 seconds
  const TOTAL_DURATION = TYPING_DURATION_FRAMES + SUBTITLE_DISPLAY_DURATION;

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '20px',
        backgroundColor: '#111'
      }}
    >
      {/* Main Typing Text */}
      <div style={{ marginBottom: '40px' }}>
        <TypingText 
          text={MAIN_TEXT} 
          durationFrames={TYPING_DURATION_FRAMES} 
        />
      </div>

      {/* Subtitle */}
      <Subtitle 
        text={SUBTITLE_TEXT} 
        fadeInFrames={30} // Fade in over 30 frames
        totalDurationFrames={TOTAL_DURATION}
      />
    </div>
  );
};

// Composition wrapper (required for Remotion setup)
export default function App() {
  return (
    <Composition
      id="AnimatedTypingVideo"
      component={AnimatedTypingVideo}
      durationInFrames={24 * 5} // Total duration: 5 seconds
      width={1920}
      height={1080}
    />
  );
}