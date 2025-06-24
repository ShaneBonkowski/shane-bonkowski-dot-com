import { GameObject } from "@/src/utils/game-object";
import { SeededRandom, randomType } from "@/src/utils/seedable-random";
import { Vec2 } from "@/src/utils/vector";
import { MainGameScene } from "@/src/games/game-template/scenes/main-game-scene";

export class Ball extends GameObject {
  private scene: MainGameScene | null = null;
  private random: SeededRandom | null = null;

  // eslint-disable-next-line no-restricted-syntax
  constructor(scene: MainGameScene, spawnX: number, spawnY: number) {
    super("Ball", new Vec2(0, 0), true, true);

    // Return early during SSR/static generation (need to call super first)
    if (typeof window === "undefined") return;

    // Initialize GameObject with physics, and rigid body
    this.updateScale(); // set the scale here!, not in GameObject

    this.scene = scene;
    this.random = new SeededRandom(randomType.UNSEEDED_RANDOM);

    // Move to provided location
    this.physicsBody2D!.position.x = spawnX;
    this.physicsBody2D!.position.y = spawnY;

    // Move in a random initial direction
    const angle = this.random.getRandomFloat(0, 2 * Math.PI);
    const speed = 0.5;
    this.physicsBody2D!.velocity = new Vec2(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed
    );

    // Create the graphic for the ball
    this.graphic = this.scene!.add.circle(
      spawnX,
      spawnY,
      200,
      this.getRandomColor()
    );

    // Enable input on the ball graphic
    this.graphic!.setInteractive();

    this.subscribeToEvents();
  }

  subscribeToEvents() {
    this.graphic!.on("pointerover", this.handlePointerOver, this);
    this.graphic!.on("pointerout", this.handlePointerOut, this);
    this.graphic!.on("pointerdown", this.handlePointerDown, this);

    // Listen for screen edge collision events
    document.addEventListener(
      "screenEdgeCollision",
      this.handleScreenEdgeCollision as EventListener
    );
  }

  unsubscribeFromEvents() {
    this.graphic!.off("pointerover", this.handlePointerOver, this);
    this.graphic!.off("pointerout", this.handlePointerOut, this);
    this.graphic!.off("pointerdown", this.handlePointerDown, this);

    document.removeEventListener(
      "screenEdgeCollision",
      this.handleScreenEdgeCollision as EventListener
    );
  }

  // Using Arrow Function to bind the context of "this" to the class instance.
  // This is necc. for event handlers.
  handlePointerOver = () => {
    this.scene!.input.setDefaultCursor("pointer");
  };

  // Using Arrow Function to bind the context of "this" to the class instance.
  // This is necc. for event handlers.
  handlePointerOut = () => {
    this.scene!.input.setDefaultCursor("default");
  };

  // Using Arrow Function to bind the context of "this" to the class instance.
  // This is necc. for event handlers.
  handlePointerDown = () => {
    this.updateGraphic(this.getRandomColor());
  };

  getRandomColor(): number {
    // Generate a random color with each RGB component above a certain threshold
    const threshold = 50; // Minimum value for each RGB component to avoid dark colors
    const r = Math.floor(Math.random() * (256 - threshold) + threshold);
    const g = Math.floor(Math.random() * (256 - threshold) + threshold);
    const b = Math.floor(Math.random() * (256 - threshold) + threshold);
    return (r << 16) | (g << 8) | b;
  }

  handleWindowResize(newX: number, newY: number) {
    if (newX == null || newY == null) {
      console.warn(
        "obj.handleWindowResize: newX or newY is null. Skipping resize handling."
      );
      return;
    }

    this.updateScale();

    this.physicsBody2D!.position.x = newX;
    this.physicsBody2D!.position.y = newY;
  }

  updateScale() {
    this.scale = this.calculateScale();

    if (this.graphic) {
      this.rigidBody2D!.hitboxSize = new Vec2(
        this.graphic!.displayWidth,
        this.graphic!.displayHeight
      );
    }
  }

  calculateScale(): Vec2 {
    // Calculate the scale based on the screen width
    let newScale =
      ((window.visualViewport?.height || window.innerHeight) * 0.07) / 200;
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;

    // Phone screen has larger objects
    if (
      (window.visualViewport?.width || window.innerWidth) <= 600 ||
      isPortrait
    ) {
      newScale =
        ((window.visualViewport?.height || window.innerHeight) * 0.05) / 200;
    }

    return new Vec2(newScale, newScale);
  }

  handlePhysics(delta: number) {
    this.physicsBody2D!.updatePosition(delta);
    this.rigidBody2D!.checkCollideScreenEdge(5);
  }

  // Using Arrow Function to bind the context of "this" to the class instance.
  // This is necc. for event handlers.
  handleScreenEdgeCollision = (event: CustomEvent) => {
    if (event.detail.gameObjectId === this.id) {
      switch (event.detail.direction) {
        case "left":
        case "right":
          this.physicsBody2D!.velocity.x *= -1;
          break;
        case "top":
        case "bottom":
          this.physicsBody2D!.velocity.y *= -1;
          break;
      }
    }
  };

  destroy() {
    super.destroy();

    // Unsubscribe from events
    this.unsubscribeFromEvents();
  }
}
