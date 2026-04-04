import { Composition, NextProps, TimeValue } from 'remotion';
import React, { useState, useEffect } from 'react';

// Constants
const TYPING_TEXT = "Welcome to the Remotion Demo!";
const SUBTITLE_TEXT = "Animation, state, and timing come together.";
const TYPING_DURATION_MS = 2500; // Time for typing to complete
const BLINK_INTERVAL_MS = 500; // Cursor blink interval
const FADE_IN_DELAY_MS = 1000; // Delay before subtitle fades in

interface AnimatedTextProps {
  text: string;
  typingSpeed: number; // characters per millisecond
}

/**
 * Component that handles the typing animation and cursor blinking.
 */
const AnimatedText: React.FC<AnimatedTextProps> = ({ text, typingSpeed }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    let interval: NodeJS.Timeout;

    if (isTyping && index < text.length) {
      interval = setInterval(() => {
        setDisplayedText((prev) => prev + text[index]);
        index++;
      }, 1000 / typingSpeed); // Calculate interval based on speed
    } else if (index >= text.length && isTyping) {
      clearInterval(interval);
      setIsTyping(false);
    }
    return () => clearInterval(interval);
  }, [text.length, isTyping, typingSpeed]);

  return (
    <div className="text-4xl font-mono flex items-center">
      {displayedText}
      {/* Blinking Cursor */}
      <span 
        className={`inline-block w-1 h-full bg-blue-500 ml-1 transition-all duration-[${BLINK_INTERVAL_MS}ms] ${
          Math.floor(Date.now() / BLINK_INTERVAL_MS) % 2 ? 'opacity-100' : 'opacity-0'
        }`}
      ></span>
    </div>
  );
};

/**
 * Main Composition Component
 */
export const AnimatedVideo: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const [showSubtitle, setShowSubtitle] = useState(false);

  // Calculate timing triggers
  const typingEndFrame = Math.floor(TYPING_DURATION_MS / 1000) * 30; // Approximate frames for typing
  const subtitleShowFrame = Math.min(durationInFrames, typingEndFrame + Math.ceil(FADE_IN_DELAY_MS / 1000) * 30);

  useEffect(() => {
    if (showSubtitle === false && Math.floor(Date.now() / 100) > (typingEndFrame * 100) + FADE_IN_DELAY_MS) {
        // Simple timer to ensure the subtitle activates after the typed text finishes and delay passes
        setShowSubtitle(true);
    }
  }, [showSubtitle, typingEndFrame]);

  return (
    <div className="flex flex-col justify-center items-start h-full p-16 bg-gray-900 text-white">
      
      {/* Main Animated Text */}
      <div className="mb-8">
        <AnimatedText text={TYPING_TEXT} typingSpeed={15} /> {/* 15 characters/second */}
      </div>

      {/* Subtitle Fade-In */}
      <div 
        className={`text-2xl font-light transition-opacity duration-1000 ease-in ${
          showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {SUBTITLE_TEXT}
      </div>
    </div>
  );
};

// Remotion Composition wrapper
export const RemotionRoot: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  return (
    <Composition
      id={`remotion-typing-fade-${durationInFrames}`}
      component={AnimatedVideo}
      subComponentName="AnimatedVideo"
      defaultProps={{ durationInFrames }}
      durationInFrames={durationInFrames}
      width={1920}
      height={1080}
    />
  );
};