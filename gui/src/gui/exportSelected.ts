/**
 * Export selected iteration as HTML.
 * The actual export is handled server-side via POST /api/export.
 */

export interface GuiIteration {
  id: number;
  code: string;
  timestamp: number;
}

/**
 * Prepare export request data for the selected iteration.
 * @throws Error if selectedIndex is out of range or code is empty
 */
export function prepareExportData(
  iterations: GuiIteration[],
  selectedIndex: number
): { code: string } {
  const iteration = iterations[selectedIndex];
  if (!iteration || !iteration.code?.trim()) {
    throw new Error('Selected iteration not found or has no code');
  }
  return { code: iteration.code };
}
