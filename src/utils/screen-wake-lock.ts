class ScreenWakeLock {
  private wakeLock: WakeLockSentinel | null = null;

  /** Request a screen wake lock to keep the screen on.
   * If the Screen Wake Lock API is not supported, returns false.
   * See https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
   * for more info.
   * @returns {Promise<boolean>} True if wake lock acquired, false otherwise.
   * */
  async requestWakeLock(): Promise<boolean> {
    if (!("wakeLock" in navigator)) {
      console.warn("Screen Wake Lock API not supported");
      return false;
    }

    try {
      this.wakeLock = await navigator.wakeLock.request("screen");
      console.log("Screen wake lock activated");
      return true;
    } catch (error) {
      console.error("Failed to request wake lock:", error);
      return false;
    }
  }

  /** Release the screen wake lock if it is active. */
  async releaseWakeLock() {
    if (this.isActive) {
      await this.wakeLock!.release();
      this.wakeLock = null;
      console.log("Screen wake lock released");
    }
  }

  /** Check if the wake lock is currently active.
   * @returns {boolean} True if wake lock is active, false otherwise.
   */
  get isActive(): boolean {
    return this.wakeLock !== null && !this.wakeLock.released;
  }
}

export const screenWakeLock = new ScreenWakeLock();
