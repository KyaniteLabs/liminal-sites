/**
 * ContextAccumulation - Manages state history and context accumulation
 *
 * Key behavior:
 * - save(state) adds state to history
 * - load() returns most recent state or null
 * - getHistory() returns all saved states (with truncation)
 * - clear() resets all state
 *
 * Used in Ralph-Wiggum Loop where each iteration's state is saved
 * and accumulated context is passed between iterations.
 */

interface State {
  [key: string]: any;
}

export class ContextAccumulation {
  private static history: State[] = [];
  private static readonly MAX_HISTORY_SIZE = 50;

  /**
   * Save state to history
   * @param state - The state object to save (any type)
   */
  static save(state: any): void {
    ContextAccumulation.history.push(state);

    // Truncate history if exceeds max size
    if (ContextAccumulation.history.length > ContextAccumulation.MAX_HISTORY_SIZE) {
      ContextAccumulation.history = ContextAccumulation.history.slice(-ContextAccumulation.MAX_HISTORY_SIZE);
    }
  }

  /**
   * Load most recent state
   * @returns Most recent state or null if no state exists
   */
  static load(): State | null {
    if (ContextAccumulation.history.length === 0) {
      return null;
    }

    const mostRecent = ContextAccumulation.history[ContextAccumulation.history.length - 1];

    // Return a deep copy to prevent external mutations
    return ContextAccumulation.deepCopy(mostRecent);
  }

  /**
   * Get full history of all saved states
   * @returns Array of all saved states (copy of internal history)
   */
  static getHistory(): State[] {
    // Return a deep copy to prevent external mutations
    return ContextAccumulation.history.map(state => ContextAccumulation.deepCopy(state));
  }

  /**
   * Clear all history
   */
  static clear(): void {
    ContextAccumulation.history = [];
  }

  /**
   * Create a deep copy of an object
   * Handles circular references and complex objects
   * @param obj - Object to copy
   * @returns Deep copy of the object
   */
  private static deepCopy(obj: any): any {
    // Handle null, undefined, and primitives
    if (obj === null || obj === undefined || typeof obj !== 'object') {
      return obj;
    }

    // Handle Date objects
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }

    // Handle Array
    if (Array.isArray(obj)) {
      return obj.map(item => ContextAccumulation.deepCopy(item));
    }

    // Try JSON serialization first (handles most cases)
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (e) {
      // Fallback for circular references or non-serializable objects
      return Object.assign({}, obj);
    }
  }
}