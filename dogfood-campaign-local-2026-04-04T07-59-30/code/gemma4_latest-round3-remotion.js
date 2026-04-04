import { Composition, useCurrentFrame, Dimensions } from 'remotion';
import React, { useState, useMemo } from 'react';

// --- Constants ---
const VIDEO_WIDTH = 1280;
const VIDEO_HEIGHT = 720;
const MAIN_TEXT = "Hello, I am typing out this message.";
const SUBTITLE_TEXT = "Animation complete. Welcome to Remotion!";
const TYPING_DURATION_FRAMES = 200; // Time for typing effect
const SUBTITLE_APPEAR_FRAME = 250; // Frame when subtitle starts fading in
const SUBTITLE_FADE_DURATION_FRAMES = 120;

const TypingComponent = () => {
  const frame = useCurrentFrame();
  const [isFinishedTyping, setIsFinishedTyping] = useState(false);

  // 1. Typing Effect Logic
  const typedText = useMemo(() => {
    if (frame < TYPING_DURATION_FRAMES) {
      // Calculate how many characters should be visible
      const visibleChars = Math.min(Math.floor(frame / 2), MAIN_TEXT.length);
      return MAIN_TEXT.substring(0, visibleChars);
    }
    return MAIN_TEXT;
  }, [frame]);

  // 2. Cursor Blink Logic
  // The cursor blinks every 5 frames if typing has occurred or is ongoing
  const cursorVisible = useMemo(() => {
    if (frame < TYPING_DURATION_FRAMES) {
      // Blink faster initially
      return Math.floor(frame / 5) % 2 === 0;
    }
    // Once typing is done, keep it visible for a moment, then let it fade/stay
    return true;
  }, [frame]);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '4rem', fontFamily: 'monospace', display: 'flex', alignItems: 'center' }}>
        {typedText}
        {/* Cursor */}
        <span 
          style={{ 
            marginLeft: '8px', 
            fontSize: '4rem', 
            animation: 'blink 1s step-end infinite', 
            opacity: cursorVisible ? 1 : 0 
          }}
        >
          |
        </span>
      </h1>
    </div>
  );
};

const SubtitleComponent = () => {
  const frame = useCurrentFrame();

  // 3. Subtitle Fade-in Logic
  let opacity = 0;
  if (frame >= SUBTITLE_APPEAR_FRAME && frame < SUBTITLE_APPEAR_FRAME + SUBTITLE_FADE_DURATION_FRAMES) {
    // Interpolate opacity from 0 to 1 over the specified duration
    opacity = Math.min(1, (frame - SUBTITLE_APPEAR_FRAME) / SUBTITLE_FADE_DURATION_FRAMES);
  } else if (frame >= SUBTITLE_APPEAR_FRAME + SUBTITLE_FADE_DURATION_FRAMES) {
    opacity = 1;
  }

  return (
    <div style={{ 
      position: 'absolute', 
      bottom: '10%', 
      left: '50%', 
      transform: 'translateX(-50%)', 
      opacity: opacity 
    }}>
      <p style={{ fontSize: '1.8rem', color: '#ccc', textAlign: 'center' }}>
        {SUBTITLE_TEXT}
      </p>
    </div>
  );
};

const RemotionVideo = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Background/Main Content Area */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <TypingComponent />
      </div>
      
      {/* Subtitle Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }}>
        <SubtitleComponent />
      </div>
    </div>
  );
};

// --- Composition Setup ---
export const RemotionExporter = () => {
  return (
    <Composition
      id="TypingVideo"
      component={RemotionVideo}
      durationInFrames={400} // Total duration: Typing (200) + Subtitle Wait (50) + Subtitle Fade (120) = 370 frames. Using 400 for safety.
      fps={30}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
    />
  );
};

// CSS Keyframes for the blink effect (must be defined globally or styled-components if using them)
// Since Remotion components are usually pure React, we define the style block here for context, 
// acknowledging that actual CSS injection needs to happen at the root level.
const BlinkingCursorStyle = `
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
`;

// Note: In a real Remotion setup, the CSS keyframes must be loaded into the global styles.
// For this code block output, we assume the environment handles the necessary styling context.