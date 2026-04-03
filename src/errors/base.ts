/**
 * Base error class for all Liminal errors.
 * Provides structured error information with codes and context.
 */
export class LiminalError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
