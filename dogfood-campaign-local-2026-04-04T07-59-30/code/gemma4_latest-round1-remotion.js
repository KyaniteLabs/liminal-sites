import React, { useState, useEffect } from "react";
import { Composition, useCurrentFrame, Dimensions } from "remotion";

// --- Constants ---
const TYPING_DURATION = 300; // Frames (e.g., 300 frames at 30fps = 10 seconds)
const BLINK_RATE = 300; // Milliseconds (Controls blink speed)
const SUBTITLE_DELAY = 60; // Frames delay after typing finishes

// --- Components ---

/**
 * Component that handles the typing animation and cursor blink.
 */
const Typewriter = ({ text, duration }) => {
  const currentFrame = useCurrentFrame();
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (currentFrame < duration) {
      const newTypedText = text.substring(0, Math.floor(currentFrame / (duration / text.length)));
      setTypedText(newTypedText);
    }
  }, [currentFrame, duration, text]);

  // Calculate the visible text length (accounting for the frame increment)
  const visibleLength = Math.min(text.length, Math.floor(currentFrame / (duration / text.length) || 0));

  // Determine if the cursor should be visible based on the frame and blink rate
  const isCursorVisible = Math.floor(currentFrame / 30) % 2 === 0;

  return (
    <div style={{ display: "flex", alignItems: "flex-end" }}>
      <span style={{ whiteSpace: "pre-wrap", fontSize: "4rem", fontFamily: "monospace", marginRight: "5px" }}>
        {text.substring(0, visibleLength)}
      </span>
      <span
        style={{
          fontSize: "4rem",
          fontFamily: "monospace",
          color: "#fff",
          animation: `blink ${BLINK_RATE / 2}ms step-end infinite`,
        }}
      >
        {isCursorVisible ? "|" : ""}
      </span>
      {/* Keyframes for blinking cursor */}
      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

/**
 * Component that fades in the subtitle after a delay.
 */
const Subtitle = ({ text, delayFrames }) => {
  const currentFrame = useCurrentFrame();
  const opacity = currentFrame > delayFrames ? 1 : 0;

  return (
    <div style={{ 
        marginTop: '3rem', 
        fontSize: '2rem', 
        color: '#ccc',
        opacity: opacity,
        transition: 'opacity 0.5s ease-out'
    }}>
      {text}
    </div>
  );
};


// --- Main Component ---

const AnimatedText = () => {
  const COMPOSITION_DURATION = TYPING_DURATION + 120; // Duration needs to cover typing + subtitle fade
  const TITLE_TEXT = "Hello, Remotion World!";
  const SUBTITLE_TEXT = "Animation complete. Now we fade.";

  return (
    <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        padding: '2rem',
        backgroundColor: '#1a1a2e'
    }}>
      <div style={{ maxWidth: '90%', textAlign: 'center' }}>
        {/* 1. Typing Animation */}
        <Typewriter text={TITLE_TEXT} duration={TYPING_DURATION} />
        
        {/* 2. Subtitle Fade */}
        <Subtitle text={SUBTITLE_TEXT} delayFrames={TYPING_DURATION + 30}/>
      </div>
    </div>
  );
};

// --- Exported Remotion Composition ---

export const MyComposition = () => {
  return (
    <>
      <AnimatedText />
    </>
  );
};

// Composition wrapper (required for file execution)
export const RemotionRoot = () => (
  <Composition
    id="AnimatedText"
    component={MyComposition}
    durationInFrames={360} // Ensure duration is enough for the full animation
    width={1920}
    height={1080}
  />
);