export interface Iteration {
  id: number;
  code: string;
  timestamp: number;
  quality?: number;
  reason?: string;
}

export interface PlayerPianoState {
  isPlaying: boolean;
  currentIndex: number;
  speed: number;
}
