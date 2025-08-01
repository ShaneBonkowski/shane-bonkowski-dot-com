import { SyncedStore } from "@/src/utils/synced-store";

export interface GameData {
  score: number;
}

class GameDataStore extends SyncedStore<GameData> {
  private defaultData: GameData = {
    score: 0,
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

  public setScore(value: number): number {
    this.data.score = value;
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
