import { GameObject } from "@/src/utils/game-object";
import { Vec2 } from "@/src/utils/vector";
import {
  MainGameScene,
  REFERENCE_BKG_SIZE,
} from "@/src/games/cowpoke/scenes/main-game-scene";
import { GUN_LOOT_MAP, HAT_LOOT_MAP, RARITY } from "@/src/games/cowpoke/loot";
import { sendFeedMessage } from "@/src/games/cowpoke/Feed";
import { gameDataStore, GameData } from "@/src/games/cowpoke/game-data-store";

export enum CHARACTER_TYPES {
  UNASSIGNED = -1,
  PLAYER = 0,
  ENEMY = 1,
}

const CHARACTER_KILL_QUIPS: string[] = [
  "You've yee'd yer last haw, partner",
  "This town ain't big enough for the tew of us",
  "Looks like you brought a lasso to a gunfight",
  "Guess you ran outta luck, cowboy",
  "Shoulda stayed on the porch, partner",
  "Hope you said all yer howdys and goodbyes",
  "That's the last tumbleweed you'll chase",
  "You bit the cactus, compadre",
  "You done rode yer last rodeo",
  "You couldn't dodge this bullet, friend",
];

const PLAYER_DIALOG_QUIPS: string[] = [
  "Looks like trouble's brewin' on the horizon",
  "Someone's lookin' to make a name for themselves",
  "Looks like there's a new hat in town",
  "Reckon things just got a bit more interestin'",
  "Better keep yer hand close to yer holster",
];

const ENEMY_DIALOG_QUIPS: string[] = [
  "Well would you look what the tumbleweed dragged in",
  "You best be ready, partner. I'm fixin' to cause some trouble",
  "Ain't no lawman gonna save you now",
  "Time to see who's the fastest draw in these parts",
  "I heard you were tough. Let's see if that's true",
  "You lookin' for a showdown? 'Cause you just found one",
  "Don't blink, or you'll miss yer last sunrise",
  "Hope yer boots are fast, 'cause my bullets are faster",
  "You look nervous, partner. That's a good instinct",
  "Let's see if you can dance when the bullets start flyin'",
];

export class Character extends GameObject {
  private scene: MainGameScene;
  public type: number = CHARACTER_TYPES.UNASSIGNED;

  public name: string = "Character";
  public level: number = 0;
  public upgradePoints: number = 0;
  public health: number = 0;
  public maxHealth: number = 0;
  public xp: number = 0;
  public maxXp: number = 0;
  public elementSelected: string | null = null; // rock, paper, or scissors
  public combatSelected: string | null = null; // attack, defend, or counter
  public kills: number = 0;
  public dead: boolean = false;

  public permanentHealthBonus: number = 0;
  public permanentDamageBonus: number = 0;

  private bounceTime: number = 0;
  private animScaleFactorX: number = 1;
  private animScaleFactorY: number = 1;

  private floatingText?: Phaser.GameObjects.Text;
  private floatingTextTween?: Phaser.Tweens.Tween;
  private visibilityTween?: Phaser.Tweens.Tween;
  private attackTween?: Phaser.Tweens.Tween;

  public bodySprite: Phaser.GameObjects.Sprite | null = null;
  public headSprite: Phaser.GameObjects.Sprite | null = null;
  public hatSprite: Phaser.GameObjects.Sprite | null = null;
  public gunSprite: Phaser.GameObjects.Sprite | null = null;
  public hatStarSprite: Phaser.GameObjects.Sprite | null = null;
  public gunStarSprite: Phaser.GameObjects.Sprite | null = null;

  public equippedHatId: number = 0;
  public ownedHatIds: number[] = [];
  public equippedGunId: number = 0;
  public ownedGunIds: number[] = [];

  constructor(
    scene: MainGameScene,
    screenWidth: number,
    screenHeight: number,
    type: number
  ) {
    // Initialize GameObject with physics, and rigid body
    super("Character", new Vec2(0, 0), true, true);
    this.scene = scene;
    this.type = type;

    // Set the sprites for the character. Each character is a container
    // full of sprites that consists of a body, head, hat, and gun.
    this.graphic = this.scene.add.container(0, 0);

    switch (this.type) {
      case CHARACTER_TYPES.ENEMY:
        this.spawnNewRandomCharacter();
        break;
      case CHARACTER_TYPES.PLAYER:
        this.spawnNewPlayerCharacter();
        break;
      default:
        console.warn(`Character: Unknown character type ${this.type}.`);
    }

    // Update scale at the end of sprite init, since it relies on sprite size etc.
    this.updateScale(); // set the scale here!, not in GameObject

    // Update position etc.
    switch (this.type) {
      case CHARACTER_TYPES.ENEMY:
        this.physicsBody2D!.position.x = screenWidth - 150;
        break;
      case CHARACTER_TYPES.PLAYER:
        this.physicsBody2D!.position.x = 150;
        break;
      default:
        console.warn(`Character: Unknown character type ${this.type}`);
    }
    this.graphic!.setDepth(5);

    // Top of floor is about at 225 px on the unscaled background.
    // Place character just below top of floor.
    this.physicsBody2D!.position.y =
      screenHeight - screenHeight * (100 / REFERENCE_BKG_SIZE.y);

    // Get snapshot of the game data, then load them in and subscribe to changes.
    this.setupSyncedGameData();

    // Subscribe to game data changes
    this.subscribeToEvents();
  }

