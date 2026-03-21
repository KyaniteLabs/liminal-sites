/**
 * CLI argument parser and executor for `liminal compost` subcommands.
 */

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MillLike = any;

/** Execute a CLI action against the CompostMill. */
export async function execute(action: CLIAction, mill: MillLike): Promise<void> {
  switch (action.command) {
    case 'add':
      if (action.paths.length > 0) {
        await mill.add(action.paths);
        console.log('Added ' + action.paths.length + ' item(s) to heap.');
      } else {
        console.log('Usage: liminal compost add <file-or-directory>...');
      }
      break;

    case 'digest': {
      console.log('Starting digestion...');
      const result = await mill.digest();
      console.log('Digestion complete.');
      console.log('  Files processed: ' + result.stats.filesProcessed);
      console.log('  Fragments: ' + result.stats.fragmentCount);
      console.log('  Collisions: ' + result.stats.collisionCount);
      console.log('  Seeds promoted: ' + result.stats.seedsPromoted);
      if (result.digestPath) {
        console.log('  Digest saved to: ' + result.digestPath);
      }
      break;
    }

    case 'soup':
      if (action.subcommand === 'start') {
        await mill.startSoup();
        console.log('Soup started.');
      } else if (action.subcommand === 'stop') {
        mill.stopSoup();
        console.log('Soup stopped.');
      } else if (action.subcommand === 'status') {
        const status = mill.status();
        console.log('Soup running: ' + status.soupRunning);
        console.log('Generation: ' + status.soupGeneration);
      }
      break;

    case 'seeds':
      if (action.subcommand === 'list') {
        console.log('Seed listing not yet implemented via CLI.');
      }
      break;

    case 'status': {
      const status = mill.status();
      console.log('Compost Mill Status:');
      console.log('  Heap size: ' + status.heapSize + ' bytes');
      console.log('  Heap files: ' + status.heapFileCount);
      console.log('  Seeds: ' + status.seedCount);
      console.log('  Soup: ' + (status.soupRunning ? 'running' : 'stopped'));
      console.log('  Soup generation: ' + status.soupGeneration);
      break;
    }
  }
}
