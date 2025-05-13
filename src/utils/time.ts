/**
 * Pauses execution for the specified number of milliseconds.
 *
 * This function returns a Promise that resolves after the given time,
 * allowing you to use it with `await` to introduce delays in asynchronous functions.
 *
 * @param {number} ms - The number of milliseconds to wait.
 * @returns {Promise<void>} A Promise that resolves after the specified time.
 *
 * @example
 * import { wait } from '@/utils/time';
 *
 * export async function exampleFunction() {
 *   console.log('Start');
 *   await wait(1000); // Wait for 1 second
 *   console.log('End');
 * }
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