  setupSyncedGameData() {
    // Get snapshot of the game data, then load them in and subscribe to changes.
    const gameData = gameDataStore.getSnapshot();

    this.setGameDataFromStore(gameData);

    gameDataStore.subscribe(() => {
      const newGameData = gameDataStore.getSnapshot();
      this.handleGameDataChange(newGameData);
    });
  }

  handleGameDataChange = (gameData: GameData) => {
    this.setGameDataFromStore(gameData);
  };

  setGameDataFromStore(gameData: GameData) {
    if (this.type === CHARACTER_TYPES.PLAYER) {
      this.name = gameData.playerName;
      this.level = gameData.playerLevel;
      this.health = gameData.playerHealth;
      this.maxHealth = gameData.playerMaxHealth;
      this.xp = gameData.playerXp;
      this.maxXp = gameData.playerMaxXp;
      this.upgradePoints = gameData.playerUpgradePoints;
      this.kills = gameData.playerKills;
    } else if (this.type === CHARACTER_TYPES.ENEMY) {
      this.name = gameData.enemyName;
      this.level = gameData.enemyLevel;
      this.health = gameData.enemyHealth;
      this.maxHealth = gameData.enemyMaxHealth;
      this.xp = gameData.enemyXp;
      this.maxXp = gameData.enemyMaxXp;
      this.upgradePoints = gameData.enemyUpgradePoints;
      this.kills = gameData.enemyKills;
    }
  }

  subscribeToEvents() {
    document.addEventListener("equipmentChanged", this.handleEquipmentChanged);
    document.addEventListener(
      "permanentUpgradeChanged",
      this.handlePermanentUpgradeChanged
    );
  }

  unsubscribeFromEvents() {
    document.removeEventListener(
      "equipmentChanged",
      this.handleEquipmentChanged
    );
    document.removeEventListener(
      "permanentUpgradeChanged",
      this.handlePermanentUpgradeChanged
    );
  }

  handleWindowResize(newX: number, newY: number) {
    if (newX == null || newY == null) {
      console.warn(
        "obj.handleWindowResize: newX or newY is null. Skipping resize handling."
      );
      return;
    }

    this.updateScale();

    this.physicsBody2D!.position.x = newX;
    this.physicsBody2D!.position.y = newY;
  }

  handleEquipmentChanged = (event: Event) => {
    const customEvent = event as CustomEvent;
    const { type, id } = customEvent.detail;
    if (type === "hat") {
      this.equipHat(id);
    } else if (type === "gun") {
      this.equipGun(id);
    }
  };

  handlePermanentUpgradeChanged = (event: Event) => {
    if (this.type === CHARACTER_TYPES.PLAYER) {
      const customEvent = event as CustomEvent;
      const { type, upgradePointsRemaining } = customEvent.detail;

      if (type === "health") {
        this.permanentHealthBonus += 1;
      } else if (type === "damage") {
        this.permanentDamageBonus += 1;
      }

      // Update upgrade points
      this.upgradePoints = upgradePointsRemaining;
    }
  };

  updateScale() {
    this.scale = this.calculateScale();
  }

  calculateScale(): Vec2 {
    // Scale w/ viewport at same scale as bkg's etc.
    const screenWidth = window.visualViewport?.width || window.innerWidth;
    const screenHeight = window.visualViewport?.height || window.innerHeight;

    let scaleX = screenWidth / REFERENCE_BKG_SIZE.x;
    let scaleY = screenHeight / REFERENCE_BKG_SIZE.y;

    // enemy faces left
    if (this.type === CHARACTER_TYPES.ENEMY) {
      scaleX = Math.abs(scaleX) * -1;
    }

    // Scale the X, Y scale by the animation factor
    scaleX = scaleX * this.animScaleFactorX;
    scaleY = scaleY * this.animScaleFactorY;

    return new Vec2(scaleX, scaleY);
  }

  handleAnims() {
    // This is for animations that are not tweens and are based on the update loop.
    this.handleBounceAnim();
  }

