import { SyncedStore } from "@/src/utils/synced-store";

export interface GameData {
  // Character data
  playerName: string;
  playerLevel: number;
  playerHealth: number;
  playerMaxHealth: number;
  playerXp: number;
  playerMaxXp: number;
  playerUpgradePoints: number;
  playerKills: number;
  playerEquippedHatId: number;
  playerEquippedGunId: number;
  playerOwnedHatIds: number[];
  playerOwnedGunIds: number[];
  permaDamageLevel: number;
  permaHealthLevel: number;
  enemyName: string;
  enemyLevel: number;
  enemyHealth: number;
  enemyMaxHealth: number;
  enemyXp: number;
  enemyMaxXp: number;
  enemyUpgradePoints: number;
  enemyKills: number;
  enemyEquippedHatId: number;
  enemyEquippedGunId: number;
  // Game modes
  autoMode: boolean;
  fastMode: boolean;
  // Player stats
  lifetimeKills: number;
  lifetimeFurthestLevel: number;
}

class GameDataStore extends SyncedStore<GameData> {
  private defaultData: GameData = {
    playerName: "Cowpoke",
    playerLevel: 1,
    playerHealth: 0,
    playerMaxHealth: 0,
    playerXp: 0,
    playerMaxXp: 0,
    playerUpgradePoints: 0,
    playerKills: 0,
    playerEquippedHatId: 0,
    playerEquippedGunId: 0,
    playerOwnedHatIds: [0],
    playerOwnedGunIds: [0],
    permaDamageLevel: 0,
    permaHealthLevel: 0,
    enemyName: "Bandit",
    enemyLevel: 1,
    enemyHealth: 0,
    enemyMaxHealth: 0,
    enemyXp: 0,
    enemyMaxXp: 0,
    enemyUpgradePoints: 0,
    enemyKills: 0,
    enemyEquippedHatId: 0,
    enemyEquippedGunId: 0,
    autoMode: false,
    fastMode: false,
    lifetimeKills: 0,
    lifetimeFurthestLevel: 1,
  };

  private data: GameData = { ...this.defaultData };

  constructor() {
    super();
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    const savedLifetimeKills = this.getLocalStorage("cowpokeLifetimeKills", 0);
    const savedLifetimeFurthestLevel = this.getLocalStorage(
      "cowpokeLifetimeFurthestLevel",
      1
    );
    const savedPlayerEquippedHatId = this.getLocalStorage(
      "cowpokePlayerEquippedHatId",
      0
    );
    const savedPlayerEquippedGunId = this.getLocalStorage(
      "cowpokePlayerEquippedGunId",
      0
    );
    const savedPlayerOwnedHatIds = this.getLocalStorage(
      "cowpokePlayerOwnedHatIds",
      [0]
    );
    const savedPlayerOwnedGunIds = this.getLocalStorage(
      "cowpokePlayerOwnedGunIds",
      [0]
    );
    const savedPermaDamageLevel = this.getLocalStorage(
      "cowpokePlayerPermaDamageLevel",
      0
    );
    const savedPermaHealthLevel = this.getLocalStorage(
      "cowpokePlayerPermaHealthLevel",
      0
    );

    this.setLifetimeKills(savedLifetimeKills);
    this.setLifetimeFurthestLevel(savedLifetimeFurthestLevel);
    this.setPlayerEquippedHatId(savedPlayerEquippedHatId);
    this.setPlayerEquippedGunId(savedPlayerEquippedGunId);
    this.setPlayerOwnedHatIds(savedPlayerOwnedHatIds);
    this.setPlayerOwnedGunIds(savedPlayerOwnedGunIds);
    this.setPermaDamageLevel(savedPermaDamageLevel);
    this.setPermaHealthLevel(savedPermaHealthLevel);
  }

  protected getData(): GameData {
    return { ...this.data };
  }

  // Player methods
  public setPlayerName(value: string) {
    this.data.playerName = value;
    this.notify();
  }

  public setPlayerLevel(value: number) {
    this.data.playerLevel = value;
    this.notify();
  }

  public setPlayerHealth(value: number) {
    this.data.playerHealth = value;
    this.notify();
  }

  public setPlayerMaxHealth(value: number) {
    this.data.playerMaxHealth = value;
    this.notify();
  }

