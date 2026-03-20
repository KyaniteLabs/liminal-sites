/**
 * Collaboration layer - Multi-model collaboration for maximum quality
 *
 * Exports all collaboration components
 */

// Main classes
export { DeepCollaboration } from './DeepCollaboration.js';
export { CollaborativeClient } from './CollaborativeClient.js';

// Critics
export { TechnicalCritic } from './critics/TechnicalCritic.js';
export { ArtisticCritic } from './critics/ArtisticCritic.js';
export { DomainExpert } from './critics/DomainExpert.js';

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