  handleBounceAnim() {
    // Create a subtle bounce anim on a sin wave
    this.bounceTime += 0.05; // Adjust speed as needed
    const minScale = 0.98;
    const maxScale = 1.02;
    const amplitude = (maxScale - minScale) / 2;
    const mid = (maxScale + minScale) / 2;
    this.animScaleFactorY = mid + Math.sin(this.bounceTime) * amplitude;
    this.updateScale();
  }

  updateContainerChildSprite(
    childSprite: Phaser.GameObjects.Sprite | null,
    newSpriteName: string
  ) {
    if (childSprite) {
      (this.graphic as Phaser.GameObjects.Container).remove(childSprite);
      childSprite.destroy();
    }

    childSprite = this.scene.add.sprite(0, 0, newSpriteName);

    // Add back to container
    (this.graphic as Phaser.GameObjects.Container).add(
      childSprite as Phaser.GameObjects.Sprite
    );

    childSprite!.setOrigin(0.5, 1); // bottom middle pivot point

    return childSprite;
  }

  spawnNewPlayerCharacter() {
    // Add body
    this.bodySprite = this.updateContainerChildSprite(
      this.bodySprite,
      "body-default"
    );
    this.bodySprite!.setDepth(6);

    // Add head
    this.headSprite = this.updateContainerChildSprite(
      this.headSprite,
      "head-chill-guy"
    );
    this.headSprite!.setDepth(7);

    // Load in saved state from localStorage
    this.loadGunsAndHats();
    this.loadPermanentUpgrades();

    // Set default name, or load from localStorage if available
    const storedName = localStorage.getItem("cowpokePlayerName");
    if (storedName) {
      this.updateName(storedName);
    } else {
      // If no name is stored, set a default name
      this.updateName("Shaner");
    }

    // Set default hat and gun when new player character is spawned
    this.equipHat(0);
    this.equipGun(0);

    // Set level, this will set max health, xp, etc.
    this.updateLevel(5, true);

    // Setup the character
    this.spawnCharacterSetup();
  }

  spawnNewRandomCharacter() {
    // Add body
    this.bodySprite = this.updateContainerChildSprite(
      this.bodySprite,
      "body-default"
    );
    this.bodySprite!.setDepth(6);

    // Set random head
    const randomHeadSpriteName = this.getRandomSprite(
      "head-",
      this.scene.textures.getTextureKeys(),
      this.scene.random
    );
    this.headSprite = this.updateContainerChildSprite(
      this.headSprite,
      randomHeadSpriteName as string
    );
    this.headSprite!.setDepth(7);

    // Set random hat/gun
    this.equipHat(-1); // -1 means random
    this.equipGun(-1);

    // Set a random level for enemy characters, this will
    // set max health, xp, etc.
    if (this.scene.gameRound < 5) {
      this.updateLevel(this.scene.random.getRandomInt(1, 4), true);
    } else if (this.scene.gameRound < 10) {
      this.updateLevel(this.scene.random.getRandomInt(3, 8), true);
    } else {
      this.updateLevel(
        this.scene.random.getRandomInt(
          this.scene.gameRound - 5,
          this.scene.gameRound
        ),
        true
      );
    }

    // Set a random name for enemy characters
    const randomTitleOptions = [
      "Bandito",
      "Outlaw",
      "Desperado",
      "Gunslinger",
      "Cowpoke",
      "Ranger",
    ];
    const randomTitleIndex = this.scene.random.getRandomInt(
      0,
      randomTitleOptions.length - 1
    );
    const randomNameOptions = ["Bob", "Sally", "Rick", "Dan", "Gus"];
    const randomNameIndex = this.scene.random.getRandomInt(
      0,
      randomNameOptions.length - 1
    );
    this.updateName(
      `${randomTitleOptions[randomTitleIndex]} ${randomNameOptions[randomNameIndex]}`
    );

    // Setup the character
    this.spawnCharacterSetup();
  }

  spawnCharacterSetup() {
    // Set visible since characters are set invisible on death
    this.dead = false;
    this.tweenVisibility();

    // Reset some parameters that can be changed during anims
    this.graphic!.setRotation(0);
    this.graphic!.setAlpha(1);

    // Send a lil dialog on spawn
    sendFeedMessage(
      this.getRandomMsgFromList(
        this.type === CHARACTER_TYPES.PLAYER
          ? PLAYER_DIALOG_QUIPS
          : ENEMY_DIALOG_QUIPS
      ),
      this.name,
      this.getFeedMessageAlignment()
    );
  }

