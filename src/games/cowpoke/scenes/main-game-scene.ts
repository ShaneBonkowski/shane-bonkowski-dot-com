import { Generic2DGameScene } from "@/src/utils/game-scene-2d";
import { Vec2 } from "@/src/utils/vector";
import {
  dispatchCloseLoadingScreenEvent,
  dispatchGameStartedEvent,
  dispatchMenuEvent,
} from "@/src/events/game-events";
import { resizeCanvasToParent } from "@/src/utils/phaser-canvas";
import { Decoration, DECOR_TYPES } from "@/src/games/cowpoke/decoration";
import { Physics } from "@/src/utils/physics";
import { SeededRandom, randomType } from "@/src/utils/seedable-random";
import { Character, CHARACTER_TYPES } from "@/src/games/cowpoke/character";
import { sendFeedMessage } from "@/src/games/cowpoke/Feed";
import { gameDataStore, GameData } from "@/src/games/cowpoke/game-data-store";

// Bkg art was drawn at 1920x1080, so we use that as the reference size.
// This is used to scale the background decorations to fit the screen.
// Note that this is not the same as the game canvas size, which is set to
// 100% width and height of the parent element.
export const REFERENCE_BKG_SIZE: Vec2 = new Vec2(1920, 1080);

const COMBAT_BEATEN_BY_MAP: Record<string, string> = {
  attack: "counter", // counter is ideal against attack
  defend: "attack", // attack is ideal (somewhat) against defend
  counter: "defend", // defend is ideal against counter
};

const ELEMENT_BEATEN_BY_MAP: Record<string, string> = {
  rock: "paper", // paper beats rock
  paper: "scissors", // scissors beats paper
  scissors: "rock", // rock beats scissors
};

export class MainGameScene extends Generic2DGameScene {
  private decorations: Decoration[] = [];
  private player: Character | null = null;
  private playerExtraDamageMultiplier: number = 1;
  private enemy: Character | null = null;
  private enemyExtraDamageMultiplier: number = 1;
  public gameRound: number = 0;
  public playerGoesFirst: boolean = true;

  public random: SeededRandom = new SeededRandom(randomType.UNSEEDED_RANDOM);

  private resizeObserver: ResizeObserver | null = null;
  public lastKnownWindowSize: Vec2 | null = null;
  private lastManualWindowResizeTime: number = 0;
  private windowResizeInterval: number = 2000;

  public uiMenuOpen: boolean = false;
  public moving: boolean = false;
  private movingStartTime: number = 0;
  private movingDuration: number = 1250; // ms
  public combatDuration = 500; // ms

  public autoMode: boolean = false;
  public fastMode: boolean = false;

  constructor() {
    // Call the parent Generic2DGameScene's constructor with
    // this scene name supplied as the name of the scene.
    super("MainGameScene");

    // Last thing we do is set the lastKnownWindowSize to the current screen size
    const screenWidth = window.visualViewport?.width || window.innerWidth;
    const screenHeight = window.visualViewport?.height || window.innerHeight;
    this.lastKnownWindowSize = new Vec2(screenWidth, screenHeight);
  }

