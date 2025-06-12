import { GameObject } from "@/src/utils/game-object";
import { Vec2 } from "@/src/utils/vector";
import {
  tileStates,
  sharedTileAttrs,
  tilePatternAttrs,
  updateAllTilesText,
} from "@/src/games/flip-tile/tile-utils";
import { tiles } from "@/src/games/flip-tile/scenes/main-game-scene";
import { MainGameScene } from "@/src/games/flip-tile/scenes/main-game-scene";

export class Tile extends GameObject {
  public scene: MainGameScene;
  public text: Phaser.GameObjects.Text | null;
  public tileSpaceCoord: Vec2;
  public gridSize: number;
  public tileState: number;
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
      // init scale just so its set, will reset to something else later
      new Vec2(1, 1),
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
    this.scale = this.calculateTileScale();
    this.graphic = this.scene.add.sprite(0, 0, "Tile Red"); // init, will be changed in updateTileColor
    this.graphic!.setInteractive(); // make it so this graphic can be clicked on etc.
    this.updateTileColor();
    (this.graphic as Phaser.GameObjects.Sprite).setOrigin(0.5, 0.5); // Set the anchor point to the center
  }

  addText() {
    // Determine text color from theme. If no preference, assume dark since
    // that's the default
    const theme = localStorage.getItem("theme");
    let textColor = "#FFFFFF"; // Default to white

    if (theme === "dark" || !theme) {
      textColor = "#FFFFFF"; // white
    } else {
      textColor = "#000000"; // black
    }

    // Add text to the top right corner of the graphic
    this.text = this.scene.add.text(
      // Position relative to graphic's top right corner
      this.physicsBody2D!.position.x + this.graphic!.displayWidth / 2,
      this.physicsBody2D!.position.y - this.graphic!.displayHeight / 2,
      "1",
      { fontFamily: "Arial", fontSize: 40, color: textColor } // init text size here, but in reality it is updated in updateTextSize()
    );
    this.text!.setOrigin(-0.2, 0.7); // Origin on the top right corner of the text
    this.text!.setDepth(10); // Ensure the text appears on top of the graphic

    this.updateTextPos();
    this.updateTextSize();
    this.hideText();
  }

  removeText() {
    if (this.text) {
      this.text.destroy();
      this.text = null;
    }
  }

  updateTextSize() {
    let fontSize = 30;
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;

    // for phones change the font size
    if (
      (window.visualViewport?.width || window.innerWidth) <= 600 ||
      isPortrait
    ) {
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
  }

  updateTileColor() {
    // Color
    if (this.tileState === tileStates.RED) {
      (this.graphic as Phaser.GameObjects.Sprite).setTexture("Tile Red");
    } else if (this.tileState === tileStates.BLUE) {
      (this.graphic as Phaser.GameObjects.Sprite).setTexture("Tile Blue");
    } else if (this.tileState === tileStates.GREEN) {
      (this.graphic as Phaser.GameObjects.Sprite).setTexture("Tile Green");
    } else {
      console.log(`ERROR: tileState ${this.tileState} is not an expected one`);
    }

    // Animations
    this.playClickSpinAnim();
  }

  playClickSpinAnim() {
    document.dispatchEvent(new CustomEvent("tileSpin"));

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
      scaleX: this.calculateTileScale().x * sharedTileAttrs.tileSpacingFactor,
      scaleY: this.calculateTileScale().y * sharedTileAttrs.tileSpacingFactor,
      duration: duration / 2, // /2 since yoyo doubles the time
      ease: "Sine.easeInOut",
      yoyo: true, // Return to original scale and rotation after the animation
      onUpdate: (
        tween: Phaser.Tweens.Tween,
        target: Phaser.GameObjects.Sprite
      ) => {
        // Ensures that the scale variable reflects the scale as it changes with the tween
        this.scale.x = target.scaleX;
        this.scale.y = target.scaleY;
      },
      onComplete: () => {
        // Can click after all animations are done
        this.animationPlaying = false;
        this.scene.tryToEnableClick();
      },
    });
  }

  handleUpdateTileState = () => {
    this.updateTileState();
  };

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
      if (nextState > tilePatternAttrs.qtyStatesBeingUsed - 1) {
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
      updateAllTilesText(tiles, Math.sqrt(tilePatternAttrs.tileCount));
    }
  }

  findTileLocFromTileSpace(): Vec2 {
    const centerX = (window.visualViewport?.width || window.innerWidth) / 2;
    const centerY = (window.visualViewport?.height || window.innerHeight) / 2;

    // Original tile is 200px, so spacing is og tile sprite size * scale * spacing factor
    const tileSpacingX =
      200 * this.calculateTileScale().x * sharedTileAttrs.tileSpacingFactor;
    const tileSpacingY =
      200 * this.calculateTileScale().y * sharedTileAttrs.tileSpacingFactor;

    // Calculate the starting position for the top-left tile in the grid
    let startGridX, startGridY;

    if (this.gridSize % 2 === 0) {
      // Even grid size
      startGridX = centerX - (this.gridSize / 2 - 0.5) * tileSpacingX;
      startGridY = centerY - (this.gridSize / 2 - 0.5) * tileSpacingY;
    } else {
      // Odd grid size
      startGridX = centerX - ((this.gridSize - 1) / 2) * tileSpacingX;
      startGridY = centerY - ((this.gridSize - 1) / 2) * tileSpacingY;
    }

    // Calculate the position of the current tile in the grid
    const tileX = startGridX + this.tileSpaceCoord.x * tileSpacingX;
    const tileY = startGridY + this.tileSpaceCoord.y * tileSpacingY;

    return new Vec2(tileX, tileY);
  }

  calculateTileScale(): Vec2 {
    // Calculate the tile scale based on the screen width
    let tileScale =
      ((window.visualViewport?.height || window.innerHeight) * 0.15) / 200;
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;

    // Phone screen has larger tile
    if (
      (window.visualViewport?.width || window.innerWidth) <= 600 ||
      isPortrait
    ) {
      tileScale =
        ((window.visualViewport?.height || window.innerHeight) * 0.09) / 200;
    }

    return new Vec2(tileScale, tileScale);
  }

  handleWindowResize() {
    // Reinitialize the tile and its graphic on resize
    this.scale = this.calculateTileScale();

    // Init at provided location, and centered
    const spawnLoc = this.findTileLocFromTileSpace();
    this.physicsBody2D!.position.x = spawnLoc.x;
    this.physicsBody2D!.position.y = spawnLoc.y;

    // Update text
    this.updateTextPos();
    this.updateTextSize();
  }

  handlePointerOver = () => {
    this.scene.game.canvas.style.cursor = "pointer";
  };

  handlePointerOut = () => {
    this.scene.game.canvas.style.cursor = "default";
  };

  subscribeToEvents() {
    // Add an event listener for pointer down events using phaser's event system
    this.graphic!.on("pointerdown", this.handleUpdateTileState);

    // Update mouse on hover
    this.graphic!.on("pointerover", this.handlePointerOver);
    this.graphic!.on("pointerout", this.handlePointerOut);
  }

  unsubscribeFromEvents() {
    this.graphic!.off("pointerdown", this.handleUpdateTileState);
    this.graphic!.off("pointerover", this.handlePointerOver);
    this.graphic!.off("pointerout", this.handlePointerOut);
  }

  destroy() {
    super.destroy();

    // Destroy the text object
    this.removeText();

    // Unsubscribe from events
    this.unsubscribeFromEvents();
  }
}
