import React, { useState, useEffect, useCallback } from 'react';
import { Composition, useCurrentFrame, Img, Offscreen } from 'remotion';
import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';

// --- Constants ---
const VIDEO_DURATION = 6 * 1000; // 6 seconds
const TYPING_SPEED = 50; // ms per character
const SUBTITLE_DELAY = 1000; // ms after typing stops

// --- Styled Components ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1a1a1a;
  color: white;
  padding: 20px;
`;

const TitleText = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 15px;
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
`;

const SubtitleText = styled.p`
  font-size: 2rem;
  font-weight: 300;
  color: #aaaaaa;
  opacity: 0;
`;

const BlinkingCursor = styled.span`
  animation: blinker 1s linear infinite;
  margin-left: 4px;
`;

const blinker = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

// --- Component ---

const TypingAnimation = ({ text, duration }) => {
  const frame = useCurrentFrame();
  const charsPerSecond = 70; // Target typing speed in characters per second
  const maxChars = text.length;
  
  // Calculate how many characters should be visible at the current frame
  const visibleChars = Math.min(Math.floor((frame / 1000) * charsPerSecond), maxChars);
  
  // Slice the text up to the visible character count
  const displayedText = text.substring(0, visibleChars);

  return (
    <>
      <TitleText>{displayedText}</TitleText>
      <BlinkingCursor />
    </>
  );
};

const TypingVideo = () => {
  const mainText = "Remotion is a powerful tool for video creation.";
  const subtitleText = "Animate complex web components into high-quality videos.";

  // State to control the visibility of the subtitle
  const [showSubtitle, setShowSubtitle] = useState(false);

  // Use useEffect to manage the timing sequence
  useEffect(() => {
    // Calculate the approximate time needed for typing (Text length / Typing speed)
    const typingDuration = mainText.length / 7; // 7 characters/sec for smooth typing

    // Set timeout to show the subtitle after typing is complete + a delay
    const timeoutId = setTimeout(() => {
      setShowSubtitle(true);
    }, typingDuration * 1000 + SUBTITLE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [mainText.length]);

  return (
    <Container>
      <div style={{ flexFlex: 1, minHeight: '200px' }}>
        <TypingAnimation text={mainText} duration={VIDEO_DURATION} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showSubtitle ? 1 : 0, y: showSubtitle ? 0 : 20 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        <SubtitleText>{subtitleText}</SubtitleText>
      </motion.div>
    </Container>
  );
};

// --- Export Composition ---

export const RemotionRoot = () => {
  return (
    <Composition
      id="TypingAnimation"
      component={TypingVideo}
      duration={VIDEO_DURATION}
      width={1920}
      height={1080}
    />
  );
};

// Usage in index.tsx or similar entry point:
// <RemotionRoot />