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
  const eventName = `uiMenu${action.charAt(0).toUpperCase() + action.slice(1)}`;
  const customEvent = new CustomEvent(eventName, {
    detail: {
      message: `${menuName} Menu ${action === "open" ? "Opened" : "Closed"}`,
    },
  });
  document.dispatchEvent(customEvent);
};
