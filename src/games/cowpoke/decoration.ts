import { GameObject } from "@/src/utils/game-object";
import { Vec2 } from "@/src/utils/vector";
import {
  MainGameScene,
  REFERENCE_BKG_SIZE,
} from "@/src/games/cowpoke/scenes/main-game-scene";
import { DECOR_TYPES } from "@/src/games/cowpoke/cowpoke-game-object-types";

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
        (this.graphic as Phaser.GameObjects.Sprite).setOrigin(0, 1); // bottom left pivot point
        this.physicsBody2D!.position.y = screenHeight;
        break;
      case DECOR_TYPES.MID:
        this.graphic!.setDepth(1);
        (this.graphic as Phaser.GameObjects.Sprite).setOrigin(0, 1); // bottom left pivot point
        this.physicsBody2D!.position.y = screenHeight;
        break;
      case DECOR_TYPES.FRONT:
        (this.graphic as Phaser.GameObjects.Sprite).setOrigin(0, 1); // bottom left pivot point
        this.graphic!.setDepth(2);

        // Top of floor is about at 225 px on the unscaled background.
        // Place decor just about on top of the floor.
        const frontDecorPosY =
          screenHeight - 225 * (screenHeight / REFERENCE_BKG_SIZE.y);
        this.physicsBody2D!.position.y = frontDecorPosY;
        break;
      case DECOR_TYPES.FLOOR:
        this.graphic!.setDepth(3);
        (this.graphic as Phaser.GameObjects.Sprite).setOrigin(0, 1); // bottom left pivot point
        this.physicsBody2D!.position.y = screenHeight;
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

    const scaleX = this.scene!.screenInfo.width / REFERENCE_BKG_SIZE.x;
    const scaleY = this.scene!.screenInfo.height / REFERENCE_BKG_SIZE.y;

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
    const midSpeed = 0.2 * this.scene!.screenInfo.width; // x% of width per second
    const frontSpeed = 0.6 * this.scene!.screenInfo.width; // x% of width per second

    // If player is moving, move the decor accordingly.
    if (isMoving) {
      // Need to move backgrounds at different speeds based on their depth
      // to create a parallax effect.
      switch (this.type) {
        case DECOR_TYPES.BACK:
          break;
        case DECOR_TYPES.MID:
          this.physicsBody2D!.position.x -= (midSpeed * delta) / 1000; // Convert delta to seconds
          this.physicsBody2D!.position.x = Math.floor(
            this.physicsBody2D!.position.x
          );
          break;
        case DECOR_TYPES.FLOOR:
          break;
        case DECOR_TYPES.FRONT:
          this.physicsBody2D!.position.x -= (frontSpeed * delta) / 1000; // Convert delta to seconds
          this.physicsBody2D!.position.x = Math.floor(
            this.physicsBody2D!.position.x
          );
          break;
        default:
          console.warn(
            `Decoration: Unknown decor type ${this.type}. No movement applied.`
          );
      }
    }
  }

  handleScreenBoundaries() {
    switch (this.type) {
      case DECOR_TYPES.BACK:
        break;
      case DECOR_TYPES.MID:
        // if the mid decor goes off screen, reset it to the right of the
        // furthest right mid found. This allows for multiple mids to be placed
        // at different x positions, and they will all reset to the right of the
        // furthest right mid when they go off screen.
        if (this.physicsBody2D!.position.x <= -this.graphic!.displayWidth) {
          // Find all other mids except this one
          const otherMids = this.scene!.decorations.filter(
            (d) => d !== this && d.type === DECOR_TYPES.MID
          );
          if (otherMids.length > 0) {
            // Find the furthest right mid
            const furthestRightMid = otherMids.reduce((rightmost, current) =>
              current.physicsBody2D!.position.x +
                current.graphic!.displayWidth >
              rightmost.physicsBody2D!.position.x +
                rightmost.graphic!.displayWidth
                ? current
                : rightmost
            );

            // Place this mid directly to the right of the furthest right mid
            this.physicsBody2D!.position.x = Math.floor(
              furthestRightMid.physicsBody2D!.position.x +
                furthestRightMid.graphic!.displayWidth
            );
          } else {
            console.error(
              "Decoration: No other mid decorations found to reset position."
            );
            // If no other mids, just reset to the right side of the screen
            this.physicsBody2D!.position.x = this.scene!.screenInfo.width;
          }
        }

        break;
      case DECOR_TYPES.FLOOR:
        break;
      case DECOR_TYPES.FRONT:
        // if the front decor goes off screen, reset it to the right side of
        // the rightmost front decor, plus a random offset.
        if (this.physicsBody2D!.position.x <= -this.graphic!.displayWidth) {
          // Find all other front decors except this one
          const otherFronts = this.scene!.decorations.filter(
            (d) => d !== this && d.type === DECOR_TYPES.FRONT
          );

          if (otherFronts.length > 0) {
            // Find the furthest right front decor
            const furthestRightFront = otherFronts.reduce(
              (rightmost, current) =>
                current.physicsBody2D!.position.x +
                  current.graphic!.displayWidth >
                rightmost.physicsBody2D!.position.x +
                  rightmost.graphic!.displayWidth
                  ? current
                  : rightmost
            );
            // Place this decor to the right of the furthest right decor (or
            // the screen width, whichever is larger), plus random offset. Checking
            // for the max here guarantees that the decor will always be placed
            // off-screen to the right.
            const offset = Math.floor(
              this.scene!.random.getRandomInt(
                50 * (this.scene!.screenInfo.width / REFERENCE_BKG_SIZE.x),
                300 * (this.scene!.screenInfo.width / REFERENCE_BKG_SIZE.x)
              )
            );
            this.physicsBody2D!.position.x =
              Math.max(
                this.scene!.screenInfo.width,
                furthestRightFront.physicsBody2D!.position.x +
                  furthestRightFront.graphic!.displayWidth
              ) + offset;
          } else {
            console.error(
              "Decoration: No other front decorations found to reset position."
            );

            // If no other fronts, just reset to the right side of the screen
            this.physicsBody2D!.position.x = this.scene!.screenInfo.width;
          }

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
        console.warn(`Decoration: Unknown decor type ${this.type}.`);
    }
  }

  destroy() {
    super.destroy();

    // Unsubscribe from events
    this.unsubscribeFromEvents();
  }
}
