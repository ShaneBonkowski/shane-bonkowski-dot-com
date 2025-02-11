/**
 * Provides functions for modular arithmetic operations.
 */
export class moduloArith {
  /**
   * Performs modulo operation on a number.
   * @param {number} num - The number to be modulo operated.
   * @param {number} modulus - The modulus value.
   * @returns {number} The result of the modulo operation.
   */
  static mod(num: number, modulus: number): number {
    return ((num % modulus) + modulus) % modulus;
  }

  /**
   * Subtracts one number from another with modulo arithmetic.
   * @param {number} a - The number to be subtracted from.
   * @param {number} b - The number to subtract.
   * @param {number} modulus - The modulus value.
   * @returns {number} The result of the subtraction with modulo arithmetic.
   */
  static modSubtract(a: number, b: number, modulus: number): number {
    // Validate inputs
    [a, b, modulus] = [Number(a), Number(b), Number(modulus)]; // Convert inputs to numbers
    if (Number.isNaN(a) || Number.isNaN(b) || Number.isNaN(modulus)) {
      return NaN; // Invalid input: return NaN
    }

    // Perform modulo subtraction
    return this.mod(a - b, modulus);
  }

  /**
   * Adds two numbers with modulo arithmetic.
   * @param {number} a - The first number to be added.
   * @param {number} b - The second number to be added.
   * @param {number} modulus - The modulus value.
   * @returns {number} The result of the addition with modulo arithmetic.
   */
  static modAdd(a: number, b: number, modulus: number): number {
    // Validate inputs
    [a, b, modulus] = [Number(a), Number(b), Number(modulus)]; // Convert inputs to numbers
    if (Number.isNaN(a) || Number.isNaN(b) || Number.isNaN(modulus)) {
      return NaN; // Invalid input: return NaN
    }

    // Perform modulo addition
    return this.mod(a + b, modulus);
  }

  /**
   * Multiplies two numbers with modulo arithmetic.
   * @param {number} a - The first number to be multiplied.
   * @param {number} b - The second number to be multiplied.
   * @param {number} modulus - The modulus value.
   * @returns {number} The result of the multiplication with modulo arithmetic.
   */
  static modMultiply(a: number, b: number, modulus: number): number {
    // Validate inputs
    [a, b, modulus] = [Number(a), Number(b), Number(modulus)]; // Convert inputs to numbers
    if (Number.isNaN(a) || Number.isNaN(b) || Number.isNaN(modulus)) {
      return NaN; // Invalid input: return NaN
    }

    // Perform modulo multiplication
    return this.mod(a * b, modulus);
  }

  /**
   * Calculates the modular exponentiation of a number.
   * @param {number} base - The base number.
   * @param {number} exponent - The exponent.
   * @param {number} modulus - The modulus value.
   * @returns {number} The result of the modular exponentiation.
   */
  static modPow(base: number, exponent: number, modulus: number): number {
    let result = 1;
    base = this.mod(base, modulus);
    while (exponent > 0) {
      if (exponent % 2 === 1) {
        result = this.mod(result * base, modulus);
      }
      exponent = Math.floor(exponent / 2);
      base = this.mod(base * base, modulus);
    }
    return result;
  }

  /**
   * Calculates the modular inverse of a number.
   * @param {number} a - The number for which to find the modular inverse.
   * @param {number} m - The modulus value.
   * @returns {number} The modular inverse of the given number modulo 'm'.
   */
  static modInverse(a: number, m: number): number {
    // Validate inputs
    [a, m] = [Number(a), Number(m)]; // Convert inputs to numbers
    if (Number.isNaN(a) || Number.isNaN(m)) {
      return NaN; // Invalid input: return NaN
    }

    // Reduce 'a' to positive residue modulo 'm'
    a = this.mod(a, m);

    // Check for special cases
    if (!a || m < 2) {
      return NaN; // Invalid input: return NaN
    }

    // Extended Euclidean Algorithm
    let [oldR, r] = [a, m];
    let [oldS, s] = [1, 0];
    let [oldT, t] = [0, 1];
    while (r !== 0) {
      const quotient = Math.floor(oldR / r);
      [oldR, r] = [r, oldR - quotient * r];
      [oldS, s] = [s, oldS - quotient * s];
      [oldT, t] = [t, oldT - quotient * t];
    }

    // Ensure the result is a positive residue modulo 'm'
    return this.mod(oldS, m);
  }
}
