import { useEffect, useState, useMemo, useRef } from 'react';
import { Composition, Img, Sequence, Integer, useCurrentFrame } from 'remotion';
import './styles.css'; // Assuming you might need basic CSS for the cursor/container

// --- Constants ---
const MAIN_TEXT = "Hello, I am typing this out!";
const SUBTITLE_TEXT = "Remotion makes complex animations easy.";

// --- Typescript/JSDoc Utility for Typing Effect ---
const useTypingEffect = (text: string, frameRate: number) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let currentText = '';
    let frameCount = 0;

    const interval = setInterval(() => {
      if (currentText.length < text.length) {
        currentText += text.charAt(currentText.length);
        setDisplayedText(currentText);
      } else {
        clearInterval(interval);
      }
    }, 1000 / frameRate); // Update based on frame rate

    return () => clearInterval(interval);
  }, [text, frameRate]);

  return displayedText;
};

// --- Main Component ---
export const TypingVideoComponent = () => {
  const frame = useCurrentFrame();
  const [isSubtitleVisible, setIsSubtitleVisible] = useState(false);
  const typingSpeed = 30; // frames per character

  // 1. Typing Animation Logic
  const displayedMainText = useMemo(() => {
    // Calculate how many characters should be visible based on the frame count
    const charsVisible = Math.min(MAIN_TEXT.length, Math.floor(frame / typingSpeed));
    return MAIN_TEXT.substring(0, charsVisible);
  }, [frame]);

  // 2. Subtitle Fade-in Logic
  // The subtitle starts fading in after the main typing is complete (e.g., 2 seconds = 60*2 = 120 frames)
  const subtitleStartTime = 60 * 2;
  const subtitleDuration = 60 * 1.5; // 1.5 seconds fade duration

  const subtitleOpacity = Math.min(1, Math.max(0, (frame - subtitleStartTime) / subtitleDuration));

  // Check if the main text is fully typed AND we are past the start time
  useEffect(() => {
    if (frame > 0 && displayedMainText.length === MAIN_TEXT.length && !isSubtitleVisible) {
      // Set a timeout to ensure the subtitle fade-in starts after the typing pauses
      const timer = setTimeout(() => setIsSubtitleVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [frame, displayedMainText.length, isSubtitleVisible]);


  return (
    <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        padding: '20px',
        color: '#333'
    }}>
      
      {/* Main Typing Text Container */}
      <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>
        {displayedMainText}
        {/* Cursor Blinking */}
        <span 
            style={{ 
                display: 'inline-block', 
                width: '0.1em', 
                height: '1.2em', 
                background: 'black', 
                margin: '2px', 
                animation: 'blink 1s step-end infinite' 
            }}
        ></span>
      </h1>

      {/* Subtitle */}
      <div 
        style={{
            fontSize: '1.5rem',
            opacity: subtitleOpacity,
            transition: 'opacity 0.1s linear' // Helps smooth the fade
        }}
      >
        {SUBTITLE_TEXT}
      </div>
    </div>
  );
};

// --- Composition Setup ---

export const RemotionRoot = () => {
  return (
    <Composition
      id="TypingAnimation"
      component={TypingVideoComponent}
      durationInFrames={60 * 4} // 4 seconds total duration
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  );
};

// NOTE: You must add the following CSS animation keyframes to your global styles/styles.css file:
/*
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
*/