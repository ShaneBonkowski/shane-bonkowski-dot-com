import { Generic2DGameScene } from "@/src/utils/game-scene-2d";
import { Vec2 } from "@/src/utils/vector";
import {
  dispatchCloseLoadingScreenEvent,
  dispatchGameStartedEvent,
  dispatchMenuEvent,
} from "@/src/events/game-events";
import { Decoration } from "@/src/games/cowpoke/decoration";
import { Physics } from "@/src/utils/physics";
import { SeededRandom, randomType } from "@/src/utils/seedable-random";
import { Character } from "@/src/games/cowpoke/character";
import {
  CHARACTER_TYPES,
  DECOR_TYPES,
} from "@/src/games/cowpoke/cowpoke-game-object-types";
import { sendFeedMessage } from "@/src/games/cowpoke/components/Feed";
import { gameDataStore, GameData } from "@/src/games/cowpoke/game-data-store";
import { MoreMath } from "@/src/utils/more-math";

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

const MOVING_DURATION_DEFAULT: number = 1250;
const MOVING_DURATION_FAST_MODE: number = 500;
const COMBAT_DURATION_DEFAULT: number = 500;
const COMBAT_DURATION_FAST_MODE: number = 250;
const UPDATE_FAVORED_INTERVAL_DEFAULT: number = 1450;
const UPDATE_FAVORED_INTERVAL_FAST_MODE: number = 500;

export class MainGameScene extends Generic2DGameScene {
  public decorations: Decoration[] = [];
  public player: Character | null = null;
  private playerExtraDamageMultiplier: number = 1;
  public enemy: Character | null = null;
  private enemyExtraDamageMultiplier: number = 1;
  public gameRound: number = 0;
  public playerGoesFirst: boolean = true;
  public random: SeededRandom = new SeededRandom(randomType.UNSEEDED_RANDOM);

  public moving: boolean = false;
  private movingStartTime: number = 0;
  private movingDuration: number = MOVING_DURATION_DEFAULT; // ms
  public combatDuration = COMBAT_DURATION_DEFAULT; // ms

  public autoMode: boolean = false;
  public fastMode: boolean = false;
  public favoredElement: null | "rock" | "paper" | "scissors" = null;
  public favoredCombat: null | "attack" | "defend" | "counter" = null;
  private lastUpdateFavoredTime: number = 0;
  private updateFavoredInterval: number = UPDATE_FAVORED_INTERVAL_DEFAULT; // ms

  // eslint-disable-next-line no-restricted-syntax
  constructor() {
    // Call the parent Generic2DGameScene's  with
    // this scene name supplied as the name of the scene.
    super("MainGameScene");

    // Return early during SSR/static generation (need to call super first)
    if (typeof window === "undefined") return;
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
    this.load.image(
      "gun-crooked-revolver",
      "/webps/games/cowpoke-gun-crooked-revolver.webp"
    );

    // Hats
    this.load.image("hat-bandito", "/webps/games/cowpoke-hat-bandito.webp");
    this.load.image("hat-sherif", "/webps/games/cowpoke-hat-sherif.webp");
    this.load.image("hat-wizard", "/webps/games/cowpoke-hat-wizard.webp");
    this.load.image("hat-santa", "/webps/games/cowpoke-hat-santa.webp");

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
    this.load.image("head-dumb-guy", "/webps/games/cowpoke-head-dumb-guy.webp");
    this.load.image("head-evil-guy", "/webps/games/cowpoke-head-evil-guy.webp");
    this.load.image("head-old-guy", "/webps/games/cowpoke-head-old-guy.webp");

    // Extras
    this.load.image("rarity-star-1", "/webps/games/cowpoke-rarity-star-1.webp");
    this.load.image("rarity-star-2", "/webps/games/cowpoke-rarity-star-2.webp");
    this.load.image("rarity-star-3", "/webps/games/cowpoke-rarity-star-3.webp");
    this.load.image("shield", "/webps/games/cowpoke-shield.webp");
  }

  create() {
    super.create();

    this.setupSyncedGameData();

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
    this.favoredElement = gameData.favoredElement;
    this.favoredCombat = gameData.favoredCombat;

    // Update fast mode + durations
    if (gameData.fastMode) {
      this.combatDuration = COMBAT_DURATION_FAST_MODE;
      this.updateFavoredInterval = UPDATE_FAVORED_INTERVAL_FAST_MODE;
      this.movingDuration = MOVING_DURATION_FAST_MODE;
    } else {
      this.combatDuration = COMBAT_DURATION_DEFAULT;
      this.updateFavoredInterval = UPDATE_FAVORED_INTERVAL_DEFAULT;
      this.movingDuration = MOVING_DURATION_DEFAULT;
    }
  }