  preload() {
    super.preload();

    // Backgrounds
    this.load.image("bkg-back", "/webps/games/cowpoke-bkg-back.webp");
    this.load.image("bkg-mid-1", "/webps/games/cowpoke-bkg-mid-1.webp");
    this.load.image("bkg-mid-2", "/webps/games/cowpoke-bkg-mid-2.webp");
    this.load.image("bkg-floor", "/webps/games/cowpoke-bkg-floor.webp");

    // Front decor
    this.load.image(
      "bkg-front-cactus-1",
      "/webps/games/cowpoke-bkg-front-cactus-1.webp"
    );
    this.load.image(
      "bkg-front-cactus-2",
      "/webps/games/cowpoke-bkg-front-cactus-2.webp"
    );
    this.load.image(
      "bkg-front-cactus-3",
      "/webps/games/cowpoke-bkg-front-cactus-3.webp"
    );
    this.load.image(
      "bkg-front-cactus-4",
      "/webps/games/cowpoke-bkg-front-cactus-4.webp"
    );
    this.load.image(
      "bkg-front-cactus-5",
      "/webps/games/cowpoke-bkg-front-cactus-5.webp"
    );
    this.load.image(
      "bkg-front-cactus-6",
      "/webps/games/cowpoke-bkg-front-cactus-6.webp"
    );
    this.load.image(
      "bkg-front-rock-1",
      "/webps/games/cowpoke-bkg-front-rock-1.webp"
    );
    this.load.image(
      "bkg-front-rock-2",
      "/webps/games/cowpoke-bkg-front-rock-2.webp"
    );

    // Guns
    this.load.image("shield-block", "/webps/games/cowpoke-shield.webp");
    this.load.image(
      "gun-handcannon",
      "/webps/games/cowpoke-gun-handcannon.webp"
    );
    this.load.image("gun-revolver", "/webps/games/cowpoke-gun-revolver.webp");

    // Hats
    this.load.image("hat-bandito", "/webps/games/cowpoke-hat-bandito.webp");
    this.load.image("hat-sherif", "/webps/games/cowpoke-hat-sherif.webp");

    // Bodies
    this.load.image("body-default", "/webps/games/cowpoke-body-default.webp");

    // Heads
    this.load.image(
      "head-bandito-1",
      "/webps/games/cowpoke-head-bandito-1.webp"
    );
    this.load.image(
      "head-bandito-2",
      "/webps/games/cowpoke-head-bandito-2.webp"
    );
    this.load.image(
      "head-bandito-3",
      "/webps/games/cowpoke-head-bandito-3.webp"
    );
    this.load.image(
      "head-bandito-4",
      "/webps/games/cowpoke-head-bandito-4.webp"
    );
    this.load.image(
      "head-chill-guy",
      "/webps/games/cowpoke-head-chill-guy.webp"
    );

    // Extras
    this.load.image("rarity-star-1", "/webps/games/cowpoke-rarity-star-1.webp");
    this.load.image("rarity-star-2", "/webps/games/cowpoke-rarity-star-2.webp");
    this.load.image("rarity-star-3", "/webps/games/cowpoke-rarity-star-3.webp");
    this.load.image("shield", "/webps/games/cowpoke-shield.webp");
  }

  create() {
    super.create();

    this.setupSyncedGameData();

    // Make sure the canvas is resized to fit the parent element
    this.handleWindowResize();

    // Hide loading screen so we can reveal the start menu...
    // game start is not called til after start menu is closed
    dispatchCloseLoadingScreenEvent("Cowpoke");
    this.openStartMenu();
  }

  setupSyncedGameData() {
    // Get snapshot of the game data, then load them in and subscribe to changes.
    const gameData = gameDataStore.getSnapshot();

    this.setGameDataFromStore(gameData);

    gameDataStore.subscribe(() => {
      const newGameData = gameDataStore.getSnapshot();
      this.handleGameDataChange(newGameData);
    });
  }

  handleGameDataChange = (gameData: GameData) => {
    this.setGameDataFromStore(gameData);
  };

  setGameDataFromStore(gameData: GameData) {
    this.autoMode = gameData.autoMode;
    this.fastMode = gameData.fastMode;
  }

  startGame = () => {
    const screenWidth = window.visualViewport?.width || window.innerWidth;
    const screenHeight = window.visualViewport?.height || window.innerHeight;

    sendFeedMessage(
      "A new cowpoke is headin' west. Best of luck, partner",
      "Cowpoke Jack's Ghost",
      "center"
    );

    this.initializeCharactersAndBackgroundDecorations(
      screenWidth,
      screenHeight
    );

    this.gameStarted = true;
    this.gameRound = 1;

    // Start the moving slider bar for element to start
    document.dispatchEvent(
      new CustomEvent("startMovingSlider", {
        detail: { sliderId: "win-element" },
      })
    );

    dispatchGameStartedEvent("Cowpoke");
  };

  /**
   * This function is called when the game ends, either because the player
   * has lost, or the player has chosen to end the game.
   */
  endGame() {
    // Lifetime stats
    const gameData = gameDataStore.getSnapshot();
    gameDataStore.setLifetimeKills(gameData.lifetimeKills + this.player!.kills);

    if (this.player!.level > gameData.lifetimeFurthestLevel) {
      gameDataStore.setLifetimeFurthestLevel(this.player!.level);
    }

    // Tell the game that ui menu was opened so that it
    // hides the UI etc.
    dispatchMenuEvent("fake menu", "open");

    // Actually end the game after a short delay...
    // This allows user to maybe see the death anim etc.
    setTimeout(() => {
      // End game
      this.gameStarted = false;
      this.destroyGameObjects();
      document.dispatchEvent(new Event("clearFeed"));

      // Open the end menu so a player can restart etc.
      this.openEndMenu();
    }, 1250);
  }

