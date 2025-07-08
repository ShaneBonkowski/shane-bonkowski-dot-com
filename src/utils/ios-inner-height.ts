import { isIOS } from "@/src/utils/heuristics";

/**
 * Returns the "true" inner height of the viewport, accounting for iOS Safari
 * quirks. On iOS, this uses a 100vh ruler div to get the real viewport height
 * (excluding the address bar). On other platforms, it returns window.innerHeight.
 * @returns {number} iOS-compatible inner height.
 */
export function getIosCompatibleInnerHeight(): number {
  // Return early during SSR/static generation
  if (typeof window === "undefined") return 0;

  // eslint-disable-next-line no-restricted-syntax
  const windowInnerHeight = window.innerHeight;
  if (!isIOS()) return windowInnerHeight;

  return measureIOSInnerHeight() || windowInnerHeight;
}

/**
 * Measures the inner height of the viewport on iOS devices by creating a
 * hidden div that spans 100vh and measuring its height. This is needed
 * because iOS Safari does not respect 100vh correctly when things like
 * the address bar are visible.
 * @returns {number} The measured inner height.
 */
function measureIOSInnerHeight(): number {
  const ruler = getOrCreateIosInnerHeightRuler();
  return ruler.offsetHeight;
}

function getOrCreateIosInnerHeightRuler(): HTMLDivElement {
  // Get the ruler element if it already exists
  let ruler = document.getElementById(
    "ios-inner-height-ruler"
  ) as HTMLDivElement | null;

  // If the ruler doesn't exist, create it
  if (!ruler) {
    ruler = document.createElement("div");
    ruler.id = "ios-inner-height-ruler";
    ruler.style.position = "fixed";
    ruler.style.height = "100vh";
    ruler.style.width = "0";
    ruler.style.top = "0";
    ruler.style.left = "0";
    ruler.style.visibility = "hidden";
    ruler.style.pointerEvents = "none";
    document.body.appendChild(ruler);
  }
  return ruler;
}
