/**
 * Blend Mode Tests - TDD Approach
 *
 * Tests for blend mode utilities and adapter integration.
 * Following RED-GREEN-REFACTOR cycle.
 * 
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { BlendMode } from '../../../src/composition/types.js';
import {
  getCSSBlendMode,
  getCanvasCompositeOp,
  getWebGLBlendFunc,
  applyBlendMode,
} from '../../../src/composition/utils/blendModes.js';

describe('Blend Modes', () => {
  describe('getCSSBlendMode', () => {
    it('should return correct CSS blend mode for all supported modes', () => {
      const testCases: Array<{ input: BlendMode; expected: string }> = [
        { input: 'normal', expected: 'normal' },
        { input: 'multiply', expected: 'multiply' },
        { input: 'screen', expected: 'screen' },
        { input: 'overlay', expected: 'overlay' },
        { input: 'darken', expected: 'darken' },
        { input: 'lighten', expected: 'lighten' },
        { input: 'difference', expected: 'difference' },
        { input: 'exclusion', expected: 'exclusion' },
      ];

      for (const { input, expected } of testCases) {
        expect(getCSSBlendMode(input)).toBe(expected);
      }
    });
  });

  describe('getCanvasCompositeOp', () => {
    it('should return correct Canvas globalCompositeOperation for all modes', () => {
      const testCases: Array<{ input: BlendMode; expected: GlobalCompositeOperation }> = [
        { input: 'normal', expected: 'source-over' },
        { input: 'multiply', expected: 'multiply' },
        { input: 'screen', expected: 'screen' },
        { input: 'overlay', expected: 'overlay' },
        { input: 'darken', expected: 'darken' },
        { input: 'lighten', expected: 'lighten' },
        { input: 'difference', expected: 'difference' },
        { input: 'exclusion', expected: 'exclusion' },
      ];

      for (const { input, expected } of testCases) {
        expect(getCanvasCompositeOp(input)).toBe(expected);
      }
    });
  });

  describe('getWebGLBlendFunc', () => {
    it('should return WebGL blend factors for normal mode', () => {
      const result = getWebGLBlendFunc('normal');
      expect(result).toHaveProperty('src');
      expect(result).toHaveProperty('dst');
      expect(typeof result.src).toBe('number');
      expect(typeof result.dst).toBe('number');
    });

    it('should return WebGL blend factors for all blend modes', () => {
      const modes: BlendMode[] = [
        'normal',
        'multiply',
        'screen',
        'overlay',
        'darken',
        'lighten',
        'difference',
        'exclusion',
      ];

      for (const mode of modes) {
        const result = getWebGLBlendFunc(mode);
        expect(result).toHaveProperty('src');
        expect(result).toHaveProperty('dst');
        expect(typeof result.src).toBe('number');
        expect(typeof result.dst).toBe('number');
      }
    });

    it('should return different blend factors for different modes', () => {
      const normal = getWebGLBlendFunc('normal');
      const multiply = getWebGLBlendFunc('multiply');
      const screen = getWebGLBlendFunc('screen');

      // Different modes should have different blend configurations
      expect(normal).not.toEqual(multiply);
      expect(normal).not.toEqual(screen);
      expect(multiply).not.toEqual(screen);
    });
  });

  describe('applyBlendMode', () => {
    describe('CSS type (HTML elements)', () => {
      it('should apply mix-blend-mode to HTMLElement', () => {
        const element = document.createElement('div');
        applyBlendMode(element, 'multiply', 'css');
        expect(element.style.mixBlendMode).toBe('multiply');
      });

      it('should apply all blend modes to HTMLElement', () => {
        const modes: BlendMode[] = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'difference', 'exclusion'];
        
        for (const mode of modes) {
          const element = document.createElement('div');
          applyBlendMode(element, mode, 'css');
          expect(element.style.mixBlendMode).toBe(getCSSBlendMode(mode));
        }
      });

      it('should not throw when applying to different element types', () => {
        const span = document.createElement('span');
        const pre = document.createElement('pre');
        
        expect(() => applyBlendMode(span, 'screen', 'css')).not.toThrow();
        expect(() => applyBlendMode(pre, 'overlay', 'css')).not.toThrow();
      });
    });

    describe('Canvas type (2D context)', () => {
      it('should apply globalCompositeOperation to CanvasRenderingContext2D', () => {
        // Create a mock 2D context
        const mockCtx = {
          globalCompositeOperation: 'source-over',
        };
        
        applyBlendMode(mockCtx as unknown as CanvasRenderingContext2D, 'multiply', 'canvas');
        expect(mockCtx.globalCompositeOperation).toBe('multiply');
      });

      it('should apply all blend modes to CanvasRenderingContext2D', () => {
        const modes: BlendMode[] = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'difference', 'exclusion'];
        
        for (const mode of modes) {
          const mockCtx = { globalCompositeOperation: 'source-over' };
          applyBlendMode(mockCtx as unknown as CanvasRenderingContext2D, mode, 'canvas');
          expect(mockCtx.globalCompositeOperation).toBe(getCanvasCompositeOp(mode));
        }
      });
    });

    describe('WebGL type', () => {
      it('should enable blending and set blend func on WebGL context', () => {
        const mockGl = {
          enable: vi.fn(),
          blendFunc: vi.fn(),
          BLEND: 0x0be2,
        };
        
        applyBlendMode(mockGl as unknown as WebGLRenderingContext, 'normal', 'webgl');
        
        expect(mockGl.enable).toHaveBeenCalledWith(mockGl.BLEND);
        expect(mockGl.blendFunc).toHaveBeenCalled();
      });

      it('should call blendFunc with correct parameters for different modes', () => {
        const mockGl = {
          enable: vi.fn(),
          blendFunc: vi.fn(),
          BLEND: 0x0be2,
        };
        
        applyBlendMode(mockGl as unknown as WebGLRenderingContext, 'multiply', 'webgl');
        
        const expected = getWebGLBlendFunc('multiply');
        expect(mockGl.blendFunc).toHaveBeenCalledWith(expected.src, expected.dst);
      });

      it('should call blendFunc with correct parameters for all modes', () => {
        const modes: BlendMode[] = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'difference', 'exclusion'];
        
        for (const mode of modes) {
          const mockGl = {
            enable: vi.fn(),
            blendFunc: vi.fn(),
            BLEND: 0x0be2,
          };
          
          applyBlendMode(mockGl as unknown as WebGLRenderingContext, mode, 'webgl');
          
          const expected = getWebGLBlendFunc(mode);
          expect(mockGl.blendFunc).toHaveBeenCalledWith(expected.src, expected.dst);
        }
      });
    });

    describe('Error handling', () => {
      it('should throw error for invalid element type with CSS', () => {
        const invalidElement = {} as HTMLElement;
        expect(() => applyBlendMode(invalidElement, 'multiply', 'css')).toThrow();
      });

      it('should throw error for invalid element type with canvas', () => {
        const invalidElement = {} as CanvasRenderingContext2D;
        expect(() => applyBlendMode(invalidElement, 'multiply', 'canvas')).toThrow();
      });

      it('should throw error for invalid element type with webgl', () => {
        const invalidElement = {} as WebGLRenderingContext;
        expect(() => applyBlendMode(invalidElement, 'multiply', 'webgl')).toThrow();
      });

      it('should throw error for unsupported type parameter', () => {
        const element = document.createElement('div');
        expect(() => applyBlendMode(element, 'multiply', 'invalid' as 'css')).toThrow();
      });
    });
  });
});
