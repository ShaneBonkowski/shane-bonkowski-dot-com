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

  document.body.classList.remove("game-background");

  // Return a "null'd" game instance to indicate that the game has been cleaned up
  return game;
};
