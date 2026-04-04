/**
 * LayerMask - Masking system for layer compositions.
 *
 * Enables using one layer as a mask for another layer,
 * supporting alpha, luminance, and inverse-alpha masking modes.
 */

import type { LayerMask, MaskMode } from './types.js';

/**
 * Manager for layer masks.
 * Handles creation, modification, and application of masks.
 */
export class LayerMaskManager {
  private masks = new Map<string, LayerMask>();

  /**
   * Create a new mask between two layers.
   *
   * @param sourceLayerId - Layer to use as the mask source
   * @param targetLayerId - Layer to apply the mask to
   * @param mode - Mask mode (default: 'alpha')
   * @returns The created LayerMask
   */
  createMask(
    sourceLayerId: string,
    targetLayerId: string,
    mode: MaskMode = 'alpha'
  ): LayerMask {
    const mask: LayerMask = {
      id: this.generateMaskId(),
      sourceLayerId,
      targetLayerId,
      mode,
      invert: false,
      feather: 0,
    };

    this.masks.set(mask.id, mask);
    return mask;
  }

  /**
   * Remove a mask by ID.
   *
   * @param maskId - ID of the mask to remove
   * @returns true if removed, false if not found
   */
  removeMask(maskId: string): boolean {
    return this.masks.delete(maskId);
  }

  /**
   * Update a mask's properties.
   *
   * @param maskId - ID of the mask to update
   * @param updates - Partial updates (cannot change id)
   * @returns true if updated, false if not found
   */
  updateMask(
    maskId: string,
    updates: Partial<Omit<LayerMask, 'id'>>
  ): boolean {
    const mask = this.masks.get(maskId);
    if (!mask) {
      return false;
    }

    Object.assign(mask, updates);
    return true;
  }

  /**
   * Get all masks that target a specific layer.
   *
   * @param layerId - Target layer ID
   * @returns Array of masks targeting the layer
   */
  getMasksForLayer(layerId: string): LayerMask[] {
    return this.getAllMasks().filter((mask) => mask.targetLayerId === layerId);
  }

  /**
   * Get all masks that use a specific layer as source.
   *
   * @param layerId - Source layer ID
   * @returns Array of masks using the layer as source
   */
  getMasksForSourceLayer(layerId: string): LayerMask[] {
    return this.getAllMasks().filter((mask) => mask.sourceLayerId === layerId);
  }

  /**
   * Get a mask by ID.
   *
   * @param maskId - Mask ID
   * @returns The mask or undefined
   */
  getMask(maskId: string): LayerMask | undefined {
    const mask = this.masks.get(maskId);
    return mask ? { ...mask } : undefined;
  }

  /**
   * Check if a mask exists.
   *
   * @param maskId - Mask ID
   * @returns true if exists
   */
  hasMask(maskId: string): boolean {
    return this.masks.has(maskId);
  }

  /**
   * Get all registered masks.
   *
   * @returns Array of all masks (copies)
   */
  getAllMasks(): LayerMask[] {
    return Array.from(this.masks.values()).map((mask) => ({ ...mask }));
  }

  /**
   * Remove all masks.
   */
  clearMasks(): void {
    this.masks.clear();
  }

  /**
   * Apply a mask to a container element using CSS.
   *
   * @param container - HTML element to apply mask to
   * @param mask - The mask configuration
   * @param sourceCanvas - Canvas element containing mask content
   */
  applyMask(
    container: HTMLElement,
    mask: LayerMask,
    sourceCanvas: HTMLCanvasElement
  ): void {
    if (!sourceCanvas) {
      return;
    }

    const maskUrl = sourceCanvas.toDataURL();
    const maskValue = `url(${maskUrl})`;

    // Apply standard and vendor-prefixed mask properties
    container.style.maskImage = maskValue;
    container.style.webkitMaskImage = maskValue;

    const mode = this.getCSSMaskMode(mask);
    container.style.maskMode = mode;
    (container.style as CSSStyleDeclaration & { webkitMaskMode?: string }).webkitMaskMode = mode;

    // Apply feather if specified
    if (mask.feather > 0) {
      container.style.maskComposite = 'source-in';
      // Note: CSS mask blur is limited, consider canvas for advanced feathering
    }
  }

  /**
   * Generate CSS mask properties for a mask.
   *
   * @param mask - The mask configuration
   * @returns CSS string with mask properties
   */
  generateCSSMask(mask: LayerMask): string {
    const mode = this.getCSSMaskMode(mask);
    const invert = mask.invert || mask.mode === 'inverse-alpha';

    const properties = [
      'mask-image: var(--mask-source);',
      `mask-mode: ${mode};`,
      '-webkit-mask-image: var(--mask-source);',
      `-webkit-mask-mode: ${mode};`,
    ];

    if (mask.feather > 0) {
      properties.push(`filter: blur(${mask.feather}px);`);
    }

    if (invert) {
      properties.push('mask-composite: exclude;');
      properties.push('-webkit-mask-composite: xor;');
    }

    return properties.join('\n  ');
  }

