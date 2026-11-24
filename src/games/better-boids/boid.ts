import { GameObject } from "@/src/utils/game-object";
import { Vec2 } from "@/src/utils/vector";
import { MoreMath } from "@/src/utils/more-math";
import { SeededRandom } from "@/src/utils/seedable-random";
import { MainGameScene } from "@/src/games/better-boids/scenes/main-game-scene";
import { settingsStore } from "@/src/games/better-boids/settings-store";
import { Physics } from "@/src/utils/physics";

const seededRandom = new SeededRandom(1234);

const BoidConstants = {
  leaderFollowFactor: 5,
  leaderFollowRadius: 1000,
  predatorPreyFactor: 3,
  boidProtectedRadius: 20,
};

type BoidType = "Good" | "Bad" | "Leader" | "Obstacle";

export class Boid extends GameObject {
  public scene: MainGameScene | null = null;
  public boidType: BoidType = "Good";
  public isDragging: boolean = false;
  public dragOffsetX: number = 0;
  public dragOffsetY: number = 0;

  // eslint-disable-next-line no-restricted-syntax
  constructor(
    scene: MainGameScene,
    spawnX: number,
    spawnY: number,
    boidType?: BoidType,
  ) {
    // Set up GameObject with physics and rigid body.
    // init scale just so its set, will reset to something else later
    super("Boid", new Vec2(1, 1), true, true);

    // Return early during SSR/static generation (need to call super first)
    if (typeof window === "undefined") return;

    this.scene = scene;
    this.boidType = boidType ??
      (seededRandom.getRandomFloat(0, 1) < 0.8 ? "Good" : "Bad");

    if (this.boidType === "Obstacle") {
      this.physicsBody2D!.velocity = new Vec2(0, 0);
    } else {
      this.physicsBody2D!.velocity = this.initVelocity();
    }

    // Create a graphics object for the boid
    this.graphic = null;
    this.initBoid();

    // Init at provided location, and centered
    this.physicsBody2D!.position.x = spawnX;
    this.physicsBody2D!.position.y = spawnY;

    // Leader is disabled to start
    if (this.boidType === "Leader") {
      this.disable();
    } else {
      this.enable();
    }

    this.subscribeToEvents();
  }

  initBoid() {
    this.updateBoidScale();

    // Init the graphics
    const spriteName = `${this.boidType} Boid Anim`;

    this.graphic = this.scene!.add.sprite(
      0,
      0,
      spriteName,
    ) as Phaser.GameObjects.Sprite;
    this.graphic.setOrigin(0.5, 0.5);
    this.updateBoidScale();

    // Define an animation for the sprite
    if ("anims" in this.graphic) {
      this.graphic.anims.create({
        key: "boidAnimation",
        frames: this.graphic.anims.generateFrameNumbers(spriteName, {
          start: 0,
          end: -1,
        }), // -1 to use all frames
        frameRate: 6,
        repeat: -1, // Repeat indefinitely
      });
      this.graphic.anims.play("boidAnimation");
    }
  }

  isPointInHitbox(worldX: number, worldY: number): boolean {
    const obstacleX = this.physicsBody2D!.position.x;
    const obstacleY = this.physicsBody2D!.position.y;
    const halfWidth = this.rigidBody2D!.hitboxSize.x / 2;
    const halfHeight = this.rigidBody2D!.hitboxSize.y / 2;

    return (
      worldX >= obstacleX - halfWidth &&
      worldX <= obstacleX + halfWidth &&
      worldY >= obstacleY - halfHeight &&
      worldY <= obstacleY + halfHeight
    );
  }

  startDragging(pointer: Phaser.Input.Pointer) {
    this.isDragging = true;
    const obstacleX = this.physicsBody2D!.position.x;
    const obstacleY = this.physicsBody2D!.position.y;
    this.dragOffsetX = pointer.worldX - obstacleX;
    this.dragOffsetY = pointer.worldY - obstacleY;
    this.scene!.setDraggingObstacle(this);

    // Hide the leader boid when dragging obstacle
    const leaderBoid = this.scene!.boids.find((b) => b.boidType === "Leader");
    if (leaderBoid) {
      leaderBoid.disable();
    }
  }

