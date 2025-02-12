import { GameObject } from "@/src/utils/game-object.ts";
import { Vec2 } from "@/src/utils/vector.ts";
import {
  tileStates,
  sharedTileAttrs,
  TilePatternAttrs,
  tileGridEventNames,
} from "@/src/games/flip-tile/tile-constants.ts";
import { updateAllTilesText } from "@/src/games/flip-tile/tile-utils.ts";
import {
  tiles,
  MainGameScene,
} from "@/src/games/flip-tile/scenes/flip-tile-scene.ts";

export class Tile extends GameObject {
  public scene: MainGameScene;
  public tileSpaceCoord: Vec2;
  public gridSize: number;
  public tileState: number;
  public graphic: Phaser.GameObjects.Sprite | null;
  public text: Phaser.GameObjects.Text | null;
  public animationPlaying: boolean;

  constructor(
    scene: MainGameScene,
    tileSpaceX: number,
    tileSpaceY: number,
    gridSize: number,
    tileState: number
  ) {
    // Set some properties on the parent GameObject class
    super(
      "Tile",
      // init size just so its set, will reset to something else later
      1,
      // physicsBody2D
      true,
      // rigidBody2D
      false
    );

    // Store some attributes about this tile
    this.scene = scene;
    this.tileSpaceCoord = new Vec2(tileSpaceX, tileSpaceY);
    this.gridSize = gridSize;
    this.tileState = tileState;

    // Create a graphics object for the tile
    this.graphic = null;
    this.text = null;
    this.initTile();
    this.animationPlaying = false;

    // Init at provided location, and centered
    const spawnLoc = this.findTileLocFromTileSpace();
    this.physicsBody2D!.position.x = spawnLoc.x;
    this.physicsBody2D!.position.y = spawnLoc.y;

    this.addText();

    // Subscribe to relevant events
    this.subscribeToEvents();
  }

  initTile() {
    this.size = this.calculateTileSize();
    this.graphic = this.scene.add.sprite(0, 0, "Tile Red"); // init, will be changed in updateTileColor
    this.graphic!.setInteractive(); // make it so this graphic can be clicked on etc.
    this.updateTileColor();
    this.graphic!.setOrigin(0.5, 0.5); // Set the anchor point to the center

    // TODO: add particles or something when new is spawned in
    // ...
  }

  addText() {
    // Add text to the top right corner of the graphic
    this.text = this.scene.add.text(
      // Position relative to graphic's top right corner
      this.physicsBody2D!.position.x + this.graphic!.displayWidth / 2,
      this.physicsBody2D!.position.y - this.graphic!.displayHeight / 2,
      "1",
      { fontFamily: "Arial", fontSize: 40, color: "#FFFFFF" } // init text size here, but in reality it is updated in updateTextSize()
    );
    this.text!.setOrigin(-0.2, 0.7); // Origin on the top right corner of the text
    this.text!.setDepth(10); // Ensure the text appears on top of the graphic

    this.updateTextPos();
    this.updateTextSize();
    this.hideText();
  }

  updateTextSize() {
    let fontSize = 30;
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;

    // for phones change the font size
    if (window.innerWidth <= 600 || isPortrait) {
      fontSize = 24;
    }
    this.text!.setFontSize(fontSize);
  }

  updateTextPos() {
    this.text!.setPosition(
      this.physicsBody2D!.position.x + this.graphic!.displayWidth / 2,
      this.physicsBody2D!.position.y - this.graphic!.displayHeight / 2
    );
  }

  updateTextContent(textContent: string) {
    this.text!.text = textContent;
  }

  hideText() {
    this.text!.setVisible(false);
  }

  showText() {
    this.text!.setVisible(true);

    this.updateTextPos();
    this.updateTextSize();

    // Make sure scene is aware we have revealed the solution
    this.scene.revealedAtLeastOnceThisLevel = true;
  }

  destroy() {
    // Remove the sprite from the scene
    this.graphic!.destroy();
    this.graphic = null;

    // Remove text from the scene
    this.text!.destroy();
    this.text = null;

    // TODO: add particles or something when destroyed
    // ...
  }

  updateTileColor() {
    // Color
    if (this.tileState === tileStates.RED) {
      this.graphic!.setTexture("tile-red");
    } else if (this.tileState === tileStates.BLUE) {
      this.graphic!.setTexture("tile-blue");
    } else if (this.tileState === tileStates.GREEN) {
      this.graphic!.setTexture("tile-green");
    } else {
      console.log(`ERROR: tileState ${this.tileState} is not an expected one`);
    }

    // Animations
    this.playClickSpinAnim();
  }

  playClickSpinAnim() {
    document.dispatchEvent(new Event(tileGridEventNames.onTileSpin));

    // cannot click during animation
    this.scene.tryToDisableClick();
    this.animationPlaying = true;

    // Rotate the graphic 360 degrees
    this.scene.tweens.add({
      targets: this.graphic,
      angle: "+=360",
      duration: 1000 * sharedTileAttrs.clickTimer,
      ease: "Linear",
      repeat: 0, // Do not repeat
      onComplete: () => {
        // Can click after all animations are done
        this.animationPlaying = false;
        const canEnable = this.scene.tryToEnableClick();

        // If we are successful in enabling click,
        // then this is the last tile to play the animation.
        // In which case, we can now check if the game has been solved!
        if (canEnable) {
          this.scene.nextPuzzleIfSolved();
        }
      },
    });
  }

