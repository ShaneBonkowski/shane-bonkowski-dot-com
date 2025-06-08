import { RigidBody2D } from "@/src/utils/rigid-body-2d";
import { PhysicsBody2D } from "@/src/utils/physics-body-2d";
import { SeededRandom } from "@/src/utils/seedable-random";
import { Vec2 } from "./vector";

/**
 * Class representing a game object.
 */
export class GameObject {
  static currentId: number = 0; // Static property to keep track of the current ID
  static instances: GameObject[] = []; // Static array to hold all GameObject instances

  public id: number;
  public name: string;
  public disabled: boolean;
  public size: Vec2;
  public graphic:
    | Phaser.GameObjects.Sprite
    | Phaser.GameObjects.Shape
    | Phaser.GameObjects.Container
    | null;
  public physicsBody2D: PhysicsBody2D | null;
  public rigidBody2D: RigidBody2D | null;

  /**
   * Create a GameObject.
   * @param {string} name - The name of the game object.
   * @param {Vec2} size - Size of the gameobject, mostly for sizing the graphic attatched to it.
   * @param {boolean} hasPhysicsBody2D - Does the GameObject have PhysicsBody2D base class?
   * @param {boolean} hasRigidBody2D - Does the GameObject have RigidBody2D base class?
   */
  constructor(
    name: string,
    size: Vec2 = new Vec2(1, 1),
    hasPhysicsBody2D: boolean = false,
    hasRigidBody2D: boolean = false
  ) {
    // State and idenitifiers
    this.id = GameObject.currentId++; // Assign and increment the ID
    this.name = name;
    this.disabled = false;
    this.enable(); // enabled to start
    GameObject.instances.push(this); // Add this instance to the static array tracking all gameobjects

    // Visualization
    this.size = size;
    this.graphic = null;

    // Base classes
    this.physicsBody2D = null;
    this.rigidBody2D = null;

    if (hasRigidBody2D && !hasPhysicsBody2D) {
      throw new Error(
        "RigidBody2D requires PhysicsBody2D. Please set physicsBody2D to true."
      );
    }

    // Add all specified base classes to the game obj
    if (hasPhysicsBody2D === true) {
      this.physicsBody2D = new PhysicsBody2D(this);
    }
    if (hasRigidBody2D === true) {
      this.rigidBody2D = new RigidBody2D(this);
    }
  }

  /**
   * Get a GameObject by its ID.
   * @param {number} id - The ID of the GameObject to find.
   * @returns {GameObject|null} The found GameObject or null if not found.
   */
  static getById(id: number): GameObject | null {
    return GameObject.instances.find((instance) => instance.id === id) || null;
  }

  /**
   * Gets a random sprite from the available textures that starts with the given substring.
   * @param substr The substring to filter the texture keys.
   * @param allTextureKeys Obtained from scene.textures.getTextureKeys().
   * @param random The SeededRandom instance to use for random selection.
   * @return The name of the selected sprite or null if no matching sprites are found.
   */
  getRandomSprite(
    substr: string,
    allTextureKeys: string[],
    random: SeededRandom
  ) {
    let spriteName: null | string = null;

    const filteredKeys = allTextureKeys.filter((key: string) =>
      key.startsWith(substr)
    );

    if (filteredKeys.length > 0) {
      const randomIndex = random.getRandomInt(0, filteredKeys.length);
      spriteName = filteredKeys[randomIndex];
    } else {
      console.warn(`No sprites found with prefix ${substr}`);
    }

    return spriteName;
  }

  /**
   * Update the graphic for the GameObject.
   * @param {number|null} newColor - The new color to set for the graphic.
   */
  updateGraphic(newColor: number | null = null) {
    if (this.graphic != null) {
      // Set graphic to be where the physics body is located
      if (this.physicsBody2D != null) {
        this.graphic.x = this.physicsBody2D.position.x;
        this.graphic.y = this.physicsBody2D.position.y;
      }

      if (newColor != null) {
        if (this.graphic instanceof Phaser.GameObjects.Sprite) {
          this.graphic.setTint(newColor);
        } else if (this.graphic instanceof Phaser.GameObjects.Shape) {
          this.graphic.setFillStyle(newColor);
        } else if (this.graphic instanceof Phaser.GameObjects.Container) {
          this.graphic.iterate(
            (
              child: Phaser.GameObjects.Sprite | Phaser.GameObjects.Container
            ) => {
              if (child instanceof Phaser.GameObjects.Sprite) {
                child.setTint(newColor);
              } else if (child instanceof Phaser.GameObjects.Shape) {
                child.setFillStyle(newColor);
              }
            }
          );
        }
      }

      // Update size of graphic
      this.graphic.setDisplaySize(this.size.x, this.size.y);
    }
  }

  /**
   * Disable the GameObject.
   */
  disable() {
    this.disabled = true;
    if (this.graphic != null) {
      this.graphic.setVisible(false);
    }
  }

  /**
   * Enable the GameObject.
   */
  enable() {
    this.disabled = false;
    if (this.graphic != null) {
      this.graphic.setVisible(true);
    }
  }

  /**
   * What to call when the game object is destroyed.
   */
  destroy() {
    // Remove the graphic from the scene
    if (this.graphic != null) {
      this.graphic.destroy();
    }

    // Remove the physics body from the scene
    if (this.physicsBody2D != null) {
      this.physicsBody2D = null;
    }

    // Remove the rigid body from the scene
    if (this.rigidBody2D != null) {
      this.rigidBody2D = null;
    }

    // Remove this instance from the static array
    GameObject.instances = GameObject.instances.filter(
      (instance) => instance.id !== this.id
    );
  }
}
