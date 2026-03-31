import { Composition, AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

// Particle type definition
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  hue: number;
  angle: number;
  speed: number;
}

// Title Sequence Component
const TitleSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = 150;
  
  // Generate particles
  const particles: Particle[] = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 60,
    y: 50 + (Math.random() - 0.5) * 60,
    size: 2 + Math.random() * 6,
    hue: Math.random() * 60 + 180, // Blue to purple range
    angle: Math.random() * Math.PI * 2,
    speed: 0.2 + Math.random() * 0.5,
  }));
  
  // Title animation - fade in from frame 30-60
  const titleOpacity = interpolate(
    frame,
    [30, 60, 90, 120],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  const titleScale = interpolate(
    frame,
    [30, 60],
    [0.8, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  return (
    <AbsoluteFill style={{ background: '#0a0a12', overflow: 'hidden' }}>
      {/* Particles */}
      {particles.map((p) => {
        // Particle scatter animation
        const scatterProgress = interpolate(
          frame,
          [0, 150],
          [0, 1],
          { extrapolateRight: 'clamp' }
        );
        
        const distance = scatterProgress * 30 * p.speed;
        const xPos = p.x + Math.cos(p.angle) * distance;
        const yPos = p.y + Math.sin(p.angle) * distance;
        
        // Fade in then out
        const particleOpacity = interpolate(
          frame,
          [0, 20, 100, 130],
          [0, 1, 1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        
        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${xPos}%`,
              top: `${yPos}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: `hsl(${p.hue}, 70%, 60%)`,
              opacity: particleOpacity,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 ${p.size * 2}px hsl(${p.hue}, 70%, 60%)`,
            }}
          />
        );
      })}
      
      {/* Title Text */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${titleScale})`,
          textAlign: 'center',
          zIndex: 10,
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontFamily: 'Arial Black, sans-serif',
            fontWeight: 900,
            color: '#ffffff',
            textShadow: '0 0 60px rgba(100, 200, 255, 0.8), 0 0 120px rgba(100, 200, 255, 0.4)',
            letterSpacing: '0.1em',
          }}
        >
          DISSOLVE
        </div>
        <div
          style={{
            fontSize: 32,
            fontFamily: 'Arial, sans-serif',
            fontWeight: 300,
            color: '#8a8a9a',
            letterSpacing: '0.5em',
            marginTop: 20,
          }}
        >
          PARTICLE EFFECT
        </div>
      </div>
      
      {/* Glow overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 18, 0.5) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

// Register composition
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TitleSequence"
      component={TitleSequence}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  );
};
