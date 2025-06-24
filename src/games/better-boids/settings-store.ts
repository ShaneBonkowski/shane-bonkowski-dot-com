import { SyncedStore } from "@/src/utils/synced-store";

export interface Settings {
  alignmentFactor: number;
  cohesionFactor: number;
  separationFactor: number;
  speed: number;
  flockSearchRadius: number;
  leaderBoidEnabled: boolean;
}

class SettingsStore extends SyncedStore<Settings> {
  private defaultData: Settings = {
    alignmentFactor: 0.3,
    cohesionFactor: 0.054,
    separationFactor: 0.935,
    speed: 0.6,
    flockSearchRadius: 90,
    leaderBoidEnabled: true,
  };

  private data: Settings = { ...this.defaultData };

  // eslint-disable-next-line no-restricted-syntax
  constructor() {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    super();
  }

  protected getData(): Settings {
    return { ...this.data };
  }

  public setAlignmentFactor(value: number) {
    this.data.alignmentFactor = value;
    this.notify();
  }

  public setCohesionFactor(value: number) {
    this.data.cohesionFactor = value;
    this.notify();
  }

  public setSeparationFactor(value: number) {
    this.data.separationFactor = value;
    this.notify();
  }

  public setSpeed(value: number) {
    this.data.speed = value;
    this.notify();
  }

  public setFlockSearchRadius(value: number) {
    this.data.flockSearchRadius = value;
    this.notify();
  }

  public setLeaderBoidEnabled(value: boolean) {
    this.data.leaderBoidEnabled = value;
    this.notify();
  }

  public resetData() {
    this.data = { ...this.defaultData };
    this.notify();
  }
}

// Export singleton instance
export const settingsStore = new SettingsStore();
