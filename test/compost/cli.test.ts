/**
 * Tests for CLI commands — liminal compost subcommand parsing.
 */

import { jest } from '@jest/globals';
import { parseArgs, execute } from '../../src/compost/cli.js';

describe('CLI parseArgs', () => {
  it('parses compost add action', () => {
    const action = parseArgs(['compost', 'add', 'file.txt', 'dir/']);
    expect(action.command).toBe('add');
    if (action.command === 'add') {
      expect(action.paths).toEqual(['file.txt', 'dir/']);
    }
  });

  it('parses compost digest action', () => {
    const action = parseArgs(['compost', 'digest']);
    expect(action.command).toBe('digest');
  });

  it('parses soup start action', () => {
    const action = parseArgs(['compost', 'soup', 'start']);
    expect(action.command).toBe('soup');
    if (action.command === 'soup') {
      expect(action.subcommand).toBe('start');
    }
  });

  it('parses soup stop action', () => {
    const action = parseArgs(['compost', 'soup', 'stop']);
    expect(action.command).toBe('soup');
    if (action.command === 'soup') {
      expect(action.subcommand).toBe('stop');
    }
  });

  it('parses soup status action', () => {
    const action = parseArgs(['compost', 'soup', 'status']);
    expect(action.command).toBe('soup');
    if (action.command === 'soup') {
      expect(action.subcommand).toBe('status');
    }
  });

  it('parses seeds list action', () => {
    const action = parseArgs(['compost', 'seeds', 'list']);
    expect(action.command).toBe('seeds');
    if (action.command === 'seeds') {
      expect(action.subcommand).toBe('list');
    }
  });

  it('parses status action', () => {
    const action = parseArgs(['compost', 'status']);
    expect(action.command).toBe('status');
  });
});

describe('CLI execute', () => {
  let consoleSpy: jest.SpiedFunction<any>;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('dispatches digest to mill.digest()', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const digestFn: any = jest.fn();
    digestFn.mockResolvedValue({
      stats: { filesProcessed: 1, fragmentCount: 5, collisionCount: 2, seedsPromoted: 1, soupCycles: 10, durationMs: 1000, totalBytes: 500, domains: ['a'] },
      seeds: [],
      digestPath: '/tmp/digest.md',
    });

    const mockMill = {
      digest: digestFn,
      add: jest.fn(),
      status: jest.fn().mockReturnValue({ heapSize: 0, heapFileCount: 0, seedCount: 0, soupRunning: false, soupGeneration: 0, lastDigestAt: null }),
      stopSoup: jest.fn(),
      startSoup: jest.fn(),
      shouldAutoDigest: jest.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mockMill.shouldAutoDigest as any).mockResolvedValue(false);

    await execute({ command: 'digest' }, mockMill as any);
    expect(mockMill.digest).toHaveBeenCalled();
  });

  it('dispatches status to mill.status()', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const statusFn: any = jest.fn();
    statusFn.mockReturnValue({ heapSize: 0, heapFileCount: 0, seedCount: 0, soupRunning: false, soupGeneration: 0, lastDigestAt: null });

    const mockMill = {
      digest: jest.fn(),
      add: jest.fn(),
      status: statusFn,
      stopSoup: jest.fn(),
      startSoup: jest.fn(),
      shouldAutoDigest: jest.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mockMill.shouldAutoDigest as any).mockResolvedValue(false);

    await execute({ command: 'status' }, mockMill as any);
    expect(mockMill.status).toHaveBeenCalled();
  });
});
