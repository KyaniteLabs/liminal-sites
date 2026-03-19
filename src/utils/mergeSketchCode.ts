/**
 * Merge two p5.js sketches: takes setup() from codeA, draw() from codeB.
 * Falls back to codeB if extraction fails, with a comment noting the merge source.
 */
export function mergeSketchCode(codeA: string, codeB: string): string {
  const extractFunction = (code: string, name: string): string | null => {
    const funcMatch = code.match(new RegExp(`function\\s+${name}\\s*\\([^)]*\\)\\s*\\{`, 's'));
    if (!funcMatch) return null;
    const startIdx = funcMatch.index!;
    let braceCount = 0;
    let endIdx = startIdx;
    for (let i = startIdx; i < code.length; i++) {
      if (code[i] === '{') braceCount++;
      else if (code[i] === '}') {
        braceCount--;
        if (braceCount === 0) { endIdx = i + 1; break; }
      }
    }
    return code.substring(startIdx, endIdx);
  };

  const extractArrowFunction = (code: string, name: string): string | null => {
    const arrowMatch = code.match(new RegExp(`const\\s+${name}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*\\{`, 's'));
    if (!arrowMatch) return null;
    const startIdx = arrowMatch.index!;
    let braceCount = 0;
    let endIdx = startIdx;
    for (let i = startIdx; i < code.length; i++) {
      if (code[i] === '{') braceCount++;
      else if (code[i] === '}') {
        braceCount--;
        if (braceCount === 0) { endIdx = i + 1; break; }
      }
    }
    return code.substring(startIdx, endIdx);
  };

  const setupA = extractFunction(codeA, 'setup') || extractArrowFunction(codeA, 'setup');
  const drawB = extractFunction(codeB, 'draw') || extractArrowFunction(codeB, 'draw');

  if (setupA && drawB) {
    // Extract global variables from codeA (lines before first function)
    const firstFuncIdx = codeA.search(/function\s+\w+\s*\(/);
    const globals = firstFuncIdx > 0 ? codeA.substring(0, firstFuncIdx).trim() : '';

    // Extract helper functions from codeB (functions other than setup/draw)
    const helperFuncs = codeB
      .replace(/function\s+(setup|draw)\s*\([^)]*\)\s*\{[^}]*\}/gs, '')
      .replace(/const\s+(setup|draw)\s*=\s*\([^)]*\)\s*=>\s*\{[^}]*\};?/gs, '')
      .trim();

    const parts = [
      '// Merged sketch (setup from A, draw from B)',
    ];
    if (globals) parts.push(globals);
    parts.push(setupA);
    if (helperFuncs) parts.push(helperFuncs);
    parts.push(drawB);
    return parts.join('\n\n');
  }

  // Fallback: return codeB with a merge comment
  return `// merge (fallback to codeB)\n${codeB}`;
}
