export const loadPhaserScriptThenGame = (loadPhaserGame: () => void): void => {
  // Check if Phaser script is already loaded
  const existingScript = document.querySelector(
    'script[src="/js/phaser.min.js"]'
  ) as HTMLScriptElement;

  if (existingScript) {
    console.log("Phaser script already loaded.");
    loadPhaserGame();
    return;
  }

  // Load the script, then the game afterwards
  const script = document.createElement("script");
  script.src = "/js/phaser.min.js";

  script.onload = () => {
    console.log("Phaser script loaded successfully.");
    loadPhaserGame();
  };

  script.onerror = () => {
    console.error("Failed to load Phaser script");
  };

  document.head.appendChild(script);
};

export const cleanupPhaserGame = (game: Phaser.Game | null): null => {
  if (game) {
    console.log("Destroying Phaser game instance.");
    game.destroy(true);
    game = null;
    console.log("Phaser game instance destroyed.");
  }

  const script = document.querySelector(
    'script[src="/js/phaser.min.js"]'
  ) as HTMLScriptElement;
  if (script && document.head.contains(script)) {
    document.head.removeChild(script);
    console.log("Phaser script removed.");
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
