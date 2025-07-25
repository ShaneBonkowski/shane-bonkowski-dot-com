import { GameObject } from "@/src/utils/game-object";
import { Vec2 } from "@/src/utils/vector";
import { MoreMath } from "@/src/utils/more-math";
import {
  tileStates,
  tileAndBackgroundColors,
} from "@/src/games/game-of-life/tile-utils";
import { MainGameScene } from "@/src/games/game-of-life/scenes/main-game-scene";
import { gameDataStore } from "@/src/games/game-of-life/game-data-store";

const TILE_ON_SCALE_FACTOR = 1.2;

export class Tile extends GameObject {
  public scene: MainGameScene | null = null;
  public gridSpaceLoc: Vec2 = new Vec2(0, 0);
  public initialClickOnThisTile: boolean = false;
  public qtyLivingNeighbors: number = 0;
  public canClick: boolean = true;
  public currentTileTween: Phaser.Tweens.Tween | null = null;
  public tileState: number = tileStates.OFF;

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
    this.initTile();
    this.subscribeToEvents();
  }

  handlePointerUp = () => {
    if (
      this.canClick &&
      !this.scene!.uiMenuOpen &&
      this.initialClickOnThisTile
    ) {
      // Toggle tile state only if the click started and ended on this tile
      this.onClickToggleTileState();

      // Autopause the game if specified to do such
      if (!this.scene!.paused && this.scene!.autoPause) {
        this.scene!.paused = gameDataStore.setPaused(true);
      }
    }

    this.initialClickOnThisTile = false; // Reset state
  };

  subscribeToEvents() {
    // Click must start and end on the same tile to count as a tile click...
    // This helps ensure dragging doesnt accidentally trigger tiles.
    this.graphic!.on("pointerdown", this.handlePointerDown);

    this.graphic!.on("pointerup", this.handlePointerUp);
    this.graphic!.on("pointercancel", this.handlePointerUp);

    // Update mouse on hover
    this.graphic!.on("pointerover", this.handlePointerOver);
    this.graphic!.on("pointerout", this.handlePointerOut);
  }

  unsubscribeFromEvents() {
    this.graphic!.off("pointerdown", this.handlePointerDown);
    this.graphic!.off("pointerup", this.handlePointerUp);
    this.graphic!.off("pointercancel", this.handlePointerUp);
    this.graphic!.off("pointerover", this.handlePointerOver);
    this.graphic!.off("pointerout", this.handlePointerOut);
  }

  handlePointerDown = (pointer: Phaser.Input.Pointer) => {
    // Make sure the canvas was clicked on! Not e.g. a ui DOM element like a button.
    // This fixes issues where you can click a tile through a button.
    if (
      pointer.event.target == this.scene!.game.canvas &&
      this.canClick &&
      !this.scene!.uiMenuOpen
    ) {
      this.initialClickOnThisTile = true;
    }
  };

  handlePointerOver = () => {
    this.scene!.game.canvas.style.cursor = "pointer";
  };

  handlePointerOut = () => {
    this.scene!.game.canvas.style.cursor = "default";
  };

  initTile() {
    this.initialClickOnThisTile = false;
    this.qtyLivingNeighbors = 0; // For storing qty of neighbors prior to update loop
    this.canClick = true;
    this.currentTileTween = null;

    // Init the graphics
    const tileSpriteName = "Tile Blank";
    this.graphic = this.scene!.add.sprite(
      0,
      0,
      tileSpriteName
    ) as Phaser.GameObjects.Sprite; // spawn at 0,0 to start
    this.graphic.setOrigin(0.5, 0.5); // Set the anchor point to the center
    this.graphic!.setInteractive(); // make it so this graphic can be clicked on etc.

    // Start in off and then change to off. This is so that any necc. vars are updated, without
    // the game thinking the state "changed" from ON to OFF for e.g.
    this.tileState = tileStates.OFF;
    this.changeState(tileStates.OFF);

    // Set position and scale
    const initialPos = this.calculateTilePosition();
    this.physicsBody2D!.position.x = initialPos.x;
    this.physicsBody2D!.position.y = initialPos.y;
    this.scale = this.calculateScale();
  }

  resetTile() {
    this.qtyLivingNeighbors = 0;
    this.canClick = true;
    this.currentTileTween = null;

    // Start in off and then change to off. This is so that any necc. vars are updated, without
    // the game thinking the state "changed" from ON to OFF for e.g.
    this.tileState = tileStates.OFF;
    this.changeState(tileStates.OFF);
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
    let scale = this.calculateDefaultScale();

    // Add extra for a tile in the ON state
    if (this.tileState == tileStates.ON) {
      scale = scale * TILE_ON_SCALE_FACTOR;
    }

    return new Vec2(scale, scale);
  }

  calculateDefaultScale(): number {
    // Calculate the scale based on the screen width
    let scale = (this.scene!.screenInfo.height * 0.035) / 600;

    // Phone screen has larger
    if (
      this.scene!.screenInfo.width <= 600 ||
      this.scene!.screenInfo.isPortrait
    ) {
      scale = (this.scene!.screenInfo.height * 0.022) / 600;
    }

    // Scale according to zoom!
    scale = scale * this.scene!.gestureManager.zoomOffset;

    return scale;
  }

  updatePosition() {
    const newPosition = this.calculateTilePosition();

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

    // this.physicsBody2D.position.x = newPosition.x;
    // this.physicsBody2D.position.y = newPosition.y;
  }

  calculateTilePosition(): Vec2 {
    // Get the tile location from the grid location and screen size
    let centerX = this.scene!.screenInfo.width / 2;
    let centerY = this.scene!.screenInfo.height / 2;
    const smallAmountForGrid = 0; // allows me to add small amount to create a buffer for the "grid"

    // Calculate the total grid size in pixels (taking into account scale and tile "ON" size)
    const tileScale = this.calculateDefaultScale() * TILE_ON_SCALE_FACTOR;
    const tileSizePx = 600 * tileScale; // = size of tile png of 600px * "ON" scale
    const gridWidthPx = tileSizePx * this.scene!.tileGridWidth;
    const gridHeightPx = tileSizePx * this.scene!.tileGridHeight;

    // Calculate min/max center positions so grid stays on screen (clamps so
    // that at least 1 tile is visible)
    const minCenterX = (-1 * gridWidthPx) / 2 + tileSizePx;
    const maxCenterX =
      this.scene!.screenInfo.width + gridWidthPx / 2 - tileSizePx;

    const minCenterY = (-1 * gridHeightPx) / 2 + tileSizePx;
    const maxCenterY =
      this.scene!.screenInfo.height + gridHeightPx / 2 - tileSizePx;

    // Add in the drag offset, but clamp so grid stays visible
    centerX = MoreMath.clamp(
      centerX + this.scene!.gestureManager.dragOffsetX,
      minCenterX,
      maxCenterX
    );
    centerY = MoreMath.clamp(
      centerY + this.scene!.gestureManager.dragOffsetY,
      minCenterY,
      maxCenterY
    );

    // Calculate the starting position for the bottom-left tile in the grid
    const tileSpacing = tileSizePx + smallAmountForGrid;
    let startGridX, startGridY;

    if (this.scene!.tileGridWidth % 2 === 0) {
      // Even grid size
      startGridX =
        centerX - (this.scene!.tileGridWidth / 2 - 0.5) * tileSpacing;
    } else {
      // Odd grid size
      startGridX =
        centerX - ((this.scene!.tileGridWidth - 1) / 2) * tileSpacing;
    }

    if (this.scene!.tileGridHeight % 2 === 0) {
      // Even grid size
      startGridY =
        centerY + (this.scene!.tileGridHeight / 2 - 0.5) * tileSpacing;
    } else {
      // Odd grid size
      startGridY =
        centerY + ((this.scene!.tileGridHeight - 1) / 2) * tileSpacing;
    }

    // Calculate the position of the current tile in the grid from bottom-left
    const tileX = startGridX + this.gridSpaceLoc.x * tileSpacing;
    const tileY = startGridY - this.gridSpaceLoc.y * tileSpacing;

    return new Vec2(tileX, tileY);
  }

  getNeighbors(
    tiles: Tile[][],
    countCorners: boolean = true,
    countTorusNeighbors: boolean = false,
    onNeighborTile?: (neighbor: Tile) => void
  ): Tile[] {
    const xWidth = tiles.length;
    const yWidth = tiles[0].length;
    const neighborTiles = [];

    // Define the directions for the 8 possible neighbors
    const directions = countCorners
      ? [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
          [1, 1],
        ]
      : [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ];

    const thisRow = Math.floor(this.gridSpaceLoc.x);
    const thisCol = Math.floor(this.gridSpaceLoc.y);

    for (const [dx, dy] of directions) {
      const row = thisRow + dx;
      const col = thisCol + dy;

      if (row >= 0 && row < xWidth && col >= 0 && col < yWidth) {
        neighborTiles.push(tiles[row][col]);

        if (onNeighborTile) {
          onNeighborTile(tiles[row][col]);
        }
      } else if (countTorusNeighbors) {
        // Wrap around the grid
        const wrappedRow = (row + xWidth) % xWidth;
        const wrappedCol = (col + yWidth) % yWidth;
        neighborTiles.push(tiles[wrappedRow][wrappedCol]);

        if (onNeighborTile) {
          onNeighborTile(tiles[wrappedRow][wrappedCol]);
        }
      }
    }

    return neighborTiles;
  }

  getQtyLivingNeighbors(
    tiles: Tile[][],
    countCorners: boolean = true,
    countTorusNeighbors: boolean = false
  ) {
    this.qtyLivingNeighbors = 0;

    this.getNeighbors(
      tiles,
      countCorners,
      countTorusNeighbors,
      this.updateLivingNeighborCount.bind(this)
    );
  }

  updateLivingNeighborCount(otherTile: Tile) {
    // If the neighbor is living, add to this tile's qty
    if (otherTile.tileState == tileStates.ON) {
      this.qtyLivingNeighbors++;
    }
  }

  handleConwayLifeIteration(): number {
    // Classic Conway's Game of Life rules:
    // - Live cell with fewer than 2 live neighbors dies (underpopulation).
    // - Live cell with more than 3 live neighbors dies (overpopulation).
    // - Live cell with 2 or 3 neighbors survives.
    // - Dead cell with 3 neighbors becomes alive (reproduction).
    if (this.tileState == tileStates.ON) {
      if (
        this.qtyLivingNeighbors < this.scene!.underpopulation ||
        this.qtyLivingNeighbors > this.scene!.overpopulation
      ) {
        this.changeState(tileStates.OFF);
      }
    } else if (this.tileState == tileStates.OFF) {
      if (this.qtyLivingNeighbors == this.scene!.reproduction) {
        this.changeState(tileStates.ON);
      }
    }

    return this.tileState;
  }

  onClickToggleTileState() {
    // Change from on to off and vice versa
    if (this.tileState == tileStates.ON) {
      this.changeState(tileStates.OFF);
    } else {
      this.changeState(tileStates.ON);
    }
  }

  changeState(newState: number) {
    // Make sure no anim is playing prior to updating tile state!
    this.stopCurrentTileTween();

    // If state changed, update population.
    if (this.tileState != newState) {
      if (newState == tileStates.ON) {
        this.scene!.updatePopulation(this.scene!.population + 1);
      } else {
        this.scene!.updatePopulation(this.scene!.population - 1);
      }
    }

    // Change the state
    this.tileState = newState;
    this.scene!.livingTilespaceSet.updateLivingTilespace(this);
  }

  renderTileGraphics() {
    this.updateVisualAttrs();
    if (this.tileState == tileStates.OFF) {
      this.updateGraphic(tileAndBackgroundColors[this.scene!.colorTheme][1]);
    } else {
      this.updateGraphic(tileAndBackgroundColors[this.scene!.colorTheme][0]);
    }
  }

  updateVisualAttrs() {
    this.updatePosition();
    this.updateScale();
  }

  playSpinAnim() {
    this.stopCurrentTileTween();
    this.canClick = false;

    // Rotate the graphic 360 degrees
    this.currentTileTween = this.scene!.tweens.add({
      targets: this.graphic,
      angle: "+=360",
      duration: 220,
      ease: "Linear",
      repeat: 0, // Do not repeat
      onComplete: () => {
        this.stopCurrentTileTween();
      },
    });
  }

  stopCurrentTileTween() {
    // Stop the anim if there is one
    if (this.currentTileTween) {
      this.currentTileTween.stop();
      this.currentTileTween = null;

      // Ensure attrs that may have changed in the anim are reset
      this.graphic!.angle = 0;
      this.graphic!.scale = 1;
      this.canClick = true;
    }
  }

  destroy() {
    super.destroy();

    // Unsubscribe from events
    this.unsubscribeFromEvents();
  }
}