  updateDragPosition(pointer: Phaser.Input.Pointer) {
    if (!this.isDragging) return;

    const newX = pointer.worldX - this.dragOffsetX;
    const newY = pointer.worldY - this.dragOffsetY;

    // Lock position within screen bounds + object width
    const halfWidth = this.rigidBody2D!.hitboxSize.x / 2;
    const halfHeight = this.rigidBody2D!.hitboxSize.y / 2;

    const clampedX = Math.max(
      halfWidth,
      Math.min(newX, this.scene!.screenInfo.width - halfWidth),
    );
    const clampedY = Math.max(
      halfHeight,
      Math.min(newY, this.scene!.screenInfo.height - halfHeight),
    );

    this.physicsBody2D!.position.x = clampedX;
    this.physicsBody2D!.position.y = clampedY;
  }

  stopDragging() {
    if (this.isDragging) {
      this.isDragging = false;
      this.scene!.setDraggingObstacle(null);
    }
  }

  handlePointerMove = (pointer: Phaser.Input.Pointer) => {
    if (this.boidType === "Leader") {
      if (!this.scene!.isInteracting) {
        return;
      }
      this.physicsBody2D!.position.x = pointer.worldX;
      this.physicsBody2D!.position.y = pointer.worldY;
      return;
    }
  };

  handlePointerHoldClick = () => {
    const settings = settingsStore.getSnapshot();

    // Only enable leader if leaderStrength is not 0, menu is closed, and no obstacle is being dragged
    if (
      settings.leaderStrength !== 0 &&
      this.scene!.uiMenuOpen == false &&
      !this.scene!.isDraggingObstacle()
    ) {
      this.enable();

      // Snap leader to current mouse position immediately
      const pointer = this.scene!.input.activePointer;
      if (pointer) {
        this.physicsBody2D!.position.x = pointer.worldX;
        this.physicsBody2D!.position.y = pointer.worldY;
      }
    }
  };

  subscribeToEvents() {
    if (this.boidType === "Leader") {
      this.scene!.input.on("pointermove", this.handlePointerMove, this);

      document.addEventListener(
        "pointerholdclick",
        this.handlePointerHoldClick,
        { capture: true },
      );

      document.addEventListener("pointerup", this.handleDisable, {
        capture: true,
      });
      document.addEventListener("pointercancel", this.handleDisable, {
        capture: true,
      });
    }
  }

  unsubscribeFromEvents() {
    if (this.boidType === "Leader") {
      this.scene!.input.off("pointermove", this.handlePointerMove, this);

      document.removeEventListener(
        "pointerholdclick",
        this.handlePointerHoldClick,
        { capture: true },
      );

      document.removeEventListener("pointerup", this.handleDisable, {
        capture: true,
      });
      document.removeEventListener("pointercancel", this.handleDisable, {
        capture: true,
      });
    }
  }

  handleDisable = () => {
    this.disable();
  };

  calculateBoidScale(): Vec2 {
    // Calculate the boid scale based on the screen height
    let boidScale = (this.scene!.screenInfo.height * 0.15) / 200;

    // Phone screen has smaller boids
    if (
      this.scene!.screenInfo.width <= 600 ||
      this.scene!.screenInfo.isPortrait
    ) {
      boidScale = (this.scene!.screenInfo.height * 0.08) / 200;
    }

    // Obstacle boids should be larger
    if (this.boidType === "Obstacle") {
      boidScale *= 1.5;
    }

    return new Vec2(boidScale, boidScale);
  }

  handleWindowResize(newX: number, newY: number) {
    if (newX == null || newY == null) {
      console.warn(
        "obj.handleWindowResize: newX or newY is null. Skipping resize handling.",
      );
      return;
    }

    // Reinitialize the boid and its graphic on resize
    this.updateBoidScale();

    this.physicsBody2D!.position.x = newX;
    this.physicsBody2D!.position.y = newY;
  }

