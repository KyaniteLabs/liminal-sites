/**
 * DigestScheduler — schedules periodic digestion runs.
 */

export class DigestScheduler {
  private timer: ReturnType<typeof setTimeout> | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schedule(mill: any, mode: 'manual' | 'daily' | 'weekly'): void {
    if (mode === 'manual') return;

    const ms = mode === 'daily'
      ? 24 * 60 * 60 * 1000
      : 7 * 24 * 60 * 60 * 1000;

    const run = async () => {
      try {
        await mill.digest();
      } catch {
        // Schedule failure doesn't crash
      }
      // Reschedule
      this.timer = setTimeout(run, ms);
    };

    this.timer = setTimeout(run, ms);
  }

  cancel(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
