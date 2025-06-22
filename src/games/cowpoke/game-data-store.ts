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
  permaCombatLevel: number;
  permaElementLevel: number;
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
  lifetimeFurthestLevelInPlaythrough: number;
  lifetimeMostKillsInPlaythrough: number;
  // Settings seen items
  settingsSeenHatIds: number[];
  settingsSeenGunIds: number[];
}

class GameDataStore extends SyncedStore<GameData> {
  private defaultData: GameData = {
    playerName: "",
    playerLevel: 0,
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
    permaCombatLevel: 0,
    permaElementLevel: 0,
    enemyName: "",
    enemyLevel: 0,
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
    lifetimeFurthestLevelInPlaythrough: 0,
    lifetimeMostKillsInPlaythrough: 0,
    settingsSeenHatIds: [],
    settingsSeenGunIds: [],
  };

  private data: GameData = { ...this.defaultData };

  constructor() {
    super();
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    const savedPlayerName = this.getLocalStorage("cowpokePlayerName", "");
    const savedLifetimeKills = this.getLocalStorage("cowpokeLifetimeKills", 0);
    const savedLifetimeFurthestLevelInPlaythrough = this.getLocalStorage(
      "cowpokeLifetimeFurthestLevelInPlaythrough",
      1
    );
    const savedLifetimeMostKillsInPlaythrough = this.getLocalStorage(
      "cowpokeLifetimeMostKillsInPlaythrough",
      0
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
    const savedPermaCombatLevel = this.getLocalStorage(
      "cowpokePlayerPermaCombatLevel",
      0
    );
    const savedPermaElementLevel = this.getLocalStorage(
      "cowpokePlayerPermaElementLevel",
      0
    );
    const savedSettingsSeenHatIds = this.getLocalStorage(
      "cowpokeSettingsSeenHatIds",
      []
    );
    const savedSettingsSeenGunIds = this.getLocalStorage(
      "cowpokeSettingsSeenGunIds",
      []
    );

    this.setLocalStorageFields(
      savedPlayerName,
      savedLifetimeKills,
      savedLifetimeFurthestLevelInPlaythrough,
      savedLifetimeMostKillsInPlaythrough,
      savedPlayerEquippedHatId,
      savedPlayerEquippedGunId,
      savedPlayerOwnedHatIds,
      savedPlayerOwnedGunIds,
      savedPermaDamageLevel,
      savedPermaHealthLevel,
      savedPermaCombatLevel,
      savedPermaElementLevel,
      savedSettingsSeenHatIds,
      savedSettingsSeenGunIds
    );
  }

  private setLocalStorageFields(
    savedPlayerName: string,
    savedLifetimeKills: number,
    savedLifetimeFurthestLevelInPlaythrough: number,
    savedLifetimeMostKillsInPlaythrough: number,
    savedPlayerEquippedHatId: number,
    savedPlayerEquippedGunId: number,
    savedPlayerOwnedHatIds: number[],
    savedPlayerOwnedGunIds: number[],
    savedPermaDamageLevel: number,
    savedPermaHealthLevel: number,
    savedPermaCombatLevel: number,
    savedPermaElementLevel: number,
    savedSettingsSeenHatIds: number[],
    savedSettingsSeenGunIds: number[]
  ) {
    this.setPlayerName(savedPlayerName);
    this.setLifetimeKills(savedLifetimeKills);
    this.setLifetimeFurthestLevelInPlaythrough(
      savedLifetimeFurthestLevelInPlaythrough
    );
    this.setLifetimeMostKillsInPlaythrough(savedLifetimeMostKillsInPlaythrough);
    this.setPlayerEquippedHatId(savedPlayerEquippedHatId);
    this.setPlayerEquippedGunId(savedPlayerEquippedGunId);
    this.setPlayerOwnedHatIds(savedPlayerOwnedHatIds);
    this.setPlayerOwnedGunIds(savedPlayerOwnedGunIds);
    this.setPermaDamageLevel(savedPermaDamageLevel);
    this.setPermaHealthLevel(savedPermaHealthLevel);
    this.setPermaCombatLevel(savedPermaCombatLevel);
    this.setPermaElementLevel(savedPermaElementLevel);
    this.setSettingsSeenHatIds(savedSettingsSeenHatIds);
    this.setSettingsSeenGunIds(savedSettingsSeenGunIds);
  }

  protected getData(): GameData {
    return { ...this.data };
  }

  // Player methods
  public setPlayerName(value: string) {
    this.data.playerName = value;
    this.setLocalStorage("cowpokePlayerName", value);
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

  public setPermaCombatLevel(value: number) {
    this.data.permaCombatLevel = value;
    this.setLocalStorage("cowpokePlayerPermaCombatLevel", value);
    this.notify();
  }

  public setPermaElementLevel(value: number) {
    this.data.permaElementLevel = value;
    this.setLocalStorage("cowpokePlayerPermaElementLevel", value);
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

  public setLifetimeFurthestLevelInPlaythrough(value: number) {
    this.data.lifetimeFurthestLevelInPlaythrough = value;
    this.setLocalStorage("cowpokeLifetimeFurthestLevelInPlaythrough", value);
    this.notify();
  }

  public setLifetimeMostKillsInPlaythrough(value: number) {
    this.data.lifetimeMostKillsInPlaythrough = value;
    this.setLocalStorage("cowpokeLifetimeMostKillsInPlaythrough", value);
    this.notify();
  }

  // Settings seen methods
  public setSettingsSeenHatIds(value: number[]) {
    this.data.settingsSeenHatIds = value;
    this.setLocalStorage("cowpokeSettingsSeenHatIds", value);
    this.notify();
  }

  public setSettingsSeenGunIds(value: number[]) {
    this.data.settingsSeenGunIds = value;
    this.setLocalStorage("cowpokeSettingsSeenGunIds", value);
    this.notify();
  }

  public resetData() {
    // Reset session data but preserve persistent player data
    this.data = {
      ...this.defaultData,
      playerName: this.data.playerName,
      lifetimeKills: this.data.lifetimeKills,
      lifetimeFurthestLevelInPlaythrough:
        this.data.lifetimeFurthestLevelInPlaythrough,
      lifetimeMostKillsInPlaythrough: this.data.lifetimeMostKillsInPlaythrough,
      playerEquippedHatId: this.data.playerEquippedHatId,
      playerEquippedGunId: this.data.playerEquippedGunId,
      playerOwnedHatIds: this.data.playerOwnedHatIds,
      playerOwnedGunIds: this.data.playerOwnedGunIds,
      permaDamageLevel: this.data.permaDamageLevel,
      permaHealthLevel: this.data.permaHealthLevel,
      permaCombatLevel: this.data.permaCombatLevel,
      permaElementLevel: this.data.permaElementLevel,
      settingsSeenHatIds: this.data.settingsSeenHatIds,
      settingsSeenGunIds: this.data.settingsSeenGunIds,
    };
    this.notify();
  }

  public resetPermanentData() {
    // Reset data
    this.data = {
      ...this.defaultData,
    };

    // Reset all data that writes to localStorage
    this.setLocalStorageFields(
      this.defaultData.playerName,
      this.defaultData.lifetimeKills,
      this.defaultData.lifetimeFurthestLevelInPlaythrough,
      this.defaultData.lifetimeMostKillsInPlaythrough,
      this.defaultData.playerEquippedHatId,
      this.defaultData.playerEquippedGunId,
      this.defaultData.playerOwnedHatIds,
      this.defaultData.playerOwnedGunIds,
      this.defaultData.permaDamageLevel,
      this.defaultData.permaHealthLevel,
      this.defaultData.permaCombatLevel,
      this.defaultData.permaElementLevel,
      this.defaultData.settingsSeenHatIds,
      this.defaultData.settingsSeenGunIds
    );

    this.notify();
  }
}

// Export singleton instance
export const gameDataStore = new GameDataStore();
