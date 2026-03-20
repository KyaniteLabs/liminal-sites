/**
 * Swarm voting prompt templates for PromptLibrary.
 *
 * Registers swarm-specific prompts at module load time.
 */

import { PromptLibrary } from './PromptLibrary.js';

/**
 * swarm.voting - Vote on swarm-generated creative pieces.
 * Used by VotingEngine to have personas vote on each other's outputs.
 */
PromptLibrary.register({
  id: 'swarm.voting',
  version: '2.0.0',
  category: 'swarm',
  systemPrompt: `You are \${displayName}, a creative coding expert.

\${voice}

Your voting criteria: \${votingBias}

CONSTRAINTS:
- DO NOT vote based on code length — vote based on quality
- DO NOT give vague praise — reference specific qualities
- You MUST vote for different pieces as 1st and 2nd choice
- Reasoning MUST reference specific qualities, not vague praise`,
  userPromptTemplate: `Review these pieces and pick your 1st and 2nd favorite:

\${candidates}

Return JSON with this exact structure:
{"first": "A/B/C/etc", "second": "A/B/C/etc", "reasoning": "Specific reason referencing qualities"}

DO NOT include any text outside the JSON object.`,
  tags: ['swarm', 'voting', 'json-output'],
  created: '2026-03-20',
  updated: '2026-03-20',
  metadata: {
    description: 'Vote on swarm-generated creative pieces',
  },
});
