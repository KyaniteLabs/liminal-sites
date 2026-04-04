import React, { useEffect, useState } from 'react';
import { Composition, useCurrentFrame, useVideoConfig } from '@remotion/video';

// --- Constants ---
const MAIN_TEXT = "Hello! Welcome to Remotion Typing Animation.";
const SUBTITLE_TEXT = "✨ React + Framer Motion = Magic.";
const TYPING_DURATION = 3 * 60; // 3 seconds for typing
const SUBTITLE_DELAY = 150; // Milliseconds delay before fade-in
const BLINK_RATE = 500; // Milliseconds for cursor blink

// --- Components ---

/**
 * Handles the typewriter effect and blinking cursor.
 * @param {string} text The text to type.
 * @param {number} duration The duration over which the text should be typed.
 */
const TypewriterText = ({ text, duration }) => {
  const frame = useCurrentFrame();
  const charsTyped = Math.min(text.length, Math.floor((frame / 60) * (duration / 1000)));

  let displayedText = '';
  if (charsTyped > 0) {
    displayedText = text.substring(0, charsTyped);
  }

  // Calculate cursor visibility: Blinks every BLINK_RATE frames
  const isCursorVisible = Math.floor(frame / BLINK_RATE) % 2 === 0;

  return (
    <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#333' }}>
      {displayedText}
      <span style={{ 
        display: 'inline-block', 
        animation: `cursor ${BLINK_RATE / 60}s step-end infinite`,
        marginLeft: '2px',
        fontSize: '1.1em' // Adjust cursor size relative to text
      }}>
        {isCursorVisible ? '|' : ' '}
      </span>
    </h1>
  );
};

/**
 * Handles the subtitle fade-in effect.
 * @param {string} text The subtitle text.
 * @param {number} startTime The frame when the subtitle fade should begin.
 * @param {number} duration The duration of the fade-in.
 */
const FadeInSubtitle = ({ text, startTime, duration }) => {
  const frame = useCurrentFrame();

  // Calculate progress: 0 (hidden) to 1 (visible)
  let progress = 0;
  if (frame >= startTime) {
    const elapsed = frame - startTime;
    progress = Math.min(1, elapsed / (duration * 60));
  }

  // Apply opacity based on progress (0 to 1)
  const opacity = Math.max(0, Math.min(1, progress));

  return (
    <p style={{ 
      fontSize: '1.5rem', 
      color: '#666', 
      marginTop: '20px',
      opacity: opacity,
      transition: 'opacity 0.1s linear'
    }}>
      {text}
    </p>
  );
};


// --- Main Composition ---

const MyVideo = () => {
  const { width, height } = useVideoConfig();

  return (
    <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%', 
        padding: '20px' 
    }}>
      
      {/* Typewriter Text */}
      <TypewriterText 
        text={MAIN_TEXT} 
        duration={TYPING_DURATION} 
      />

      {/* Subtitle (Starts fading in after typing is complete) */}
      <FadeInSubtitle 
        text={SUBTITLE_TEXT} 
        startTime={TYPING_DURATION + (SUBTITLE_DELAY / 60)} 
        duration={1} // 1 second fade duration
      />
    </div>
  );
};

// --- Remotion Composition Wrapper ---

export const RemotionalVideo = () => {
  return (
    <Composition
      id="TypingAnimation"
      component={MyVideo}
      durationInFrames={
        Math.ceil((TYPING_DURATION + 1000) / 1000) * 60
      }
      width={1920}
      height={1080}
    />
  );
};