  openStartMenu() {
    // Dispatch an event to open the start menu
    document.dispatchEvent(
      new CustomEvent("openStartEndMenu", { detail: { type: "start" } })
    );
  }

  openEndMenu() {
    // Dispatch an event to open the end menu
    document.dispatchEvent(
      new CustomEvent("openStartEndMenu", { detail: { type: "end" } })
    );
  }

  initializeCharactersAndBackgroundDecorations(
    screenWidth: number,
    screenHeight: number
  ) {
    // Back bkg
    this.decorations.push(
      new Decoration(
        this,
        screenWidth / 2,
        screenHeight,
        DECOR_TYPES.BACK,
        "bkg-back"
      )
    );

    // Need 2 mid backgrounds. One on the pg and one offscreen shifted by screen width.
    // This is so there is a buffer to allow for parallax scrolling.
    this.decorations.push(
      new Decoration(
        this,
        screenWidth / 2,
        screenHeight,
        DECOR_TYPES.MID,
        "bkg-mid-1"
      )
    );
    this.decorations.push(
      new Decoration(
        this,
        screenWidth / 2 + screenWidth,
        screenHeight,
        DECOR_TYPES.MID,
        "bkg-mid-2"
      )
    );

    // Floor bkg
    this.decorations.push(
      new Decoration(
        this,
        screenWidth / 2,
        screenHeight,
        DECOR_TYPES.FLOOR,
        "bkg-floor"
      )
    );

    // Add some front decorations at random x positions on the screen to start.
    // Must be sufficiently spaced out so they do not overlap.
    const propSpawnOptionsPercentViewportWidth = [
      [0.08, 0.14, 0.2], // e.g. prop 1 can be located at x% of viewport width from one of these choices
      [0.3, 0.4, 0.55, 0.6],
      [0.75, 0.8, 0.85],
    ];
    for (let i = 0; i < propSpawnOptionsPercentViewportWidth.length; i++) {
      const spawnPercents = propSpawnOptionsPercentViewportWidth[i];
      const chosenPercent =
        spawnPercents[this.random.getRandomInt(0, spawnPercents.length)];
      const xPosition = screenWidth * chosenPercent;

      this.decorations.push(
        new Decoration(
          this,
          xPosition,
          screenHeight,
          DECOR_TYPES.FRONT,
          // Start with a random cactus decoration. Other props will get added in as the
          // game progresses.
          this.getRandomCactusSprite()
        )
      );
    }

    // Create the player character
    this.player = new Character(
      this,
      screenWidth,
      screenHeight,
      CHARACTER_TYPES.PLAYER
    );

    // Create the enemy character
    this.enemy = new Character(
      this,
      screenWidth,
      screenHeight,
      CHARACTER_TYPES.ENEMY
    );
  }

  getRandomCactusSprite() {
    const cactusSprites = this.textures
      .getTextureKeys()
      .filter((key: string) => key.startsWith("bkg-front-cactus-"));
    return cactusSprites[this.random.getRandomInt(0, cactusSprites.length)];
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    if (this.gameStarted) {
      // Physics update at a slower rate
      if (
        time - Physics.lastPhysicsUpdateTime >=
        Physics.physicsUpdateInterval
      ) {
        Physics.performPhysicsUpdate(time);

        // If the player is moving, need to move decor to make it look like
        // the player is moving.
        for (const decoration of this.decorations) {
          decoration.handlePhysics(delta, this.moving);
        }
      }

      // Handle time-based player and enemy animations
      this.player!.handleAnims();
      this.enemy!.handleAnims();

      // Graphics update will occur every frame
      for (const decoration of this.decorations) {
        decoration.updateGraphic();
      }
      this.player!.updateGraphic();
      this.enemy!.updateGraphic();

      // Check if moving can be ended
      if (this.moving) {
        if (time - this.movingStartTime >= this.movingDuration) {
          this.stopMoving();
        }
      }
    }

    // In order to handle edge cases where the resize observer does not catch
    // a resize (such as when iPhone toolbar changes), we also check for resize
    // every windowResizeInterval milliseconds.
    if (time - this.lastManualWindowResizeTime >= this.windowResizeInterval) {
      this.handleWindowResize();
      this.lastManualWindowResizeTime = time;
    }
  }

