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
    super();

    // Return early during SSR/static generation (need to call super first)
    if (typeof window === "undefined") return;
  }

  protected getData(): Settings {
    return { ...this.data };
  }

  public setAlignmentFactor(value: number): number {
    this.data.alignmentFactor = value;
    this.notify();

    return value;
  }

  public setCohesionFactor(value: number): number {
    this.data.cohesionFactor = value;
    this.notify();

    return value;
  }

  public setSeparationFactor(value: number): number {
    this.data.separationFactor = value;
    this.notify();

    return value;
  }

  public setSpeed(value: number): number {
    this.data.speed = value;
    this.notify();

    return value;
  }

  public setFlockSearchRadius(value: number): number {
    this.data.flockSearchRadius = value;
    this.notify();

    return value;
  }

  public setLeaderBoidEnabled(value: boolean): boolean {
    this.data.leaderBoidEnabled = value;
    this.notify();

    return value;
  }

  public resetData() {
    this.data = { ...this.defaultData };
    this.notify();
  }
}

// Export singleton instance
export const settingsStore = new SettingsStore();
