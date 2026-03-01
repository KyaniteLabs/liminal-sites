/**
 * PromiseDetector - Detects exact promise completion strings
 *
 * Looks for the exact string: <promise>COMPLETE</promise>
 * - Case-sensitive matching
 * - No partial matches allowed
 * - Must be exact spelling and formatting
 */
export class PromiseDetector {
  private static readonly PROMISE_STRING = '<promise>COMPLETE</promise>';

  /**
   * Detect if the output contains the exact completion promise
   * @param output - The text to search for the promise string
   * @returns true if exact promise found, false otherwise
   */
  static detect(output: string): boolean {
    if (typeof output !== 'string') {
      return false;
    }

    return output.includes(this.PROMISE_STRING);
  }
}