  /*
   * Note that this function is called in the create() method for GameScene2D,
   * so no need to call it! That is handled automatically.
   */
  subscribeToEvents() {
    super.subscribeToEvents();

    // Subscribe to events for this scene
    this.setUpWindowResizeHandling();

    document.addEventListener("startLoadingGame", this.startGame);
    document.addEventListener("toggleAutomatic", this.handleToggleAutomatic);
    document.addEventListener("toggleFastMode", this.handleToggleFastMode);

    document.addEventListener("uiMenuOpen", this.handleUiMenuOpen);
    document.addEventListener("uiMenuClose", this.handleUiMenuClose);

    document.addEventListener("selectElement", this.ready);
    document.addEventListener("selectCombat", this.draw);
    document.addEventListener(
      "movingSliderResult",
      this.handleMovingSliderResult
    );
    document.addEventListener(
      "executeLastCombat",
      this.handleExecuteLastCombat
    );
    document.addEventListener("postCombat", this.handlePostCombat);
  }

  ready = (event: Event) => {
    const custom = event as CustomEvent;
    const type = custom.detail?.type;

    if (type === "rock" || type === "paper" || type === "scissors") {
      // Player picks element, then stops element slider.. this will trigger
      // another event which starts the combat slider and picks enemy element.
      this.player!.elementSelected = type;

      document.dispatchEvent(
        new CustomEvent("stopMovingSlider", {
          detail: { sliderId: "win-element" },
        })
      );
    } else {
      console.warn(
        `Unknown type "${type}" in ready event. Expected "rock", "paper", or "scissors".`
      );
    }
  };

  draw = (event: Event) => {
    const custom = event as CustomEvent;
    const type = custom.detail?.type;

    if (type === "attack" || type === "defend" || type === "counter") {
      // Player picks combat, then stops combat slider.. this will trigger
      // another event which picks enemy combat and fires.
      this.player!.combatSelected = type;

      document.dispatchEvent(
        new CustomEvent("stopMovingSlider", {
          detail: { sliderId: "win-combat" },
        })
      );
    } else {
      console.warn(
        `Unknown type "${type}" in draw event. Expected "attack", "defend", or "counter".`
      );
    }
  };

  fire() {
    // Execute the "sub round" combat
    this.calculateDamageMultipliers();

    // Start w/ first combat, and let events drive the
    // rest of the combat so that theres time for animations.
    this.executeFirstCombat();
  }

  executeFirstCombat() {
    // Execute the first combat based on who goes first.
    if (this.playerGoesFirst) {
      this.executePlayerCombat();
    } else {
      this.executeEnemyCombat();
    }

    // Dispatch an event to handle the next combat step after a lil delay
    // for combat animations to play.
    setTimeout(() => {
      document.dispatchEvent(new Event("executeLastCombat"));
    }, this.combatDuration);
  }

  handleExecuteLastCombat = () => {
    this.executeLastCombat();
  };

  executeLastCombat() {
    if (this.playerGoesFirst) {
      // Let the enemy execute their combat if they are still alive
      if (!this.enemy!.dead) {
        this.executeEnemyCombat();
      }
    } else {
      // Let the player execute their combat if they are still alive
      if (!this.player!.dead) {
        this.executePlayerCombat();
      }
    }

    // dispatch event to handle post-combat logic after a lil delay
    setTimeout(() => {
      document.dispatchEvent(new Event("postCombat"));
    }, this.combatDuration);
  }

  handlePostCombat = () => {
    this.postCombat();
  };

  postCombat() {
    // Handle the combat results
    if (this.player!.dead) {
      // Game Over if player dies
      this.endGame();
    } else if (this.enemy!.dead) {
      // Next round if enemy dies
      this.gameRound += 1;
      this.walkToNextEnemy();
    } else {
      // Neither have died, move to next "sub round" and start the moving slider
      // for element again
      document.dispatchEvent(
        new CustomEvent("startMovingSlider", {
          detail: { sliderId: "win-element" },
        })
      );
    }
  }

  executePlayerCombat() {
    let playerDmgDealt =
      this.player!.getDamageAmount() * this.playerExtraDamageMultiplier;
    playerDmgDealt = Math.round(playerDmgDealt * 100) / 100;

    this.player!.attack(this.enemy!, playerDmgDealt);
  }

