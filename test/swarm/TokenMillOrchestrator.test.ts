/**
 * TokenMillOrchestrator tests
 */

import { TokenMillOrchestrator } from '../../src/swarm/TokenMillOrchestrator.js';
import { SwarmMode } from '../../src/swarm/types.js';
import type { SwarmConfig } from '../../src/swarm/types.js';

// Mock Ollama caller that returns deterministic responses per persona
const createMockOllama = (): (model: string, prompt: string, options?: { temperature?: number; num_predict?: number }) => Promise<string> => {
  return async (_model: string, prompt: string): Promise<string> => {
    if (prompt.includes('You are Max')) return 'Brief. Precise.';
    if (prompt.includes('You are Rex')) return 'This is wrong. Challenge it.';
    if (prompt.includes('You are Sam')) return 'The warm light touched her face as she remembered.';
    if (prompt.includes('You are Kai')) return 'The system connects flows through hidden networks.';
    if (prompt.includes('You are Eve')) return 'Truth folds into paradox. What is cannot be.';
    if (prompt.includes('You are Joy')) return 'Golden light! Warm texture! Beautiful shimmer!';
    if (prompt.includes('You are Ben')) return 'This observation aligns with precedent in structural analysis.';
    if (prompt.includes('1st choice') || prompt.includes('2nd choice')) return '1st choice: C\n2nd choice: A\nSam had the most emotion.';
    return 'Default response.';
  };
};

describe('TokenMillOrchestrator', () => {
  describe('constructor', () => {
    it('should create with default config', () => {
      const orchestrator = new TokenMillOrchestrator();
      expect(orchestrator).toBeDefined();
    });

    it('should create with custom config', () => {
      const config: Partial<SwarmConfig> = {
        maxRounds: 3,
        convergenceThreshold: 2,
        mode: SwarmMode.COMPETITIVE,
        musicalChairs: false,
      };

      const orchestrator = new TokenMillOrchestrator(config);
      expect(orchestrator).toBeDefined();
    });
  });

  describe('run', () => {
    it('should run a full swarm evolution with mock Ollama', async () => {
      const orchestrator = new TokenMillOrchestrator(
        { maxRounds: 2, musicalChairs: false, streamDir: './test-stream' },
        { callOllama: createMockOllama() }
      );

      const result = await orchestrator.run('Write about light');

      expect(result).toBeDefined();
      expect(result.rounds.length).toBeGreaterThan(0);
      expect(result.finalOutput).toBeTruthy();
      expect(result.totalDurationMs).toBeGreaterThanOrEqual(0);
      expect(result.mode).toBe(SwarmMode.HYBRID);
    }, 10000);

    it('should run in competitive mode', async () => {
      const orchestrator = new TokenMillOrchestrator(
        { maxRounds: 2, musicalChairs: false, streamDir: './test-stream' },
        { callOllama: createMockOllama() }
      );

      const result = await orchestrator.run('Test prompt', SwarmMode.COMPETITIVE);

      expect(result.mode).toBe(SwarmMode.COMPETITIVE);
      expect(result.rounds.length).toBe(2);
    }, 10000);

    it('should run in ring mode', async () => {
      const orchestrator = new TokenMillOrchestrator(
        { maxRounds: 1, musicalChairs: false, streamDir: './test-stream' },
        { callOllama: createMockOllama() }
      );

      const result = await orchestrator.run('Test', SwarmMode.RING);

      expect(result.mode).toBe(SwarmMode.RING);
      expect(result.rounds.length).toBe(1);
    }, 10000);

    it('should call progress callback', async () => {
      const progressCalls: Array<{ round: number; winnerId: string | null }> = [];
      const orchestrator = new TokenMillOrchestrator(
        { maxRounds: 1, musicalChairs: false, streamDir: './test-stream' },
        {
          callOllama: createMockOllama(),
          onProgress: (data) => progressCalls.push(data),
        }
      );

      await orchestrator.run('Test');

      expect(progressCalls.length).toBeGreaterThan(0);
      expect(progressCalls[0].round).toBe(1);
    }, 10000);

    it('should detect convergence', async () => {
      // Mock that always votes for 'sam'
      const convergingMock = async (_model: string, prompt: string): Promise<string> => {
        if (prompt.includes('You are Max')) return 'Brief.';
        if (prompt.includes('You are Rex')) return 'Challenge.';
        if (prompt.includes('You are Sam')) return 'Story time with golden light.';
        if (prompt.includes('You are Kai')) return 'Systems connect.';
        if (prompt.includes('You are Eve')) return 'Paradox.';
        if (prompt.includes('You are Joy')) return 'Beautiful!';
        if (prompt.includes('You are Ben')) return 'Precedent.';
        // All voters pick C (sam)
        return '1st choice: C\n2nd choice: A\nSam is best.';
      };

      const orchestrator = new TokenMillOrchestrator(
        { maxRounds: 10, convergenceThreshold: 3, musicalChairs: false, streamDir: './test-stream' },
        { callOllama: convergingMock }
      );

      const result = await orchestrator.run('Test');

      expect(result.converged).toBe(true);
      expect(result.convergenceRound).toBeLessThanOrEqual(5);
    }, 30000);
  });

  describe('checkConvergence', () => {
    it('should detect convergence with 3 consecutive wins', () => {
      const rounds = [
        { roundNum: 1, seed: '', outputs: new Map(), votes: new Map(), scores: new Map(), winnerId: 'sam', winnerContent: '', constraint: '' },
        { roundNum: 2, seed: '', outputs: new Map(), votes: new Map(), scores: new Map(), winnerId: 'sam', winnerContent: '', constraint: '' },
        { roundNum: 3, seed: '', outputs: new Map(), votes: new Map(), scores: new Map(), winnerId: 'sam', winnerContent: '', constraint: '' },
      ];

      expect(TokenMillOrchestrator.checkConvergence(rounds, 3)).toBe(true);
    });

    it('should not detect convergence with different winners', () => {
      const rounds = [
        { roundNum: 1, seed: '', outputs: new Map(), votes: new Map(), scores: new Map(), winnerId: 'sam', winnerContent: '', constraint: '' },
        { roundNum: 2, seed: '', outputs: new Map(), votes: new Map(), scores: new Map(), winnerId: 'eve', winnerContent: '', constraint: '' },
        { roundNum: 3, seed: '', outputs: new Map(), votes: new Map(), scores: new Map(), winnerId: 'sam', winnerContent: '', constraint: '' },
      ];

      expect(TokenMillOrchestrator.checkConvergence(rounds, 3)).toBe(false);
    });

    it('should not detect convergence with insufficient rounds', () => {
      const rounds = [
        { roundNum: 1, seed: '', outputs: new Map(), votes: new Map(), scores: new Map(), winnerId: 'sam', winnerContent: '', constraint: '' },
      ];

      expect(TokenMillOrchestrator.checkConvergence(rounds, 3)).toBe(false);
    });

    it('should handle null winner IDs', () => {
      const rounds = [
        { roundNum: 1, seed: '', outputs: new Map(), votes: new Map(), scores: new Map(), winnerId: null, winnerContent: '', constraint: '' },
        { roundNum: 2, seed: '', outputs: new Map(), votes: new Map(), scores: new Map(), winnerId: null, winnerContent: '', constraint: '' },
        { roundNum: 3, seed: '', outputs: new Map(), votes: new Map(), scores: new Map(), winnerId: null, winnerContent: '', constraint: '' },
      ];

      expect(TokenMillOrchestrator.checkConvergence(rounds, 3)).toBe(true);
    });
  });
});
