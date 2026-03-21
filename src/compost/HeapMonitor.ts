/**
 * HeapMonitor — monitors heap size and auto-triggers digestion.
 */

export class HeapMonitor {
  private intervalMs: number;
  private timer: ReturnType<typeof setInterval> | null = null;
  private digesting = false;

  constructor(intervalMs: number = 60000) {
    this.intervalMs = intervalMs;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  start(mill: any): void {
    if (this.timer) return;

    this.timer = setInterval(async () => {
      if (this.digesting) return; // debounce

      try {
        const shouldDigest = await mill.shouldAutoDigest();
        if (shouldDigest) {
          this.digesting = true;
          await mill.digest();
          this.digesting = false;
        }
      } catch {
        // Digest failure doesn't crash the monitor
        this.digesting = false;
      }
    }, this.intervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
