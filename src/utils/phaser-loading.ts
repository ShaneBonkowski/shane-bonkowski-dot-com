import type Phaser from "phaser";

export type PhaserModule = typeof Phaser;

export const loadPhaserModuleThenGame = async (
  loadPhaserGame: (phaser: PhaserModule) => Promise<void>
): Promise<void> => {
  const { default: phaser } = await import("phaser");
  await loadPhaserGame(phaser);
};

export const startPhaserGame = (
  loadScene: () => Promise<{ MainGameScene: Phaser.Types.Scenes.SceneType }>
): (() => void) => {
  let cancelled = false;
  let game: Phaser.Game | null = null;

  loadPhaserModuleThenGame(async (phaser) => {
    if (cancelled) return;

    try {
      const { MainGameScene } = await loadScene();
      if (cancelled) return;

      const gameConfig: Phaser.Types.Core.GameConfig = {
        type: phaser.AUTO,
        width: "100%",
        height: "100%",
        transparent: true,
        scale: {
          mode: phaser.Scale.NONE, // see phaser-canvas.ts resizeCanvasToParent() for manual resizing
          autoCenter: phaser.Scale.NO_CENTER,
        },
        scene: MainGameScene,
        parent: "phaser-game",
      };

      game = new phaser.Game(gameConfig);
      console.log(`Phaser game created successfully.`);
    } catch (error) {
      console.error("Failed to load Game Scene:", error);
    }
  }).catch((error) => {
    console.error("Failed to load Phaser module:", error);
  });

  return () => {
    cancelled = true;
    game = cleanupPhaserGame(game);
  };
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