  executeEnemyCombat() {
    let enemyDmgDealt =
      this.enemy!.getDamageAmount() * this.enemyExtraDamageMultiplier;
    enemyDmgDealt = Math.round(enemyDmgDealt * 100) / 100;

    this.enemy!.attack(this.player!, enemyDmgDealt);
  }

  calculateDamageMultipliers() {
    // Play out the "sub-round" to see who won, who gets dmg'd etc.
    let playerExtraDamageMultiplier = 1;
    let enemyExtraDamageMultiplier = 1;

    // Handle element matchups
    if (
      ELEMENT_BEATEN_BY_MAP[this.player!.elementSelected!] ===
      this.enemy!.elementSelected
    ) {
      // Enemy wins element
      playerExtraDamageMultiplier = 0.5;
      enemyExtraDamageMultiplier = 1.5;
    } else if (
      // Player wins element
      ELEMENT_BEATEN_BY_MAP[this.enemy!.elementSelected!] ===
      this.player!.elementSelected
    ) {
      playerExtraDamageMultiplier = 1.5;
      enemyExtraDamageMultiplier = 0.5;
    } else {
      // Draw, both do normal damage
      playerExtraDamageMultiplier = 1;
      enemyExtraDamageMultiplier = 1;
    }

    // Handle combat matchups
    if (this.player!.combatSelected === "attack") {
      if (this.enemy!.combatSelected === "attack") {
        // Both attack, no extra damage
        playerExtraDamageMultiplier *= 1;
        enemyExtraDamageMultiplier *= 1;
      } else if (this.enemy!.combatSelected === "defend") {
        // Attack a defender, do 0.5x each
        playerExtraDamageMultiplier *= 0.5;
        enemyExtraDamageMultiplier *= 0.5;
      } else if (this.enemy!.combatSelected === "counter") {
        // Attack a counter, 50/50 chance to do no damage.
        // Enemy doing counter does 1.5x.
        if (this.random.getRandomFloat(0, 1) < 0.5) {
          playerExtraDamageMultiplier = 0;
        } else {
          playerExtraDamageMultiplier *= 1;
        }
        enemyExtraDamageMultiplier *= 1.5;
      }
    } else if (this.player!.combatSelected === "defend") {
      if (this.enemy!.combatSelected === "attack") {
        // Defend against an attacker, do 0.5x each
        playerExtraDamageMultiplier *= 0.5;
        enemyExtraDamageMultiplier *= 0.5;
      } else if (this.enemy!.combatSelected === "defend") {
        // Both defend, no damage dealt
        playerExtraDamageMultiplier *= 0;
        enemyExtraDamageMultiplier *= 0;
      } else if (this.enemy!.combatSelected === "counter") {
        // Defend against a counter, do 1x dmg and enemy does 0x.
        playerExtraDamageMultiplier *= 1;
        enemyExtraDamageMultiplier *= 0;
      }
    } else if (this.player!.combatSelected === "counter") {
      if (this.enemy!.combatSelected === "attack") {
        // Counter an attacker, do 1.5x dmg and 50/50 chance enemy does 0x.
        playerExtraDamageMultiplier *= 1.5;
        if (this.random.getRandomFloat(0, 1) < 0.5) {
          enemyExtraDamageMultiplier = 0;
        } else {
          enemyExtraDamageMultiplier *= 1;
        }
      } else if (this.enemy!.combatSelected === "defend") {
        // Counter a defender, do 0x dmg and enemy does 1x shield bash.
        playerExtraDamageMultiplier *= 0;
        enemyExtraDamageMultiplier *= 1;
      } else if (this.enemy!.combatSelected === "counter") {
        // Both counter, no extra damage
        playerExtraDamageMultiplier *= 1;
        enemyExtraDamageMultiplier *= 1;
      }
    }

    // Update the multipliers for the player and enemy
    this.playerExtraDamageMultiplier = playerExtraDamageMultiplier;
    this.enemyExtraDamageMultiplier = enemyExtraDamageMultiplier;
  }

  walkToNextEnemy() {
    this.startMoving();
  }

  startMoving() {
    this.moving = true;
    this.movingStartTime = performance.now();
  }

  stopMoving() {
    this.moving = false;

    // Arrive at the next enemy after done moving
    this.arriveAtNextEnemy();
  }

  arriveAtNextEnemy() {
    // Spawn new enemy
    this.enemy!.spawnNewRandomCharacter();

    // Start the moving slider for element again
    document.dispatchEvent(
      new CustomEvent("startMovingSlider", {
        detail: { sliderId: "win-element" },
      })
    );
  }

