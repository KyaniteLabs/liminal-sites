import React, { useState, useRef } from 'react';
import { Box, Text, useInput } from 'ink';

interface VoiceAnalysis {
  pitch: number;
  timbre: {
    roughness: number;
    brightness: number;
  };
  intensity: number;
}

interface GenerativeParams {
  particleCount: number;
  colorPalette: string[];
  animationSpeed: number;
  noiseScale: number;
  brightness: number;
  chaos: number;
  colorTemp: 'warm' | 'cool' | 'neutral';
}

export class VoiceInput {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  public isCapturing: boolean = false;

  async startCapture(): Promise<MediaStream> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    source.connect(this.analyser);
    this.isCapturing = true;
    return stream;
  }

  async stopCapture(): Promise<void> {
    if (this.audioContext) {
      await this.audioContext.close();
    }
    this.isCapturing = false;
  }

  async generateParams(analysis: VoiceAnalysis): Promise<GenerativeParams> {
    const mappedParams = mapToGenerativeParams(analysis);
    return {
      particleCount: Math.floor(mappedParams.chaos * 100) + 10,
      colorPalette: mappedParams.colorTemp === 'warm' 
        ? ['#FF6B6B', '#FFA500', '#FFD93D'] 
        : mappedParams.colorTemp === 'cool'
        ? ['#4ECDC4', '#44A08D', '#093637']
        : ['#95A5A6', '#BDC3C7', '#ECF0F1'],
      animationSpeed: mappedParams.brightness * 2,
      noiseScale: mappedParams.chaos * 0.1,
      brightness: mappedParams.brightness,
      chaos: mappedParams.chaos,
      colorTemp: mappedParams.colorTemp
    };
  }
}

export function analyzePitch(audioBuffer: Float32Array, sampleRate: number): number {
  let bestOffset = -1;
  let bestCorrelation = 0;

  for (let offset = 20; offset < audioBuffer.length / 2; offset++) {
    let correlation = 0;
    for (let i = 0; i < audioBuffer.length - offset; i++) {
      correlation += audioBuffer[i] * audioBuffer[i + offset];
    }
    
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }

  if (bestOffset === -1) return 0;
  return sampleRate / bestOffset;
}

export function analyzeTimbre(audioBuffer: Float32Array): { roughness: number; brightness: number } {
  let zeroCrossings = 0;
  let totalEnergy = 0;
  
  for (let i = 1; i < audioBuffer.length; i++) {
    if ((audioBuffer[i] > 0) !== (audioBuffer[i - 1] > 0)) {
      zeroCrossings++;
    }
    totalEnergy += audioBuffer[i] * audioBuffer[i];
  }
  
  const roughness = Math.min(zeroCrossings / audioBuffer.length * 10, 1);
  const brightness = Math.min(totalEnergy / audioBuffer.length * 100, 1);
  
  return { roughness, brightness };
}

export function mapToGenerativeParams(analysis: { pitch: number; timbre: { roughness: number; brightness: number } }): GenerativeParams {
  const normalizedPitch = (analysis.pitch - 80) / (1200 - 80);
  
  const colorTemp: 'warm' | 'cool' | 'neutral' = 
    normalizedPitch > 0.6 ? 'warm' : 
    normalizedPitch < 0.3 ? 'cool' : 'neutral';
  
  const brightness = (analysis.timbre.brightness + normalizedPitch) / 2;
  const chaos = analysis.timbre.roughness;
  
  return {
    particleCount: Math.floor(chaos * 100) + 10,
    colorPalette: colorTemp === 'warm' 
      ? ['#FF6B6B', '#FFA500', '#FFD93D'] 
      : colorTemp === 'cool'
      ? ['#4ECDC4', '#44A08D', '#093637']
      : ['#95A5A6', '#BDC3C7', '#ECF0F1'],
    animationSpeed: brightness * 2,
    noiseScale: chaos * 0.1,
    brightness,
    chaos,
    colorTemp
  };
}

export const VoiceInputUI: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [pitch] = useState(0);
  const [lastParams] = useState<GenerativeParams | null>(null);
  const voiceInputRef = useRef(new VoiceInput());

  useInput(async (input) => {
    if (input === 'v') {
      if (!isListening) {
        await voiceInputRef.current.startCapture();
        setIsListening(true);
      } else {
        await voiceInputRef.current.stopCapture();
        setIsListening(false);
      }
    }
  });

  return (
    <Box flexDirection="column" borderStyle="round" borderColor={isListening ? 'green' : 'gray'} padding={1}>
      <Text bold color={isListening ? 'green' : 'white'}>
        {isListening ? '🔴 LISTENING' : '⚫ VOICE INPUT'}
      </Text>
      <Text>Press [v] to {isListening ? 'stop' : 'start'} capture</Text>
      {pitch > 0 && (
        <Text color="cyan">Detected pitch: {pitch.toFixed(0)} Hz</Text>
      )}
      {lastParams && (
        <Box flexDirection="column" marginTop={1}>
          <Text dimColor>Generated params:</Text>
          <Text>  Brightness: {(lastParams.brightness * 100).toFixed(0)}%</Text>
          <Text>  Chaos: {(lastParams.chaos * 100).toFixed(0)}%</Text>
          <Text>  Color: {lastParams.colorTemp}</Text>
        </Box>
      )}
    </Box>
  );
};
