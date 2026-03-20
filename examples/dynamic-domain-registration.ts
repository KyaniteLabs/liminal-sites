/**
 * Example: Dynamic Domain Registration
 *
 * This example demonstrates how to register new creative domains at runtime
 * using the GeneratorRegistry and SmartRouter.
 */

import { generatorRegistry } from '../src/generators/GeneratorRegistry.js';
import { SmartRouter } from '../src/routing/SmartRouter.js';

async function main() {
  // Example 1: Register a lyrics generation domain
  console.log('=== Example 1: Lyrics Domain ===\n');

  generatorRegistry.registerDomain({
    name: 'lyrics',
    keywords: ['lyrics', 'poem', 'song words', 'verse', 'rhyme'],
    confidence: 0.8,
    generate: async (prompt: string) => {
      // Simple lyrics generation (in production, you'd call an LLM here)
      return `[LYRICS]
Verse 1:
When you ask for "${prompt}"
The words begin to flow
Creating melodies and dreams
Wherever you may go

Chorus:
Dynamic domains so bright
Adding new creative light
From lyrics to code and art
We're pushing every bound
`;
    },
  });

  // Test the lyrics domain
  const lyricsDispatch = generatorRegistry.dispatch('write some lyrics about love');
  if (lyricsDispatch) {
    console.log(`Domain: ${lyricsDispatch.entry.name}`);
    console.log(`Confidence: ${lyricsDispatch.confidence}`);
    const lyrics = await lyricsDispatch.entry.generate('love');
    console.log(`Output:\n${lyrics}`);
  }

  // Example 2: Register a joke generation domain
  console.log('\n=== Example 2: Joke Domain ===\n');

  generatorRegistry.registerDomain({
    name: 'joke',
    keywords: ['joke', 'funny', 'humor', 'comedy', 'laugh'],
    confidence: 0.9,
    generate: async (prompt: string) => {
      const jokes = [
        'Why did the developer go broke? Because he used up all his cache!',
        'Why do programmers prefer dark mode? Because light attracts bugs!',
        'There are only 10 types of people in the world: those who understand binary and those who don\'t.',
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    },
  });

  // Test the joke domain
  const jokeDispatch = generatorRegistry.dispatch('tell me a joke');
  if (jokeDispatch) {
    console.log(`Domain: ${jokeDispatch.entry.name}`);
    console.log(`Confidence: ${jokeDispatch.confidence}`);
    const joke = await jokeDispatch.entry.generate('joke');
    console.log(`Output: ${joke}`);
  }

  // Example 3: Integration with SmartRouter
  console.log('\n=== Example 3: SmartRouter Integration ===\n');

  const router = new SmartRouter();

  // Register the domain with SmartRouter for routing awareness
  router.registerDynamicDomain('lyrics', ['lyrics', 'poem', 'verse'], 'local', 0.8);
  router.registerDynamicDomain('joke', ['joke', 'funny', 'humor'], 'cloud', 0.7);

  // Test routing to dynamic domains
  const lyricsDecision = router.routeByPrompt('generate lyrics about coding');
  console.log(`Prompt: "generate lyrics about coding"`);
  console.log(`Routed to: ${lyricsDecision.model}`);
  console.log(`Domain: ${lyricsDecision.domain}`);
  console.log(`Reason: ${lyricsDecision.reason}`);

  console.log();

  const jokeDecision = router.routeByPrompt('tell me something funny');
  console.log(`Prompt: "tell me something funny"`);
  console.log(`Routed to: ${jokeDecision.model}`);
  console.log(`Domain: ${jokeDecision.domain}`);
  console.log(`Reason: ${jokeDecision.reason}`);

  // Example 4: List all dynamic domains
  console.log('\n=== Example 4: Managing Dynamic Domains ===\n');

  console.log('Current dynamic domains:');
  const dynamicDomains = generatorRegistry.getDynamicDomains();
  for (const domain of dynamicDomains) {
    console.log(`  - ${domain}`);
  }

  // Example 5: Unregister a domain
  console.log('\n=== Example 5: Unregistering a Domain ===\n');

  console.log('Unregistering "joke" domain...');
  const removed = generatorRegistry.unregisterDomain('joke');
  console.log(`Removed: ${removed}`);

  console.log('Remaining dynamic domains:');
  for (const domain of generatorRegistry.getDynamicDomains()) {
    console.log(`  - ${domain}`);
  }

  // Try to dispatch to the unregistered domain
  const noDispatch = generatorRegistry.dispatch('tell me a joke');
  console.log(`\nDispatch to "joke" after unregistering: ${noDispatch ? 'Found' : 'Not found'}`);

  // Example 6: Check if domain exists
  console.log('\n=== Example 6: Domain Existence Checks ===\n');

  console.log(`Has "lyrics" domain: ${generatorRegistry.hasDomain('lyrics')}`);
  console.log(`Has "joke" domain: ${generatorRegistry.hasDomain('joke')}`);
  console.log(`Router supports "lyrics": ${router.isDomainSupported('lyrics')}`);
  console.log(`Router supports "joke": ${router.isDomainSupported('joke')}`);

  console.log('\n=== Examples Complete ===\n');
}

// Run the examples
main().catch(console.error);