  handleMovingSliderResult = (event: Event) => {
    const custom = event as CustomEvent;
    const sliderId = custom.detail?.sliderId;
    const distance = custom.detail?.distance;
    if (sliderId === "win-element") {
      // % chance enemy picks optimal element, lower if player got close to the target
      let winElementChance = 0.33;
      let extraWinElementStr = "";
      if (distance < 0.01) {
        winElementChance += 0.5;
        extraWinElementStr = " +50% win chance";
      } else if (distance < 0.05) {
        winElementChance += 0.1;
        extraWinElementStr = " +10% win chance";
      } else if (distance < 0.1) {
        winElementChance += 0.05;
        extraWinElementStr = " +5% win chance";
      }

      // Add any element inc/dec from player and enemy loot, if applicable
      winElementChance += this.player!.getElementIncreaseFromLoot();
      winElementChance -= this.enemy!.getElementIncreaseFromLoot();
      winElementChance = Math.max(0, Math.min(1, winElementChance));

      this.enemy!.elementSelected = this.pickEnemyChoice(
        this.player!.elementSelected!,
        winElementChance,
        ["rock", "paper", "scissors"],
        ELEMENT_BEATEN_BY_MAP
      );

      // Send the message for the player and enemy's element choice
      this.sendElementMessage(
        this.player,
        this.player!.elementSelected!,
        extraWinElementStr
      );
      this.sendElementMessage(this.enemy, this.enemy!.elementSelected);

      // Start the combat slider after the element slider is done
      document.dispatchEvent(
        new CustomEvent("startMovingSlider", {
          detail: { sliderId: "win-combat" },
        })
      );
    } else if (sliderId === "win-combat") {
      // % chance enemy picks optimal combat action, lower if player got close to the target
      let winCombatChance = 0.33;
      let extraWinCombatStr = "";
      if (distance < 0.01) {
        winCombatChance += 0.5;
        extraWinCombatStr = " +50% win chance";
      } else if (distance < 0.05) {
        winCombatChance += 0.1;
        extraWinCombatStr = " +10% win chance";
      } else if (distance < 0.1) {
        winCombatChance += 0.05;
        extraWinCombatStr = " +5% win chance";
      }

      // Add any combat inc/dec from player and enemy loot, if applicable
      winCombatChance += this.player!.getCombatIncreaseFromLoot();
      winCombatChance -= this.enemy!.getCombatIncreaseFromLoot();
      winCombatChance = Math.max(0, Math.min(1, winCombatChance));

      this.enemy!.combatSelected = this.pickEnemyChoice(
        this.player!.combatSelected!,
        winCombatChance,
        ["attack", "defend", "counter"],
        COMBAT_BEATEN_BY_MAP
      );

      // Send the message for the winner's combat action choice, then the loser, or if
      // its a draw, do player first, then enemy.
      if (
        COMBAT_BEATEN_BY_MAP[this.player!.combatSelected!] ===
        this.enemy!.combatSelected
      ) {
        // Enemy wins
        this.sendCombatMessage(this.enemy, this.enemy!.combatSelected);
        this.sendCombatMessage(
          this.player,
          this.player!.combatSelected!,
          extraWinCombatStr
        );
        this.playerGoesFirst = false;
      } else {
        // Player wins or draw, send player msg first
        this.sendCombatMessage(
          this.player,
          this.player!.combatSelected!,
          extraWinCombatStr
        );
        this.sendCombatMessage(this.enemy, this.enemy!.combatSelected!);
        this.playerGoesFirst = true;
      }

      // Start the block animations for both player and enemy if they are defending.
      if (this.player!.combatSelected === "defend") {
        this.player!.block();
      }

      if (this.enemy!.combatSelected === "defend") {
        this.enemy!.block();
      }

      // Attack time!
      this.fire();
    } else {
      console.warn(
        `Unknown sliderId "${sliderId}" in handleMovingSliderResult. Expected "win-element" or "win-combat".`
      );
    }
  };