  /**
   * Generate canvas mask using composite operations.
   *
   * @param mask - The mask configuration
   * @param ctx - Canvas rendering context (of target layer)
   * @param sourceCanvas - Canvas containing mask content
   */
  generateCanvasMask(
    mask: LayerMask,
    ctx: CanvasRenderingContext2D,
    sourceCanvas: HTMLCanvasElement
  ): void {
    // Save current state
    const prevComposite = ctx.globalCompositeOperation;
    const prevFilter = ctx.filter;

    // Apply feather filter if specified
    if (mask.feather > 0) {
      ctx.filter = `blur(${mask.feather}px)`;
    }

    // Determine composite operation based on mask mode
    const compositeOp = this.getCanvasCompositeOperation(mask);
    ctx.globalCompositeOperation = compositeOp;

    // Draw the mask source onto the target
    ctx.drawImage(sourceCanvas, 0, 0);

    // Restore state
    ctx.globalCompositeOperation = prevComposite;
    ctx.filter = prevFilter;
  }

  /**
   * Apply mask to a WebGL context using stencil buffer.
   *
   * @param mask - The mask configuration
   * @param gl - WebGL rendering context
   * @param _maskTexture - Texture containing mask data (reserved for future use)
   */
  applyWebGLMask(
    mask: LayerMask,
    gl: WebGLRenderingContext,
    _maskTexture?: WebGLTexture
  ): void {
    // Enable stencil testing
    gl.enable(gl.STENCIL_TEST);

    // Set up stencil operations based on mask mode
    const stencilFunc = this.getWebGLStencilFunc(mask);
    gl.stencilFunc(stencilFunc, 1, 0xff);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);

    // Clear stencil buffer
    gl.clear(gl.STENCIL_BUFFER_BIT);

    // Draw mask geometry to stencil buffer
    // (Implementation would depend on specific WebGL setup)

    // Re-enable stencil test for actual rendering
    gl.stencilFunc(gl.EQUAL, 1, 0xff);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

    // After rendering target content, disable stencil
    // gl.disable(gl.STENCIL_TEST);
  }

  /**
   * Get the CSS mask mode string.
   */
  private getCSSMaskMode(mask: LayerMask): string {
    switch (mask.mode) {
      case 'luminance':
        return 'luminance';
      case 'alpha':
      case 'inverse-alpha':
      default:
        return 'alpha';
    }
  }

  /**
   * Get the canvas composite operation.
   */
  private getCanvasCompositeOperation(mask: LayerMask): GlobalCompositeOperation {
    const effectiveMode = mask.mode === 'inverse-alpha' || mask.invert
      ? 'inverse-alpha'
      : mask.mode;

    switch (effectiveMode) {
      case 'inverse-alpha':
        return 'destination-out';
      case 'luminance':
        // Luminance masking requires custom shader or pre-processing
        // Fallback to alpha for basic canvas
        return 'destination-in';
      case 'alpha':
      default:
        return 'destination-in';
    }
  }

  /**
   * Get WebGL stencil function based on mask mode.
   */
  private getWebGLStencilFunc(mask: LayerMask): number {
    const invert = mask.invert || mask.mode === 'inverse-alpha';
    return invert ? WebGLRenderingContext.NEVER : WebGLRenderingContext.ALWAYS;
  }

  /**
   * Generate a unique mask ID.
   */
  private generateMaskId(): string {
    return `mask_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Utility class for batch mask operations on layer groups.
 */
export class LayerMaskGroup {
  private manager: LayerMaskManager;
  private maskIds: string[] = [];

  constructor(manager: LayerMaskManager) {
    this.manager = manager;
  }

  /**
   * Apply a single mask to multiple target layers.
   *
   * @param sourceLayerId - Mask source layer
   * @param targetLayerIds - Layers to apply mask to
   * @param mode - Mask mode
   * @returns IDs of created masks
   */
  maskMultipleLayers(
    sourceLayerId: string,
    targetLayerIds: string[],
    mode: MaskMode = 'alpha'
  ): string[] {
    this.maskIds = targetLayerIds.map((targetId) => {
      const mask = this.manager.createMask(sourceLayerId, targetId, mode);
      return mask.id;
    });

    return this.maskIds;
  }

  /**
   * Remove all masks in this group.
   */
  clear(): void {
    for (const maskId of this.maskIds) {
      this.manager.removeMask(maskId);
    }
    this.maskIds = [];
  }

  /**
   * Update all masks in the group.
   *
   * @param updates - Updates to apply
   */
  updateAll(updates: Partial<Omit<LayerMask, 'id'>>): void {
    for (const maskId of this.maskIds) {
      this.manager.updateMask(maskId, updates);
    }
  }
}