  private loadGunsAndHats() {
    // Read in hats + guns from localStorage if there are any
    const storedHatIds = localStorage.getItem("cowpokeOwnedHatIds");
    if (storedHatIds) {
      this.ownedHatIds = JSON.parse(storedHatIds);
      this.updateOwnedHatsUiAndStorage();
    }

    const storedGunIds = localStorage.getItem("cowpokeOwnedGunIds");
    if (storedGunIds) {
      this.ownedGunIds = JSON.parse(storedGunIds);
      this.updateOwnedGunsUiAndStorage();
    }
  }

  private loadPermanentUpgrades() {
    const savedPermaHealth = localStorage.getItem("cowpoke-perma-health");
    const savedPermaDamage = localStorage.getItem("cowpoke-perma-damage");

    if (savedPermaHealth) {
      const healthLevel = parseInt(savedPermaHealth);
      this.permanentHealthBonus = healthLevel;
    }

    if (savedPermaDamage) {
      const damageLevel = parseInt(savedPermaDamage);
      this.permanentDamageBonus = damageLevel;
    }

    // Refresh health, since permanent upgrades can add health
    this.updateMaxHealth();
  }

  equipHat(id: number) {
    // -1 means randomly select a hat
    if (id === -1) {
      id = this.getIdForRandomLoot(HAT_LOOT_MAP);
    }

    this.hatSprite = this.updateContainerChildSprite(
      this.hatSprite,
      HAT_LOOT_MAP[id].spriteName as string
    );
    this.hatSprite!.setDepth(8);

    if (HAT_LOOT_MAP[id].rarity === RARITY.COMMON) {
      this.hatStarSprite = this.updateContainerChildSprite(
        this.hatStarSprite,
        "rarity-star-1"
      );
    } else if (HAT_LOOT_MAP[id].rarity === RARITY.RARE) {
      this.hatStarSprite = this.updateContainerChildSprite(
        this.hatStarSprite,
        "rarity-star-2"
      );
    } else if (HAT_LOOT_MAP[id].rarity === RARITY.LEGENDARY) {
      this.hatStarSprite = this.updateContainerChildSprite(
        this.hatStarSprite,
        "rarity-star-3"
      );
    }
    this.hatStarSprite!.setDepth(9);

    // Initial position is relative to parent graphic container,
    // which is about 600px tall, but the hat doesnt stretch
    // that far.
    this.hatStarSprite!.x = 0;
    this.hatStarSprite!.y = (-520 / 600) * this.bodySprite!.displayHeight;
    this.hatStarSprite!.setScale(0.7, 0.7);

    this.equippedHatId = id;
    this.addNewOwnedHat(id);

    // Refresh health, since hats can add health
    this.updateMaxHealth();
  }

  equipGun(id: number) {
    // -1 means randomly select a gun
    if (id === -1) {
      id = this.getIdForRandomLoot(GUN_LOOT_MAP);
    }

    this.gunSprite = this.updateContainerChildSprite(
      this.gunSprite,
      GUN_LOOT_MAP[id].spriteName as string
    );
    this.gunSprite!.setDepth(10);

    if (GUN_LOOT_MAP[id].rarity === RARITY.COMMON) {
      this.gunStarSprite = this.updateContainerChildSprite(
        this.gunStarSprite,
        "rarity-star-1"
      );
    } else if (GUN_LOOT_MAP[id].rarity === RARITY.RARE) {
      this.gunStarSprite = this.updateContainerChildSprite(
        this.gunStarSprite,
        "rarity-star-2"
      );
    } else if (GUN_LOOT_MAP[id].rarity === RARITY.LEGENDARY) {
      this.gunStarSprite = this.updateContainerChildSprite(
        this.gunStarSprite,
        "rarity-star-3"
      );
    }
    this.gunStarSprite!.setDepth(11);

    // Initial position is relative to parent graphic container,
    // which is about 600px tall, but the gun is about halfway.
    this.gunStarSprite!.x = (220 / 600) * this.bodySprite!.displayWidth;
    this.gunStarSprite!.y = (-290 / 600) * this.bodySprite!.displayHeight;
    this.gunStarSprite!.setScale(0.6, 0.6);

    this.equippedGunId = id;
    this.addNewOwnedGun(id);

    // Refresh health, since guns can add health
    this.updateMaxHealth();
  }

