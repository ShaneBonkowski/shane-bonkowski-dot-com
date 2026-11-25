type Procedure = (...args: unknown[]) => void;

/**
 * Debounce a function so it only runs after a certain amount of time has passed since the last call
 * @param {F} func - The function to debounce
 * @param {number} wait - The time to wait before calling the function again
 * @returns The debounced function, with a flush method to run pending work immediately.
 */
export function debounce<F extends Procedure>(func: F, wait: number) {
  let timeout: NodeJS.Timeout;
  let pending: (() => void) | null = null;
  const flush = () => {
    if (!pending) return;
    clearTimeout(timeout);
    const callback = pending;
    pending = null;
    callback();
  };
  const debounced = function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    clearTimeout(timeout);
    pending = () => func.apply(this, args);
    timeout = setTimeout(flush, wait);
  };
  debounced.flush = flush;
  return debounced;
}
