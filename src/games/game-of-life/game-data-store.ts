import { SyncedStore } from "@/src/utils/synced-store";

export interface GameData {
  population: number;
  generation: number;
  paused: boolean;
  autoPlayMode: boolean;
  discoMode: boolean;
}

class GameDataStore extends SyncedStore<GameData> {
  private defaultData: GameData = {
    population: 0,
    generation: 0,
    paused: true,
    autoPlayMode: false,
    discoMode: false,
  };

  private data: GameData = { ...this.defaultData };

  // eslint-disable-next-line no-restricted-syntax
  constructor() {
    super();

    // Return early during SSR/static generation (need to call super first)
    if (typeof window === "undefined") return;
  }

  protected getData(): GameData {
    return { ...this.data };
  }

  public setPopulation(value: number): number {
    this.data.population = value;
    this.notify();

    return value;
  }

  public setGeneration(value: number): number {
    this.data.generation = value;
    this.notify();

    return value;
  }

  public setPaused(value: boolean): boolean {
    this.data.paused = value;
    this.notify();

    return value;
  }

  public setAutoPlayMode(value: boolean): boolean {
    this.data.autoPlayMode = value;
    this.notify();

    return value;
  }

  public setDiscoMode(value: boolean): boolean {
    this.data.discoMode = value;
    this.notify();

    return value;
  }

  public resetData() {
    this.data = { ...this.defaultData };
    this.notify();
  }
}

// Export singleton instance
export const gameDataStore = new GameDataStore();