  startGame = () => {
    // Ensure fresh starting data/state
    this.resetGameData();

    sendFeedMessage(
      "A new cowpoke is headin' west. Best of luck, partner",
      "Cowpoke Jack's Ghost",
      "center"
    );

    this.initializeCharactersAndBackgroundDecorations(
      this.screenInfo.width,
      this.screenInfo.height
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

    if (this.player) {
      // eslint-disable-next-line no-restricted-syntax
      gameDataStore.setLifetimeKills(
        gameData.lifetimeKills + this.player.kills
      );

      if (this.player.level > gameData.lifetimeFurthestLevelInPlaythrough) {
        // eslint-disable-next-line no-restricted-syntax
        gameDataStore.setLifetimeFurthestLevelInPlaythrough(this.player.level);
      }

      if (this.player.kills > gameData.lifetimeMostKillsInPlaythrough) {
        // eslint-disable-next-line no-restricted-syntax
        gameDataStore.setLifetimeMostKillsInPlaythrough(this.player.kills);
      }
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
      new Decoration(this, 0, screenHeight, DECOR_TYPES.BACK, "bkg-back")
    );

    // Need 2 mid backgrounds. One on the pg and one offscreen shifted by screen width.
    // This is so there is a buffer to allow for parallax scrolling.
    this.decorations.push(
      new Decoration(this, 0, screenHeight, DECOR_TYPES.MID, "bkg-mid-1")
    );
    this.decorations.push(
      new Decoration(
        this,
        0 + screenWidth, // to the right of the first mid bkg
        screenHeight,
        DECOR_TYPES.MID,
        "bkg-mid-2"
      )
    );

    // Floor bkg
    this.decorations.push(
      new Decoration(this, 0, screenHeight, DECOR_TYPES.FLOOR, "bkg-floor")
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
          Math.round(xPosition),
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

        // Handle screen boundaries for decor so that if they go off screen,
        // they are reset to the right side of the screen etc.
        for (const decoration of this.decorations) {
          decoration.handleScreenBoundaries();
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

      // Update the favored element/combat every so often
      if (time - this.lastUpdateFavoredTime >= this.updateFavoredInterval) {
        // Update the favored element/combat.
        const gameData = gameDataStore.getSnapshot();

        // Cycle through elements: rock -> paper -> scissors -> rock
        let nextElement: "rock" | "paper" | "scissors";
        switch (gameData.favoredElement) {
          case "rock":
            nextElement = "paper";
            break;
          case "paper":
            nextElement = "scissors";
            break;
          case "scissors":
            nextElement = "rock";
            break;
          default:
            nextElement = "rock"; // fallback if null or undefined
            break;
        }
        this.favoredElement = gameDataStore.setFavoredElement(nextElement);

        // Cycle through combat: attack -> defend -> counter -> attack
        let nextCombat: "attack" | "defend" | "counter";
        switch (gameData.favoredCombat) {
          case "attack":
            nextCombat = "defend";
            break;
          case "defend":
            nextCombat = "counter";
            break;
          case "counter":
            nextCombat = "attack";
            break;
          default:
            nextCombat = "attack"; // fallback if null or undefined
            break;
        }
        this.favoredCombat = gameDataStore.setFavoredCombat(nextCombat);

        this.lastUpdateFavoredTime = time;
      }
    }
  }

  /*
   * Note that this function is called in the create() method for GameScene2D,
   * so no need to call it! That is handled automatically.
   */
  subscribeToEvents() {
    super.subscribeToEvents();

    // Subscribe to events for this scene
    document.addEventListener("startLoadingGame", this.startGame);
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
    document.addEventListener("manualEndGame", this.handleManualEndGame);
  }

  /*
   * Note that this function is called in the shutdown() method for GameScene2D,
   * so no need to call it! That is handled automatically.
   */
  unsubscribeFromEvents() {
    super.unsubscribeFromEvents();

    // Unsubscribe from events for this scene
    document.removeEventListener("startLoadingGame", this.startGame);
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
    document.removeEventListener("manualEndGame", this.handleManualEndGame);
  }

  ready = (event: Event) => {
    const custom = event as CustomEvent;
    const type = custom.detail?.type;

    // Reset the extra damage multipliers prior to next combat
    this.playerExtraDamageMultiplier = this.player!.getBaseDmgMultiplier();
    this.enemyExtraDamageMultiplier = this.enemy!.getBaseDmgMultiplier();

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
      this.player!.getBaseDamageAmount() * this.playerExtraDamageMultiplier;
    playerDmgDealt = MoreMath.roundToDigits(playerDmgDealt, 2);

    this.player!.attack(this.enemy!, playerDmgDealt);
  }

  executeEnemyCombat() {
    let enemyDmgDealt =
      this.enemy!.getBaseDamageAmount() * this.enemyExtraDamageMultiplier;
    enemyDmgDealt = MoreMath.roundToDigits(enemyDmgDealt, 2);

    this.enemy!.attack(this.player!, enemyDmgDealt);
  }

  handleFavoredElement() {
    // Favored element multiplier. More dmg if you select the favored element
    const favoredElementMultiplier = 1.2;
    const favoredElementMultiplierDmgText =
      (favoredElementMultiplier - 1 >= 0 ? "+" : "-") +
      MoreMath.roundToDigits(Math.abs(favoredElementMultiplier - 1) * 100, 1) +
      "%";

    if (this.favoredElement) {
      const favoredElementMsg = `The favored element here is ${this.favoredElement} <b>(${favoredElementMultiplierDmgText} dmg)</b>`;

      if (this.player!.elementSelected === this.favoredElement) {
        this.playerExtraDamageMultiplier *= 1.2;
      }

      if (this.enemy!.elementSelected === this.favoredElement) {
        this.enemyExtraDamageMultiplier *= 1.2;
      }

      sendFeedMessage(favoredElementMsg, "Cowpoke Jack's Ghost", "center");
    } else {
      console.error(
        "Favored element is not set. Please ensure game data is initialized correctly."
      );
    }
  }

  handleElementMatchups() {
    let elementMatchupMsg = "";

    // Handle element matchups
    let playerElementMatchupMultiplier = 1;
    let enemyElementMatchupMultiplier = 1;
    if (
      ELEMENT_BEATEN_BY_MAP[this.player!.elementSelected!] ===
      this.enemy!.elementSelected
    ) {
      // Enemy wins element
      playerElementMatchupMultiplier = 0.5;
      enemyElementMatchupMultiplier = 1.5;

      elementMatchupMsg += `His ${this.displayEnemyElementMsg(
        enemyElementMatchupMultiplier
      )} beats yer ${this.displayPlayerElementMsg(
        playerElementMatchupMultiplier
      )}`;
    } else if (
      // Player wins element
      ELEMENT_BEATEN_BY_MAP[this.enemy!.elementSelected!] ===
      this.player!.elementSelected
    ) {
      playerElementMatchupMultiplier = 1.5;
      enemyElementMatchupMultiplier = 0.5;

      elementMatchupMsg += `Yer ${this.displayPlayerElementMsg(
        playerElementMatchupMultiplier
      )} beats his ${this.displayEnemyElementMsg(
        enemyElementMatchupMultiplier
      )}`;
    } else {
      // Draw, both do normal damage
      playerElementMatchupMultiplier = 1;
      enemyElementMatchupMultiplier = 1;

      elementMatchupMsg += `It's a draw! His ${this.displayEnemyElementMsg(
        enemyElementMatchupMultiplier
      )} against yer ${this.displayPlayerElementMsg(
        playerElementMatchupMultiplier
      )}`;
    }

    this.playerExtraDamageMultiplier *= playerElementMatchupMultiplier;
    this.enemyExtraDamageMultiplier *= enemyElementMatchupMultiplier;

    // Send a message about the element matchup
    sendFeedMessage(elementMatchupMsg, "Cowpoke Jack's Ghost", "center");
  }

  displayPlayerElementMsg(addDmgMult: number) {
    const addOrSubtractDmgPercent = addDmgMult - 1; // Convert to percentage change

    const dmgText =
      (addOrSubtractDmgPercent >= 0 ? "+" : "-") +
      MoreMath.roundToDigits(Math.abs(addOrSubtractDmgPercent) * 100, 1) +
      "%";

    return `${this.player!.elementSelected} <b>(${dmgText} dmg)</b>`;
  }

  displayEnemyElementMsg(addDmgMult: number) {
    const addOrSubtractDmgPercent = addDmgMult - 1; // Convert to percentage change

    const dmgText =
      (addOrSubtractDmgPercent >= 0 ? "+" : "-") +
      MoreMath.roundToDigits(Math.abs(addOrSubtractDmgPercent) * 100, 1) +
      "%";

    return `${this.enemy!.elementSelected} <b>(${dmgText} dmg)</b>`;
  }

  handleFavoredCombat() {
    // Favored combat multiplier. More dmg if you select the favored combat
    const favoredCombatMultiplier = 1.2;
    const favoredCombatMultiplierDmgText =
      (favoredCombatMultiplier - 1 >= 0 ? "+" : "-") +
      MoreMath.roundToDigits(Math.abs(favoredCombatMultiplier - 1) * 100, 1) +
      "%";

    if (this.favoredCombat) {
      const favoredCombatMsg = `The favored combat type here is ${this.favoredCombat} <b>(${favoredCombatMultiplierDmgText} dmg)</b>`;

      if (this.player!.combatSelected === this.favoredCombat) {
        this.playerExtraDamageMultiplier *= 1.2;
      }

      if (this.enemy!.combatSelected === this.favoredCombat) {
        this.enemyExtraDamageMultiplier *= 1.2;
      }

      sendFeedMessage(favoredCombatMsg, "Cowpoke Jack's Ghost", "center");
    } else {
      console.error(
        "Favored combat is not set. Please ensure game data is initialized correctly."
      );
    }
  }

  handleCombatMatchups() {
    let combatMatchupMsg = "";

    // Handle combat matchups
    let playerCombatMatchupMultiplier = 1;
    let enemyCombatMatchupMultiplier = 1;
    if (this.player!.combatSelected === "attack") {
      if (this.enemy!.combatSelected === "attack") {
        // Both attack, no extra damage
        playerCombatMatchupMultiplier = 1;
        enemyCombatMatchupMultiplier = 1;

        combatMatchupMsg += `It's a draw! His ${this.displayEnemyCombatMsg(
          enemyCombatMatchupMultiplier
        )} against yer ${this.displayPlayerCombatMsg(
          playerCombatMatchupMultiplier
        )}`;
      } else if (this.enemy!.combatSelected === "defend") {
        // Attack a defender, do 0.5x each
        playerCombatMatchupMultiplier = 0.5;
        enemyCombatMatchupMultiplier = 0.5;

        combatMatchupMsg += `His ${this.displayEnemyCombatMsg(
          enemyCombatMatchupMultiplier
        )} blocks yer ${this.displayPlayerCombatMsg(
          playerCombatMatchupMultiplier
        )}`;
      } else if (this.enemy!.combatSelected === "counter") {
        // Attack a counter, 50/50 chance to do no damage.
        // Enemy doing counter does 1.5x.
        let playerAttackMissMsg = "";
        if (this.random.getRandomFloat(0, 1) < 0.5) {
          playerCombatMatchupMultiplier = 0;
          playerAttackMissMsg += " and you miss";
        } else {
          playerCombatMatchupMultiplier = 1;
        }
        enemyCombatMatchupMultiplier = 1.5;

        combatMatchupMsg += `He does a ${this.displayEnemyCombatMsg(
          enemyCombatMatchupMultiplier
        )} against yer ${this.displayPlayerCombatMsg(
          playerCombatMatchupMultiplier
        )}${playerAttackMissMsg}`;
      }
    } else if (this.player!.combatSelected === "defend") {
      if (this.enemy!.combatSelected === "attack") {
        // Defend against an attacker, do 0.5x each
        playerCombatMatchupMultiplier = 0.5;
        enemyCombatMatchupMultiplier = 0.5;

        combatMatchupMsg += `Yer ${this.displayPlayerCombatMsg(
          playerCombatMatchupMultiplier
        )} blocks his ${this.displayEnemyCombatMsg(
          enemyCombatMatchupMultiplier
        )}`;
      } else if (this.enemy!.combatSelected === "defend") {
        // Both defend, no damage dealt
        playerCombatMatchupMultiplier = 0;
        enemyCombatMatchupMultiplier = 0;

        combatMatchupMsg += `It's a draw and yer both nullified! His ${this.displayEnemyCombatMsg(
          enemyCombatMatchupMultiplier
        )} against yer ${this.displayPlayerCombatMsg(
          playerCombatMatchupMultiplier
        )}`;
      } else if (this.enemy!.combatSelected === "counter") {
        // Defend against a counter, do 1x dmg and enemy does 0x.
        playerCombatMatchupMultiplier = 1;
        enemyCombatMatchupMultiplier = 0;

        combatMatchupMsg += `Yer ${this.displayPlayerCombatMsg(
          playerCombatMatchupMultiplier
        )} nullifies his ${this.displayEnemyCombatMsg(
          enemyCombatMatchupMultiplier
        )}`;
      }
    } else if (this.player!.combatSelected === "counter") {
      if (this.enemy!.combatSelected === "attack") {
        // Counter an attacker, do 1.5x dmg and 50/50 chance enemy does 0x.
        playerCombatMatchupMultiplier = 1.5;
        let enemyAttackMissMsg = "";
        if (this.random.getRandomFloat(0, 1) < 0.5) {
          enemyCombatMatchupMultiplier = 0;
          enemyAttackMissMsg += " and he misses";
        } else {
          enemyCombatMatchupMultiplier = 1;
        }

        combatMatchupMsg += `You ${this.displayPlayerCombatMsg(
          playerCombatMatchupMultiplier
        )} against his ${this.displayEnemyCombatMsg(
          enemyCombatMatchupMultiplier
        )}${enemyAttackMissMsg}`;
      } else if (this.enemy!.combatSelected === "defend") {
        // Counter a defender, do 0x dmg and enemy does 1x shield bash.
        playerCombatMatchupMultiplier = 0;
        enemyCombatMatchupMultiplier = 1;

        combatMatchupMsg += `His ${this.displayEnemyCombatMsg(
          enemyCombatMatchupMultiplier
        )} nullifies yer ${this.displayPlayerCombatMsg(
          playerCombatMatchupMultiplier
        )}`;
      } else if (this.enemy!.combatSelected === "counter") {
        // Both counter, no extra damage
        playerCombatMatchupMultiplier = 1;
        enemyCombatMatchupMultiplier = 1;

        combatMatchupMsg += `It's a draw! His ${this.displayEnemyCombatMsg(
          enemyCombatMatchupMultiplier
        )} against yer ${this.displayPlayerCombatMsg(
          playerCombatMatchupMultiplier
        )}`;
      }
    }

    this.playerExtraDamageMultiplier *= playerCombatMatchupMultiplier;
    this.enemyExtraDamageMultiplier *= enemyCombatMatchupMultiplier;

    // Send a message about the element matchup
    sendFeedMessage(combatMatchupMsg, "Cowpoke Jack's Ghost", "center");
  }

  displayPlayerCombatMsg(addDmgMult: number) {
    const addOrSubtractDmgPercent = addDmgMult - 1; // Convert to percentage change

    const dmgText =
      (addOrSubtractDmgPercent >= 0 ? "+" : "-") +
      MoreMath.roundToDigits(Math.abs(addOrSubtractDmgPercent) * 100, 1) +
      "%";

    return `${this.player!.combatSelected} <b>(${dmgText} dmg)</b>`;
  }

  displayEnemyCombatMsg(addDmgMult: number) {
    const addOrSubtractDmgPercent = addDmgMult - 1; // Convert to percentage change

    const dmgText =
      (addOrSubtractDmgPercent >= 0 ? "+" : "-") +
      MoreMath.roundToDigits(Math.abs(addOrSubtractDmgPercent) * 100, 1) +
      "%";

    return `${this.enemy!.combatSelected} <b>(${dmgText} dmg)</b>`;
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
      const baseWinElementChance = 0.33;
      let winElementChance = baseWinElementChance;
      if (distance < 0.01) {
        winElementChance += 0.5;
      } else if (distance < 0.05) {
        winElementChance += 0.1;
      } else if (distance < 0.1) {
        winElementChance += 0.05;
      }

      // Add any element inc/dec from player and enemy loot, if applicable
      winElementChance += this.player!.getElementIncrease();
      winElementChance -= this.enemy!.getElementIncrease();
      winElementChance = Math.max(0, Math.min(1, winElementChance));

      const extraWinElementChance = MoreMath.roundToDigits(
        (winElementChance - baseWinElementChance) * 100,
        1
      );
      const extraWinElementStr =
        " " +
        (extraWinElementChance >= 0 ? "+" : "-") +
        Math.abs(extraWinElementChance) +
        "% win odds";

      this.enemy!.elementSelected = this.pickEnemyChoice(
        this.player!.elementSelected!,
        winElementChance,
        ["rock", "paper", "scissors"],
        ELEMENT_BEATEN_BY_MAP
      ) as "rock" | "paper" | "scissors";

      // Handle favored element multiplier
      this.handleFavoredElement();

      // Send the message for the player and enemy's element choice
      this.sendElementMessage(
        this.player,
        this.player!.elementSelected!,
        extraWinElementStr
      );
      this.sendElementMessage(this.enemy, this.enemy!.elementSelected);

      // Play out the element matchups to see who gets dmg'd etc.
      this.handleElementMatchups();

      // Start the combat slider after the element slider is done
      document.dispatchEvent(
        new CustomEvent("startMovingSlider", {
          detail: { sliderId: "win-combat" },
        })
      );
    } else if (sliderId === "win-combat") {
      // % chance enemy picks optimal combat action, lower if player got close to the target
      const baseWinCombatChance = 0.33;
      let winCombatChance = baseWinCombatChance;
      if (distance < 0.01) {
        winCombatChance += 0.5;
      } else if (distance < 0.05) {
        winCombatChance += 0.1;
      } else if (distance < 0.1) {
        winCombatChance += 0.05;
      }

      // Add any combat inc/dec from player and enemy loot, if applicable
      winCombatChance += this.player!.getCombatIncrease();
      winCombatChance -= this.enemy!.getCombatIncrease();
      winCombatChance = Math.max(0, Math.min(1, winCombatChance));

      const extraWinCombatChance = MoreMath.roundToDigits(
        (winCombatChance - baseWinCombatChance) * 100,
        1
      );
      const extraWinCombatStr =
        " " +
        (extraWinCombatChance >= 0 ? "+" : "-") +
        Math.abs(extraWinCombatChance) +
        "% win odds";

      this.enemy!.combatSelected = this.pickEnemyChoice(
        this.player!.combatSelected!,
        winCombatChance,
        ["attack", "defend", "counter"],
        COMBAT_BEATEN_BY_MAP
      ) as "attack" | "defend" | "counter";

      // Handle favored combat multiplier
      this.handleFavoredCombat();

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

      // Play out the combat matchups to see who gets dmg'd etc.
      this.handleCombatMatchups();

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

  handleManualEndGame = () => {
    sendFeedMessage(
      `Look who's takin' the easy way out`,
      "Cowpoke Jack's Ghost",
      "center"
    );

    // Kill player if they press end game
    if (this.player && !this.player.dead) {
      this.player!.handleDeath();
    }

    // Handle the end game
    this.endGame();
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

  // Override the parent class's handleWindowResizeHook to add custom logic.
  // This will get called automatically by the parent class's handleWindowResize()
  // method.
  handleWindowResizeHook() {
    // Handle resizing of game objs
    if (
      !this.lastKnownWindowSize ||
      this.lastKnownWindowSize.x == null ||
      this.lastKnownWindowSize.y == null
    ) {
      console.warn(
        "lastKnownWindowSize is not properly initialized. Skipping resize handling."
      );
      return;
    } else {
      // Do not update if screen size has not changed
      if (
        this.lastKnownWindowSize.x === this.screenInfo.width &&
        this.lastKnownWindowSize.y === this.screenInfo.height
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
            this.screenInfo.width;
          newY =
            (decoration.physicsBody2D!.position.y /
              this.lastKnownWindowSize.y) *
            this.screenInfo.height;

          decoration.handleWindowResize(newX, newY);
        }
      }

      if (this.player) {
        newX =
          (this.player!.physicsBody2D!.position.x /
            this.lastKnownWindowSize.x) *
          this.screenInfo.width;
        newY =
          (this.player!.physicsBody2D!.position.y /
            this.lastKnownWindowSize.y) *
          this.screenInfo.height;

        this.player!.handleWindowResize(newX, newY);
      }

      if (this.enemy) {
        newX =
          (this.enemy!.physicsBody2D!.position.x / this.lastKnownWindowSize.x) *
          this.screenInfo.width;
        newY =
          (this.enemy!.physicsBody2D!.position.y / this.lastKnownWindowSize.y) *
          this.screenInfo.height;

        this.enemy!.handleWindowResize(newX, newY);
      }
    }
  }

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

  resetGameData() {
    gameDataStore.resetData();
  }

  /*
   * Note that this function is called by GameScene2D during shutdown,
   * so no need to call it! That is handled automatically.
   */
  shutdown() {
    super.shutdown();

    // Shutdown logic for this scene
    this.resetGameData();
    this.destroyGameObjects();
  }
}