  initVelocity(): Vec2 {
    // Set velocity in a random direction
    let velocityDesired = new Vec2(
      seededRandom.getRandomFloat(0.1, 1),
      seededRandom.getRandomFloat(0.1, 1),
    );

    velocityDesired = this.clampVelocity(velocityDesired);
    return velocityDesired;
  }

  updateBoidScale() {
    this.scale = this.calculateBoidScale();

    if (this.graphic) {
      this.rigidBody2D!.hitboxSize = new Vec2(
        // Use x% of the graphic size for hitbox
        this.graphic.width * this.scale.x * 0.55,
        this.graphic.height * this.scale.y * 0.55,
      );
    }
  }

  clampVelocity(velocityDesired: Vec2): Vec2 {
    const settings = settingsStore.getSnapshot();

    // Cleans up velocity such if the provided value is not within min and max speed,
    // it is normalized and then set in magnitude to the speed limit it is at.
    const normalizedVelocity = Vec2.normalize(velocityDesired);
    if (Vec2.magnitude(velocityDesired) > settings.speed) {
      velocityDesired = Vec2.scale(normalizedVelocity, settings.speed);
    }
    // Min speed is defined at 10% max speed
    else if (Vec2.magnitude(velocityDesired) < settings.speed * 0.1) {
      velocityDesired = Vec2.scale(normalizedVelocity, settings.speed * 0.1);
    }

    return velocityDesired;
  }

  // Physics for boid
  handlePhysics(boids: Boid[]) {
    // Skip physics calculation if the boid is disabled or is an obstacle
    if (this.disabled || this.boidType === "Obstacle") {
      return;
    }

    if (this.boidType !== "Leader") {
      // Boid Behavior
      const desiredVelocity = this.handleBoidFlocking(boids);

      // Handle collisions with screen edges
      this.rigidBody2D!.checkCollideScreenEdge(
        this.scene!.screenInfo.width,
        this.scene!.screenInfo.height,
        0,
      );

      // Lerp toward desired velocity
      const lerpFactor = 0.1;
      this.physicsBody2D!.velocity.x = MoreMath.lerp(
        this.physicsBody2D!.velocity.x,
        desiredVelocity.x,
        lerpFactor,
      );
      this.physicsBody2D!.velocity.y = MoreMath.lerp(
        this.physicsBody2D!.velocity.y,
        desiredVelocity.y,
        lerpFactor,
      );

      // We can lerp, but never exceed speed limits
      this.physicsBody2D!.velocity = this.clampVelocity(
        this.physicsBody2D!.velocity,
      );

      if (settingsStore.getSnapshot().collisionsEnabled) {
        this.moveWithObstacleCollisions(boids);
      } else {
        this.physicsBody2D!.updatePosition();
      }
    }
  }

