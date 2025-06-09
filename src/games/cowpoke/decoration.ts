import { GameObject } from "@/src/utils/game-object";
import { Vec2 } from "@/src/utils/vector";
import {
  MainGameScene,
  REFERENCE_BKG_SIZE,
} from "@/src/games/cowpoke/scenes/main-game-scene";

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
  private ogPixelSize: Vec2 = new Vec2(0, 0);

  constructor(
    scene: MainGameScene,
    spawnX: number,
    screenHeight: number,
    type: number,
    spriteName: string
  ) {
    // Initialize GameObject with physics, and rigid body
    super("Decoration", new Vec2(0, 0), true, true);
    this.scene = scene;
    this.type = type;

    // Set the sprite
    this.graphic = this.scene.add.sprite(0, 0, spriteName);

    this.ogPixelSize = new Vec2(
      (
        this.graphic as Phaser.GameObjects.Sprite
      ).texture.getSourceImage().width,
      (
        this.graphic as Phaser.GameObjects.Sprite
      ).texture.getSourceImage().height
    );

    // Update size at the end of sprite init, since it relies on sprite size etc.
    this.updateSize(); // set the size here!, not in GameObject

    // Update position etc.
    this.physicsBody2D!.position.x = spawnX;
    switch (this.type) {
      case DECOR_TYPES.BACK:
        this.graphic!.setDepth(0);
        (this.graphic as Phaser.GameObjects.Sprite).setOrigin(0.5, 0.5);
        this.physicsBody2D!.position.y = screenHeight / 2;
        break;
      case DECOR_TYPES.MID:
        this.graphic!.setDepth(1);
        (this.graphic as Phaser.GameObjects.Sprite).setOrigin(0.5, 0.5);
        this.physicsBody2D!.position.y = screenHeight / 2;
        break;
      case DECOR_TYPES.FRONT:
        (this.graphic as Phaser.GameObjects.Sprite).setOrigin(0.5, 1); // bottom middle pivot point
        this.graphic!.setDepth(2);

        // Top of floor is about at 225 px on the unscaled background.
        // Place decor just about on top of the floor.
        const frontDecorPosY =
          screenHeight - screenHeight * (225 / REFERENCE_BKG_SIZE.y);
        this.physicsBody2D!.position.y = frontDecorPosY;
        break;
      case DECOR_TYPES.FLOOR:
        this.graphic!.setDepth(3);
        (this.graphic as Phaser.GameObjects.Sprite).setOrigin(0.5, 0.5);
        this.physicsBody2D!.position.y = screenHeight / 2;
        break;
      default:
        console.warn(`Decoration: Unknown decor type ${this.type}.`);
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
  }

  calculateSize(): Vec2 {
    // Calculate the size based on the screen width
    let newSize = new Vec2(0, 0);

    const screenWidth = window.visualViewport?.width || window.innerWidth;
    const screenHeight = window.visualViewport?.height || window.innerHeight;

    const scaleX = screenWidth / REFERENCE_BKG_SIZE.x;
    const scaleY = screenHeight / REFERENCE_BKG_SIZE.y;

    // Backgrounds are sized to fit viewport
    if (
      this.type === DECOR_TYPES.BACK ||
      this.type === DECOR_TYPES.MID ||
      this.type === DECOR_TYPES.FLOOR
    ) {
      newSize = new Vec2(screenWidth, screenHeight);
    } else if (this.type === DECOR_TYPES.FRONT) {
      newSize = new Vec2(
        this.ogPixelSize.x * scaleX * 0.6, // scale to be a little smaller
        this.ogPixelSize.y * scaleY * 0.6
      );
    }

    return newSize;
  }

  handlePhysics(isMoving: boolean) {
    // If player is moving, move the decor accordingly.
    if (isMoving) {
      // Need to move backgrounds at different speeds based on their depth
      // to create a parallax effect.
      switch (this.type) {
        case DECOR_TYPES.BACK:
          this.physicsBody2D!.position.x -= 0;
          break;
        case DECOR_TYPES.MID:
          this.physicsBody2D!.position.x -= 0.2;

          // if the mid decor goes off screen, reset it to the right side
          if (this.physicsBody2D!.position.x < -this.size.x) {
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
          if (this.physicsBody2D!.position.x < -this.size.x) {
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
  }

  destroy() {
    super.destroy();

    // Unsubscribe from events
    this.unsubscribeFromEvents();
  }
}
