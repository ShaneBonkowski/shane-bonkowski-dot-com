import { Generic2DGameScene } from "@/src/games/utils/game-scene-2d";

export class MainGameScene extends Generic2DGameScene {
  constructor() {
    super("MainGameScene");
  }

  preload() {
    // this.load.image("placeholder", "/webps/mars-logo-large.webp");
  }

  create() {
    // const { width, height } = this.game.config;
    // // Placeholder image and text
    // this.add.image(Number(width) / 2, Number(height) / 2, "placeholder");
    // this.add
    //   .text(Number(width) / 2, Number(height) / 2 + 100, "Test Scene", {
    //     fontSize: "32px",
    //     color: "#ffffff",
    //   })
    //   .setOrigin(0.5);
  }

  update() {
    // Update logic if needed
  }
}
