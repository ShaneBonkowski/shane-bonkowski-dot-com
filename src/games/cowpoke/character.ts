import { GameObject } from "@/src/utils/game-object";
import { Vec2 } from "@/src/utils/vector";
import { MainGameScene } from "@/src/games/cowpoke/scenes/main-game-scene";
import { GUN_LOOT_MAP, HAT_LOOT_MAP, RARITY } from "@/src/games/cowpoke/loot";

export const CHARACTER_TYPES = {
  UNASSIGNED: -1,
  PLAYER: 0,
  ENEMY: 1,
};

export class Character extends GameObject {
  private scene: MainGameScene;
  public type: number = CHARACTER_TYPES.UNASSIGNED;

  public level: number = 0;
  public bodySprite: Phaser.GameObjects.Sprite | null = null;
  public headSprite: Phaser.GameObjects.Sprite | null = null;
  public hatSprite: Phaser.GameObjects.Sprite | null = null;
  public gunSprite: Phaser.GameObjects.Sprite | null = null;

  public equippedHatId: number = 0;
  public ownedHatIds: number[] = [];

  public equippedGunId: number = 0;
  public ownedGunIds: number[] = [];

  constructor(
    scene: MainGameScene,
    spawnX: number,
    screenHeight: number,
    type: number
  ) {
    // Initialize GameObject with physics, and rigid body
    super("Character", new Vec2(0, 0), true, true);
    this.updateSize(); // set the size here!, not in GameObject

    this.scene = scene;
    this.type = type;

    // Set the sprites for the character. Each character is a container
    // full of sprites that consists of a body, head, hat, and gun.
    this.graphic = this.scene.add.container(0, 0);

    this.physicsBody2D!.position.x = spawnX;
    switch (this.type) {
      case CHARACTER_TYPES.ENEMY:
        this.spawnNewRandomCharacter();
        this.graphic!.setDepth(4);
        this.physicsBody2D!.position.y = screenHeight / 2 - this.size.y;
        break;
      case CHARACTER_TYPES.PLAYER:
        this.spawnNewPlayerCharacter();
        this.graphic!.setDepth(5);
        this.physicsBody2D!.position.y = screenHeight / 2 - this.size.y;
        break;
      default:
        console.warn(
          `Character: Unknown character type ${this.type}. Defaulting to depth 5.`
        );
        this.graphic!.setDepth(5);
    }

    // Assemble the character graphic
    (this.graphic as Phaser.GameObjects.Container).add([
      this.bodySprite as Phaser.GameObjects.Sprite,
      this.headSprite as Phaser.GameObjects.Sprite,
      this.hatSprite as Phaser.GameObjects.Sprite,
      this.gunSprite as Phaser.GameObjects.Sprite,
    ]);

    this.subscribeToEvents();
  }

  subscribeToEvents() {}

  unsubscribeFromEvents() {}

  handleWindowResize(newX: number, newY: number) {
    if (newX == null || newY == null) {
      console.warn(
        "obj.handleWindowResize: newX or newY is null. Skipping resize handling."
      );
      return;
    }

    this.updateSize();

    this.physicsBody2D!.position.x = newX;
    this.physicsBody2D!.position.y = newY;
  }

  updateSize() {
    this.size = this.calculateSize();
  }

  calculateSize(): Vec2 {
    // Calculate the size based on the screen width
    let newSize = (window.visualViewport?.height || window.innerHeight) * 0.07;
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;

    // Phone screen has larger objects
    if (
      (window.visualViewport?.width || window.innerWidth) <= 600 ||
      isPortrait
    ) {
      newSize = (window.visualViewport?.height || window.innerHeight) * 0.05;
    }

    return new Vec2(newSize, newSize);
  }

  handleMoving() {
    // No movement logic for characters... yet
  }

  spawnNewPlayerCharacter() {
    if (!this.bodySprite) {
      this.bodySprite = this.scene.add.sprite(0, 0, "body-default");
    } else {
      this.bodySprite.destroy();
      this.bodySprite = this.scene.add.sprite(0, 0, "body-default");
    }
    this.bodySprite!.setOrigin(0.5, 0.5);

    if (!this.headSprite) {
      this.headSprite = this.scene.add.sprite(0, 0, "head-chill-guy");
    } else {
      this.headSprite.destroy();
      this.headSprite = this.scene.add.sprite(0, 0, "head-chill-guy");
    }
    this.headSprite!.setOrigin(0.5, 0.5);

    // Set default hat and gun when new player character is spawned
    this.equipHat(0);
    this.equipGun(0);

    this.level = 1;
  }

