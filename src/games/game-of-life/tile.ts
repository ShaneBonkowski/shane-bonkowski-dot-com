import { GameObject } from "@/src/utils/game-object";
import { Vec2 } from "@/src/utils/vector";
import { MoreMath } from "@/src/utils/more-math";
import {
  tileStates,
  tileGridAttrs,
  tileColors,
} from "@/src/games/game-of-life/tile-utils";
import { MainGameScene } from "@/src/games/game-of-life/scenes/main-game-scene";
import { settings } from "@/src/games/game-of-life/SettingsContainer.tsx";

export class Tile extends GameObject {
  public scene: MainGameScene;
  public gridSpaceLoc: Vec2;
  public initialClickOnThisTile: boolean = false;
  public qtyLivingNeighbors: number = 0;
  public canClick: boolean = true;
  public currentTileAnim: Phaser.Tweens.Tween | null = null;
  public tileState: number = tileStates.OFF;

  constructor(scene: MainGameScene, gridX: number, gridY: number) {
    super(
      "Tile",
      // init size just so its set, will reset to something else later
      1,
      // Add physicsBody2D (even though it doesnt "move", it still has a position
      // when screen resizes occur etc.)
      true,
      false
    );

    this.scene = scene;

    this.graphic = null;
    this.gridSpaceLoc = new Vec2(gridX, gridY);
    this.initTile();
    this.subscribeToEvents();
  }

