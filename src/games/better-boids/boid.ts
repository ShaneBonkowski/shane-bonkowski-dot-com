import { GameObject } from "@/src/utils/game-object";
import { Vec2 } from "@/src/utils/vector";
import { MoreMath } from "@/src/utils/more-math";
import {
  BoidFactors,
  boidEventNames,
} from "@/src/games/better-boids/boid-utils";
import { SeededRandom } from "@/src/utils/seedable-random";
import { BoidsGameScene } from "@/src/games/better-boids/scenes/better-boids-scene";

const seededRandom = new SeededRandom(1234);

export class Boid extends GameObject {
  public scene: BoidsGameScene;
  public mainBoid: boolean;
  public boidNumber: number;
  public boidType: string;

  constructor(
    scene: BoidsGameScene,
    spawnX: number,
    spawnY: number,
    leaderBoid: boolean,
    boidNumber: number
  ) {
    // Set up GameObject with physics and rigid body.
    // init size just so its set, will reset to something else later
    super("Boid", 1, true, true);

    this.scene = scene;
    this.mainBoid = leaderBoid;
    this.boidNumber = boidNumber;

    if (this.mainBoid == true) {
      this.boidType = "Leader";
    } else {
      if (seededRandom.getRandomFloat(0, 1) < 0.8) {
        this.boidType = "Good";
      } else {
        this.boidType = "Bad";
      }
    }

    this.physicsBody2D!.velocity = this.initVelocity();

    // Create a graphics object for the boid
    this.graphic = null;
    this.initBoid();

    // Init at provided location, and centered
    this.physicsBody2D!.position.x = spawnX;
    this.physicsBody2D!.position.y = spawnY;

    // Leader is disabled to start
    if (this.mainBoid == true) {
      this.disable();
    } else {
      this.enable();
    }

    this.subscribeToEvents();
  }

  initBoid() {
    this.updateBoidSize();

    // Init the graphics
    let boidAnimName = "";
    if (this.boidType == "Good") {
      boidAnimName = "Good Boid Anim";
    } else if (this.boidType == "Bad") {
      boidAnimName = "Bad Boid Anim";
    } else {
      boidAnimName = "Leader Boid Anim";
    }

    this.graphic = this.scene.add.sprite(0, 0, boidAnimName);
    this.graphic!.setOrigin(0.5, 0.5);

    // Define an animation for the sprite
    if (this.graphic instanceof Phaser.GameObjects.Sprite) {
      this.graphic!.anims.create({
        key: "boidAnimation",
        frames: this.graphic.anims.generateFrameNumbers(boidAnimName, {
          start: 0,
          end: -1,
        }), // -1 to use all frames
        frameRate: 6,
        repeat: -1, // Repeat indefinitely
      });
      this.graphic!.anims.play("boidAnimation");
    }
  }

