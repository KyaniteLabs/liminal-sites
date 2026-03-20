/**
 * PromptLibrary - Centralized prompt template management
 *
 * Provides a registry and rendering system for LLM prompts.
 * All prompts are registered at module load time via static registration.
 */

export interface PromptTemplate {
  id: string;
  version: string;
  category: string;
  systemPrompt: string;
  userPromptTemplate?: string;
  tags?: string[];
  created?: string;
  updated?: string;
  metadata?: Record<string, unknown>;
}

/** Validation result for a single template */
interface TemplateValidation {
  id: string;
  valid: boolean;
  issues: string[];
}

/** Summary of all registered prompts */
interface LibraryStats {
  total: number;
  byCategory: Record<string, number>;
  ids: string[];
}

class PromptLibrary {
  private static templates = new Map<string, PromptTemplate>();

  static register(template: PromptTemplate): void {
    if (this.templates.has(template.id)) {
      throw new Error(`Prompt template already registered: ${template.id}`);
    }
    this.templates.set(template.id, template);
  }

  static render(
    id: string,
    vars?: Record<string, string>
  ): { system: string; user: string } {
    const template = this.templates.get(id);
    if (!template) {
      throw new Error(`Prompt template not found: ${id}`);
    }

    const interpolate = (str: string): string => {
      if (!vars) return str;
      let result = str;
      for (const [key, value] of Object.entries(vars)) {
        result = result.replaceAll(`\${${key}}`, value);
      }
      return result;
    };

    const system = interpolate(template.systemPrompt);
    const user = template.userPromptTemplate
      ? interpolate(template.userPromptTemplate)
      : '';

    return { system, user };
  }

  static get(id: string): PromptTemplate | undefined {
    return this.templates.get(id);
  }

  static listByCategory(category: string): PromptTemplate[] {
    return Array.from(this.templates.values()).filter((t) => t.category === category);
  }

  static list(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get summary statistics for all registered prompts.
   */
  static stats(): LibraryStats {
    const all = Array.from(this.templates.values());
    const byCategory: Record<string, number> = {};
    for (const t of all) {
      byCategory[t.category] = (byCategory[t.category] || 0) + 1;
    }
    return {
      total: all.length,
      byCategory,
      ids: all.map((t) => t.id).sort(),
    };
  }

  /**
   * Validate all registered templates for required fields and metadata.
   * Returns validation results for each template.
   */
  static validate(): TemplateValidation[] {
    return Array.from(this.templates.values()).map((t) => {
      const issues: string[] = [];

      if (!t.id) issues.push('missing id');
      if (!t.version) issues.push('missing version');
      if (!t.category) issues.push('missing category');
      if (!t.systemPrompt || t.systemPrompt.trim() === '') issues.push('empty systemPrompt');
      if (!t.created) issues.push('missing created date');
      if (!t.updated) issues.push('missing updated date');
      if (!t.tags || t.tags.length === 0) issues.push('missing tags');

      return { id: t.id, valid: issues.length === 0, issues };
    });
  }

  /**
   * Export all templates as a JSON-serializable structure for debugging/auditing.
   */
  static exportAll(): Record<string, PromptTemplate> {
    const result: Record<string, PromptTemplate> = {};
    for (const [id, template] of this.templates) {
      result[id] = { ...template };
    }
    return result;
  }
}

export { PromptLibrary };
export type { LibraryStats, TemplateValidation };
