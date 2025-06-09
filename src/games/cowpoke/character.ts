import { GameObject } from "@/src/utils/game-object";
import { Vec2 } from "@/src/utils/vector";
import {
  MainGameScene,
  REFERENCE_BKG_SIZE,
} from "@/src/games/cowpoke/scenes/main-game-scene";
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

  private ogPixelSize: Vec2 = new Vec2(0, 0);
  private bounceTime: number = 0;

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

    // body, head, hat, and gun all have the same pixel size, so
    // arbitrarily use body sprite size for ogPixelSize.
    this.ogPixelSize = new Vec2(
      (
        this.bodySprite as Phaser.GameObjects.Sprite
      ).texture.getSourceImage().width,
      (
        this.bodySprite as Phaser.GameObjects.Sprite
      ).texture.getSourceImage().height
    );

    // Update size at the end of sprite init, since it relies on sprite size etc.
    this.updateSize(); // set the size here!, not in GameObject

    // Update position etc.
    switch (this.type) {
      case CHARACTER_TYPES.ENEMY:
        this.physicsBody2D!.position.x = screenWidth - 150;
        (this.graphic as Phaser.GameObjects.Container).scaleX = -1; // enemy faces left
        break;
      case CHARACTER_TYPES.PLAYER:
        this.physicsBody2D!.position.x = 150;
        (this.graphic as Phaser.GameObjects.Container).scaleX = 1;
        break;
      default:
        console.warn(`Character: Unknown character type ${this.type}`);
    }
    this.graphic!.setDepth(5);

    // Top of floor is about at 225 px on the unscaled background.
    // Place character just below top of floor.
    this.physicsBody2D!.position.y =
      screenHeight - screenHeight * (100 / REFERENCE_BKG_SIZE.y);

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
    // Size ro scale w/ viewport at same scale as bkg's etc.
    const screenWidth = window.visualViewport?.width || window.innerWidth;
    const screenHeight = window.visualViewport?.height || window.innerHeight;

    const scaleX = screenWidth / REFERENCE_BKG_SIZE.x;
    const scaleY = screenHeight / REFERENCE_BKG_SIZE.y;

    const newSize = new Vec2(
      this.ogPixelSize.x * scaleX,
      this.ogPixelSize.y * scaleY
    );

    return newSize;
  }

  handleAnims() {
    // Create a subtle bounce anim on a sin wave
    this.bounceTime += 0.05; // Adjust speed as needed
    const minScale = 0.99;
    const maxScale = 1.01;
    const amplitude = (maxScale - minScale) / 2;
    const mid = (maxScale + minScale) / 2;
    const scaleY = mid + Math.sin(this.bounceTime) * amplitude;

    (this.graphic as Phaser.GameObjects.Container).scaleY = scaleY;
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

    // Set default hat and gun when new player character is spawned
    this.equipHat(0);
    this.equipGun(0);

    this.level = 1;
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

    this.hatSprite = this.updateContainerChildSprite(
      this.hatSprite,
      HAT_LOOT_MAP[id].spriteName as string
    );
    this.hatSprite!.setDepth(8);

    this.equippedHatId = id;
    this.addNewOwnedHat(id);
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
    this.gunSprite!.setDepth(9);

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
      // FIXME: add player character death logic
    } else if (this.type === CHARACTER_TYPES.ENEMY) {
      // FIXME: random chance to drop loot if player character
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
