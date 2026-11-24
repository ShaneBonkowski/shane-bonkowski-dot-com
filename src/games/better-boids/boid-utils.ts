import { Boid } from "@/src/games/better-boids/boid";
import { SeededRandom } from "@/src/utils/seedable-random";
import { MainGameScene } from "@/src/games/better-boids/scenes/main-game-scene";
import { Vec2 } from "@/src/utils/vector";
import { settingsStore } from "@/src/games/better-boids/settings-store";

const seededRandom = new SeededRandom(1234);
const obstacleRandom = new SeededRandom(1234);

const MIN_BOID_SPAWN_ATTEMPTS = 50;
const MIN_OBSTACLE_SPAWN_ATTEMPTS = 50;

function getMinBoidDistance(boid1Size: number): number {
  // Minimum distance is boid width * 2
  return boid1Size * 2;
}

function isTooCloseToOtherBoid(
  position: Vec2,
  boidSize: number,
  otherBoids: Array<{ position: Vec2 }>
): boolean {
  for (const other of otherBoids) {
    const minDist = getMinBoidDistance(boidSize);
    const dx = position.x - other.position.x;
    const dy = position.y - other.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < minDist) {
      return true;
    }
  }
  return false;
}

function getObstacleSpawnPosition(
  scene: MainGameScene,
  obstacleSize: number,
  boids: Boid[]
): Vec2 | null {
  const padding = obstacleSize / 2 + 10;
  const minX = padding;
  const maxX = scene.screenInfo.width - padding;
  const minY = padding;
  const maxY = scene.screenInfo.height - padding;

  for (let attempt = 0; attempt < MIN_OBSTACLE_SPAWN_ATTEMPTS; attempt++) {
    const position = new Vec2(
      obstacleRandom.getRandomFloat(minX, maxX),
      obstacleRandom.getRandomFloat(minY, maxY)
    );

    const isTooClose = boids.some((boid) => {
      const otherPosition = boid.physicsBody2D!.position;
      const minDistance = (obstacleSize + boid.rigidBody2D!.hitboxSize.x) / 2 + 10;
      const dx = position.x - otherPosition.x;
      const dy = position.y - otherPosition.y;
      return Math.sqrt(dx * dx + dy * dy) < minDistance;
    });

    if (!isTooClose) return position;
  }

  return null;
}

export function instantiateBoids(
  scene: MainGameScene
): Boid[] {
  const settings = settingsStore.getSnapshot();
  const boids: Boid[] = [];
  const tempBoids: Array<{ position: Vec2 }> = [];

  // Spawn in the main boid (leader) at the middle of the screen, it will follow pointer
  const spawnX = scene.screenInfo.width / 2;
  const spawnY = scene.screenInfo.height / 2;
  const mainBoid = new Boid(scene, spawnX, spawnY, "Leader");
  boids.push(mainBoid);

  tempBoids.push({
    position: new Vec2(
      mainBoid.physicsBody2D!.position.x,
      mainBoid.physicsBody2D!.position.y
    ),
  });

  // Spawn good and bad boids
  for (const { type, count } of [
    { type: "Good", count: settings.goodBoidCount },
    { type: "Bad", count: settings.badBoidCount },
  ] as const) {
    for (let i = 0; i < count; i++) {
      for (let attempt = 0; attempt < MIN_BOID_SPAWN_ATTEMPTS; attempt++) {
        const randomX =
          seededRandom.getRandomFloat(0.1, 0.9) * scene.screenInfo.width;
        const randomY =
          seededRandom.getRandomFloat(0.1, 0.9) * scene.screenInfo.height;
        const testPosition = new Vec2(randomX, randomY);

        // Create a temporary boid to get its size for collision checking
        const tempBoid = new Boid(scene, randomX, randomY, type);
        const boidSize = tempBoid.rigidBody2D!.hitboxSize.x;

        if (!isTooCloseToOtherBoid(testPosition, boidSize, tempBoids) || attempt === MIN_BOID_SPAWN_ATTEMPTS - 1) {
          // Keep the last candidate if there is no uncrowded position.
          tempBoids.push({
            position: testPosition,
          });
          boids.push(tempBoid);
          break;
        } else {
          // Position is too close, destroy this temporary boid and try again
          tempBoid.destroy();
        }
      }
    }
  }

  // Spawn obstacles based on settings
  for (let i = 0; i < settings.obstacleCount; i++) {
    let obstacleSpawned = false;
    for (let attempt = 0; attempt < MIN_OBSTACLE_SPAWN_ATTEMPTS; attempt++) {
      // Create a temporary obstacle to get its size
      const tempObstacle = new Boid(scene, 0, 0, "Obstacle");
      const obstacleSize = tempObstacle.rigidBody2D!.hitboxSize.x;
      const spawnPos = getObstacleSpawnPosition(scene, obstacleSize, boids);
      tempObstacle.destroy();

      if (spawnPos) {
        boids.push(new Boid(scene, spawnPos.x, spawnPos.y, "Obstacle"));
        obstacleSpawned = true;
        break;
      }
    }

    if (!obstacleSpawned) {
      console.warn(`Failed to spawn obstacle ${i} after ${MIN_OBSTACLE_SPAWN_ATTEMPTS} attempts`);
    }
  }

  return boids;
}
