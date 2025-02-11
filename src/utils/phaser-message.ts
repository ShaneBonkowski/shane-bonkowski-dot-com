import Phaser from "phaser";

let currentMessage: Phaser.GameObjects.Text | null = null;
let resizeObserver: ResizeObserver | null = null;

/**
 * Displays a message on the screen that fades out after a set duration.
 * @param {Phaser.Scene} scene - The Phaser scene in which to display the message. Typically just pass "this" into the function from the scene.
 * @param {string} messageText - The text to display in the message.
 */
export function showMessage(scene: Phaser.Scene, messageText: string) {
  // Destroy the current message if it exists
  if (currentMessage) {
    currentMessage.destroy();
    currentMessage = null;
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }

  // Create a text object for the message
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const message = scene.add.text(centerX, centerY, messageText, {
    fontFamily: "sans-serif",
    fontSize: "22pt",
    color: "#ffffff",
    align: "center",
    stroke: "#000000", // Black outline
    strokeThickness: 5,
    fixedWidth: window.innerWidth * 0.8,
    wordWrap: { width: window.innerWidth * 0.8 },
  });
  message.setOrigin(0.5);

  // Fade out the message
  scene.tweens.add({
    targets: message,
    alpha: 0,
    duration: 500, // Fade out duration in milliseconds
    delay: 1500, // Delay before starting the fade out
    onComplete: () => {
      if (message) {
        message.destroy();
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      currentMessage = null;
    },
  });

  // Set the current message
  currentMessage = message;

  // Observe window resizing with ResizeObserver
  resizeObserver = new ResizeObserver(() => {
    handleWindowResize(message);
  });
  resizeObserver.observe(document.documentElement);

  // Event listener functions
  const resizeHandler = () => handleWindowResize(message);
  const orientationChangeHandler = () => handleWindowResize(message);

  // Add event listeners
  window.addEventListener("resize", resizeHandler);
  window.addEventListener("orientationchange", orientationChangeHandler);

  // Cleanup function to remove event listeners and disconnect ResizeObserver
  const cleanup = () => {
    window.removeEventListener("resize", resizeHandler);
    window.removeEventListener("orientationchange", orientationChangeHandler);
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  };

  // Call cleanup when the scene is shutdown or destroyed
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup);
  scene.events.once(Phaser.Scenes.Events.DESTROY, cleanup);
}

function handleWindowResize(message: Phaser.GameObjects.Text): void {
  if (message) {
    message.setPosition(window.innerWidth / 2, window.innerHeight / 2);
    message.setStyle({
      fontFamily: "sans-serif",
      fontSize: "22pt",
      color: "#ffffff",
      align: "center",
      stroke: "#000000", // Black outline
      strokeThickness: 5,
      fixedWidth: window.innerWidth * 0.8,
      wordWrap: { width: window.innerWidth * 0.8 },
    });
  }
}
