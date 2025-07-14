export const randomType = {
  UNSEEDED_RANDOM: -1,
};

/**
 * Generates pseudo-random numbers with optional seed for reproducibility.
 */
export class SeededRandom {
  public seed: number = 0;
  /**
   * Creates a new SeededRandom instance with the specified seed.
   * @param {number} seed - The seed value. Use randomType.UNSEEDED_RANDOM for "real", unseeded randomness.
   */
  // eslint-disable-next-line no-restricted-syntax
  constructor(seed: number = randomType.UNSEEDED_RANDOM) {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    this.seed = seed;
  }

  /**
   * Generates a pseudo-random float between 0 (inclusive) and 1 (exclusive).
   * @returns {number} A pseudo-random float.
   */
  random(): number {
    // If we supply randomType.UNSEEDED_RANDOM, then
    // we do real randomness instead of seeded randomness
    if (this.seed === randomType.UNSEEDED_RANDOM) {
      return Math.random();
    } else {
      let x = this.seed;
      x ^= x << 13;
      x ^= x >> 17;
      x ^= x << 5;
      this.seed = x;
      let randVal = (x >>> 0) / ((1 << 31) >>> 0);

      // Dont let random exceed (or equal) 1.
      // This causes issues sometimes, so keep it exclusive on the upper bound.
      if (randVal >= 1) {
        randVal = 0.999;
      }
      return randVal;
    }
  }

  /**
   * Generates a pseudo-random float within the specified range.
   * @param {number} min - The minimum value (inclusive). Can be negative.
   * @param {number} max - The maximum value (exclusive). Can be negative.
   * @returns {number} A pseudo-random float within the specified range.
   */
  getRandomFloat(min: number, max: number): number {
    return this.random() * (max - min) + min;
  }

  /**
   * Generates a pseudo-random integer within the specified range.
   * @param {number} min - The minimum value (inclusive). Can be negative.
   * @param {number} max - The maximum value (exclusive). Can be negative.
   * @returns {number} A pseudo-random integer within the specified range.
   */
  getRandomInt(min: number, max: number): number {
    if (max <= min) {
      console.error(
        "Max is less than min. Max and min are as follows:",
        max,
        min
      );
      return -1;
    }

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(this.random() * (max - min)) + min;
  }
}
