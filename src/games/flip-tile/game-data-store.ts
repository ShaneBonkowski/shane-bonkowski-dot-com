import { SyncedStore } from "@/src/utils/synced-store";

export interface GameData {
  score: number;
  solutionRevealed: boolean;
}

class GameDataStore extends SyncedStore<GameData> {
  private defaultData: GameData = {
    score: 0,
    solutionRevealed: false,
  };

  private data: GameData = { ...this.defaultData };

  // eslint-disable-next-line no-restricted-syntax
  constructor() {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    super();
  }

  protected getData(): GameData {
    return { ...this.data };
  }

  public setScore(value: number) {
    this.data.score = value;
    this.notify();
  }

  public setSolutionRevealed(value: boolean) {
    this.data.solutionRevealed = value;
    this.notify();
  }

  public resetData() {
    this.data = { ...this.defaultData };
    this.notify();
  }
}

// Export singleton instance
export const gameDataStore = new GameDataStore();
