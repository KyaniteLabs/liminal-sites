import { Composition, useCurrentFrame, waitFor } from 'remotion';
import React, { useState, useEffect, useMemo } from 'react';

// --- Constants ---
const VIDEO_WIDTH = 1280;
const VIDEO_HEIGHT = 720;
const TYPING_DURATION = 2000; // 2 seconds
const SUBTITLE_FADE_DELAY = 500; // 0.5 seconds delay after typing stops

// --- Helper Component: Typing Text ---
const TypingText = ({ text, durationMs, fontSize = 64, color = 'white' }) => {
  const frame = useCurrentFrame();
  const chars = text.split('');

  // Calculate how many characters should be visible at the current frame
  const visibleCharsCount = Math.min(chars.length, Math.floor((frame / 1000) * (chars.length / (durationMs / 1000))));

  // The visible part of the text
  const visibleText = chars.slice(0, visibleCharsCount).join('');

  // The cursor blinking logic
  const cursorVisible = Math.sin(frame / 150) > 0.5; // Blinks every 150 frames (approx 2.5s cycle)

  return (
    <div style={{ 
      fontSize: `${fontSize}px`, 
      color: color, 
      whiteSpace: 'pre', // Important for preserving spaces/formatting
      display: 'inline-block',
      lineHeight: 1.2
    }}>
      {visibleText}
      {cursorVisible && <span style={{ fontSize: `${fontSize}px`, color: color }}>|</span>}
    </div>
  );
};


// --- Main Component ---
const AnimatedTypingVideo = () => {
  const [subtitleVisible, setSubtitleVisible] = useState(false);

  useEffect(() => {
    // We use a setTimeout/requestAnimationFrame pattern within the component's scope
    // to manage the state changes based on the overall video timeline flow.
    // In a real Remotion setup, direct state management based on time is often done
    // by conditional rendering inside the main component body or by using 'waitFor'.
  }, []);

  // We'll use the composition lifecycle to manage the sequence

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: 50, 
      height: '100%', 
      width: '100%',
      justifyContent: 'center'
    }}>
      {/* Main Typing Text Area */}
      <div style={{ minHeight: '100px', textAlign: 'center' }}>
        <TypingText 
          text={`Hello Remotion! This is a dynamic, timed animation.`} 
          durationMs={TYPING_DURATION} 
          fontSize={72} 
          color='#333'
        />
      </div>

      {/* Subtitle Area */}
      <div 
        style={{
          marginTop: 40,
          fontSize: '24px',
          color: '#666',
          opacity: subtitleVisible ? 1 : 0,
          transform: subtitleVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
        }}
      >
        {subtitleVisible ? '✨ Animation complete! Check the console for details.' : ''}
      </div>
    </div>
  );
};

// --- Remotion Composition Wrapper ---
export const MyVideo = () => {
  return (
    <Composition
      id={`typing-video-${Date.now()}`}
      component={AnimatedTypingVideo}
      durationInFrames={Math.ceil((TYPING_DURATION + 1000) / 16.67)} // Total duration: Typing time + Fade time
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
    />
  );
};