  /**
   * Picks an enemy choice based on the player's choice and the win chance.
   * @param playerChoice The player's choice (e.g. rock, paper, or scissors).
   * @param playerWinChance The chance that the enemy will pick a choice that makes player win.
   * @param choices The available choices for the enemy.
   * @param beatenByMap A map of choices that are beaten by each choice.
   * @returns The enemy's choice.
   */
  pickEnemyChoice(
    playerChoice: string,
    playerWinChance: number,
    choices: string[],
    beatenByMap: Record<string, string>
  ) {
    // Find the choice that is beaten by the player's choice (i.e., player wins)
    const beatenChoice = Object.keys(beatenByMap).find(
      (key) => beatenByMap[key] === playerChoice
    );

    if (this.random.getRandomFloat(0, 1) < playerWinChance && beatenChoice) {
      // Enemy picks the losing choice (player wins)
      return beatenChoice;
    } else {
      // Enemy picks randomly from the other options
      const choicesToPickFrom = choices.filter(
        (choice) => choice !== beatenChoice
      );
      return choicesToPickFrom[
        this.random.getRandomInt(0, choicesToPickFrom.length)
      ];
    }
  }

  sendElementMessage(
    character: Character | null,
    type: string,
    extraStr: string = ""
  ) {
    switch (type) {
      case "rock":
        sendFeedMessage(
          "Feel this, partner <b>(rock" + extraStr + ")</b>",
          character!.name,
          character!.type == CHARACTER_TYPES.PLAYER ? "left" : "right"
        );
        break;
      case "paper":
        sendFeedMessage(
          "Here's my wanted poster <b>(paper" + extraStr + ")</b>",
          character!.name,
          character!.type == CHARACTER_TYPES.PLAYER ? "left" : "right"
        );
        break;
      case "scissors":
        sendFeedMessage(
          "Snip-snip, varmint <b>(scissors" + extraStr + ")</b>",
          character!.name,
          character!.type == CHARACTER_TYPES.PLAYER ? "left" : "right"
        );
        break;
      default:
        console.warn(
          `Unknown type "${type}" in sendElementMessage. Expected "rock", "paper", or "scissors".`
        );
        break;
    }
  }

  sendCombatMessage(
    character: Character | null,
    type: string,
    extraStr: string = ""
  ) {
    switch (type) {
      case "attack":
        sendFeedMessage(
          "Draw, partner! <b>(attack" + extraStr + ")</b>",
          character!.name,
          character!.type == CHARACTER_TYPES.PLAYER ? "left" : "right"
        );
        break;
      case "defend":
        sendFeedMessage(
          "Take'n cover, yellabelly! <b>(defend" + extraStr + ")</b>",
          character!.name,
          character!.type == CHARACTER_TYPES.PLAYER ? "left" : "right"
        );
        break;
      case "counter":
        sendFeedMessage(
          "Yeehaw, not so fast <b>(counter" + extraStr + ")</b>",
          character!.name,
          character!.type == CHARACTER_TYPES.PLAYER ? "left" : "right"
        );
        break;
      default:
        console.warn(
          `Unknown type "${type}" in sendCombatMessage. Expected "attack", "defend", or "counter".`
        );
        break;
    }
  }

  handleToggleAutomatic = () => {
    gameDataStore.setAutoMode(!this.autoMode);
  };

  handleToggleFastMode = () => {
    gameDataStore.setFastMode(!this.fastMode);
  };

  /*
   * Note that this function is called in the shutdown() method for GameScene2D,
   * so no need to call it! That is handled automatically.
   */
  unsubscribeFromEvents() {
    super.unsubscribeFromEvents();

    // Unsubscribe from events for this scene
    this.tearDownWindowResizeHandling();

    document.removeEventListener("startLoadingGame", this.startGame);
    document.removeEventListener("toggleAutomatic", this.handleToggleAutomatic);
    document.removeEventListener("toggleFastMode", this.handleToggleFastMode);

    document.removeEventListener("uiMenuOpen", this.handleUiMenuOpen);
    document.removeEventListener("uiMenuClose", this.handleUiMenuClose);

    document.removeEventListener("selectElement", this.ready);
    document.removeEventListener("selectCombat", this.draw);
    document.removeEventListener(
      "movingSliderResult",
      this.handleMovingSliderResult
    );
    document.removeEventListener(
      "executeLastCombat",
      this.handleExecuteLastCombat
    );
    document.removeEventListener("postCombat", this.handlePostCombat);
  }

  // Using Arrow Function to bind the context of "this" to the class instance.
  // This is necc. for event handlers.
  handleUiMenuOpen = () => {
    this.uiMenuOpen = true;
  };