  moveWithObstacleCollisions(boids: Boid[]) {
    const body = this.physicsBody2D!;
    const obstacles = boids.filter((boid) => boid.boidType === "Obstacle" && !boid.disabled);

    const overlapsObstacle = (x: number, y: number) =>
      obstacles.some((obstacle) => {
        const position = obstacle.physicsBody2D!.position;
        const halfWidth =
          (this.rigidBody2D!.hitboxSize.x +
            obstacle.rigidBody2D!.hitboxSize.x) /
          2;
        const halfHeight =
          (this.rigidBody2D!.hitboxSize.y +
            obstacle.rigidBody2D!.hitboxSize.y) /
          2;
        return (
          Math.abs(x - position.x) < halfWidth &&
          Math.abs(y - position.y) < halfHeight
        );
      });

    // Find the closest free edge when dragged or overlapping obstacles cover a boid.
    if (overlapsObstacle(body.position.x, body.position.y)) {
      let bestDistance = Infinity;
      let bestX = body.position.x;
      let bestY = body.position.y;
      for (const obstacle of obstacles) {
        const position = obstacle.physicsBody2D!.position;
        const halfWidth =
          (this.rigidBody2D!.hitboxSize.x +
            obstacle.rigidBody2D!.hitboxSize.x) /
          2;
        const halfHeight =
          (this.rigidBody2D!.hitboxSize.y +
            obstacle.rigidBody2D!.hitboxSize.y) /
          2;
        for (const x of [position.x - halfWidth, position.x + halfWidth]) {
          const distance = Math.abs(x - body.position.x);
          if (
            distance < bestDistance &&
            !overlapsObstacle(x, body.position.y)
          ) {
            bestDistance = distance;
            bestX = x;
            bestY = body.position.y;
          }
        }
        for (const y of [position.y - halfHeight, position.y + halfHeight]) {
          const distance = Math.abs(y - body.position.y);
          if (
            distance < bestDistance &&
            !overlapsObstacle(body.position.x, y)
          ) {
            bestDistance = distance;
            bestX = body.position.x;
            bestY = y;
          }
        }
      }
      if (bestX !== body.position.x) {
        body.velocity.x =
          Math.sign(bestX - body.position.x) * Math.abs(body.velocity.x);
      } else {
        body.velocity.y =
          Math.sign(bestY - body.position.y) * Math.abs(body.velocity.y);
      }
      body.position.x = bestX;
      body.position.y = bestY;
    }

    // Sweep the boid's center against obstacles expanded by the boid's half-size.
    const moveX = body.velocity.x * Physics.physicsUpdateInterval;
    const moveY = body.velocity.y * Physics.physicsUpdateInterval;
    let firstHit = 1;
    let hitAxis: "x" | "y" | null = null;
    for (const obstacle of obstacles) {
      const position = obstacle.physicsBody2D!.position;
      const halfWidth =
        (this.rigidBody2D!.hitboxSize.x + obstacle.rigidBody2D!.hitboxSize.x) /
        2;
      const halfHeight =
        (this.rigidBody2D!.hitboxSize.y + obstacle.rigidBody2D!.hitboxSize.y) /
        2;
      const minX = position.x - halfWidth;
      const maxX = position.x + halfWidth;
      const minY = position.y - halfHeight;
      const maxY = position.y + halfHeight;
      if (
        (moveX === 0 && (body.position.x <= minX || body.position.x >= maxX)) ||
        (moveY === 0 && (body.position.y <= minY || body.position.y >= maxY))
      ) {
        continue;
      }
      const x1 = moveX === 0 ? -Infinity : (minX - body.position.x) / moveX;
      const x2 = moveX === 0 ? Infinity : (maxX - body.position.x) / moveX;
      const y1 = moveY === 0 ? -Infinity : (minY - body.position.y) / moveY;
      const y2 = moveY === 0 ? Infinity : (maxY - body.position.y) / moveY;
      const entryX = Math.min(x1, x2);
      const entryY = Math.min(y1, y2);
      const entry = Math.max(entryX, entryY);
      const exit = Math.min(Math.max(x1, x2), Math.max(y1, y2));
      if (entry >= 0 && entry < firstHit && entry < exit) {
        firstHit = entry;
        hitAxis = entryX > entryY ? "x" : "y";
      }
    }
    body.position.x += moveX * firstHit;
    body.position.y += moveY * firstHit;
    if (hitAxis === "x") body.velocity.x *= -1;
    if (hitAxis === "y") body.velocity.y *= -1;
  }

