import React, { useState, useEffect } from 'react';
import { Composition, useVideoConfig, useCurrentFrame } from '@remotion/cli';

// --- Constants ---
const VIDEO_DURATION = 5 * 1000; // 5 seconds
const TYPING_DURATION = 2000; // 2 seconds to type
const SUBTITLE_DELAY = 500; // 0.5s delay after typing finishes

const FULL_TEXT = "Welcome to the world of Remotion! This text is being animated.";
const SUBTITLE_TEXT = "Animation power, effortlessly.";

/**
 * Component responsible for the typing animation effect.
 * @param {string} text The full text to type.
 * @param {number} duration The duration over which typing should occur (in ms).
 * @returns {JSX.Element}
 */
const TypingText = ({ text, duration }) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / (duration / 30)); // Scale progress from 0 to 1
  
  // Calculate how many characters should be visible based on progress
  const charactersToShow = Math.floor(progress * text.length);
  const typedText = text.substring(0, charactersToShow);
  
  // Calculate the cursor visibility
  // Blink every 500ms (50 frames at 30fps)
  const cursorVisible = Math.floor(frame / 50) % 2 === 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ whiteSpace: 'pre-wrap', fontSize: '3rem', fontWeight: 'bold', color: '#333' }}>
        {typedText}
      </span>
      {/* Cursor Blink */}
      <span 
        style={{ 
          display: 'inline-block', 
          width: '0.1em', 
          height: '1.2em', 
          backgroundColor: 'black', 
          marginLeft: '0.1em',
          animation: cursorVisible ? 'blink 0.5s step-end infinite' : 'none'
        }}
      ></span>
      {/* Define the blinking animation keyframes (usually managed by CSS global scope, but defined here for completeness) */}
      <style>{`
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};


/**
 * Main video component orchestrating typing and fading.
 */
export const TypingTextVideo = () => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / (VIDEO_DURATION / 30));

  // 1. Determine if typing is active
  const isTypingActive = progress < (TYPING_DURATION / VIDEO_DURATION);
  
  // 2. Determine if the subtitle should be visible (after typing finishes and delay passes)
  const isSubtitleVisible = progress >= ((TYPING_DURATION + SUBTITLE_DELAY) / VIDEO_DURATION);

  return (
    <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        padding: '20px',
        textAlign: 'center'
    }}>
      {/* --- Typing Text Area --- */}
      <div style={{ minHeight: '100px', marginBottom: '30px' }}>
        <TypingText 
          text={FULL_TEXT} 
          duration={TYPING_DURATION} 
        />
      </div>

      {/* --- Subtitle Area --- */}
      <div 
        style={{
          opacity: isSubtitleVisible ? 1 : 0,
          transform: isSubtitleVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
          fontSize: '2rem',
          color: '#666',
          fontWeight: '300',
        }}
      >
        {SUBTITLE_TEXT}
      </div>
    </div>
  );
};

// --- Composition Component ---
export const RemotionRoot = () => {
  return (
    <Composition
      id="TypingVideo"
      component={TypingTextVideo}
      duration={VIDEO_DURATION}
      width={1920}
      height={1080}
    />
  );
};

// Export the root component for standard execution
export default RemotionRoot;