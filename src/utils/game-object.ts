import { RigidBody2D } from "@/src/utils/rigid-body-2d.ts";
import { PhysicsBody2D } from "@/src/utils/physics-body-2d.ts";

/**
 * Class representing a game object.
 */
export class GameObject {
  static currentId: number = 0; // Static property to keep track of the current ID
  static instances: GameObject[] = []; // Static array to hold all GameObject instances

  public id: number;
  public name: string;
  public disabled: boolean;
  public size: number;
  public graphic: Phaser.GameObjects.Sprite | null;
  public physicsBody2D: PhysicsBody2D | null;
  public rigidBody2D: RigidBody2D | null;

  /**
   * Create a GameObject.
   * @param {string} name - The name of the game object.
   * @param {number} size - Size of the gameobject, mostly for sizing the graphic attatched to it.
   * @param {boolean} hasPhysicsBody2D - Does the GameObject have PhysicsBody2D base class?
   * @param {boolean} hasRigidBody2D - Does the GameObject have RigidBody2D base class?
   */
  constructor(
    name: string,
    size: number = 1,
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

  updateGraphic(newColor = null) {
    if (this.graphic != null) {
      // Set graphic to be where the physics body is located
      if (this.physicsBody2D != null) {
        this.graphic.x = this.physicsBody2D.position.x;
        this.graphic.y = this.physicsBody2D.position.y;
      }

      if (newColor != null) {
        this.graphic.setTint(newColor);
      }

      // Update size of graphic
      //this.graphic.setScale(this.size);
      this.graphic.setDisplaySize(this.size, this.size);
    }
  }

  disable() {
    this.disabled = true;
    if (this.graphic != null) {
      this.graphic.setVisible(false);
    }
  }

  enable() {
    this.disabled = false;
    if (this.graphic != null) {
      this.graphic.setVisible(true);
    }
  }
}
