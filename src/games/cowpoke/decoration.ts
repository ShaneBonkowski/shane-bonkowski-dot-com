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
  private scene: MainGameScene | null = null;
  public type: number = DECOR_TYPES.UNASSIGNED;

  // eslint-disable-next-line no-restricted-syntax
  constructor(
    scene: MainGameScene,
    spawnX: number,
    screenHeight: number,
    type: number,
    spriteName: string
  ) {
    // Initialize GameObject with physics, and rigid body
    super("Decoration", new Vec2(0, 0), true, true);

    // Return early during SSR/static generation (need to call super first)
    if (typeof window === "undefined") return;

    this.scene = scene;
    this.type = type;

    // Set the sprite
    this.graphic = this.scene!.add.sprite(0, 0, spriteName);

    // Update scale at the end of sprite init, since it relies on sprite size etc.
    this.updateScale(); // set the scale here!, not in GameObject

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

    this.updateScale();

    this.physicsBody2D!.position.x = newX;
    this.physicsBody2D!.position.y = newY;
  }

  updateScale() {
    this.scale = this.calculateScale();
  }

  calculateScale(): Vec2 {
    // Calculate the scale based on the screen width
    let newScale = new Vec2(0, 0);

    /* eslint-disable no-restricted-syntax */
    const screenWidth = window.visualViewport?.width || window.innerWidth;
    const screenHeight = window.visualViewport?.height || window.innerHeight;
    /* eslint-enable no-restricted-syntax */

    const scaleX = screenWidth / REFERENCE_BKG_SIZE.x;
    const scaleY = screenHeight / REFERENCE_BKG_SIZE.y;

    // Backgrounds are scaled to fit viewport
    if (
      this.type === DECOR_TYPES.BACK ||
      this.type === DECOR_TYPES.MID ||
      this.type === DECOR_TYPES.FLOOR
    ) {
      newScale = new Vec2(scaleX, scaleY);
    } else if (this.type === DECOR_TYPES.FRONT) {
      newScale = new Vec2(
        scaleX * 0.6, // scale to be a little smaller
        scaleY * 0.6
      );
    }

    return newScale;
  }

  handlePhysics(delta: number, isMoving: boolean) {
    // eslint-disable-next-line no-restricted-syntax
    const screenWidth = window.visualViewport?.width || window.innerWidth;
    const midSpeed = 0.2 * screenWidth; // x% of width per second
    const frontSpeed = 0.6 * screenWidth; // x% of width per second

    // If player is moving, move the decor accordingly.
    if (isMoving) {
      // Need to move backgrounds at different speeds based on their depth
      // to create a parallax effect.
      switch (this.type) {
        case DECOR_TYPES.BACK:
          break;
        case DECOR_TYPES.MID:
          this.physicsBody2D!.position.x -= (midSpeed * delta) / 1000; // Convert delta to seconds
          this.physicsBody2D!.position.x = Math.round(
            this.physicsBody2D!.position.x
          );

          // if the mid decor goes off screen, reset it to the right side
          if (
            this.physicsBody2D!.position.x <=
            -this.graphic!.displayWidth / 2
          ) {
            this.physicsBody2D!.position.x = Math.round(
              screenWidth + this.graphic!.displayWidth / 2
            );
          }

          break;
        case DECOR_TYPES.FLOOR:
          break;
        case DECOR_TYPES.FRONT:
          this.physicsBody2D!.position.x -= (frontSpeed * delta) / 1000; // Convert delta to seconds
          this.physicsBody2D!.position.x = Math.round(
            this.physicsBody2D!.position.x
          );

          // if the front decor goes off screen, reset it to the right side
          if (
            this.physicsBody2D!.position.x <=
            -this.graphic!.displayWidth / 2
          ) {
            this.physicsBody2D!.position.x = Math.round(
              screenWidth + this.graphic!.displayWidth / 2
            );

            // Also update it to a random new decor graphic sprite to keep it fresh
            const randomSpriteName = this.getRandomSprite(
              "bkg-front-",
              this.scene!.textures.getTextureKeys(),
              this.scene!.random
            );

            if (randomSpriteName != null) {
              (this.graphic as Phaser.GameObjects.Sprite).setTexture(
                randomSpriteName
              );
            }
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