  handleBoidFlocking(boids: Boid[]): Vec2 {
    const settings = settingsStore.getSnapshot();

    // Initialize variables to compute the new velocity based on boid rules
    let velocSum = new Vec2(0, 0);
    let positionSum = new Vec2(0, 0);
    let separation = new Vec2(0, 0); // how far apart all boids are on avg (try to stay a certain distance apart)
    let opposingPositionSum = new Vec2(0, 0); // avg pos of opposing neighbors
    let obstacleRepulsion = new Vec2(0, 0); // repulsion from obstacles
    let similarNeighborsCount = 0;
    let opposingNeighborsCount = 0;

    let followLeader = false;
    let leaderPos = new Vec2(0, 0);

    const obstacleRepulsionRadius = 150; // Distance at which obstacles start repelling boids

    // Loop through all other boids in the scene
    for (const otherBoid of boids) {
      if (otherBoid !== this && !otherBoid.disabled) {
        // Get distance attrs between this and other boid
        const distObj = this.getBoidDistance(otherBoid);
        const dx = distObj.dx;
        const dy = distObj.dy;
        const distanceSquared = distObj.distanceSquared;

        // Handle obstacle repulsion
        if (otherBoid.boidType === "Obstacle") {
          if (
            distanceSquared <
            obstacleRepulsionRadius * obstacleRepulsionRadius
          ) {
            const distance = Math.sqrt(distanceSquared);
            if (distance > 0) {
              // Create repulsion force away from the obstacle
              const repulsionStrength = 1 - distance / obstacleRepulsionRadius;
              obstacleRepulsion = Vec2.add(
                obstacleRepulsion,
                Vec2.scale(
                  Vec2.normalize(
                    Vec2.subtract(
                      this.physicsBody2D!.position,
                      otherBoid.physicsBody2D!.position,
                    ),
                  ),
                  repulsionStrength * 2,
                ),
              );
            }
          }
          continue; // Skip other logic for obstacles
        }

        // If otherBoid is the main boid and the player is interacting (aka pointer is down), have this boid follow the leader if within leader follow radius!
        if (otherBoid.boidType === "Leader" && this.scene!.isInteracting) {
          if (
            distanceSquared <
            BoidConstants.leaderFollowRadius * BoidConstants.leaderFollowRadius
          ) {
            followLeader = true;
            leaderPos = new Vec2(
              otherBoid.physicsBody2D!.position.x,
              otherBoid.physicsBody2D!.position.y,
            );
          }
        }

        // If other boid is the same type as this boid, use regular boid logic!
        else if (this.boidType == otherBoid.boidType) {
          // Update boid flock measurements if otherBoid is within search radius
          if (
            distanceSquared <
            settings.flockSearchRadius * settings.flockSearchRadius
          ) {
            const distance = Math.sqrt(distanceSquared);
            if (distance > 0) {
              similarNeighborsCount++;

              // Total up avg veloc and position for neighboring boids
              velocSum = Vec2.add(velocSum, otherBoid.physicsBody2D!.velocity);
              positionSum = Vec2.add(
                positionSum,
                new Vec2(
                  otherBoid.physicsBody2D!.position.x,
                  otherBoid.physicsBody2D!.position.y,
                ),
              );

              // If any boids are within the protected radius of a boid, steer away from them
              if (distance < BoidConstants.boidProtectedRadius) {
                // By doing 0 - distance, this allows us to have this boid move away from other boid
                separation = Vec2.add(
                  separation,
                  Vec2.subtract(new Vec2(0, 0), new Vec2(dx, dy)),
                );
              }
            }
          }
        }

        // if boid types conflict, have good boid run from bad boid and bad boid chase good boid!
        // Take avg position of opposing neighbors, and then either go toward or away from that based on boid type.
        else if (this.boidType != otherBoid.boidType) {
          if (
            distanceSquared <
            settings.flockSearchRadius * settings.flockSearchRadius
          ) {
            opposingNeighborsCount += 1;
            opposingPositionSum = Vec2.add(
              opposingPositionSum,
              new Vec2(
                otherBoid.physicsBody2D!.position.x,
                otherBoid.physicsBody2D!.position.y,
              ),
            );
          }
        }
      }
    }

    // Calculate and update the new velocity based on the rules.
    // Using Object.assign({}, this.physicsBody2D.velocity); makes desiredVelocity a copy of
    // this.physicsBody2D.velocity instead of pointing to the same loc in memory
    let desiredVelocity = Object.assign({}, this.physicsBody2D!.velocity);

    // Follow the alignment, cohesion, and separation rules for similar (same boidType) neighbors
    if (similarNeighborsCount > 0) {
      // Alignment: Steer toward average neighboring boid heading (aka velocity)
      let avgVeloc = new Vec2(0, 0);
      avgVeloc = new Vec2(
        velocSum.x / similarNeighborsCount,
        velocSum.y / similarNeighborsCount,
      );
      desiredVelocity.x +=
        (avgVeloc.x - this.physicsBody2D!.velocity.x) *
        settings.alignmentFactor;
      desiredVelocity.y +=
        (avgVeloc.y - this.physicsBody2D!.velocity.y) *
        settings.alignmentFactor;

      // Cohesion: Steer toward average neighboring boid position (aka center of mass)
      let avgPos = new Vec2(0, 0);
      avgPos = new Vec2(
        positionSum.x / similarNeighborsCount,
        positionSum.y / similarNeighborsCount,
      );

      const directionObj = this.getMovementDirectionVectorThroughTorus(
        this.physicsBody2D!.position,
        avgPos,
      );
      desiredVelocity.x +=
        Math.abs(avgPos.x - this.physicsBody2D!.position.x) *
        directionObj.directionX *
        settings.cohesionFactor;
      desiredVelocity.y +=
        Math.abs(avgPos.y - this.physicsBody2D!.position.y) *
        directionObj.directionY *
        settings.cohesionFactor;

      // Separation: boids steer away from boids within their boidProtectedRadius
      desiredVelocity.x += separation.x * settings.separationFactor;
      desiredVelocity.y += separation.y * settings.separationFactor;
    }

    // Follow the leader if told to do so!
    if (followLeader) {
      // Follow Leader (positive = attract, negative = repel)
      const directionObj = this.getMovementDirectionVectorThroughTorus(
        this.physicsBody2D!.position,
        leaderPos,
      );
      const leaderFollowStrength =
        (Math.abs(settings.leaderStrength) / 100) *
        BoidConstants.leaderFollowFactor;
      const directionMultiplier = settings.leaderStrength < 0 ? -1 : 1;

      desiredVelocity.x +=
        Math.abs(leaderPos.x - this.physicsBody2D!.position.x) *
        directionObj.directionX *
        leaderFollowStrength *
        directionMultiplier;
      desiredVelocity.y +=
        Math.abs(leaderPos.y - this.physicsBody2D!.position.y) *
        directionObj.directionY *
        leaderFollowStrength *
        directionMultiplier;
    }

    // Perform opposing boid velocity updates
    if (opposingNeighborsCount > 0) {
      // Predator-prey: Steer toward average opposing boid position (aka center of mass) if predator (bad boid), and run away from this if prey (good boid)
      let opposingAvgPos = new Vec2(0, 0);
      opposingAvgPos = new Vec2(
        opposingPositionSum.x / opposingNeighborsCount,
        opposingPositionSum.y / opposingNeighborsCount,
      );

      const directionObj = this.getMovementDirectionVectorThroughTorus(
        this.physicsBody2D!.position,
        opposingAvgPos,
      );

      // Bad boid chases
      if (this.boidType == "Bad") {
        desiredVelocity.x +=
          Math.abs(opposingAvgPos.x - this.physicsBody2D!.position.x) *
          directionObj.directionX *
          BoidConstants.predatorPreyFactor;
        desiredVelocity.y +=
          Math.abs(opposingAvgPos.y - this.physicsBody2D!.position.y) *
          directionObj.directionY *
          BoidConstants.predatorPreyFactor;
      }
      // good boid runs away
      else if (this.boidType == "Good") {
        desiredVelocity.x +=
          -1 *
          Math.abs(opposingAvgPos.x - this.physicsBody2D!.position.x) *
          directionObj.directionX *
          BoidConstants.predatorPreyFactor;
        desiredVelocity.y +=
          -1 *
          Math.abs(opposingAvgPos.y - this.physicsBody2D!.position.y) *
          directionObj.directionY *
          BoidConstants.predatorPreyFactor;
      }
    }

    // Apply obstacle repulsion
    if (obstacleRepulsion.x !== 0 || obstacleRepulsion.y !== 0) {
      desiredVelocity.x += obstacleRepulsion.x;
      desiredVelocity.y += obstacleRepulsion.y;
    }

    // Cleanup veloc so we dont exceed speed limit
    desiredVelocity = this.clampVelocity(desiredVelocity);

    return desiredVelocity;
  }

