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
 * Estimates if mobile virtual keyboard is likely open. This is a heuristic and
 * may not be 100% accurate, but it works well in most cases.
 * @returns {boolean} True if the keyboard is likely open.
 */
export function mobileVirtualKeyboardLikelyOpen(): boolean {
  // Only applies to mobile devices
  if (!isMobileDevice()) return false;

  return isInputFocused();
}

/**
 * Checks if an iOS or similar window is likely open. This is a heuristic that
 * checks if the visual viewport height is significantly less than the document
 * height, which indicates that the address bar, virtual keyboard, or other UI
 * elements are likely visible. NOTE: This is not foolproof, especially if the
 * user has zoomed at all. Since zooming is mostly blocked on app-like windows
 * on this site, this heuristic should work will in most cases.
 * @returns {boolean} True if the iOS or similar window is likely open.
 */
export function mobileWindowLikelyOpen(): boolean {
  // Return early during SSR/static generation
  if (typeof window === "undefined") return false;

  // Only applies to mobile devices
  if (!isMobileDevice()) return false;

  // eslint-disable-next-line no-restricted-syntax
  const visualHeight = window.visualViewport?.height || window.innerHeight;
  const documentHeight = document.documentElement.clientHeight;

  // If the visual height is significantly less than the document height,
  // it suggests that the address bar or similar UI elements are open.
  // Similar for if the mobile virtual keyboard is likely open.
  return (
    visualHeight < documentHeight * 0.9 || mobileVirtualKeyboardLikelyOpen()
  );
}

/**
 * Checks if the current device is a mobile device based on the user agent
 * string and other available properties.
 * @returns {boolean} True if the device is mobile.
 */
export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;

  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent
  );
}

/**
 * Checks if the current device is an iOS device (iPhone, iPad, or iPod).
 * @returns {boolean} True if the device is iOS.
 */
export function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;

  return /iphone|ipod|ipad/i.test(navigator.userAgent);
}
