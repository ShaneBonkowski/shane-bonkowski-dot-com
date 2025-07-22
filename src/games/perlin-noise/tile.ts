import { GameObject } from "@/src/utils/game-object";
import { Vec2 } from "@/src/utils/vector";
import { MoreMath } from "@/src/utils/more-math";
import { MainGameScene } from "@/src/games/perlin-noise/scenes/main-game-scene";
import {
  tileTypes,
  tileGridSize,
  tileColorMap,
} from "@/src/games/perlin-noise/tile-utils";

export class Tile extends GameObject {
  public scene: MainGameScene | null = null;
  public gridSpaceLoc: Vec2 = new Vec2(0, 0);
  public perlinValue: number = 0;
  public tileType: tileTypes = tileTypes.DEEP_WATER;

  // eslint-disable-next-line no-restricted-syntax
  constructor(scene: MainGameScene, gridX: number, gridY: number) {
    super(
      "Tile",
      // init scale just so its set, will reset to something else later
      new Vec2(1, 1),
      // Add physicsBody2D (even though it doesnt "move", it still has a position
      // when screen resizes occur etc.)
      true,
      false
    );

    // Return early during SSR/static generation (need to call super first)
    if (typeof window === "undefined") return;

    this.scene = scene;
    this.graphic = null;
    this.gridSpaceLoc = new Vec2(gridX, gridY);

    this.init();
    this.subscribeToEvents();
  }

  subscribeToEvents() {}

  unsubscribeFromEvents() {}

  init() {
    // Init the graphics
    const tileSpriteName = "Tile Blank";
    this.graphic = this.scene!.add.sprite(
      0,
      0,
      tileSpriteName
    ) as Phaser.GameObjects.Sprite; // spawn at 0,0 to start
    this.graphic.setOrigin(0.5, 0.5); // Set the anchor point to the center

    // Init the perlin value / type to start
    this.updatePerlinValue(this.scene!.random.getRandomFloat(0, 1));

    // Set position and scale
    const initialPos = this.calculatePosition();
    this.physicsBody2D!.position.x = initialPos.x;
    this.physicsBody2D!.position.y = initialPos.y;
    this.scale = this.calculateScale();
  }

  reset() {
    this.updatePerlinValue(0);
  }

  updatePerlinValue(newValue: number) {
    this.perlinValue = newValue;
    this.updateType();
  }

  updateType() {
    if (this.perlinValue < 0.15) {
      this.tileType = tileTypes.DEEP_WATER;
    } else if (this.perlinValue < 0.35) {
      this.tileType = tileTypes.SHALLOW_WATER;
    } else if (this.perlinValue < 0.45) {
      this.tileType = tileTypes.BEACH;
    } else if (this.perlinValue < 0.55) {
      this.tileType = tileTypes.SOIL;
    } else if (this.perlinValue < 0.65) {
      this.tileType = tileTypes.GRASS;
    } else if (this.perlinValue < 0.75) {
      this.tileType = tileTypes.FOREST;
    } else if (this.perlinValue < 0.88) {
      this.tileType = tileTypes.MOUNTAIN;
    } else {
      this.tileType = tileTypes.SNOW;
    }
  }

  updateScale() {
    const targetScale = this.calculateScale();
    if (this.scale != null) {
      this.scale = new Vec2(
        MoreMath.lerpWithThreshold(this.scale.x, targetScale.x, 0.2, 0.5),
        MoreMath.lerpWithThreshold(this.scale.y, targetScale.y, 0.2, 0.5)
      );
    } else {
      this.scale = targetScale;
    }
  }

  calculateScale(): Vec2 {
    return new Vec2(
      // Tile png is 600px
      this.scene!.screenInfo.width / tileGridSize.x / 600,
      this.scene!.screenInfo.height / tileGridSize.y / 600
    );
  }

  updatePosition() {
    const newPosition = this.calculatePosition();

    if (this.physicsBody2D!.position.x != null) {
      this.physicsBody2D!.position.x = MoreMath.lerpWithThreshold(
        this.physicsBody2D!.position.x,
        newPosition.x,
        0.65,
        1
      );
    } else {
      this.physicsBody2D!.position.x = newPosition.x;
    }

    if (this.physicsBody2D!.position.y != null) {
      this.physicsBody2D!.position.y = MoreMath.lerpWithThreshold(
        this.physicsBody2D!.position.y,
        newPosition.y,
        0.65,
        1
      );
    } else {
      this.physicsBody2D!.position.y = newPosition.y;
    }
  }

  calculatePosition(): Vec2 {
    // Get the tile location from the grid location and screen size
    const center = new Vec2(
      this.scene!.screenInfo.width / 2,
      this.scene!.screenInfo.height / 2
    );
    const smallAmountForGrid = 0; // optional small amount to create a buffer for the "grid"

    // Calculate the total grid size in pixels (taking into account scale)
    const tileScale = this.calculateScale();
    const tileSizePx = new Vec2(600 * tileScale.x, 600 * tileScale.y); // = size of tile png of 600px * scale

    // Calculate the starting position for the bottom-left tile in the grid
    const tileSpacing = new Vec2(
      tileSizePx.x + smallAmountForGrid,
      tileSizePx.y + smallAmountForGrid
    );
    const startGrid = new Vec2(0, 0);

    if (tileGridSize.x % 2 === 0) {
      // Even grid size
      startGrid.x = center.x - (tileGridSize.x / 2 - 0.5) * tileSpacing.x;
    } else {
      // Odd grid size
      startGrid.x = center.x - ((tileGridSize.x - 1) / 2) * tileSpacing.x;
    }

    if (tileGridSize.y % 2 === 0) {
      // Even grid size
      startGrid.y = center.y + (tileGridSize.y / 2 - 0.5) * tileSpacing.y;
    } else {
      // Odd grid size
      startGrid.y = center.y + ((tileGridSize.y - 1) / 2) * tileSpacing.y;
    }

    // Calculate the position of the current tile in the grid from bottom-left
    return new Vec2(
      startGrid.x + this.gridSpaceLoc.x * tileSpacing.x,
      startGrid.y - this.gridSpaceLoc.y * tileSpacing.y
    );
  }

  renderGraphics() {
    // Make sure size etc. is up to date
    this.updatePosition();
    this.updateScale();

    // Update the graphic
    this.updateGraphic(tileColorMap[this.tileType]);
  }

  destroy() {
    super.destroy();

    // Unsubscribe from events
    this.unsubscribeFromEvents();
  }
}
