/**
 * Dispatches a custom event for menu actions (e.g., opening or closing a menu).
 *
 * This function generates a custom event with a dynamic name based on the menu
 * name and action (e.g., "uiMenuOpen" or "uiMenuClose").
 *
 * @param menuName - The name of the menu (e.g., "Info", "Settings").
 * @param action - The action performed on the menu ("open" or "close").
 *
 * @example
 * // Dispatch an event for opening the Info menu
 * dispatchMenuEvent("Info", "open");
 * // This will create and dispatch a "uiMenuOpen" event with the message:
 * // "Info Menu Opened"
 */
export const dispatchMenuEvent = (
  menuName: string,
  action: "open" | "close"
) => {
  // One of "uiMenuOpen" or "uiMenuClose"
  const eventName = `uiMenu${action.charAt(0).toUpperCase() + action.slice(1)}`;
  document.dispatchEvent(
    new CustomEvent(eventName, {
      detail: {
        message: `${menuName} Menu ${action === "open" ? "Opened" : "Closed"}`,
      },
    })
  );
};

/**
 * Dispatches a custom event for when a game starts.
 *
 * @param gameName - The name of the game (e.g. "Better Boids").
 *
 * @example
 * dispatchGameStartedEvent("Better Boids");
 * // This will create and dispatch a "gameStarted" event with the message:
 * // "Better Boids Game Started"
 */
export const dispatchGameStartedEvent = (gameName: string) => {
  document.dispatchEvent(
    new CustomEvent("gameStarted", {
      detail: {
        message: `${gameName} Game Started`,
      },
    })
  );
};

/**
 * Dispatches a custom event for when loading screen can be closed.
 *
 * @param gameName - The name of the game (e.g. "Better Boids").
 */
export const dispatchCloseLoadingScreenEvent = (gameName: string) => {
  document.dispatchEvent(
    new CustomEvent("closeLoadingScreen", {
      detail: {
        message: `${gameName} Hide Loading Screen`,
      },
    })
  );
};
