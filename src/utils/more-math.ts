export class MoreMath {
  /**
   * Performs linear interpolation between two values.
   * @param {number} start - The starting value.
   * @param {number} end - The ending value.
   * @param {number} t - The interpolation parameter. Should be between 0 and 1.
   * @returns {number} The interpolated value.
   */
  static lerp(start: number, end: number, t: number): number {
    return (1 - t) * start + t * end;
  }

  /**
   * Calculates an exponential interpolation factor for frame-rate independent lerp.
   * After 'duration' ms, the value will be within 'accuracy' of the target.
   * Use this to get a smooth interpolation factor for lerp.
   * @param {number} delta - The elapsed time since the last frame (ms).
   * @param {number} duration - The total duration for interpolation to complete in (ms).
   * @param {number} accuracy - How close to the target to achieve (e.g., 0.01 for 1%).
   * @returns {number} The interpolation factor to use in lerp (aka "t" value) (between 0 and 1).
   */
  static getLerpInterpolatedValue(
    delta: number,
    duration: number,
    accuracy: number = 0.01
  ): number {
    // Clamp delta/duration to [0, 1] for safety
    const t = Math.max(0, Math.min(delta / duration, 1));
    // Exponential interpolation for frame-rate independence
    return 1 - Math.pow(accuracy, t);
  }

  /**
   * Performs linear interpolation between two values with a threshold.
   * If the difference between start and end is lower than the threshold, it jumps to the end value.
   * @param {number} start - The starting value.
   * @param {number} end - The ending value.
   * @param {number} t - The interpolation parameter. Should be between 0 and 1.
   * @param {number} threshold - The threshold for jumping to the end value.
   * @returns {number} The interpolated value or the end value if the threshold is exceeded.
   */
  static lerpWithThreshold(
    start: number,
    end: number,
    t: number,
    threshold: number
  ): number {
    const difference = Math.abs(end - start);

    // If the difference is lower than the threshold, jump to the end value
    if (difference < threshold) {
      return end;
    }

    // Otherwise, call the existing lerp function
    return this.lerp(start, end, t);
  }

  /**
   * Clamps a value between a minimum and maximum value.
   * @param {number} value - The value to be clamped.
   * @param {number} min - The minimum value.
   * @param {number} max - The maximum value.
   * @returns {number} The clamped value.
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
  }

  /**
   * Rounds a number to a specified number of decimal digits.
   * @param {number} value - The number to round.
   * @param {number} digits - The number of decimal digits to round to.
   * @returns {number} The rounded number.
   */
  static roundToDigits(value: number, digits: number): number {
    const factor = Math.pow(10, digits);
    return Math.round(value * factor) / factor;
  }
}
