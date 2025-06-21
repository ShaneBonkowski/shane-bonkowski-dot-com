import { SyncedStore } from "@/src/utils/synced-store";

export interface GameData {
  population: number;
  generation: number;
}

class GameDataStore extends SyncedStore<GameData> {
  private defaultData: GameData = {
    population: 0,
    generation: 0,
  };

  private data: GameData = { ...this.defaultData };

  constructor() {
    super();
  }

  protected getData(): GameData {
    return { ...this.data };
  }

  public setPopulation(value: number) {
    this.data.population = value;
    this.notify();
  }

  public setGeneration(value: number) {
    this.data.generation = value;
    this.notify();
  }

  public resetData() {
    this.data = { ...this.defaultData };
    this.notify();
  }
}

// Export singleton instance
export const gameDataStore = new GameDataStore();
