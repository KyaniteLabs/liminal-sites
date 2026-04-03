/**
 * Error formatting utilities
 * 
 * Centralized error formatting to replace the 24+ duplicate patterns
 * found across the codebase. These utilities ensure consistent error
 * message formatting throughout the application.
 */

/**
 * Format an error with a context prefix.
 * 
 * @param context - The context where the error occurred
 * @param error - The error value (Error, string, number, or unknown)
 * @returns Formatted error string: "{context}: {message}"
 * 
 * @example
 * ```ts
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   console.error(formatError('DatabaseConnection', error));
 *   // Output: "DatabaseConnection: Connection refused"
 * }
 * ```
 */
export function formatError(context: string, error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return `${context}: ${message}`;
}



/**
 * Format an error with a fallback message for null/undefined values.
 * 
 * This variation is useful when you want to avoid "null" or "undefined"
 * in your error messages and instead show a user-friendly message.
 * 
 * @param context - The context where the error occurred
 * @param error - The error value (Error, string, number, or unknown)
 * @param fallback - The fallback message for non-Error values (default: 'Unknown error')
 * @returns Formatted error string
 * 
 * @example
 * ```ts
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   console.error(formatErrorWithFallback('Backup', error));
 *   // Output: "Backup: Unknown error" (when error is null)
 * }
 * ```
 */
export function formatErrorWithFallback(
  context: string,
  error: unknown,
  fallback: string = 'Unknown error'
): string {
  const message = error instanceof Error ? error.message : fallback;
  return `${context}: ${message}`;
}