  getBoidDistance(otherBoid: Boid): {
    dx: number;
    dy: number;
    distanceSquared: number;
  } {
    // Calculate distance between this boid and the other
    let dx =
      otherBoid.physicsBody2D!.position.x - this.physicsBody2D!.position.x;
    let dy =
      otherBoid.physicsBody2D!.position.y - this.physicsBody2D!.position.y;

    // Because boids can overflow to the other side of the screen, we need to check the
    // "torus" distance as well to see if the boids are closer in that direction.
    // To do so, we can assume the shorter route from one boid to another is through the edge of a screen if
    // their distance in a given direction (x or y) is greater than half the respective size of the screen.
    if (Math.abs(dx) > this.scene!.screenInfo.width / 2) {
      // If "other" is to the right of "this", then we subtract screen width since
      // in the land of "torus" geometry "other" is really to the left of "this" in their closest distance
      if (dx > 0) {
        dx -= this.scene!.screenInfo.width;
      } else {
        dx += this.scene!.screenInfo.width;
      }
    }
    if (Math.abs(dy) > this.scene!.screenInfo.height / 2) {
      // If "other" is above "this", then we subtract screen height since
      // in the land of "torus" geometry "other" is really below "this" in their closest distance
      if (dy > 0) {
        dy -= this.scene!.screenInfo.height;
      } else {
        dy += this.scene!.screenInfo.height;
      }
    }

    const distanceSquared = dx * dx + dy * dy;

    return {
      dx: dx,
      dy: dy,
      distanceSquared: distanceSquared,
    };
  }