  subscribeToEvents() {
    // Ensure that the boid updates its own speed when the speed value changes
    document.addEventListener(boidEventNames.onSpeedChange, () => {
      this.updateBoidSpeed();
    });

    // Leader boid movement etc.
    if (this.mainBoid) {
      // Follow pointer
      this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
        this.physicsBody2D!.position.x = pointer.worldX;
        this.physicsBody2D!.position.y = pointer.worldY;
      });
      this.scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
        this.physicsBody2D!.position.x = pointer.worldX;
        this.physicsBody2D!.position.y = pointer.worldY;
      });

      // Hide / reveal leader on pointer up / down
      document.addEventListener(
        boidEventNames.pointerholdclick,
        () => {
          // can only enable if leader is toggled on
          if (BoidFactors.leaderBoidEnabled == true) {
            this.enable();
          }
        },
        { capture: true }
      );

      // When the user lifts their finger off the screen, or stops clicking, the
      // leader boid should dissapear
      document.addEventListener(
        "pointerup",
        () => {
          this.disable();
        },
        { capture: true }
      );
      document.addEventListener(
        "pointercancel",
        () => {
          this.disable();
        },
        { capture: true }
      );
    }
  }

  unsubscribeFromEvents() {
    // Unsubscribe from the speed change event
    document.removeEventListener(
      boidEventNames.onSpeedChange,
      this.updateBoidSpeed
    );

    // Unsubscribe from leader boid events if this is the main boid
    if (this.mainBoid) {
      // Remove pointer events
      this.scene.input.off("pointerdown");
      this.scene.input.off("pointermove");

      // Remove custom events for leader boid visibility
      document.removeEventListener(
        boidEventNames.pointerholdclick,
        this.enable,
        {
          capture: true,
        }
      );
      document.removeEventListener("pointerup", this.disable, {
        capture: true,
      });
      document.removeEventListener("pointercancel", this.disable, {
        capture: true,
      });
    }
  }

  calculateBoidSize() {
    // Calculate the boid size based on the screen width
    let boidSize = window.innerHeight * 0.15;
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;

    // Phone screen has larger boids
    if (window.innerWidth <= 600 || isPortrait) {
      boidSize = window.innerHeight * 0.08;
    }

    return boidSize;
  }

  handleWindowResize(newX: number, newY: number) {
    if (newX == null || newY == null) {
      console.warn(
        "obj.handleWindowResize: newX or newY is null. Skipping resize handling."
      );
      return;
    }

    // Reinitialize the boid and its graphic on resize
    this.updateBoidSize();

    this.physicsBody2D!.position.x = newX;
    this.physicsBody2D!.position.y = newY;
  }

  initVelocity() {
    // Set velocity in a random direction
    let velocityDesired = new Vec2(
      seededRandom.getRandomFloat(0.1, 1),
      seededRandom.getRandomFloat(0.1, 1)
    );

    velocityDesired = this.clampVelocity(velocityDesired);
    return velocityDesired;
  }

  updateBoidSize() {
    this.size = this.calculateBoidSize();
    this.rigidBody2D!.hitboxSize = new Vec2(this.size, this.size);
  }

  updateBoidSpeed() {
    // Update's boid speed (mostly used so that when the "speed" value is changed by the slider, each boid can adjust their velocity to be
    // capped at the new speed)
    this.physicsBody2D!.velocity = this.clampVelocity(
      this.physicsBody2D!.velocity
    );
  }

  clampVelocity(velocityDesired: Vec2) {
    // Cleans up velocity such if the provided value is not within min and max speed,
    // it is normalized and then set in magnitude to the speed limit it is at.
    const normalizedVelocity = Vec2.normalize(velocityDesired);
    if (Vec2.magnitude(velocityDesired) > BoidFactors.speed) {
      velocityDesired = Vec2.scale(normalizedVelocity, BoidFactors.speed);
    }
    // Min speed is defined at 10% max speed
    else if (Vec2.magnitude(velocityDesired) < BoidFactors.speed * 0.1) {
      velocityDesired = Vec2.scale(normalizedVelocity, BoidFactors.speed * 0.1);
    }

    return velocityDesired;
  }

  // Physics for boid
  handlePhysics(boids: Boid[]) {
    // Skip physics calculation if the boid is disabled
    if (this.disabled) {
      return;
    }

    if (!this.mainBoid) {
      // Boid Behavior
      const desiredVelocity = this.handleBoidFlocking(boids);

      // Handle collisions
      this.rigidBody2D!.checkCollideScreenEdge(0);

      // Lerp toward desired velocity
      const lerpFactor = 0.1;
      this.physicsBody2D!.velocity.x = MoreMath.lerp(
        this.physicsBody2D!.velocity.x,
        desiredVelocity.x,
        lerpFactor
      );
      this.physicsBody2D!.velocity.y = MoreMath.lerp(
        this.physicsBody2D!.velocity.y,
        desiredVelocity.y,
        lerpFactor
      );

      // We can lerp, but never exceed speed limits
      this.physicsBody2D!.velocity = this.clampVelocity(
        this.physicsBody2D!.velocity
      );

      // Position update
      this.physicsBody2D!.updatePosition();
    }
  }

  handleBoidFlocking(boids: Boid[]) {
    // Initialize variables to compute the new velocity based on boid rules
    let velocSum = new Vec2(0, 0);
    let positionSum = new Vec2(0, 0);
    let separation = new Vec2(0, 0); // how far apart all boids are on avg (try to stay a certain distance apart)
    let opposingPositionSum = new Vec2(0, 0); // avg pos of opposing neighbors
    let similarNeighborsCount = 0;
    let opposingNeighborsCount = 0;

    let followLeader = false;
    let leaderPos = new Vec2(0, 0);

    // Loop through all other boids in the scene
    for (const otherBoid of boids) {
      if (otherBoid !== this && !otherBoid.disabled) {
        // Get distance attrs between this and other boid
        const distObj = this.getBoidDistance(otherBoid);
        const dx = distObj.dx;
        const dy = distObj.dy;
        const distanceSquared = distObj.distanceSquared;

        // If otherBoid is the main boid and the player is interacting (aka pointer is down), have this boid follow the leader if within leader follow radius!
        if (otherBoid.mainBoid == true && this.scene.isInteracting) {
          if (
            distanceSquared <
            BoidFactors.leaderFollowRadius * BoidFactors.leaderFollowRadius
          ) {
            followLeader = true;
            leaderPos = new Vec2(
              otherBoid.physicsBody2D!.position.x,
              otherBoid.physicsBody2D!.position.y
            );
          }
        }

        // If other boid is the same type as this boid, use regular boid logic!
        else if (this.boidType == otherBoid.boidType) {
          // Update boid flock measurements if otherBoid is within search radius
          if (
            distanceSquared <
            BoidFactors.flockSearchRadius * BoidFactors.flockSearchRadius
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
                  otherBoid.physicsBody2D!.position.y
                )
              );

              // If any boids are within the protected radius of a boid, steer away from them
              if (distance < BoidFactors.boidProtectedRadius) {
                // By doing 0 - distance, this allows us to have this boid move away from other boid
                separation = Vec2.add(
                  separation,
                  Vec2.subtract(new Vec2(0, 0), new Vec2(dx, dy))
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
            BoidFactors.flockSearchRadius * BoidFactors.flockSearchRadius
          ) {
            opposingNeighborsCount += 1;
            opposingPositionSum = Vec2.add(
              opposingPositionSum,
              new Vec2(
                otherBoid.physicsBody2D!.position.x,
                otherBoid.physicsBody2D!.position.y
              )
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
        velocSum.y / similarNeighborsCount
      );
      desiredVelocity.x +=
        (avgVeloc.x - this.physicsBody2D!.velocity.x) *
        BoidFactors.alignmentFactor;
      desiredVelocity.y +=
        (avgVeloc.y - this.physicsBody2D!.velocity.y) *
        BoidFactors.alignmentFactor;

      // Cohesion: Steer toward average neighboring boid position (aka center of mass)
      let avgPos = new Vec2(0, 0);
      avgPos = new Vec2(
        positionSum.x / similarNeighborsCount,
        positionSum.y / similarNeighborsCount
      );

      const directionObj = this.getMovementDirectionVectorThroughTorus(
        this.physicsBody2D!.position,
        avgPos
      );
      desiredVelocity.x +=
        Math.abs(avgPos.x - this.physicsBody2D!.position.x) *
        directionObj.directionX *
        BoidFactors.cohesionFactor;
      desiredVelocity.y +=
        Math.abs(avgPos.y - this.physicsBody2D!.position.y) *
        directionObj.directionY *
        BoidFactors.cohesionFactor;

      // Separation: boids steer away from boids within their boidProtectedRadius
      desiredVelocity.x += separation.x * BoidFactors.separationFactor;
      desiredVelocity.y += separation.y * BoidFactors.separationFactor;
    }

    // Follow the leader if told to do so!
    if (followLeader) {
      // Follow Leader
      const directionObj = this.getMovementDirectionVectorThroughTorus(
        this.physicsBody2D!.position,
        leaderPos
      );
      desiredVelocity.x +=
        Math.abs(leaderPos.x - this.physicsBody2D!.position.x) *
        directionObj.directionX *
        BoidFactors.leaderFollowFactor;
      desiredVelocity.y +=
        Math.abs(leaderPos.y - this.physicsBody2D!.position.y) *
        directionObj.directionY *
        BoidFactors.leaderFollowFactor;
    }

    // Perform opposing boid velocity updates
    if (opposingNeighborsCount > 0) {
      // Predator-prey: Steer toward average opposing boid position (aka center of mass) if predator (bad boid), and run away from this if prey (good boid)
      let opposingAvgPos = new Vec2(0, 0);
      opposingAvgPos = new Vec2(
        opposingPositionSum.x / opposingNeighborsCount,
        opposingPositionSum.y / opposingNeighborsCount
      );

      const directionObj = this.getMovementDirectionVectorThroughTorus(
        this.physicsBody2D!.position,
        opposingAvgPos
      );

      // Bad boid chases
      if (this.boidType == "Bad") {
        desiredVelocity.x +=
          Math.abs(opposingAvgPos.x - this.physicsBody2D!.position.x) *
          directionObj.directionX *
          BoidFactors.predatorPreyFactor;
        desiredVelocity.y +=
          Math.abs(opposingAvgPos.y - this.physicsBody2D!.position.y) *
          directionObj.directionY *
          BoidFactors.predatorPreyFactor;
      }
      // good boid runs away
      else if (this.boidType == "Good") {
        desiredVelocity.x +=
          -1 *
          Math.abs(opposingAvgPos.x - this.physicsBody2D!.position.x) *
          directionObj.directionX *
          BoidFactors.predatorPreyFactor;
        desiredVelocity.y +=
          -1 *
          Math.abs(opposingAvgPos.y - this.physicsBody2D!.position.y) *
          directionObj.directionY *
          BoidFactors.predatorPreyFactor;
      }
    }

    // Cleanup veloc so we dont exceed speed limit
    desiredVelocity = this.clampVelocity(desiredVelocity);

    return desiredVelocity;
  }

  getBoidDistance(otherBoid: Boid) {
    // Calculate distance between this boid and the other
    let dx =
      otherBoid.physicsBody2D!.position.x - this.physicsBody2D!.position.x;
    let dy =
      otherBoid.physicsBody2D!.position.y - this.physicsBody2D!.position.y;

    // Because boids can overflow to the other side of the screen, we need to check the
    // "torus" distance as well to see if the boids are closer in that direction.
    // To do so, we can assume the shorter route from one boid to another is through the edge of a screen if
    // their distance in a given direction (x or y) is greater than half the respective size of the screen.
    if (Math.abs(dx) > window.innerWidth / 2) {
      // If "other" is to the right of "this", then we subtract screen width since
      // in the land of "torus" geometry "other" is really to the left of "this" in their closest distance
      if (dx > 0) {
        dx -= window.innerWidth;
      } else {
        dx += window.innerWidth;
      }
    }
    if (Math.abs(dy) > window.innerHeight / 2) {
      // If "other" is above "this", then we subtract screen height since
      // in the land of "torus" geometry "other" is really below "this" in their closest distance
      if (dy > 0) {
        dy -= window.innerHeight;
      } else {
        dy += window.innerHeight;
      }
    }

    const distanceSquared = dx * dx + dy * dy;

    return {
      dx: dx,
      dy: dy,
      distanceSquared: distanceSquared,
    };
  }

  getMovementDirectionVectorThroughTorus(positionA: Vec2, positionB: Vec2) {
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
    if (Math.abs(dx) > window.innerWidth / 2) {
      // If positionB is to the right of positionA in this case, then we subtract screen width since
      // in the land of "torus" geometry positionB is really to the left of positionA in their closest distance through the edge
      if (dx > 0) {
        dx -= window.innerWidth;
      } else {
        dx += window.innerWidth;
      }
    }
    if (Math.abs(dy) > window.innerHeight / 2) {
      // If positionB is above of positionA in this case, then we subtract screen height since
      // in the land of "torus" geometry positionB is really to the below of positionA in their closest distance through the edge
      if (dy > 0) {
        dy -= window.innerHeight;
      } else {
        dy += window.innerHeight;
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
        window.innerWidth - edgeMargin - this.size / 2;
    }
    // If right, teleport to left side of screen
    else if (collisionDirection === "right") {
      this.physicsBody2D!.position.x = edgeMargin + this.size / 2;
    }
    // If top, move to bottom
    else if (collisionDirection === "top") {
      this.physicsBody2D!.position.y =
        window.innerHeight - edgeMargin - this.size / 2;
    }
    // If bottom, move to top
    else if (collisionDirection === "bottom") {
      this.physicsBody2D!.position.y = edgeMargin + this.size / 2;
    }
  }

  destroy() {
    super.destroy();

    // Unsubscribe from events
    this.unsubscribeFromEvents();
  }
}
