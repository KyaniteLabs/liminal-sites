/**
 * CLI argument parser and executor for `liminal compost` subcommands.
 */

import type { Seed } from './types.js';
import type { CompostMill } from './CompostMill.js';
import { formatSeedForDisplay } from '../core/lir/LIRPromptFormatter.js';
import { Logger } from '../utils/Logger.js';

export type CLIAction =
  | { command: 'add'; paths: string[] }
  | { command: 'digest' }
  | { command: 'soup'; subcommand: 'start' | 'stop' | 'status' }
  | { command: 'seeds'; subcommand: 'list' | 'show'; args?: string[] }
  | { command: 'status' };

/** Parse CLI arguments into a typed action. */
export function parseArgs(args: string[]): CLIAction {
  const argv = args[0] === 'compost' ? args.slice(1) : args;

  if (argv[0] === 'add') {
    return { command: 'add', paths: argv.slice(1) };
  }
  if (argv[0] === 'digest') {
    return { command: 'digest' };
  }
  if (argv[0] === 'soup') {
    const sub = argv[1] as 'start' | 'stop' | 'status';
    return { command: 'soup', subcommand: sub };
  }
  if (argv[0] === 'seeds') {
    const sub = argv[1] as 'list' | 'show';
    return { command: 'seeds', subcommand: sub, args: argv.slice(2) };
  }
  if (argv[0] === 'status') {
    return { command: 'status' };
  }

  return { command: 'status' };
}

/** Execute a CLI action against the CompostMill. */
export async function execute(action: CLIAction, mill: CompostMill): Promise<void> {
  switch (action.command) {
    case 'add':
      if (action.paths.length > 0) {
        await mill.add(action.paths);
        Logger.info('CompostCLI', 'Added ' + action.paths.length + ' item(s) to heap.');
      } else {
        Logger.info('CompostCLI', 'Usage: liminal compost add <file-or-directory>...');
      }
      break;

    case 'digest': {
      Logger.info('CompostCLI', 'Starting digestion...');
      const result = await mill.digest();
      Logger.info('CompostCLI', 'Digestion complete.');
      Logger.info('CompostCLI', '  Files processed: ' + result.stats.filesProcessed);
      Logger.info('CompostCLI', '  Fragments: ' + result.stats.fragmentCount);
      Logger.info('CompostCLI', '  Collisions: ' + result.stats.collisionCount);
      Logger.info('CompostCLI', '  Seeds promoted: ' + result.stats.seedsPromoted);
      if (result.digestPath) {
        Logger.info('CompostCLI', '  Digest saved to: ' + result.digestPath);
      }
      break;
    }

    case 'soup':
      if (action.subcommand === 'start') {
        await mill.startSoup();
        Logger.info('CompostCLI', 'Soup started. Press Ctrl+C to stop.');
      } else if (action.subcommand === 'stop') {
        mill.stopSoup();
        Logger.info('CompostCLI', 'Soup stopped.');
      } else if (action.subcommand === 'status') {
        const status = await mill.statusAsync();
        Logger.info('CompostCLI', 'Soup running: ' + status.soupRunning);
        Logger.info('CompostCLI', 'Generation: ' + status.soupGeneration);
      }
      break;

    case 'seeds':
      if (action.subcommand === 'list') {
        const seeds = await mill.listSeeds();
        if (seeds.length === 0) {
          Logger.info('CompostCLI', 'No seeds yet. Run `liminal compost digest` first.');
        } else {
          Logger.info('CompostCLI', 'Seeds (' + seeds.length + '):');
          for (const seed of seeds) {
            const badge = seed.lir ? '[' + seed.lir.type + '] ' : '';
            let preview: string;
            if (seed.lir?.type === 'code') {
              const t = seed.lir;
              // Use the full signature directly — it already includes name + params
              preview = `${t.kind} ${t.signature}`;
              preview = preview.length > 60 ? preview.slice(0, 57) + '...' : preview;
            } else if (seed.lir?.type === 'doc') {
              const t = seed.lir;
              preview = `# ${t.heading} | words: ${t.metrics.wordCount}`;
            } else if (seed.lir?.type === 'text') {
              const t = seed.lir;
              const headings = t.structure.headings.map(h => h.text).join(', ') || 'text';
              preview = `${headings} | words: ${t.metrics.wordCount}`;
            } else {
              preview = seed.content.length > 60 ? seed.content.slice(0, 57) + '...' : seed.content;
            }
            Logger.info('CompostCLI', '  [' + seed.score.toFixed(1) + '] ' + badge + seed.id + ' — ' + preview.replace(/\n/g, ' '));
          }
        }
      } else if (action.subcommand === 'show') {
        const seedId = action.args?.[0];
        if (!seedId) {
          Logger.info('CompostCLI', 'Usage: liminal compost seeds show <seed-id>');
          Logger.info('CompostCLI', 'Run `liminal compost seeds list` to see available seeds.');
        } else {
          const seeds = await mill.listSeeds();
          const match = seeds.find((s: Seed) => s.id === seedId || s.id.startsWith(seedId));
          if (!match) {
            Logger.info('CompostCLI', 'Seed not found: ' + seedId);
          } else {
            Logger.info('CompostCLI', '# ' + match.id);
            Logger.info('CompostCLI', 'Score: ' + match.score);
            Logger.info('CompostCLI', 'Domains: ' + match.source.domains.join(', '));
            Logger.info('CompostCLI', 'Collision: ' + match.source.collisionType);
            Logger.info('CompostCLI', 'Promoted: ' + match.promotedAt);
            Logger.info('CompostCLI', 'Used by: ' + (match.usedBy.length > 0 ? match.usedBy.join(', ') : '(none)'));
            if (match.lir) {
              Logger.info('CompostCLI', '');
              Logger.info('CompostCLI', formatSeedForDisplay(match));
            } else {
              Logger.info('CompostCLI', '');
              Logger.info('CompostCLI', match.content);
            }
          }
        }
      }
      break;

    case 'status': {
      const status = await mill.statusAsync();
      Logger.info('CompostCLI', 'Compost Mill Status:');
      Logger.info('CompostCLI', '  Heap size: ' + status.heapSize + ' bytes');
      Logger.info('CompostCLI', '  Heap files: ' + status.heapFileCount);
      Logger.info('CompostCLI', '  Seeds: ' + status.seedCount);
      Logger.info('CompostCLI', '  Soup: ' + (status.soupRunning ? 'running' : 'stopped'));
      Logger.info('CompostCLI', '  Soup generation: ' + status.soupGeneration);
      break;
    }
  }
}
