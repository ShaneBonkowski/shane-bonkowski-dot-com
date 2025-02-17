type Procedure = (...args: unknown[]) => void;

/**
 * Debounce a function so it only runs after a certain amount of time has passed since the last call
 * @param {F} func - The function to debounce
 * @param {number} wait - The time to wait before calling the function again
 * @return {F} - The debounced function
 */
export function debounce<F extends Procedure>(func: F, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