  getMovementDirectionVectorThroughTorus(
    positionA: Vec2,
    positionB: Vec2,
  ): { directionX: number; directionY: number } {
    // Get the movement direction vector to go from point a to point b
    // taking into account the fact that boids live on a torus, so sometimes
    // the best (shortest) way to go is through the side of the screen

    // Calculate initial direction from a to b the normal way (not considering torus)
    let dx = positionB.x - positionA.x;
    let dy = positionB.y - positionA.y;

    // Because boids can overflow to the other side of the screen, we need to check the
    // "torus" distance to see if the boids are closer in that direction.
    // To do so, we can assume the shorter route from one boid to another is through the edge of a screen if
    // their distance in a given direction (x or y) is greater than half the respective size of the screen.
    if (Math.abs(dx) > this.scene!.screenInfo.width / 2) {
      // If positionB is to the right of positionA in this case, then we subtract screen width since
      // in the land of "torus" geometry positionB is really to the left of positionA in their closest distance through the edge
      if (dx > 0) {
        dx -= this.scene!.screenInfo.width;
      } else {
        dx += this.scene!.screenInfo.width;
      }
    }
    if (Math.abs(dy) > this.scene!.screenInfo.height / 2) {
      // If positionB is above of positionA in this case, then we subtract screen height since
      // in the land of "torus" geometry positionB is really to the below of positionA in their closest distance through the edge
      if (dy > 0) {
        dy -= this.scene!.screenInfo.height;
      } else {
        dy += this.scene!.screenInfo.height;
      }
    }

    return {
      directionX: Math.sign(dx),
      directionY: Math.sign(dy),
    };
  }

  onCollideScreenEdge(collisionDirection = null) {
    const edgeMargin = 0;
    // If left, teleport to right side of screen
    if (collisionDirection === "left") {
      this.physicsBody2D!.position.x =
        this.scene!.screenInfo.width -
        edgeMargin -
        this.rigidBody2D!.hitboxSize.x / 2;
    }
    // If right, teleport to left side of screen
    else if (collisionDirection === "right") {
      this.physicsBody2D!.position.x =
        edgeMargin + this.rigidBody2D!.hitboxSize.x / 2;
    }
    // If top, move to bottom
    else if (collisionDirection === "top") {
      this.physicsBody2D!.position.y =
        this.scene!.screenInfo.height -
        edgeMargin -
        this.rigidBody2D!.hitboxSize.y / 2;
    }
    // If bottom, move to top
    else if (collisionDirection === "bottom") {
      this.physicsBody2D!.position.y =
        edgeMargin + this.rigidBody2D!.hitboxSize.y / 2;
    }
  }

  destroy() {
    super.destroy();

    // Unsubscribe from events
    this.unsubscribeFromEvents();
  }
}
