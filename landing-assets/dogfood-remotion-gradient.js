import React from 'react';
import { useCurrentFrame, interpolate, AbsoluteFill, spring } from 'remotion';

const TEXT_LINES = [
  'Emerging from silence',
  'Letters find their voice',
  'One character at a time',
  'Until the story is whole',
];

const FONT_SIZE = 52;
const LINE_DELAY = 18;

export const TextReveal: React.FC = () => {
  const frame = useCurrentFrame();

  const { fps } = { fps: 30 };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0d0d0d',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Georgia', serif",
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {TEXT_LINES.map((line, lineIdx) => {
          const lineStart = lineIdx * LINE_DELAY;
          const lineProgress = interpolate(
            frame - lineStart,
            [0, 10],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          const lineY = interpolate(lineProgress, [0, 1], [30, 0]);
          const lineOpacity = lineProgress;

          const scaleSpring = spring({
            frame: frame - lineStart,
            fps,
            config: { damping: 12, stiffness: 80, mass: 0.8 },
          });

          return (
            <div
              key={lineIdx}
              style={{
                display: 'flex',
                gap: 2,
                transform: `translateY(${lineY}px) scale(${scaleSpring})`,
                opacity: lineOpacity,
              }}
            >
              {line.split('').map((char, charIdx) => {
                const charStart = lineStart + charIdx * 1.5;
                const charProgress = interpolate(
                  frame - charStart,
                  [0, 8],
                  [0, 1],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                );

                const charY = interpolate(charProgress, [0, 1], [20, 0]);
                const charOpacity = charProgress;
                const charScale = interpolate(charProgress, [0, 0.5, 1], [0.5, 1.2, 1]);

                const hue = 45 + charIdx * 8 + lineIdx * 20;

                return (
                  <span
                    key={charIdx}
                    style={{
                      fontSize: FONT_SIZE,
                      color: `hsl(${hue}, 70%, 75%)`,
                      opacity: charOpacity,
                      transform: `translateY(${charY}px) scale(${charScale})`,
                      display: 'inline-block',
                      textShadow: `0 0 20px hsla(${hue}, 80%, 60%, 0.4)`,
                      fontWeight: 300,
                      letterSpacing: 2,
                    }}
                  >
                    {char === ' ' ? ' ' : char}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
