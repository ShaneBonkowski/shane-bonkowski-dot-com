/**
 * Checks if the currently focused element is an input field or a content-editable
 * element. This is useful for determining if the user is currently typing or
 * interacting with an input field.
 * * @returns {boolean} True if an input field / editable element is focused.
 */
export function isInputFocused(): boolean {
  const active = document.activeElement;
  if (!active) return false;

  const tag = active.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    (active as HTMLElement).isContentEditable
  );
}

/**
 * Estimates if the keyboard is likely open. This is a heuristic and may not be
 * 100% accurate, but it works well in most cases.
 * @returns {boolean} True if the keyboard is likely open.
 */
export function virtualKeyboardLikelyOpen(): boolean {
  return isInputFocused();
}
