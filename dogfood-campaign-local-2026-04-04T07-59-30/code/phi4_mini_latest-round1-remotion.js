import React, { useMemo } from 'react';
import { Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import { motion } from 'framer-motion';

// --- Constants ---
const MAIN_TEXT = "Hello Remotion! Typing animation complete.";
const SUBTITLE = "Video generation powered by React and Framer Motion.";
const VIDEO_DURATION = 6 * 60; // 6 seconds
const TYPING_DURATION = 3 * 60; // 3 seconds for typing

// --- Components ---

/**
 * Typing Text Effect Component
 * Animates text character by character.
 */
const TypingText = ({ text, duration }) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(1, frame / duration);
  const displayedText = useMemo(() => {
    if (frame >= duration) {
      return text;
    }
    // Calculate how many characters should be visible based on elapsed time
    const charsToShow = Math.floor((frame / duration) * text.length);
    return text.substring(0, charsToShow);
  }, [text, duration, frame]);

  return (
    <motion.h1
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      style={{ fontSize: '3rem', fontWeight: 'bold', color: '#333' }}
    >
      {displayedText}
      {/* Blinking Cursor */}
      <span
        style={{
          display: 'inline-block',
          width: '0.1em',
          height: '1.2em',
          backgroundColor: '#333',
          animation: 'blink 1s step-end infinite',
        }}
      ></span>
    </motion.h1>
  );
};

/**
 * Main Video Component
 */
const TypingVideo = () => {
  const frame = useCurrentFrame();

  // Phase 1: Typing (0 to 3s)
  const isTypingPhase = frame < TYPING_DURATION;

  // Phase 2: Subtitle Fade-in (Starts after typing, lasts for the remainder)
  const subtitleProgress = Math.min(1, Math.max(0, (frame - TYPING_DURATION) / (VIDEO_DURATION - TYPING_DURATION)));
  const isSubtitleVisible = frame >= TYPING_DURATION;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
      }}
    >
      {/* Main Typing Text */}
      <TypingText text={MAIN_TEXT} duration={TYPING_DURATION} />

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, translateY(100) }}
        animate={{ opacity: isSubtitleVisible ? 1 : 0, translateY: isSubtitleVisible ? 0 : 100 }}
        transition={{
          delay: 0.5, // Slight delay after the typing effect is complete
          duration: 1.5,
          ease: 'easeOut',
        }}
        style={{
          marginTop: '40px',
          fontSize: '1.5rem',
          color: '#666',
          maxWidth: '800px',
        }}
      >
        {SUBTITLE}
      </motion.p>
    </div>
  );
};

// --- Composition Setup ---

// CSS Keyframes for the blinking cursor
const styleSheet = `
@keyframes blink {
  50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
}
`;

export const RemotionRoot = () => {
  return (
    <>
      <style>{styleSheet}</style>
      <Composition
        id="TypingVideo"
        component={TypingVideo}
        durationInFrames={VIDEO_DURATION}
        width={1920}
        height={1080}
      />
    </>
  );
};