import React from 'react';
import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';

const PALETTE = [
  { r: 255, g: 94, b: 98 },
  { r: 255, g: 195, b: 113 },
  { r: 62, g: 207, b: 207 },
  { r: 131, g: 94, b: 235 },
  { r: 72, g: 199, b: 142 },
];

function lerpColor(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
  t: number
): string {
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bl = Math.round(a.b + (b.b - a.b) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

export const GradientLoop: React.FC = () => {
  const frame = useCurrentFrame();

  const cycleDuration = 90;
  const t = (frame % cycleDuration) / cycleDuration;

  const colorIdx1 = Math.floor(t * PALETTE.length) % PALETTE.length;
  const colorIdx2 = (colorIdx1 + 1) % PALETTE.length;
  const colorIdx3 = (colorIdx1 + 2) % PALETTE.length;
  const colorIdx4 = (colorIdx1 + 3) % PALETTE.length;

  const blendT = (t * PALETTE.length) % 1;

  const topLeft = lerpColor(PALETTE[colorIdx1], PALETTE[colorIdx2], blendT);
  const topRight = lerpColor(PALETTE[colorIdx2], PALETTE[colorIdx3], blendT);
  const bottomLeft = lerpColor(PALETTE[colorIdx3], PALETTE[colorIdx4], blendT);
  const bottomRight = lerpColor(PALETTE[colorIdx4], PALETTE[colorIdx1], blendT);

  const angle = interpolate(frame, [0, 150], [135, 495], {
    extrapolateRight: 'clamp',
  });

  const pulseOpacity = interpolate(
    frame % 60,
    [0, 30, 60],
    [0.3, 0.6, 0.3]
  );

  const grainOffset = interpolate(frame, [0, 150], [0, 1000], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, ${topLeft}, ${topRight}, ${bottomLeft}, ${bottomRight})`,
        backgroundSize: '300% 300%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '120%',
          height: '120%',
          background: `radial-gradient(circle at ${30 + Math.sin(frame * 0.03) * 20}% ${40 + Math.cos(frame * 0.04) * 20}%, rgba(255,255,255,${pulseOpacity}), transparent 60%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at ${70 + Math.cos(frame * 0.02) * 15}% ${60 + Math.sin(frame * 0.05) * 15}%, rgba(0,0,0,${pulseOpacity * 0.5}), transparent 50%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.08,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          transform: `translate(${grainOffset % 50 - 25}px, ${(grainOffset * 0.7) % 50 - 25}px)`,
        }}
      />
    </AbsoluteFill>
  );
};
