import type Phaser from "phaser";

export type PhaserModule = typeof Phaser;

export const loadPhaserModuleThenGame = async (
  loadPhaserGame: (phaser: PhaserModule) => Promise<void>
): Promise<void> => {
  const { default: phaser } = await import("phaser");
  await loadPhaserGame(phaser);
};

export const cleanupPhaserGame = (game: Phaser.Game | null): null => {
  if (game) {
    console.log("Destroying Phaser game instance.");
    game.destroy(true);
    game = null;
    console.log("Phaser game instance destroyed.");
  }

  // Remove all classes containing "game-background". This is because a common
  // naming convention is used for css game background classes (e.g. "better-boids-game-background")
  // in order to prevent CSS class name collisions.
  document.body.classList.forEach((className) => {
    if (className.includes("game-background")) {
      document.body.classList.remove(className);
    }
  });
  console.log("All game-background classes removed.");

  // Clear any inline styles so that bkg color can go back to normal in the
  // main app. This is needed for example when flip tile sets a bkg color
  // that we do not want to persist after the game is cleaned up.
  document.body.style.backgroundColor = "";

  // Return a "null'd" game instance to indicate that the game has been cleaned up
  return game;
};