  celebrateTileAnim(duration = sharedTileAttrs.solvedTimer * 1000) {
    // cannot click during animation
    this.scene.tryToDisableClick();
    this.animationPlaying = true;

    // Play animation
    this.scene.tweens.add({
      targets: this.graphic,
      //angle: "+=360",
      displayWidth: this.size * sharedTileAttrs.tileSpacingFactor,
      displayHeight: this.size * sharedTileAttrs.tileSpacingFactor,
      duration: duration / 2, // /2 since yoyo doubles the time
      ease: "Sine.easeInOut",
      yoyo: true, // Return to original scale and rotation after the animation
      onUpdate: (target: Phaser.GameObjects.Sprite) => {
        // Ensures that the size variable reflects the scale as it changes with the tween
        this.size = target.displayWidth; // Assuming width == height
      },
      onComplete: () => {
        // Can click after all animations are done
        this.animationPlaying = false;
        this.scene.tryToEnableClick();
      },
    });
  }

  updateTileState(updateNeighbors = true) {
    // Only update tile state if this is a tile reacting to
    // an initial tile being clicked (aka updateNeighbors == false),
    // or if we are allowed to click. Also the uiMenu cannot be opened
    if (
      !this.scene.uiMenuOpen &&
      (!updateNeighbors || this.scene.canClickTile)
    ) {
      // Advance forward one tile state
      let nextState = this.tileState + 1;

      // If the next state exceeds the maximum, loop back to the first state
      if (nextState > TilePatternAttrs.qtyStatesBeingUsed - 1) {
        nextState = 0;
      }

      // Update this tile
      this.tileState = nextState;
      this.updateTileColor();

      // Notify neighbors to update
      if (updateNeighbors) {
        // left neighbor
        if (this.tileSpaceCoord.x - 1 >= 0) {
          tiles[Math.round(this.tileSpaceCoord.x - 1)][
            Math.round(this.tileSpaceCoord.y)
          ].updateTileState(false); // do not let this one update neighbors since only the first clicked on should
        }
        // right
        if (this.tileSpaceCoord.x + 1 < this.gridSize) {
          tiles[Math.round(this.tileSpaceCoord.x + 1)][
            Math.round(this.tileSpaceCoord.y)
          ].updateTileState(false); // do not let this one update neighbors since only the first clicked on should
        }
        // below
        if (this.tileSpaceCoord.y - 1 >= 0) {
          tiles[Math.round(this.tileSpaceCoord.x)][
            Math.round(this.tileSpaceCoord.y - 1)
          ].updateTileState(false); // do not let this one update neighbors since only the first clicked on should
        }
        // above
        if (this.tileSpaceCoord.y + 1 < this.gridSize) {
          tiles[Math.round(this.tileSpaceCoord.x)][
            Math.round(this.tileSpaceCoord.y + 1)
          ].updateTileState(false); // do not let this one update neighbors since only the first clicked on should
        }
      }

      // Update text of all tiles
      updateAllTilesText(tiles, Math.sqrt(TilePatternAttrs.tileCount));
    }
  }

  findTileLocFromTileSpace() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const tileSpacing = this.size * sharedTileAttrs.tileSpacingFactor;

    // Calculate the starting position for the top-left tile in the grid
    let startGridX, startGridY;

    if (this.gridSize % 2 === 0) {
      // Even grid size
      startGridX = centerX - (this.gridSize / 2 - 0.5) * tileSpacing;
      startGridY = centerY - (this.gridSize / 2 - 0.5) * tileSpacing;
    } else {
      // Odd grid size
      startGridX = centerX - ((this.gridSize - 1) / 2) * tileSpacing;
      startGridY = centerY - ((this.gridSize - 1) / 2) * tileSpacing;
    }

    // Calculate the position of the current tile in the grid
    const tileX = startGridX + this.tileSpaceCoord.x * tileSpacing;
    const tileY = startGridY + this.tileSpaceCoord.y * tileSpacing;

    return new Vec2(tileX, tileY);
  }

  calculateTileSize(): number {
    // Calculate the tile size based on the screen width
    let tileSize = window.innerHeight * 0.15;
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;

    // Phone screen has larger tile
    if (window.innerWidth <= 600 || isPortrait) {
      tileSize = window.innerHeight * 0.09;
    }

    return tileSize;
  }

  handleWindowResize() {
    // Reinitialize the tile and its graphic on resize
    this.size = this.calculateTileSize();

    // Init at provided location, and centered
    const spawnLoc = this.findTileLocFromTileSpace();
    this.physicsBody2D!.position.x = spawnLoc.x;
    this.physicsBody2D!.position.y = spawnLoc.y;

    // Update text
    this.updateTextPos();
    this.updateTextSize();
  }

  subscribeToEvents() {
    // Add an event listener for pointer down events using phaser's event system
    this.graphic!.on("pointerdown", () => {
      // updateTileState when the pointer clicks down on the tile
      this.updateTileState();
    });

    // Update mouse on hover
    this.graphic!.on("pointerover", () => {
      this.scene.game.canvas.style.cursor = "pointer";
    });
    this.graphic!.on("pointerout", () => {
      this.scene.game.canvas.style.cursor = "default";
    });
  }
}
