/**
 * Creates a throttled version of the provided function that ensures the function
 * is only called at most once within the specified time limit.
 *
 * @template F - The type of the function to throttle.
 * @param {F} func - The function to throttle.
 * @param {number} limit - The time limit (in milliseconds) to throttle the function.
 * @returns {(...args: Parameters<F>) => void} - A throttled version of the provided function.
 *
 * @example
 * const throttledLog = throttle((msg: string) => console.log(msg), 1000);
 * window.addEventListener('resize', () => throttledLog('Resized!'));
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<F extends (...args: any[]) => void>(
  func: F,
  limit: number
): (...args: Parameters<F>) => void {
  let lastFunc: NodeJS.Timeout | undefined = undefined;
  let lastRan: number | null = null;

  return function executedFunction(...args: Parameters<F>) {
    const now = Date.now();

    if (lastRan === null || now - lastRan >= limit) {
      func(...args);
      lastRan = now;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        func(...args);
        lastRan = Date.now();
      }, limit - (now - lastRan));
    }
  };
}
