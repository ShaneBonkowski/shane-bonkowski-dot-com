import { SyncedStore } from "@/src/utils/synced-store";

export interface Settings {
  updateInterval: number;
  underpopulation: number;
  overpopulation: number;
  reproduction: number;
  colorTheme: number;
  autoPause: boolean;
  infiniteEdges: boolean;
  diagonalNeighbors: boolean;
}

class SettingsStore extends SyncedStore<Settings> {
  private defaultData: Settings = {
    updateInterval: 200,
    underpopulation: 2,
    overpopulation: 3,
    reproduction: 3,
    colorTheme: 0,
    autoPause: true,
    infiniteEdges: true,
    diagonalNeighbors: true,
  };

  private data: Settings = { ...this.defaultData };

  // eslint-disable-next-line no-restricted-syntax
  constructor() {
    super();

    // Return early during SSR/static generation (need to call super first)
    if (typeof window === "undefined") return;

    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    const savedColorTheme = this.getLocalStorage(
      "gameOfLifeColorTheme",
      this.defaultData.colorTheme
    );
    this.setColorTheme(savedColorTheme);
  }

  protected getData(): Settings {
    return { ...this.data };
  }

  public setUpdateInterval(value: number): number {
    this.data.updateInterval = value;
    this.notify();

    return value;
  }

  public setUnderpopulation(value: number): number {
    this.data.underpopulation = value;
    this.notify();

    return value;
  }

  public setOverpopulation(value: number): number {
    this.data.overpopulation = value;
    this.notify();

    return value;
  }

  public setReproduction(value: number): number {
    this.data.reproduction = value;
    this.notify();

    return value;
  }

  public setColorTheme(value: number): number {
    this.data.colorTheme = value;
    this.setLocalStorage("gameOfLifeColorTheme", value);
    this.notify();

    return value;
  }

  public setAutoPause(value: boolean): boolean {
    this.data.autoPause = value;
    this.notify();

    return value;
  }

  public setInfiniteEdges(value: boolean): boolean {
    this.data.infiniteEdges = value;
    this.notify();

    return value;
  }

  public setDiagonalNeighbors(value: boolean): boolean {
    this.data.diagonalNeighbors = value;
    this.notify();

    return value;
  }

  public resetData() {
    // Reset to base defaults
    this.data = { ...this.defaultData };

    // Override to local storage defaults
    this.loadFromLocalStorage();

    this.notify();
  }
}

// Export singleton instance
export const settingsStore = new SettingsStore();
