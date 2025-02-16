import { Generic2DGameScene } from "@/src/utils/game-scene-2d.ts";

// Export so other scripts can access this
export class MainGameScene extends Generic2DGameScene {
  constructor() {
    super("MainGameScene");
  }

  preload() {
    // Preload assets if needed
    // this.load.image("image-name", "/webps/image-name.webp");
  }

  create() {
    // Create the game scene here
  }

  update() {
    // Update logic if needed
  }
}
