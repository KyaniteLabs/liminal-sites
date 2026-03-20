/**
 * Collaboration layer - Multi-model collaboration for maximum quality
 *
 * Exports all collaboration components
 */

// Main classes
export { DeepCollaboration } from './DeepCollaboration.js';
export { CollaborativeClient } from './CollaborativeClient.js';

// Types
export type {
  CollaborationRole,
  CollaborationPhase,
  DeepCollaborationConfig,
  DeepCollaborationResult,
  PhaseResult,
  Analysis,
  Synthesis,
  CollaborativeConfig,
  CollaborativeResult,
  CollaborationRound,
  PhaseUpdate,
  DomainType,
} from './types.js';
