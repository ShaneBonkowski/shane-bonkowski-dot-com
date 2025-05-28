import { Boid } from "@/src/games/better-boids/boid";
import { SeededRandom } from "@/src/utils/seedable-random";
import { MainGameScene } from "@/src/games/better-boids/scenes/main-game-scene";

const seededRandom = new SeededRandom(1234);

export function instantiateBoids(
  scene: MainGameScene,
  boidCount: number
): Boid[] {
  const boids: Boid[] = [];

  // Spawn in the main boid at the middle of the screen, it will follow pointer
  const spawnX = (window.visualViewport?.width || window.innerWidth) / 2;
  const spawnY = (window.visualViewport?.height || window.innerHeight) / 2;
  let leaderBoid = true;
  const mainBoid = new Boid(scene, spawnX, spawnY, leaderBoid, 0);
  boids.push(mainBoid);

  // Spawn in other boids randomly to start
  leaderBoid = false;
  for (let i = 0; i < boidCount; i++) {
    const randomX =
      seededRandom.getRandomFloat(0.1, 0.9) *
      (window.visualViewport?.width || window.innerWidth);
    const randomY =
      seededRandom.getRandomFloat(0.1, 0.9) *
      (window.visualViewport?.height || window.innerHeight);
    const boid = new Boid(scene, randomX, randomY, leaderBoid, i + 1);
    boids.push(boid);
  }

  return boids;
}
