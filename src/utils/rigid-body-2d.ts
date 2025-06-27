import { Vec2 } from "@/src/utils/vector";
import { GameObject } from "@/src/utils/game-object";

/**
 * Class representing a 2D rigid body.
 */
export class RigidBody2D {
  public gameObject: GameObject | null = null;
  public hitboxSize: Vec2 = new Vec2(0, 0);

  /**
   * Create a RigidBody2D.
   * @param {GameObject} gameObject - Parent game obj
   * @param {Vec2} hitboxSize - Size of the hitbox for collision in px.
   */
  // eslint-disable-next-line no-restricted-syntax
  constructor(gameObject: GameObject, hitboxSize: Vec2 = new Vec2(1, 1)) {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    this.gameObject = gameObject;
    this.hitboxSize = hitboxSize;
  }

  /**
   * Check for a collision with another rigid body.
   * @param {RigidBody2D} otherBody - The other body involved in the collision.
   */
  checkBodyOnBodyCollision(otherBody: RigidBody2D) {
    if (otherBody.gameObject!.disabled || this.gameObject!.disabled) {
      return;
    }

    // Basic square collision detection (axis-aligned bounding box)
    const isColliding =
      this.gameObject!.physicsBody2D!.position.x <
        otherBody.gameObject!.physicsBody2D!.position.x +
          otherBody.hitboxSize.x &&
      this.gameObject!.physicsBody2D!.position.x + this.hitboxSize.x >
        otherBody.gameObject!.physicsBody2D!.position.x &&
      this.gameObject!.physicsBody2D!.position.y <
        otherBody.gameObject!.physicsBody2D!.position.y +
          otherBody.hitboxSize.y &&
      this.gameObject!.physicsBody2D!.position.y + this.hitboxSize.y >
        otherBody.gameObject!.physicsBody2D!.position.y;

    if (isColliding) {
      document.dispatchEvent(
        new CustomEvent("bodyOnBodyCollision", {
          detail: {
            thisId: this.gameObject!.id,
            otherId: otherBody.gameObject!.id,
          },
        })
      );
    }
  }

  /**
   * Check for a collision with the screen edge with this body.
   * @param {number} edgeMargin - How close to the screen edge to be considered a collision.
   */
  checkCollideScreenEdge(
    screenWidth: number,
    screenHeight: number,
    edgeMargin: number = 1
  ) {
    if (this.gameObject!.disabled) {
      return;
    }

    let collisionDirection = null;

    // If too close to any screen edge, say which edge it is colliding with!
    if (
      this.gameObject!.physicsBody2D!.position.x <=
      edgeMargin + this.hitboxSize.x / 2
    ) {
      collisionDirection = "left";
    } else if (
      this.gameObject!.physicsBody2D!.position.x >=
      screenWidth - edgeMargin - this.hitboxSize.x / 2
    ) {
      collisionDirection = "right";
    } else if (
      this.gameObject!.physicsBody2D!.position.y <=
      edgeMargin + this.hitboxSize.y / 2
    ) {
      collisionDirection = "top";
    } else if (
      this.gameObject!.physicsBody2D!.position.y >=
      screenHeight - edgeMargin - this.hitboxSize.y / 2
    ) {
      collisionDirection = "bottom";
    }

    // If a collision direction was detected, dispatch an event
    if (collisionDirection) {
      document.dispatchEvent(
        new CustomEvent("screenEdgeCollision", {
          detail: {
            gameObjectId: this.gameObject!.id,
            direction: collisionDirection,
          },
        })
      );
    }
  }
}
