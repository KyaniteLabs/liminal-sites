import { createHash, randomUUID } from 'crypto';

export function slugifySiteName(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 54);
  return slug || 'site';
}

export function createSiteId(name: string): string {
  return `${slugifySiteName(name)}-${randomUUID().slice(0, 8)}`;
}

export function createRunId(prefix: string): string {
  return `${prefix}-${Date.now()}-${randomUUID().slice(0, 8)}`;
}

export function stableSeed(...parts: string[]): string {
  return createHash('sha256').update(parts.join('\n')).digest('hex').slice(0, 16);
}

export function assertSafeSiteId(siteId: string): void {
  if (!/^[a-z0-9][a-z0-9-]{2,100}$/.test(siteId)) {
    throw new Error(`Invalid site id: ${siteId}`);
  }
}