  handlePointerUp = () => {
    if (
      this.canClick &&
      !this.scene.uiMenuOpen &&
      this.initialClickOnThisTile
    ) {
      // Toggle tile state only if the click started and ended on this tile
      this.onClickToggleTileState();

      // Autopause the game if specified to do such
      if (!this.scene.paused && settings.autoPause.value) {
        this.scene.togglePause();
        document.dispatchEvent(new CustomEvent("manualPause"));
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
      pointer.event.target == this.scene.game.canvas &&
      this.canClick &&
      !this.scene.uiMenuOpen
    ) {
      this.initialClickOnThisTile = true;
    }
  };

  handlePointerOver = () => {
    this.scene.game.canvas.style.cursor = "pointer";
  };

  handlePointerOut = () => {
    this.scene.game.canvas.style.cursor = "default";
  };

  initTile() {
    this.initialClickOnThisTile = false;
    this.qtyLivingNeighbors = 0; // For storing qty of neighbors prior to update loop
    this.canClick = true;
    this.currentTileAnim = null;

    // Init the graphics
    const tileSpriteName = "Tile Blank";
    this.graphic = this.scene.add.sprite(0, 0, tileSpriteName); // spawn at 0,0 to start
    this.graphic!.setOrigin(0.5, 0.5); // Set the anchor point to the center
    this.graphic!.setInteractive(); // make it so this graphic can be clicked on etc.

    // Start in off and then change to off. This is so that any necc. vars are updated, without
    // the game thinking the state "changed" from ON to OFF for e.g.
    this.tileState = tileStates.OFF;
    this.changeState(tileStates.OFF);

    // Set position and size
    const initialPos = this.calculateTilePosition();
    this.physicsBody2D!.position.x = initialPos.x;
    this.physicsBody2D!.position.y = initialPos.y;
    this.size = this.calculateSize();
  }

  resetTile() {
    this.qtyLivingNeighbors = 0;
    this.canClick = true;
    this.currentTileAnim = null;

    // Start in off and then change to off. This is so that any necc. vars are updated, without
    // the game thinking the state "changed" from ON to OFF for e.g.
    this.tileState = tileStates.OFF;
    this.changeState(tileStates.OFF);
  }

  updateSize() {
    const targetSize = this.calculateSize();
    if (this.size != null) {
      this.size = MoreMath.lerpWithThreshold(this.size, targetSize, 1, 1.5);
    } else {
      this.size = targetSize;
    }
  }

  calculateSize(): number {
    let size = this.calculateDefaultSize();

    // Add extra for a tile in the ON state
    if (this.tileState == tileStates.ON) {
      size = this.calculateMaxSize(size);
    }

    return size;
  }

  calculateDefaultSize(): number {
    // Calculate the size based on the screen width
    let size = window.innerHeight * 0.035;
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;

    // Phone screen has larger
    if (window.innerWidth <= 600 || isPortrait) {
      size = window.innerHeight * 0.022;
    }

    // Scale according to zoom!
    size = size * this.scene.gestureManager.zoomOffset;

    return size;
  }

  calculateMaxSize(size: number): number {
    // "max" size is just the size of an ON state tile since it is larger
    return size * 1.15;
  }

  updatePosition() {
    const newPosition = this.calculateTilePosition();

    if (this.physicsBody2D!.position.x != null) {
      this.physicsBody2D!.position.x = MoreMath.lerpWithThreshold(
        this.physicsBody2D!.position.x,
        newPosition.x,
        0.5,
        0.75
      );
    } else {
      this.physicsBody2D!.position.x = newPosition.x;
    }

    if (this.physicsBody2D!.position.y != null) {
      this.physicsBody2D!.position.y = MoreMath.lerpWithThreshold(
        this.physicsBody2D!.position.y,
        newPosition.y,
        0.5,
        0.75
      );
    } else {
      this.physicsBody2D!.position.y = newPosition.y;
    }

    // this.physicsBody2D.position.x = newPosition.x;
    // this.physicsBody2D.position.y = newPosition.y;
  }

  calculateTilePosition(): Vec2 {
    // Get the tile location from the grid location and screen size
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;
    let smallAmountForGrid = 0; // allows me to add small amount to create a buffer for the "grid"
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;

    // for phones change the center location etc.
    if (window.innerWidth <= 600 || isPortrait) {
      centerY = window.innerHeight * 0.47;
      smallAmountForGrid = 0;
    }

    // Add in any drag offset, but clamp to within screen bounds
    centerX = MoreMath.clamp(
      centerX + this.scene.gestureManager.dragOffsetX,
      0,
      window.innerWidth
    );
    centerY = MoreMath.clamp(
      centerY + this.scene.gestureManager.dragOffsetY,
      0,
      window.innerHeight
    );

    // Calculate the starting position for the bottom-left tile in the grid
    const maxSize = this.calculateMaxSize(this.calculateDefaultSize());
    const tileSpacing = maxSize + smallAmountForGrid;
    let startGridX, startGridY;

    if (tileGridAttrs.tileGridWidth % 2 === 0) {
      // Even grid size
      startGridX =
        centerX - (tileGridAttrs.tileGridWidth / 2 - 0.5) * tileSpacing;
    } else {
      // Odd grid size
      startGridX =
        centerX - ((tileGridAttrs.tileGridWidth - 1) / 2) * tileSpacing;
    }

    if (tileGridAttrs.tileGridHeight % 2 === 0) {
      // Even grid size
      startGridY =
        centerY + (tileGridAttrs.tileGridHeight / 2 - 0.5) * tileSpacing;
    } else {
      // Odd grid size
      startGridY =
        centerY + ((tileGridAttrs.tileGridHeight - 1) / 2) * tileSpacing;
    }

    // Calculate the position of the current tile in the grid
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
        this.qtyLivingNeighbors < settings.underpopulation.value ||
        this.qtyLivingNeighbors > settings.overpopulation.value
      ) {
        this.changeState(tileStates.OFF);
      }
    } else if (this.tileState == tileStates.OFF) {
      if (this.qtyLivingNeighbors == settings.reproduction.value) {
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
    this.stopCurrentTileAnim();

    // If state changed, update population.
    if (this.tileState != newState) {
      if (newState == tileStates.ON) {
        this.scene.updatePopulation(this.scene.population + 1);
      } else {
        this.scene.updatePopulation(this.scene.population - 1);
      }
    }

    // Change the state
    this.tileState = newState;
    this.scene.livingTilespaceSet.updateLivingTilespace(this);
  }

  renderTileGraphics() {
    this.updateVisualAttrs();
    if (this.tileState == tileStates.OFF) {
      this.updateGraphic(tileColors.OFF);
    } else {
      this.updateGraphic(tileColors.ON);
    }
  }

  updateVisualAttrs() {
    this.updatePosition();
    this.updateSize();
  }

  playSpinAnim() {
    this.stopCurrentTileAnim();
    this.canClick = false;

    // Rotate the graphic 360 degrees
    this.currentTileAnim = this.scene.tweens.add({
      targets: this.graphic,
      angle: "+=360",
      duration: 220,
      ease: "Linear",
      repeat: 0, // Do not repeat
      onComplete: () => {
        this.stopCurrentTileAnim();
      },
    });
  }

  stopCurrentTileAnim() {
    // Stop the anim if there is one
    if (this.currentTileAnim) {
      this.currentTileAnim.stop();
      this.currentTileAnim = null;

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
