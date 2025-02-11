/**
 * Class that represents a 2-dimensional vector.
 */
export class Vec2 {
  public x: number;
  public y: number;

  /**
   * Initializes a new instance of the Vec2 class.
   * @param {number} x - The x-coordinate of the vector.
   * @param {number} y - The y-coordinate of the vector.
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Calculates the magnitude (length) of the vector.
   * @param {Vec2} vector - The input vector.
   * @returns {number} The magnitude of the input vector.
   */
  static magnitude(vector: Vec2): number {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  }

  /**
   * Normalizes the input vector.
   * @param {Vec2} vector - The input vector.
   * @returns {Vec2} The normalized vector.
   */
  static normalize(vector: Vec2): Vec2 {
    const magnitude = Vec2.magnitude(vector);
    if (magnitude !== 0) {
      return new Vec2(vector.x / magnitude, vector.y / magnitude);
    } else {
      return new Vec2(0, 0);
    }
  }

  /**
   * Adds two vectors.
   * @param {Vec2} vector1 - The first vector.
   * @param {Vec2} vector2 - The second vector.
   * @returns {Vec2} The sum of the two vectors.
   */
  static add(vector1: Vec2, vector2: Vec2): Vec2 {
    return new Vec2(vector1.x + vector2.x, vector1.y + vector2.y);
  }

  /**
   * Subtracts one vector from another.
   * @param {Vec2} vector1 - The vector to subtract from.
   * @param {Vec2} vector2 - The vector to subtract.
   * @returns {Vec2} The difference of the two vectors.
   */
  static subtract(vector1: Vec2, vector2: Vec2): Vec2 {
    return new Vec2(vector1.x - vector2.x, vector1.y - vector2.y);
  }

  /**
   * Calculates the dot product of two vectors.
   * @param {Vec2} vector1 - The first vector.
   * @param {Vec2} vector2 - The second vector.
   * @returns {number} The dot product of the two vectors.
   */
  static dot(vector1: Vec2, vector2: Vec2): number {
    return vector1.x * vector2.x + vector1.y * vector2.y;
  }

  /**
   * Scales a vector by a scalar value.
   * @param {Vec2} vector - The vector to scale.
   * @param {number} scalar - The scalar value.
   * @returns {Vec2} The scaled vector.
   */
  static scale(vector: Vec2, scalar: number): Vec2 {
    return new Vec2(vector.x * scalar, vector.y * scalar);
  }
}
