import React, { useState, useEffect, useCallback } from 'react';
import { Composition, useCurrentFrame, Dimensions } from 'remotion';

const VIDEO_WIDTH = 1920;
const VIDEO_HEIGHT = 1080;

const TYPING_TEXT = "Remotion makes complex animations simple.";
const SUBTITLE_TEXT = "Built with React and Framer Motion principles.";
const TYPING_SPEED = 50; // ms per character
const TYPE_DURATION_FRAMES = 200; // Frames needed to type the whole text
const SUBTITLE_FADE_DURATION_FRAMES = 90;

/**
 * Blinking Cursor Component
 * @param {number} frame - Current frame count
 * @returns {React.ReactElement}
 */
const Cursor = ({ frame }) => {
  const blinkInterval = 300; // ms
  const isVisible = Math.floor(frame / (blinkInterval / 30)) % 2 === 0;

  return (
    <span
      style={{
        opacity: isVisible ? 1 : 0,
        marginLeft: '2px',
        animation: 'blink 1s linear infinite',
        display: 'inline-block'
      }}
    >
      |
    </span>
  );
};

/**
 * Main Component for the Typing and Subtitle Animation
 */
const TypingVideo = () => {
  const frame = useCurrentFrame();
  const [typedText, setTypedText] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(false);

  // 1. Typing Effect Logic
  useEffect(() => {
    let currentTypedText = '';
    let intervalId = null;

    if (frame > 0 && currentTypedText.length < TYPING_TEXT.length) {
      // Calculate the frame corresponding to the character index
      const charIndex = Math.min(Math.floor(frame / (1000 / 30)), TYPING_TEXT.length - 1);
      const newText = TYPING_TEXT.substring(0, charIndex + 1);
      
      if (newText !== currentTypedText) {
        setTypedText(newText);
      }
    } else if (frame >= TYPE_DURATION_FRAMES && currentTypedText.length === TYPING_TEXT.length) {
        // Once typing is complete, start the subtitle reveal
        if (!showSubtitle) {
            setShowSubtitle(true);
        }
    }
    
    // Cleanup function (though useEffect is mostly run on mount/update, this structure helps manage dependencies)
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [frame, typedText, showSubtitle]);

  // 2. Subtitle Fade Logic (State update driven by frames)
  useEffect(() => {
    // If typing is finished (frame >= TYPE_DURATION_FRAMES) and the subtitle hasn't shown yet
    if (frame >= TYPE_DURATION_FRAMES && !showSubtitle) {
        setShowSubtitle(true);
    }
  }, [frame, showSubtitle]);


  // --- Rendering ---

  // Calculate the visible portion of the text
  const visibleText = typedText;
  
  // Calculate the fade opacity for the subtitle
  const subtitleOpacity = showSubtitle 
    ? Math.min(1, frame / (SUBTITLE_FADE_DURATION_FRAMES / 30)) 
    : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: '0 100px',
        fontFamily: 'Arial, sans-serif',
        color: '#FFF',
        backgroundColor: '#111',
        textAlign: 'center',
        // Key for the blinking cursor animation
        '@keyframes blink': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0 }
        }
      }}
    >
      {/* Main Typing Text */}
      <h1
        style={{
          fontSize: '5rem',
          fontWeight: 'bold',
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'center',
          minHeight: '6rem'
        }}
      >
        {visibleText}
        <Cursor frame={frame} />
      </h1>

      {/* Subtitle */}
      <div
        style={{
          fontSize: '2rem',
          color: '#AAA',
          opacity: subtitleOpacity,
          transform: `translateY(${Math.sin(frame / 10) * 5}px)`,
          transition: 'opacity 0.1s linear'
        }}
      >
        {SUBTITLE_TEXT}
      </div>
    </div>
  );
};

export const RemotionRoot = () => (
  <Composition
    id="TypingAnimation"
    component={TypingVideo}
    durationInFrames={Math.max(TYPE_DURATION_FRAMES + 30, 300)} // Ensure enough frames for typing + fade
    width={VIDEO_WIDTH}
    height={VIDEO_HEIGHT}
  />
);