  spawnNewRandomCharacter() {
    if (!this.bodySprite) {
      this.bodySprite = this.scene.add.sprite(0, 0, "body-default");
    } else {
      this.bodySprite.destroy();
      this.bodySprite = this.scene.add.sprite(0, 0, "body-default");
    }
    this.bodySprite!.setOrigin(0.5, 0.5);

    // Set random head
    const randomHeadSpriteName = this.getRandomSprite(
      "head-",
      this.scene.textures.getTextureKeys(),
      this.scene.random
    );
    if (randomHeadSpriteName != null) {
      if (!this.headSprite) {
        this.headSprite = this.scene.add.sprite(0, 0, randomHeadSpriteName);
      } else {
        this.headSprite.destroy();
        this.headSprite = this.scene.add.sprite(0, 0, randomHeadSpriteName);
      }
    }
    this.headSprite!.setOrigin(0.5, 0.5);

    // Set random hat/gun
    this.equipHat(-1); // -1 means random
    this.equipGun(-1);

    // Set a random level for enemy characters
    if (this.scene.gameRound < 5) {
      this.level = this.scene.random.getRandomInt(1, 4);
    } else if (this.scene.gameRound < 10) {
      this.level = this.scene.random.getRandomInt(3, 8);
    } else {
      this.level = this.scene.random.getRandomInt(
        this.scene.gameRound - 5,
        this.scene.gameRound
      );
    }
  }

  equipHat(id: number) {
    // -1 means randomly select a hat
    if (id === -1) {
      id = this.getIdForRandomLoot(HAT_LOOT_MAP);
    }

    if (!this.hatSprite) {
      this.hatSprite = this.scene.add.sprite(0, 0, HAT_LOOT_MAP[id].spriteName);
    } else {
      this.hatSprite.destroy();
      this.hatSprite = this.scene.add.sprite(0, 0, HAT_LOOT_MAP[id].spriteName);
    }
    this.hatSprite!.setOrigin(0.5, 0.5);

    this.equippedHatId = id;
    this.addNewOwnedHat(id);
  }

  equipGun(id: number) {
    // -1 means randomly select a gun
    if (id === -1) {
      id = this.getIdForRandomLoot(GUN_LOOT_MAP);
    }

    if (!this.gunSprite) {
      this.gunSprite = this.scene.add.sprite(0, 0, GUN_LOOT_MAP[id].spriteName);
    } else {
      this.gunSprite.destroy();
      this.gunSprite = this.scene.add.sprite(0, 0, GUN_LOOT_MAP[id].spriteName);
    }
    this.gunSprite!.setOrigin(0.5, 0.5);

    this.equippedGunId = id;
    this.addNewOwnedGun(id);
  }

  getIdForRandomLoot(LOOT_MAP: typeof HAT_LOOT_MAP | typeof GUN_LOOT_MAP) {
    const commonLoot = LOOT_MAP.filter((item) => item.rarity === RARITY.COMMON);
    const rareLoot = LOOT_MAP.filter((item) => item.rarity === RARITY.RARE);
    const legendaryLoot = LOOT_MAP.filter(
      (item) => item.rarity === RARITY.LEGENDARY
    );

    // Set chances for each rarity
    let commonChance = 0.86;
    let rareChance = 0.12;
    let legendaryChance = 0.02;

    if (this.scene.gameRound >= 20) {
      commonChance = 0.8;
      rareChance = 0.15;
      legendaryChance = 0.05;
    } else if (this.scene.gameRound >= 40) {
      commonChance = 0.7;
      rareChance = 0.2;
      legendaryChance = 0.1;
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

  addNewOwnedHat(id: number) {
    if (!this.ownedHatIds.includes(id)) {
      this.ownedHatIds.push(id);
    }
  }

  addNewOwnedGun(id: number) {
    if (!this.ownedGunIds.includes(id)) {
      this.ownedGunIds.push(id);
    }
  }

  handleDeath() {
    if (this.type === CHARACTER_TYPES.PLAYER) {
      // TODO: add player character death logic
    } else if (this.type === CHARACTER_TYPES.ENEMY) {
      // TODO: random chance to drop loot if player character
      // does not have the item already
    } else {
      console.warn(
        `Character.handleDeath: Unknown character type ${this.type}. No death logic applied.`
      );
    }
  }

  destroy() {
    super.destroy();

    // Unsubscribe from events
    this.unsubscribeFromEvents();
  }
}