  getIdForRandomLoot(LOOT_MAP: typeof HAT_LOOT_MAP | typeof GUN_LOOT_MAP) {
    const commonLoot = LOOT_MAP.filter((item) => item.rarity === RARITY.COMMON);
    const rareLoot = LOOT_MAP.filter((item) => item.rarity === RARITY.RARE);
    const legendaryLoot = LOOT_MAP.filter(
      (item) => item.rarity === RARITY.LEGENDARY
    );

    // Set chances for each rarity
    let commonChance = 0;
    let rareChance = 0;
    let legendaryChance = 0;

    if (this.scene.gameRound >= 40) {
      commonChance = 0.7;
      rareChance = 0.2;
      legendaryChance = 0.1;
    } else if (this.scene.gameRound >= 20) {
      commonChance = 0.8;
      rareChance = 0.15;
      legendaryChance = 0.05;
    } else {
      commonChance = 0.86;
      rareChance = 0.12;
      legendaryChance = 0.02;
    }

    // Normalize in case of rounding errors
    const total = commonChance + rareChance + legendaryChance;
    commonChance /= total;
    rareChance /= total;
    legendaryChance /= total;

    const roll = this.scene.random.getRandomFloat(0, 1);

    if (roll < commonChance) {
      // Common
      return commonLoot[
        this.scene.random.getRandomInt(0, commonLoot.length - 1)
      ].id;
    } else if (roll < commonChance + rareChance) {
      // Rare
      return rareLoot[this.scene.random.getRandomInt(0, rareLoot.length - 1)]
        .id;
    } else {
      // Legendary
      return legendaryLoot[
        this.scene.random.getRandomInt(0, legendaryLoot.length - 1)
      ].id;
    }
  }

  getRandomMsgFromList(msgList: string[]) {
    if (msgList.length === 0) {
      console.warn("getRandomMsgFromList: msgList is empty.");
    }

    const randomIndex = this.scene.random.getRandomInt(0, msgList.length - 1);
    return msgList[randomIndex];
  }

  getFeedMessageAlignment() {
    // Player is left, enemy is right
    return this.type === CHARACTER_TYPES.PLAYER ? "left" : "right";
  }

  addNewOwnedHat(id: number) {
    if (!this.ownedHatIds.includes(id)) {
      this.ownedHatIds.push(id);
      this.updateOwnedHatsUiAndStorage();
    }
  }

  updateOwnedHatsUiAndStorage() {
    // Only update player-owned hats
    if (this.type === CHARACTER_TYPES.PLAYER) {
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "cowpokeOwnedHatIds",
          JSON.stringify(this.ownedHatIds)
        );
      }

