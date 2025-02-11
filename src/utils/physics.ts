/**
 * Provides physics utility functions and properties.
 */
export class Physics {
  static physicsUpdateInterval: number = 1000 / 60; // 60 Hz
  static lastPhysicsUpdateTime: number = 0;

  /**
   * Performs a physics update.
   * @param {number} time - The current timestamp.
   */
  static performPhysicsUpdate(time: number) {
    this.lastPhysicsUpdateTime = time;
  }

  /**
   * Checks for collision between two circles based on the squared distance between their centers.
   * @param {number} distanceSquared - The squared distance between the centers of the circles.
   * @param {number} colliderOneRadius - The radius of the first circle.
   * @param {number} colliderTwoRadius - The radius of the second circle.
   * @returns {boolean} True if collision occurs, otherwise false.
   */
  static checkCircleCollision(
    distanceSquared: number,
    colliderOneRadius: number,
    colliderTwoRadius: number
  ): boolean {
    if (distanceSquared < (colliderOneRadius + colliderTwoRadius) ** 2) {
      return true;
    }
    return false;
  }
}
