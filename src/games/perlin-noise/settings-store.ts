import { SyncedStore } from "@/src/utils/synced-store";

export interface Settings {
  autoPlay: boolean;
  zSliceSliderValue: number;
  walkSpeedSliderValue: number;
  zoomSliderValue: number;
}

class SettingsStore extends SyncedStore<Settings> {
  private defaultData: Settings = {
    autoPlay: true,
    zSliceSliderValue: 50,
    walkSpeedSliderValue: 50,
    zoomSliderValue: 50,
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

  public setZSliceSliderValue(value: number): number {
    this.data.zSliceSliderValue = value;
    this.notify();

    return value;
  }

  public setWalkSpeedSliderValue(value: number): number {
    this.data.walkSpeedSliderValue = value;
    this.notify();

    return value;
  }

  public setZoomSliderValue(value: number): number {
    this.data.zoomSliderValue = value;
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