      // Dispatch event to update owned hats in the game
      document.dispatchEvent(
        new CustomEvent("updateOwnedHats", {
          detail: { ownedHatIds: this.ownedHatIds },
        })
      );
    }
  }

  addNewOwnedGun(id: number) {
    if (!this.ownedGunIds.includes(id)) {
      this.ownedGunIds.push(id);
      this.updateOwnedGunsUiAndStorage();
    }
  }

  updateOwnedGunsUiAndStorage() {
    // Only update player-owned guns
    if (this.type === CHARACTER_TYPES.PLAYER) {
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "cowpokeOwnedGunIds",
          JSON.stringify(this.ownedGunIds)
        );
      }

      // Dispatch event to update owned guns in the game
      document.dispatchEvent(
        new CustomEvent("updateOwnedGuns", {
          detail: { ownedGunIds: this.ownedGunIds },
        })
      );
    }
  }

  getCombatIncreaseFromLoot() {
    // +10% win chance per addCombat bonus from gun and hat
    return (
      0.1 *
      (GUN_LOOT_MAP[this.equippedGunId].addCombat +
        HAT_LOOT_MAP[this.equippedHatId].addCombat)
    );
  }

  getElementIncreaseFromLoot() {
    // +10% win chance per addElement bonus from gun and hat
    return (
      0.1 *
      (GUN_LOOT_MAP[this.equippedGunId].addElement +
        HAT_LOOT_MAP[this.equippedHatId].addElement)
    );
  }

  getDamageAmount() {
    // base dmg + gun and hat bonuses
    const baseDmg = 1 + this.level * 0.6;
    return (
      baseDmg +
      GUN_LOOT_MAP[this.equippedGunId].addDmg +
      HAT_LOOT_MAP[this.equippedHatId].addDmg +
      this.permanentDamageBonus
    );
  }

  attack(otherCharacter: Character, dmgDealt: number) {
    // Play the shoot animation
    if (this.combatSelected === "attack") {
      this.tweenShoot();
    } else if (this.combatSelected === "defend") {
      this.tweenDefend();
    } else if (this.combatSelected === "counter") {
      this.tweenCounter();
    } else {
      console.warn(
        `Character: Unknown combatSelected "${this.combatSelected}" in attack.`
      );
      return;
    }

    // dmg the other character
    otherCharacter!.handleDamage(dmgDealt);
    this.sendAttackMessage(dmgDealt);

    // Handle this character getting a kill
    if (otherCharacter!.health <= 0) {
      this.handleKill(otherCharacter);
    }
  }

  block() {
    // "Block" by temporarily overriding gun sprite to shield
    this.gunSprite = this.updateContainerChildSprite(
      this.gunSprite,
      "shield-block"
    );
  }

  unblock() {
    // "Unblock" by restoring the gun sprite
    this.gunSprite = this.updateContainerChildSprite(
      this.gunSprite,
      GUN_LOOT_MAP[this.equippedGunId].spriteName as string
    );
  }

  sendAttackMessage(dmgValue: number) {
    switch (this.combatSelected) {
      case "attack":
        if (dmgValue > 0) {
          sendFeedMessage(
            "Take that! <b>(+" + dmgValue + " dmg)</b>",
            this!.name,
            this!.type == CHARACTER_TYPES.PLAYER ? "left" : "right"
          );
        } else {
          sendFeedMessage(
            "I musta missed... <b>(0 dmg)</b>",
            this!.name,
            this!.type == CHARACTER_TYPES.PLAYER ? "left" : "right"
          );
        }
        break;
      case "defend":
        if (dmgValue > 0) {
          sendFeedMessage(
            "Feel the wrath of my shield, friend! <b>(+" +
              dmgValue +
              " dmg)</b>",
            this!.name,
            this!.type == CHARACTER_TYPES.PLAYER ? "left" : "right"
          );
        } else {
          sendFeedMessage(
            "I ain't afraid of you! <b>(0 dmg)</b>",
            this!.name,
            this!.type == CHARACTER_TYPES.PLAYER ? "left" : "right"
          );
        }
        break;
      case "counter":
        if (dmgValue > 0) {
          sendFeedMessage(
            "You can't hit me! <b>(+" + dmgValue + " dmg)</b>",
            this!.name,
            this!.type == CHARACTER_TYPES.PLAYER ? "left" : "right"
          );
        } else {
          sendFeedMessage(
            "I musta missed... <b>(0 dmg)</b>",
            this!.name,
            this!.type == CHARACTER_TYPES.PLAYER ? "left" : "right"
          );
        }
        break;
      default:
        console.warn(
          `Unknown attack type "${this.combatSelected}" in sendAttackMessage.`
        );
    }
  }

  handleDamage(damage: number) {
    this.updateHealth(this.health - damage);
    this.showHealDmgFloatingText(-1 * damage);

    this.tweenTakeDamage();

    if (this.health <= 0) {
      this.handleDeath();
    }
  }

  handleHeal(healthAdded: number) {
    // Only heal if health is not already at max
    if (this.health !== this.maxHealth) {
      this.updateHealth(this.health + healthAdded);
      this.showHealDmgFloatingText(healthAdded);
    }
  }

  showHealDmgFloatingText(healthChangeAmount: number) {
    // Init the text object if it doesn't exist yet
    if (!this.floatingText) {
      this.floatingText = this.scene.add
        .text(0, 0, "", {
          font: "bold 36px Arial",
          color: "#fff",
          align: "center",
        })
        .setOrigin(0.5, 1); // bottom middle pivot point
      (this.graphic as Phaser.GameObjects.Container).add(this.floatingText!);
    }

    // Set green +health or red -health text
    this.floatingText!.setText(
      `${healthChangeAmount > 0 ? "+" : "-"}${Math.abs(healthChangeAmount)}`
    );
    this.floatingText!.setColor(healthChangeAmount > 0 ? "#10b981" : "#ef4444");

    // Play animation for the floating text
    this.tweenFloatingText();
  }

  updateName(newName: string) {
    if (newName.length === 0) {
      newName = "Shaner";
    }

    if (this.type === CHARACTER_TYPES.PLAYER) {
      gameDataStore.setPlayerName(newName);
    } else if (this.type === CHARACTER_TYPES.ENEMY) {
      gameDataStore.setEnemyName(newName);
    }
  }

  updateHealth(newHealth: number) {
    if (newHealth < 0) {
      newHealth = 0;
    } else if (newHealth > this.maxHealth) {
      newHealth = this.maxHealth;
    }

    // Ensure health is an int
    newHealth = Math.round(newHealth);

    if (this.type === CHARACTER_TYPES.PLAYER) {
      gameDataStore.setPlayerHealth(newHealth);
    } else if (this.type === CHARACTER_TYPES.ENEMY) {
      gameDataStore.setEnemyHealth(newHealth);
    }
  }

  updateMaxHealth() {
    let newMaxHealth = 10 + this.level * 1.2 + this.permanentHealthBonus;

    newMaxHealth +=
      HAT_LOOT_MAP[this.equippedHatId].addHealth +
      GUN_LOOT_MAP[this.equippedGunId].addHealth;

    // Ensure max health is an int
    newMaxHealth = Math.round(newMaxHealth);

    if (this.type === CHARACTER_TYPES.PLAYER) {
      gameDataStore.setPlayerMaxHealth(newMaxHealth);
    } else if (this.type === CHARACTER_TYPES.ENEMY) {
      gameDataStore.setEnemyMaxHealth(newMaxHealth);
    }
  }

  updateLevel(newLevel: number, skipMsg: boolean = false) {
    if (newLevel < 0) {
      newLevel = 0;
    }

    if (this.type === CHARACTER_TYPES.PLAYER) {
      gameDataStore.setPlayerLevel(newLevel);
    } else if (this.type === CHARACTER_TYPES.ENEMY) {
      gameDataStore.setEnemyLevel(newLevel);
    }

    if (this.type === CHARACTER_TYPES.PLAYER) {
      gameDataStore.setPlayerUpgradePoints(this.upgradePoints + 1);
    } else if (this.type === CHARACTER_TYPES.ENEMY) {
      gameDataStore.setEnemyUpgradePoints(this.upgradePoints + 1);
    }

    // Update max health on level up, then restore health
    this.updateMaxHealth();
    this.handleHeal(this.maxHealth - this.health); // Restore health to max

    // Reset xp on level up, and add to max xp
    this.updateMaxXp();
    this.updateXp(0);

    // Send a level up message
    if (!skipMsg) {
      sendFeedMessage(
        "Good goin', son. You've reached level " + this.level,
        "Cowpoke Jack's Ghost",
        "center"
      );
    }
  }

  updateXp(newXp: number) {
    if (newXp < 0) {
      newXp = 0;
    }

    if (this.type === CHARACTER_TYPES.PLAYER) {
      gameDataStore.setPlayerXp(newXp);
    } else if (this.type === CHARACTER_TYPES.ENEMY) {
      gameDataStore.setEnemyXp(newXp);
    }

    // Level up!
    if (this.xp >= this.maxXp) {
      this.updateLevel(this.level + 1);
    }
  }

  updateMaxXp() {
    const newMaxXp = 10 + this.level * 2;

    if (this.type === CHARACTER_TYPES.PLAYER) {
      gameDataStore.setPlayerMaxXp(newMaxXp);
    } else if (this.type === CHARACTER_TYPES.ENEMY) {
      gameDataStore.setEnemyMaxXp(newMaxXp);
    }
  }

  handleKill(otherCharacter: Character) {
    if (this.type === CHARACTER_TYPES.PLAYER) {
      gameDataStore.setPlayerKills((this.kills += 1));

      const addXp = Math.floor(otherCharacter.level * 1.2);

      // Player says a quip when killing enemy
      sendFeedMessage(
        this.getRandomMsgFromList(CHARACTER_KILL_QUIPS) +
          ` <b>(+${addXp} XP)</b>`,
        this.name,
        this.getFeedMessageAlignment()
      );

      // Gain xp
      this.updateXp(this.xp + addXp);

      // 50/50 chance to try to drop either gun or hat
      if (this.scene.random.getRandomFloat(0, 1) < 0.5) {
        // Random chance to get enemy's gun
        let gunDropOdds = 0.2;
        if (GUN_LOOT_MAP[otherCharacter.equippedGunId].rarity === RARITY.RARE) {
          gunDropOdds = 0.1;
        } else if (
          GUN_LOOT_MAP[otherCharacter.equippedGunId].rarity === RARITY.LEGENDARY
        ) {
          gunDropOdds = 0.05;
        }

        if (this.scene.random.getRandomFloat(0, 1) < gunDropOdds) {
          // Only drop if player doesn't already own it
          if (!this.ownedGunIds.includes(otherCharacter.equippedGunId)) {
            sendFeedMessage(
              `Look's like that foe dropped <b>${
                GUN_LOOT_MAP[otherCharacter.equippedGunId].name
              }</b>!`,
              "Cowpoke Jack's Ghost",
              "center"
            );

            this.addNewOwnedGun(otherCharacter.equippedGunId);
          }
        }
      } else {
        // Random chance to get enemy's hat
        let hatDropOdds = 0.2;
        if (HAT_LOOT_MAP[otherCharacter.equippedHatId].rarity === RARITY.RARE) {
          hatDropOdds = 0.1;
        } else if (
          HAT_LOOT_MAP[otherCharacter.equippedHatId].rarity === RARITY.LEGENDARY
        ) {
          hatDropOdds = 0.05;
        }

        if (this.scene.random.getRandomFloat(0, 1) < hatDropOdds) {
          // Only drop if player doesn't already own it
          if (!this.ownedHatIds.includes(otherCharacter.equippedHatId)) {
            sendFeedMessage(
              `Look's like that foe dropped <b>${
                HAT_LOOT_MAP[otherCharacter.equippedHatId].name
              }</b>!`,
              "Cowpoke Jack's Ghost",
              "center"
            );

            this.addNewOwnedHat(otherCharacter.equippedHatId);
          }
        }
      }
    } else {
      gameDataStore.setEnemyKills((this.kills += 1));

      // Enemy says a quip when killing player
      sendFeedMessage(
        this.getRandomMsgFromList(CHARACTER_KILL_QUIPS),
        this.name,
        this.getFeedMessageAlignment()
      );
    }
  }

  handleDeath() {
    this.dead = true;
    this.tweenInvisibility();
  }

  tweenShoot() {
    // play a tween for rotation that goes from 0 to -20 degrees, or 0 to 20 for enemey
    const rotationAngle = this.type === CHARACTER_TYPES.PLAYER ? -20 : 20;

    if (this.attackTween) {
      this.attackTween.stop();
    }

    this.attackTween = this.scene.tweens.add({
      targets: this.graphic,
      rotation: rotationAngle * (Math.PI / 180),
      duration: this.scene.combatDuration / 2,
      ease: "Cubic.easeInOut",
      yoyo: true, // Go back to original rotation
    });
  }

  tweenDefend() {
    // play a tween for rotation that goes from 0 to -10 degrees, or 0 to 10 for enemy
    const rotationAngle = this.type === CHARACTER_TYPES.PLAYER ? -10 : 10;
    if (this.attackTween) {
      this.attackTween.stop();
    }

    this.attackTween = this.scene.tweens.add({
      targets: this.graphic,
      rotation: rotationAngle * (Math.PI / 180),
      duration: this.scene.combatDuration / 2,
      ease: "Cubic.easeInOut",
      yoyo: true, // Go back to original rotation
      onComplete: () => {
        this.unblock(); // Restore gun sprite after defend
      },
    });
  }

  tweenCounter() {
    // Tween animScaleFactorX from -1 to 1 for a flip effect...
    // See updateScale() to see where this is used. This is needed because
    // scale is already being set / modified in updateScale()
    if (this.attackTween) {
      this.attackTween.stop();
    }

    this.attackTween = this.scene.tweens.add({
      targets: this,
      animScaleFactorX: -1,
      duration: this.scene.combatDuration / 2,
      ease: "Cubic.easeInOut",
      yoyo: true, // Go back to original animScaleFactorX (1)
      onUpdate: () => {
        this.updateScale();
      },
    });
  }

  tweenVisibility() {
    // Set visible, then tween opacity to 1
    this.graphic!.setAlpha(0); // Start invisible for fade-in effect
    this.graphic!.setVisible(true);

    if (this.visibilityTween) {
      this.visibilityTween.stop();
    }

    this.visibilityTween = this.scene.tweens.add({
      targets: this.graphic,
      alpha: 1,
      duration: this.scene.combatDuration,
      ease: "Cubic.easeOut",
    });
  }

  tweenInvisibility() {
    // Tween opacity to 0, then set invisible
    this.graphic!.setAlpha(1);
    this.graphic!.setVisible(true);

    if (this.visibilityTween) {
      this.visibilityTween.stop();
    }

    this.visibilityTween = this.scene.tweens.add({
      targets: this.graphic,
      alpha: 0,
      duration: this.scene.combatDuration,
      ease: "Cubic.easeOut",
      onComplete: () => {
        this.graphic!.setVisible(false);
      },
    });
  }

  tweenTakeDamage() {
    // Flash the character to indicate damage taken
    this.graphic!.setAlpha(1);

    if (this.visibilityTween) {
      this.visibilityTween.stop();
    }

    this.visibilityTween = this.scene.tweens.add({
      targets: this.graphic,
      alpha: 0.5,
      duration: this.scene.combatDuration / 4,
      ease: "Power2.easeOut",
      yoyo: true,
    });
  }

  tweenFloatingText() {
    // Init pos, scale, and alpha before tweening
    this.floatingText!.setAlpha(1);
    this.floatingText!.setScale(
      // Flip text on enemy across x
      this.type === CHARACTER_TYPES.PLAYER ? 1.2 : -1.2,
      1.2
    );
    this.floatingText!.y = -1 * this.bodySprite!.displayHeight * 1.05;
    this.floatingText!.setVisible(true);

    // Animate: grow, shrink, then fade out
    if (this.floatingTextTween) {
      this.floatingTextTween.stop();
    }

    this.floatingTextTween = this.scene.tweens.add({
      targets: this.floatingText,
      // Flip text on enemy across x
      scaleX: this.type === CHARACTER_TYPES.PLAYER ? 1 : -1,
      scaleY: 1,
      alpha: 0,
      y: this.floatingText!.y * 1.05,
      duration: this.scene.combatDuration * 2,
      ease: "Cubic.easeOut",
      onComplete: () => {
        this.floatingText?.setVisible(false);
      },
    });
  }

  destroy() {
    super.destroy();

    // Unsubscribe from events
    this.unsubscribeFromEvents();
  }
}
