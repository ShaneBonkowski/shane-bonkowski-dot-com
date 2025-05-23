import { Boid } from "@/src/games/better-boids/boid";
import { SeededRandom } from "@/src/utils/seedable-random";
import { MainGameScene } from "@/src/games/better-boids/scenes/main-game-scene";

const seededRandom = new SeededRandom(1234);

export async function instantiateBoids(
  scene: MainGameScene,
  boidCount: number
): Promise<Boid[]> {
  // Allows for async behavior
  return new Promise(async (resolve, reject) => {
    void reject; // Unused variable

    const boids: Boid[] = [];
    let boidsInitialized = 0;

    // Spawn in the main boid at the middle of the screen, it will follow pointer
    const spawnX = window.innerWidth / 2;
    const spawnY = window.innerHeight / 2;
    let leaderBoid = true;
    const mainBoid = new Boid(scene, spawnX, spawnY, leaderBoid, 0);
    boids.push(mainBoid);

    // Spawn in other boids randomly to start
    leaderBoid = false;
    for (let i = 0; i < boidCount; i++) {
      const randomX = seededRandom.getRandomFloat(0.1, 0.9) * window.innerWidth;
      const randomY =
        seededRandom.getRandomFloat(0.1, 0.9) * window.innerHeight;
      const boid = new Boid(
        scene,
        randomX,
        randomY,
        leaderBoid,
        boidsInitialized + 1
      );
      boids.push(boid);
      boidsInitialized++;

      // Promise wont resolve until all boids are initialized
      function checkInitialization() {
        if (boidsInitialized === boidCount) {
          resolve(boids); // Resolve the Promise with the array of boids
        }
      }
      checkInitialization();
    }
  });
}
