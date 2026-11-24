import { SyncedStore } from "@/src/utils/synced-store";

export const MAX_BOIDS_PER_TYPE = 25;

export interface Settings {
  alignmentFactor: number;
  cohesionFactor: number;
  separationFactor: number;
  speed: number;
  flockSearchRadius: number;
  leaderStrength: number;
  collisionsEnabled: boolean;
  showHitboxes: boolean;
  goodBoidCount: number;
  badBoidCount: number;
  obstacleCount: number;
}

class SettingsStore extends SyncedStore<Settings> {
  private defaultData: Settings = {
    alignmentFactor: 0.3,
    cohesionFactor: 0.054,
    separationFactor: 0.935,
    speed: 0.6,
    flockSearchRadius: 90,
    leaderStrength: 50,
    collisionsEnabled: true,
    showHitboxes: false,
    goodBoidCount: 15,
    badBoidCount: 15,
    obstacleCount: 10,
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

  public setLeaderStrength(value: number): number {
    this.data.leaderStrength = Math.max(-100, Math.min(value, 100));
    this.notify();

    return this.data.leaderStrength;
  }

  public setCollisionsEnabled(value: boolean): boolean {
    this.data.collisionsEnabled = value;
    this.notify();

    return value;
  }

  public setShowHitboxes(value: boolean): boolean {
    this.data.showHitboxes = value;
    this.notify();
    return value;
  }

  public setGoodBoidCount(value: number): number {
    this.data.goodBoidCount = Math.max(0, Math.min(value, MAX_BOIDS_PER_TYPE));
    this.notify();
    return this.data.goodBoidCount;
  }

  public setBadBoidCount(value: number): number {
    this.data.badBoidCount = Math.max(0, Math.min(value, MAX_BOIDS_PER_TYPE));
    this.notify();
    return this.data.badBoidCount;
  }

  public setObstacleCount(value: number): number {
    this.data.obstacleCount = Math.max(0, Math.min(value, MAX_BOIDS_PER_TYPE));
    this.notify();
    return this.data.obstacleCount;
  }

  public resetData() {
    this.data = { ...this.defaultData };
    this.notify();
  }
}

// Export singleton instance
export const settingsStore = new SettingsStore();
