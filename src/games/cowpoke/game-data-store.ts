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
  autoRestart: boolean;
  fastMode: boolean;
  favoredElement: null | "rock" | "paper" | "scissors";
  favoredCombat: null | "attack" | "defend" | "counter";
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
    autoRestart: false,
    fastMode: false,
    favoredElement: null,
    favoredCombat: null,
    lifetimeKills: 0,
    lifetimeFurthestLevelInPlaythrough: 0,
    lifetimeMostKillsInPlaythrough: 0,
    settingsSeenHatIds: [],
    settingsSeenGunIds: [],
  };

  private data: GameData = { ...this.defaultData };

  // eslint-disable-next-line no-restricted-syntax
  constructor() {
    super();

    // Return early during SSR/static generation (need to call super first)
    if (typeof window === "undefined") return;

    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    const savedPlayerName = this.getLocalStorage(
      "cowpokePlayerName",
      this.defaultData.playerName
    );
    const savedAutoMode = this.getLocalStorage(
      "cowpokeAutoMode",
      this.defaultData.autoMode
    );
    const savedAutoRestart = this.getLocalStorage(
      "cowpokeAutoRestart",
      this.defaultData.autoRestart
    );
    const savedFastMode = this.getLocalStorage(
      "cowpokeFastMode",
      this.defaultData.fastMode
    );
    const savedLifetimeKills = this.getLocalStorage(
      "cowpokeLifetimeKills",
      this.defaultData.lifetimeKills
    );
    const savedLifetimeFurthestLevelInPlaythrough = this.getLocalStorage(
      "cowpokeLifetimeFurthestLevelInPlaythrough",
      this.defaultData.lifetimeFurthestLevelInPlaythrough
    );
    const savedLifetimeMostKillsInPlaythrough = this.getLocalStorage(
      "cowpokeLifetimeMostKillsInPlaythrough",
      this.defaultData.lifetimeMostKillsInPlaythrough
    );
    const savedPlayerEquippedHatId = this.getLocalStorage(
      "cowpokePlayerEquippedHatId",
      this.defaultData.playerEquippedHatId
    );
    const savedPlayerEquippedGunId = this.getLocalStorage(
      "cowpokePlayerEquippedGunId",
      this.defaultData.playerEquippedGunId
    );
    const savedPlayerOwnedHatIds = this.getLocalStorage(
      "cowpokePlayerOwnedHatIds",
      this.defaultData.playerOwnedHatIds
    );
    const savedPlayerOwnedGunIds = this.getLocalStorage(
      "cowpokePlayerOwnedGunIds",
      this.defaultData.playerOwnedGunIds
    );
    const savedPermaDamageLevel = this.getLocalStorage(
      "cowpokePlayerPermaDamageLevel",
      this.defaultData.permaDamageLevel
    );
    const savedPermaHealthLevel = this.getLocalStorage(
      "cowpokePlayerPermaHealthLevel",
      this.defaultData.permaHealthLevel
    );
    const savedPermaCombatLevel = this.getLocalStorage(
      "cowpokePlayerPermaCombatLevel",
      this.defaultData.permaCombatLevel
    );
    const savedPermaElementLevel = this.getLocalStorage(
      "cowpokePlayerPermaElementLevel",
      this.defaultData.permaElementLevel
    );
    const savedSettingsSeenHatIds = this.getLocalStorage(
      "cowpokeSettingsSeenHatIds",
      this.defaultData.settingsSeenHatIds
    );
    const savedSettingsSeenGunIds = this.getLocalStorage(
      "cowpokeSettingsSeenGunIds",
      this.defaultData.settingsSeenGunIds
    );

    this.setLocalStorageFields(
      savedPlayerName,
      savedAutoMode,
      savedAutoRestart,
      savedFastMode,
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
    savedAutoMode: boolean,
    savedAutoRestart: boolean,
    savedFastMode: boolean,
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
    this.setAutoMode(savedAutoMode);
    this.setAutoRestart(savedAutoRestart);
    this.setFastMode(savedFastMode);
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
  public setPlayerName(value: string): string {
    this.data.playerName = value;
    this.setLocalStorage("cowpokePlayerName", value);
    this.notify();

    return value;
  }

  public setPlayerLevel(value: number): number {
    this.data.playerLevel = value;
    this.notify();

    return value;
  }

  public setPlayerHealth(value: number): number {
    this.data.playerHealth = value;
    this.notify();

    return value;
  }

  public setPlayerMaxHealth(value: number): number {
    this.data.playerMaxHealth = value;
    this.notify();

    return value;
  }

  public setPlayerXp(value: number): number {
    this.data.playerXp = value;
    this.notify();

    return value;
  }

  public setPlayerMaxXp(value: number): number {
    this.data.playerMaxXp = value;
    this.notify();

    return value;
  }

  public setPlayerUpgradePoints(value: number): number {
    this.data.playerUpgradePoints = value;
    this.notify();

    return value;
  }

  public setPlayerKills(value: number): number {
    this.data.playerKills = value;
    this.notify();

    return value;
  }

  public setPlayerEquippedHatId(value: number): number {
    this.data.playerEquippedHatId = value;
    this.setLocalStorage("cowpokePlayerEquippedHatId", value);
    this.notify();

    return value;
  }

  public setPlayerEquippedGunId(value: number): number {
    this.data.playerEquippedGunId = value;
    this.setLocalStorage("cowpokePlayerEquippedGunId", value);
    this.notify();

    return value;
  }

  public setPlayerOwnedHatIds(value: number[]): number[] {
    this.data.playerOwnedHatIds = value;
    this.setLocalStorage("cowpokePlayerOwnedHatIds", value);
    this.notify();

    return value;
  }

  public setPlayerOwnedGunIds(value: number[]): number[] {
    this.data.playerOwnedGunIds = value;
    this.setLocalStorage("cowpokePlayerOwnedGunIds", value);
    this.notify();

    return value;
  }

  public setPermaDamageLevel(value: number): number {
    this.data.permaDamageLevel = value;
    this.setLocalStorage("cowpokePlayerPermaDamageLevel", value);
    this.notify();

    return value;
  }

  public setPermaHealthLevel(value: number): number {
    this.data.permaHealthLevel = value;
    this.setLocalStorage("cowpokePlayerPermaHealthLevel", value);
    this.notify();

    return value;
  }

  public setPermaCombatLevel(value: number): number {
    this.data.permaCombatLevel = value;
    this.setLocalStorage("cowpokePlayerPermaCombatLevel", value);
    this.notify();

    return value;
  }

  public setPermaElementLevel(value: number): number {
    this.data.permaElementLevel = value;
    this.setLocalStorage("cowpokePlayerPermaElementLevel", value);
    this.notify();

    return value;
  }

  // Enemy methods
  public setEnemyName(value: string): string {
    this.data.enemyName = value;
    this.notify();

    return value;
  }

  public setEnemyLevel(value: number): number {
    this.data.enemyLevel = value;
    this.notify();

    return value;
  }

  public setEnemyHealth(value: number): number {
    this.data.enemyHealth = value;
    this.notify();

    return value;
  }

  public setEnemyMaxHealth(value: number): number {
    this.data.enemyMaxHealth = value;
    this.notify();

    return value;
  }

  public setEnemyXp(value: number): number {
    this.data.enemyXp = value;
    this.notify();

    return value;
  }

  public setEnemyMaxXp(value: number): number {
    this.data.enemyMaxXp = value;
    this.notify();

    return value;
  }

  public setEnemyUpgradePoints(value: number): number {
    this.data.enemyUpgradePoints = value;
    this.notify();

    return value;
  }

  public setEnemyKills(value: number): number {
    this.data.enemyKills = value;
    this.notify();

    return value;
  }

  public setEnemyEquippedHatId(value: number): number {
    // Not saved to localStorage as enemies don't have persistent data
    this.data.enemyEquippedHatId = value;
    this.notify();

    return value;
  }

  public setEnemyEquippedGunId(value: number): number {
    // Not saved to localStorage as enemies don't have persistent data
    this.data.enemyEquippedGunId = value;
    this.notify();

    return value;
  }

  // Game mode methods
  public setAutoMode(value: boolean): boolean {
    this.data.autoMode = value;
    this.setLocalStorage("cowpokeAutoMode", value);
    this.notify();

    return value;
  }

  public setAutoRestart(value: boolean): boolean {
    this.data.autoRestart = value;
    this.setLocalStorage("cowpokeAutoRestart", value);
    this.notify();

    return value;
  }

  public setFastMode(value: boolean): boolean {
    this.data.fastMode = value;
    this.setLocalStorage("cowpokeFastMode", value);
    this.notify();

    return value;
  }

  public setFavoredElement(
    value: null | "rock" | "paper" | "scissors"
  ): null | "rock" | "paper" | "scissors" {
    this.data.favoredElement = value;
    this.notify();

    return value;
  }

  public setFavoredCombat(
    value: null | "attack" | "defend" | "counter"
  ): null | "attack" | "defend" | "counter" {
    this.data.favoredCombat = value;
    this.notify();

    return value;
  }

  // Stats methods
  public setLifetimeKills(value: number): number {
    this.data.lifetimeKills = value;
    this.setLocalStorage("cowpokeLifetimeKills", value);
    this.notify();

    return value;
  }

  public setLifetimeFurthestLevelInPlaythrough(value: number): number {
    this.data.lifetimeFurthestLevelInPlaythrough = value;
    this.setLocalStorage("cowpokeLifetimeFurthestLevelInPlaythrough", value);
    this.notify();

    return value;
  }

  public setLifetimeMostKillsInPlaythrough(value: number): number {
    this.data.lifetimeMostKillsInPlaythrough = value;
    this.setLocalStorage("cowpokeLifetimeMostKillsInPlaythrough", value);
    this.notify();

    return value;
  }

  // Settings seen methods
  public setSettingsSeenHatIds(value: number[]): number[] {
    this.data.settingsSeenHatIds = value;
    this.setLocalStorage("cowpokeSettingsSeenHatIds", value);
    this.notify();

    return value;
  }

  public setSettingsSeenGunIds(value: number[]): number[] {
    this.data.settingsSeenGunIds = value;
    this.setLocalStorage("cowpokeSettingsSeenGunIds", value);
    this.notify();

    return value;
  }

  public resetData() {
    // Reset session data but preserve persistent player data
    this.data = {
      ...this.defaultData,
      playerName: this.data.playerName,
      autoMode: this.data.autoMode,
      autoRestart: this.data.autoRestart,
      fastMode: this.data.fastMode,
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
      this.defaultData.autoMode,
      this.defaultData.autoRestart,
      this.defaultData.fastMode,
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
