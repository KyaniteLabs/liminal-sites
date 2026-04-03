import { describe, it, expect } from 'vitest';
import { restoreBackup } from '../../../src/harness/tools/backup.js';

describe('backup error handling', () => {
  it('should throw error when restore fails', async () => {
    // Given: corrupted backup that will fail
    const corruptedBackup = '/nonexistent/path/backup.zip';
    
    // When/Then: Should throw, not swallow
    await expect(restoreBackup(corruptedBackup)).rejects.toThrow('Backup restore failed');
  });
  
  it('should include original error message', async () => {
    const corruptedBackup = '/nonexistent/path/backup.zip';
    
    await expect(restoreBackup(corruptedBackup)).rejects.toThrow(/nonexistent|ENOENT/);
  });
});