  // Using Arrow Function to bind the context of "this" to the class instance.
  // This is necc. for event handlers.
  handleUiMenuClose = () => {
    this.uiMenuOpen = false;
  };

  setUpWindowResizeHandling() {
    // Observe window resizing so we can adjust the position
    // and size accordingly!

    // Observe window resizing with ResizeObserver since it is good for snappy changes
    this.resizeObserver = new ResizeObserver(() => {
      this.handleWindowResize();
    });
    this.resizeObserver.observe(document.documentElement);

    // Also checking for resize or orientation change to try to handle edge cases
    // that ResizeObserver misses!
    window.addEventListener("resize", this.handleWindowResize);
    window.addEventListener("orientationchange", this.handleWindowResize);
  }

  tearDownWindowResizeHandling() {
    if (this.resizeObserver != null) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    window.removeEventListener("resize", this.handleWindowResize);
    window.removeEventListener("orientationchange", this.handleWindowResize);
  }

  // Using Arrow Function to bind the context of "this" to the class instance.
  // This is necc. for event handlers.
  handleWindowResize = () => {
    // Ensure the scene is fully initialized before handling resize
    if (!this.isInitialized) {
      console.warn("handleWindowResize called before scene initialization.");
      return;
    }

    // Update canvas size to match the parent.
    // This is needed to be done manually since Phaser.AUTO does not
    // take into account some nuances of screen size on safari/iOS.
    resizeCanvasToParent(this.game);

    // This is a workaround for the iOS bug where address bar or "enable diction"
    // window appearing causes scroll that gets stuck.
    if (window.scrollX !== 0 || window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }

    // Get the new screen dimensions
    const screenWidth = window.visualViewport?.width || window.innerWidth;
    const screenHeight = window.visualViewport?.height || window.innerHeight;

    // Handle resizing of game objs
    if (
      !this.lastKnownWindowSize ||
      this.lastKnownWindowSize.x == null ||
      this.lastKnownWindowSize.y == null
    ) {
      console.warn(
        "lastKnownWindowSize is not properly initialized. Skipping resize handling."
      );
      this.lastKnownWindowSize = new Vec2(screenWidth, screenHeight);
      return;
    } else {
      if (
        this.lastKnownWindowSize.x === screenWidth &&
        this.lastKnownWindowSize.y === screenHeight
      ) {
        return;
      }

      // Update positions of all objs based on new screen dimensions. We want to
      // retain the general location of the obj, so we try to position it the
      // same screen % it was before on the new screen.
      let newX: number | null = null;
      let newY: number | null = null;

      for (const decoration of this.decorations) {
        if (decoration) {
          newX =
            (decoration.physicsBody2D!.position.x /
              this.lastKnownWindowSize.x) *
            screenWidth;
          newY =
            (decoration.physicsBody2D!.position.y /
              this.lastKnownWindowSize.y) *
            screenHeight;

          decoration.handleWindowResize(newX, newY);
        }
      }

      if (this.player) {
        newX =
          (this.player!.physicsBody2D!.position.x /
            this.lastKnownWindowSize.x) *
          screenWidth;
        newY =
          (this.player!.physicsBody2D!.position.y /
            this.lastKnownWindowSize.y) *
          screenHeight;

        this.player!.handleWindowResize(newX, newY);
      }

      if (this.enemy) {
        newX =
          (this.enemy!.physicsBody2D!.position.x / this.lastKnownWindowSize.x) *
          screenWidth;
        newY =
          (this.enemy!.physicsBody2D!.position.y / this.lastKnownWindowSize.y) *
          screenHeight;

        this.enemy!.handleWindowResize(newX, newY);
      }
    }

    // Update lastKnownWindowSize to current screen dimensions
    this.lastKnownWindowSize = new Vec2(screenWidth, screenHeight);
  };

  destroyGameObjects() {
    for (const decoration of this.decorations) {
      if (decoration) {
        decoration.destroy();
      }
    }
    this.decorations = [];

    if (this.player) {
      this.player!.destroy();
    }
    this.player = null;

    if (this.enemy) {
      this.enemy!.destroy();
    }
    this.enemy = null;
  }

  /*
   * Note that this function is called by GameScene2D during shutdown,
   * so no need to call it! That is handled automatically.
   */
  shutdown() {
    super.shutdown();

    // Shutdown logic for this scene
    gameDataStore.resetData();
    this.destroyGameObjects();
  }
}
