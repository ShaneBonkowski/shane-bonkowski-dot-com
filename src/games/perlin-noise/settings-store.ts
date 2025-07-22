import { SyncedStore } from "@/src/utils/synced-store";

export interface Settings {
  autoPlay: boolean;
}

class SettingsStore extends SyncedStore<Settings> {
  private defaultData: Settings = {
    autoPlay: true,
  };

  private data: Settings = { ...this.defaultData };

  // eslint-disable-next-line no-restricted-syntax
  constructor() {
    super();

    // Return early during SSR/static generation (need to call super first)
    if (typeof window === "undefined") return;
  }

  protected getData(): Settings {
    return { ...this.data };
  }

  public setAutoPlay(value: boolean): boolean {
    this.data.autoPlay = value;
    this.notify();

    return value;
  }

  public resetData() {
    // Reset to base defaults
    this.data = { ...this.defaultData };

    this.notify();
  }
}

// Export singleton instance
export const settingsStore = new SettingsStore();
