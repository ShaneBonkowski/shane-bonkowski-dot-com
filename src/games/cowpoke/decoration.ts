import { GameObject } from "@/src/utils/game-object";
import { Vec2 } from "@/src/utils/vector";
import { MainGameScene } from "@/src/games/cowpoke/scenes/main-game-scene";

export const DECOR_TYPES = {
  UNASSIGNED: -1,
  BACK: 0,
  MID: 1,
  FLOOR: 2,
  FRONT: 3,
};

export class Decoration extends GameObject {
  private scene: MainGameScene;
  public type: number = DECOR_TYPES.UNASSIGNED;

  constructor(
    scene: MainGameScene,
    spawnX: number,
    screenHeight: number,
    type: number,
    spriteName: string
  ) {
    // Initialize GameObject with physics, and rigid body
    super("Decoration", 0, true, true);
    this.updateSize(); // set the size here!, not in GameObject

    this.scene = scene;
    this.type = type;

    // Set the sprite
    this.graphic = this.scene.add.sprite(0, 0, spriteName);
    (this.graphic as Phaser.GameObjects.Sprite).setOrigin(0.5, 0.5);

    this.physicsBody2D!.position.x = spawnX;
    switch (this.type) {
      case DECOR_TYPES.BACK:
        this.graphic!.setDepth(0);
        this.physicsBody2D!.position.y = screenHeight / 2;
        break;
      case DECOR_TYPES.MID:
        this.graphic!.setDepth(1);
        this.physicsBody2D!.position.y = screenHeight / 2;
        break;
      case DECOR_TYPES.FLOOR:
        this.graphic!.setDepth(2);
        this.physicsBody2D!.position.y = screenHeight / 2;
        break;
      case DECOR_TYPES.FRONT:
        this.graphic!.setDepth(3);
        this.physicsBody2D!.position.y = screenHeight / 2 - this.size / 2;
        break;
      default:
        console.warn(
          `Decoration: Unknown decor type ${this.type}. Defaulting to depth 0.`
        );
        this.graphic!.setDepth(0);
    }

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
    this.rigidBody2D!.hitboxSize = new Vec2(this.size, this.size);
  }

  calculateSize(): number {
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

    return newSize;
  }

  handleMoving() {
    // Need to move backgrounds at different speeds based on their depth
    // to create a parallax effect.
    switch (this.type) {
      case DECOR_TYPES.BACK:
        this.physicsBody2D!.position.x -= 0;
        break;
      case DECOR_TYPES.MID:
        this.physicsBody2D!.position.x -= 0.2;

        // if the mid decor goes off screen, reset it to the right side
        if (this.physicsBody2D!.position.x < -this.size) {
          this.physicsBody2D!.position.x +=
            window.visualViewport?.width || window.innerWidth;
        }

        break;
      case DECOR_TYPES.FLOOR:
        this.physicsBody2D!.position.x -= 0;
        break;
      case DECOR_TYPES.FRONT:
        this.physicsBody2D!.position.x -= 0.4;

        // if the front decor goes off screen, reset it to the right side
        if (this.physicsBody2D!.position.x < -this.size) {
          this.physicsBody2D!.position.x +=
            window.visualViewport?.width || window.innerWidth;
        }

        // Also update it to a random new decor graphic sprite to keep it fresh
        const randomSpriteName = this.getRandomSprite(
          "bkg-front-",
          this.scene.textures.getTextureKeys(),
          this.scene.random
        );
        if (randomSpriteName != null) {
          (this.graphic as Phaser.GameObjects.Sprite).setTexture(
            randomSpriteName
          );
        }

        break;
      default:
        console.warn(
          `Decoration: Unknown decor type ${this.type}. No movement applied.`
        );
    }
  }

  destroy() {
    super.destroy();

    // Unsubscribe from events
    this.unsubscribeFromEvents();
  }
}
