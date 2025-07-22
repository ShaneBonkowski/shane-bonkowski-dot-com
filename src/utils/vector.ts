/**
 * Class that represents a 2-dimensional vector.
 */
export class Vec2 {
  public x: number = 0;
  public y: number = 0;

  /**
   * Initializes a new instance of the Vec2 class.
   * @param {number} x - The x-coordinate of the vector.
   * @param {number} y - The y-coordinate of the vector.
   */
  // eslint-disable-next-line no-restricted-syntax
  constructor(x: number, y: number) {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

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

/**
 * Class that represents a 3-dimensional vector.
 */
export class Vec3 {
  public x: number = 0;
  public y: number = 0;
  public z: number = 0;

  /**
   * Initializes a new instance of the Vec3 class.
   * @param {number} x - The x-coordinate of the vector.
   * @param {number} y - The y-coordinate of the vector.
   * @param {number} z - The z-coordinate of the vector.
   */
  // eslint-disable-next-line no-restricted-syntax
  constructor(x: number, y: number, z: number) {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Calculates the magnitude (length) of the vector.
   * @param {Vec3} vector - The input vector.
   * @returns {number} The magnitude of the input vector.
   */
  static magnitude(vector: Vec3): number {
    return Math.sqrt(
      vector.x * vector.x + vector.y * vector.y + vector.z * vector.z
    );
  }

  /**
   * Normalizes the input vector.
   * @param {Vec3} vector - The input vector.
   * @returns {Vec3} The normalized vector.
   */
  static normalize(vector: Vec3): Vec3 {
    const magnitude = Vec3.magnitude(vector);
    if (magnitude !== 0) {
      return new Vec3(
        vector.x / magnitude,
        vector.y / magnitude,
        vector.z / magnitude
      );
    } else {
      return new Vec3(0, 0, 0);
    }
  }

  /**
   * Adds two vectors.
   * @param {Vec3} vector1 - The first vector.
   * @param {Vec3} vector2 - The second vector.
   * @returns {Vec3} The sum of the two vectors.
   */
  static add(vector1: Vec3, vector2: Vec3): Vec3 {
    return new Vec3(
      vector1.x + vector2.x,
      vector1.y + vector2.y,
      vector1.z + vector2.z
    );
  }

  /**
   * Subtracts one vector from another.
   * @param {Vec3} vector1 - The vector to subtract from.
   * @param {Vec3} vector2 - The vector to subtract.
   * @returns {Vec3} The difference of the two vectors.
   */
  static subtract(vector1: Vec3, vector2: Vec3): Vec3 {
    return new Vec3(
      vector1.x - vector2.x,
      vector1.y - vector2.y,
      vector1.z - vector2.z
    );
  }

  /**
   * Calculates the dot product of two vectors.
   * @param {Vec3} vector1 - The first vector.
   * @param {Vec3} vector2 - The second vector.
   * @returns {number} The dot product of the two vectors.
   */
  static dot(vector1: Vec3, vector2: Vec3): number {
    return (
      vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z
    );
  }

  /**
   * Calculates the cross product of two vectors.
   * @param {Vec3} vector1 - The first vector.
   * @param {Vec3} vector2 - The second vector.
   * @returns {Vec3} The cross product of the two vectors.
   */
  static cross(vector1: Vec3, vector2: Vec3): Vec3 {
    return new Vec3(
      vector1.y * vector2.z - vector1.z * vector2.y,
      vector1.z * vector2.x - vector1.x * vector2.z,
      vector1.x * vector2.y - vector1.y * vector2.x
    );
  }

  /**
   * Scales a vector by a scalar value.
   * @param {Vec3} vector - The vector to scale.
   * @param {number} scalar - The scalar value.
   * @returns {Vec3} The scaled vector.
   */
  static scale(vector: Vec3, scalar: number): Vec3 {
    return new Vec3(vector.x * scalar, vector.y * scalar, vector.z * scalar);
  }
}
