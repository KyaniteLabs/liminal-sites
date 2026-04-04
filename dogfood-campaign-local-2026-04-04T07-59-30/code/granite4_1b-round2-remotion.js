import { Composition, useCurrentFrame, Dimensions } from 'remotion';
import React, { useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';

// --- Constants ---
const TYPING_SPEED_MS = 50; // Delay between characters (in ms)
const TYPING_DURATION_SECONDS = 3;
const SUBTITLE_FADE_DURATION_SECONDS = 1;
const TOTAL_DURATION_SECONDS = TYPING_DURATION_SECONDS + 3 + SUBTITLE_FADE_DURATION_SECONDS; // 3s typing + 3s pause + 1s fade

// --- Styling ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
  background-color: #1e1e1e;
  color: white;
`;

const TypingText = styled.h1`
  font-family: 'Arial', sans-serif;
  font-size: 4rem;
  margin-bottom: 10px;
  white-space: pre; /* Essential for preserving spaces and newlines */
  overflow: hidden; /* Hides characters that haven't been typed yet */
  border-right: 3px solid white; /* The cursor */

  /* The border-right animation will be handled by the cursor component for blinking */
`;

const Subtitle = styled.p`
  font-family: 'Arial', sans-serif;
  font-size: 2rem;
  color: #aaa;
  opacity: 0;
  animation: fadeIn 1s forwards;
`;

// Keyframes
const blinkCursor = keyframes`
  0%, 100% {
    border-color: white;
  }
  50% {
    border-color: transparent;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// --- Components ---

/**
 * The core typing logic component.
 * It calculates how many characters should be visible up to the current frame.
 * @param {string} text The full text to be typed.
 * @param {number} typingDurationFrames The number of frames dedicated to typing.
 * @returns {string} The truncated text visible so far.
 */
const TypingAnimation = ({ text, typingDurationFrames }) => {
  const frame = useCurrentFrame();
  
  // Calculate the number of characters to show based on time elapsed
  // (frame / fps * TYPING_SPEED_MS) / 1000 = characters
  const charsTyped = Math.min(
    text.length, 
    Math.floor((frame / 30) * (1000 / TYPING_SPEED_MS))
  );

  return text.substring(0, charsTyped);
};

/**
 * The blinking cursor component.
 * It animates the border-right property of the text container.
 */
const Cursor = () => {
  const frame = useCurrentFrame();
  // Use the blink cycle animation
  return <span style={{ animation: `${blinkCursor} 1s steps(1) infinite` }} />;
};


// --- Main Component ---

export const TypingVideo = () => {
  const fullText = "Hello, Remotion! This is a dynamic typing animation.";
  const subtitleText = "Welcome to the world of programmatic video generation.";
  
  // Calculate frames for timing
  const fps = Dimensions.defaultProps.fps;
  const typingFrames = Math.ceil(TYPING_DURATION_SECONDS * fps);
  const subtitleStartFrame = Math.floor((TYPING_DURATION_SECONDS + 3) * fps); // Start fade after typing + pause
  const subtitleEndFrame = Math.floor((TYPING_DURATION_SECONDS + 3 + SUBTITLE_FADE_DURATION_SECONDS) * fps);


  return (
    <Container>
      <TypingText>
        {/* The text component uses the typing logic */}
        {useMemo(() => (
          <>
            {/* The TypingAnimation determines the visible text */}
            {TypingAnimation({ text: fullText, typingDurationFrames: typingFrames })}
            {/* The Cursor component handles the blinking effect */}
            <Cursor />
          </>
        ), []}
      </TypingText>

      {/* The Subtitle fades in later */}
      <Subtitle
        style={{ 
            opacity: 
                // Interpolate opacity between 0 and 1 during the fade window
                Math.max(0, Math.min(1, (frame - (subtitleStartFrame * 1000 / fps)) / (SUBTITLE_FADE_DURATION_SECONDS * 1000 / fps)))
        }}
      >
        {subtitleText}
      </Subtitle>
    </Container>
  );
};

// --- Composition Wrapper ---
export const RemotionRoot = () => {
  return (
    <Composition
      id="TypingVideo"
      component={TypingVideo}
      durationInFrames={Math.floor(TOTAL_DURATION_SECONDS * 30)} // Assuming 30 FPS
      width={1920}
      height={1080}
      defaultProps={{ fps: 30 }}
    />
  );
};

// To run this code, you would typically use:
// export default RemotionRoot;