  public setPlayerXp(value: number) {
    this.data.playerXp = value;
    this.notify();
  }

  public setPlayerMaxXp(value: number) {
    this.data.playerMaxXp = value;
    this.notify();
  }

  public setPlayerUpgradePoints(value: number) {
    this.data.playerUpgradePoints = value;
    this.notify();
  }

  public setPlayerKills(value: number) {
    this.data.playerKills = value;
    this.notify();
  }

  public setPlayerEquippedHatId(value: number) {
    this.data.playerEquippedHatId = value;
    this.setLocalStorage("cowpokePlayerEquippedHatId", value);
    this.notify();
  }

  public setPlayerEquippedGunId(value: number) {
    this.data.playerEquippedGunId = value;
    this.setLocalStorage("cowpokePlayerEquippedGunId", value);
    this.notify();
  }

  public setPlayerOwnedHatIds(value: number[]) {
    this.data.playerOwnedHatIds = value;
    this.setLocalStorage("cowpokePlayerOwnedHatIds", value);
    this.notify();
  }

  public setPlayerOwnedGunIds(value: number[]) {
    this.data.playerOwnedGunIds = value;
    this.setLocalStorage("cowpokePlayerOwnedGunIds", value);
    this.notify();
  }

  public setPermaDamageLevel(value: number) {
    this.data.permaDamageLevel = value;
    this.setLocalStorage("cowpokePlayerPermaDamageLevel", value);
    this.notify();
  }

  public setPermaHealthLevel(value: number) {
    this.data.permaHealthLevel = value;
    this.setLocalStorage("cowpokePlayerPermaHealthLevel", value);
    this.notify();
  }

  // Enemy methods
  public setEnemyName(value: string) {
    this.data.enemyName = value;
    this.notify();
  }

  public setEnemyLevel(value: number) {
    this.data.enemyLevel = value;
    this.notify();
  }

  public setEnemyHealth(value: number) {
    this.data.enemyHealth = value;
    this.notify();
  }

  public setEnemyMaxHealth(value: number) {
    this.data.enemyMaxHealth = value;
    this.notify();
  }

  public setEnemyXp(value: number) {
    this.data.enemyXp = value;
    this.notify();
  }

  public setEnemyMaxXp(value: number) {
    this.data.enemyMaxXp = value;
    this.notify();
  }

  public setEnemyUpgradePoints(value: number) {
    this.data.enemyUpgradePoints = value;
    this.notify();
  }

  public setEnemyKills(value: number) {
    this.data.enemyKills = value;
    this.notify();
  }

  public setEnemyEquippedHatId(value: number) {
    // Not saved to localStorage as enemies don't have persistent data
    this.data.enemyEquippedHatId = value;
    this.notify();
  }

  public setEnemyEquippedGunId(value: number) {
    // Not saved to localStorage as enemies don't have persistent data
    this.data.enemyEquippedGunId = value;
    this.notify();
  }

  // Game mode methods
  public setAutoMode(value: boolean) {
    this.data.autoMode = value;
    this.notify();
  }

  public setFastMode(value: boolean) {
    this.data.fastMode = value;
    this.notify();
  }

  // Stats methods
  public setLifetimeKills(value: number) {
    this.data.lifetimeKills = value;
    this.setLocalStorage("cowpokeLifetimeKills", value);
    this.notify();
  }

  public setLifetimeFurthestLevel(value: number) {
    this.data.lifetimeFurthestLevel = value;
    this.setLocalStorage("cowpokeLifetimeFurthestLevel", value);
    this.notify();
  }

  public resetData() {
    // Reset session data but preserve persistent player data
    this.data = {
      ...this.defaultData,
      lifetimeKills: this.data.lifetimeKills,
      lifetimeFurthestLevel: this.data.lifetimeFurthestLevel,
      playerEquippedHatId: this.data.playerEquippedHatId,
      playerEquippedGunId: this.data.playerEquippedGunId,
      playerOwnedHatIds: this.data.playerOwnedHatIds,
      playerOwnedGunIds: this.data.playerOwnedGunIds,
      permaDamageLevel: this.data.permaDamageLevel,
      permaHealthLevel: this.data.permaHealthLevel,
    };
    this.notify();
  }
}

// Export singleton instance
export const gameDataStore = new GameDataStore();
