import { GameObject } from "@/src/utils/game-object";
import { Vec2 } from "@/src/utils/vector";
import {
  MainGameScene,
  REFERENCE_BKG_SIZE,
} from "@/src/games/cowpoke/scenes/main-game-scene";
import { GUN_LOOT_MAP, HAT_LOOT_MAP, RARITY } from "@/src/games/cowpoke/loot";
import { sendFeedMessage } from "@/src/games/cowpoke/Feed";
import { MoreMath } from "@/src/utils/more-math";

export enum CHARACTER_TYPES {
  UNASSIGNED = -1,
  PLAYER = 0,
  ENEMY = 1,
}

const CHARACTER_KILL_QUIPS: string[] = [
  "You've yee'd yer last haw, partner",
  "This town ain't big enough for the tew of us",
  "Looks like you brought a lasso to a gunfight",
  "Guess you ran outta luck, cowboy",
  "Shoulda stayed on the porch, partner",
  "Hope you said all yer howdys and goodbyes",
  "That's the last tumbleweed you'll chase",
  "You bit the cactus, compadre",
  "You done rode yer last rodeo",
  "You couldn't dodge this bullet, friend",
];

const PLAYER_DIALOG_QUIPS: string[] = [
  "Looks like trouble's brewin' on the horizon",
  "Someone's lookin' to make a name for themselves",
  "Looks like there's a new hat in town",
  "Reckon things just got a bit more interestin'",
  "Better keep yer hand close to yer holster",
];

const ENEMY_DIALOG_QUIPS: string[] = [
  "Well would you look what the tumbleweed dragged in",
  "You best be ready, partner. I'm fixin' to cause some trouble",
  "Ain't no lawman gonna save you now",
  "Time to see who's the fastest draw in these parts",
  "I heard you were tough. Let's see if that's true",
  "You lookin' for a showdown? 'Cause you just found one",
  "Don't blink, or you'll miss yer last sunrise",
  "Hope yer boots are fast, 'cause my bullets are faster",
  "You look nervous, partner. That's a good instinct",
  "Let's see if you can dance when the bullets start flyin'",
];

export class Character extends GameObject {
  private scene: MainGameScene;
  public type: number = CHARACTER_TYPES.UNASSIGNED;

  public name: string = "Character";
  public level: number = 0;
  public health: number = 0;
  public maxHealth: number = 0;
  public xp: number = 0;
  public maxXp: number = 0;
  public elementSelected: string | null = null; // rock, paper, or scissors
  public combatSelected: string | null = null; // attack, defend, or counter
  public kills: number = 0;
  public dead: boolean = false;

  private bounceTime: number = 0;
  private animScaleFactorY: number = 1;
  public isShooting: boolean = false;

  private floatingText?: Phaser.GameObjects.Text;
  private floatingTextTween?: Phaser.Tweens.Tween;

  public bodySprite: Phaser.GameObjects.Sprite | null = null;
  public headSprite: Phaser.GameObjects.Sprite | null = null;
  public hatSprite: Phaser.GameObjects.Sprite | null = null;
  public gunSprite: Phaser.GameObjects.Sprite | null = null;
  public hatStarSprite: Phaser.GameObjects.Sprite | null = null;
  public gunStarSprite: Phaser.GameObjects.Sprite | null = null;

  public equippedHatId: number = 0;
  public ownedHatIds: number[] = [];
  public equippedGunId: number = 0;
  public ownedGunIds: number[] = [];

  constructor(
    scene: MainGameScene,
    screenWidth: number,
    screenHeight: number,
    type: number
  ) {
    // Initialize GameObject with physics, and rigid body
    super("Character", new Vec2(0, 0), true, true);
    this.scene = scene;
    this.type = type;

    // Set the sprites for the character. Each character is a container
    // full of sprites that consists of a body, head, hat, and gun.
    this.graphic = this.scene.add.container(0, 0);

    switch (this.type) {
      case CHARACTER_TYPES.ENEMY:
        this.spawnNewRandomCharacter();
        break;
      case CHARACTER_TYPES.PLAYER:
        this.spawnNewPlayerCharacter();
        break;
      default:
        console.warn(`Character: Unknown character type ${this.type}.`);
    }

    // Update scale at the end of sprite init, since it relies on sprite size etc.
    this.updateScale(); // set the scale here!, not in GameObject

    // Update position etc.
    switch (this.type) {
      case CHARACTER_TYPES.ENEMY:
        this.physicsBody2D!.position.x = screenWidth - 150;
        break;
      case CHARACTER_TYPES.PLAYER:
        this.physicsBody2D!.position.x = 150;
        break;
      default:
        console.warn(`Character: Unknown character type ${this.type}`);
    }
    this.graphic!.setDepth(5);

    // Top of floor is about at 225 px on the unscaled background.
    // Place character just below top of floor.
    this.physicsBody2D!.position.y =
      screenHeight - screenHeight * (100 / REFERENCE_BKG_SIZE.y);

    this.subscribeToEvents();
  }

  subscribeToEvents() {}

  unsubscribeFromEvents() {}

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
  }

  calculateScale(): Vec2 {
    // Scale w/ viewport at same scale as bkg's etc.
    const screenWidth = window.visualViewport?.width || window.innerWidth;
    const screenHeight = window.visualViewport?.height || window.innerHeight;

    let scaleX = screenWidth / REFERENCE_BKG_SIZE.x;
    let scaleY = screenHeight / REFERENCE_BKG_SIZE.y;

    // enemy faces left
    if (this.type === CHARACTER_TYPES.ENEMY) {
      scaleX = Math.abs(scaleX) * -1;
    }

    // Scale the Y scale by the animation factor
    scaleY = scaleY * this.animScaleFactorY;

    return new Vec2(scaleX, scaleY);
  }

  handleAnims(delta: number) {
    // Player idly bounces up and down
    this.handleBounceAnim();

    // Shooting anim
    if (this.isShooting) {
      this.handleShootingAnim(delta);
    } else {
      this.handleResetShootingAnim(delta);
    }
  }

  handleBounceAnim() {
    // Create a subtle bounce anim on a sin wave
    this.bounceTime += 0.05; // Adjust speed as needed
    const minScale = 0.98;
    const maxScale = 1.02;
    const amplitude = (maxScale - minScale) / 2;
    const mid = (maxScale + minScale) / 2;
    this.animScaleFactorY = mid + Math.sin(this.bounceTime) * amplitude;
    this.updateScale();
  }

  handleShootingAnim(delta: number) {
    // Lerp the rotation to 20 ish degrees
    const targetRotation =
      this.type === CHARACTER_TYPES.PLAYER
        ? -20 * (Math.PI / 180)
        : 20 * (Math.PI / 180);
    this.handleRotationAnimation(
      targetRotation,
      MoreMath.getLerpInterpolatedValue(delta, this.scene.combatDuration, 0.01)
    );
  }

  handleResetShootingAnim(delta: number) {
    // Lerp the rotation CW back to 0 degrees
    this.handleRotationAnimation(
      0,
      MoreMath.getLerpInterpolatedValue(delta, this.scene.combatDuration, 0.01)
    );
  }

  handleRotationAnimation(targetRotation: number, lerpSpeed: number = 0.1) {
    if (this.graphic && this.graphic.rotation !== targetRotation) {
      this.graphic.rotation = MoreMath.lerp(
        this.graphic.rotation,
        targetRotation,
        lerpSpeed
      );

      // If close enough to target rotation, snap to it
      if (Math.abs(this.graphic.rotation - targetRotation) < lerpSpeed * 1.1) {
        this.graphic.rotation = targetRotation;
      }
    }
  }

  updateContainerChildSprite(
    childSprite: Phaser.GameObjects.Sprite | null,
    newSpriteName: string
  ) {
    if (childSprite) {
      (this.graphic as Phaser.GameObjects.Container).remove(childSprite);
      childSprite.destroy();
    }

    childSprite = this.scene.add.sprite(0, 0, newSpriteName);

    // Add back to container
    (this.graphic as Phaser.GameObjects.Container).add(
      childSprite as Phaser.GameObjects.Sprite
    );

    childSprite!.setOrigin(0.5, 1); // bottom middle pivot point

    return childSprite;
  }

  spawnNewPlayerCharacter() {
    // Add body
    this.bodySprite = this.updateContainerChildSprite(
      this.bodySprite,
      "body-default"
    );
    this.bodySprite!.setDepth(6);

    // Add head
    this.headSprite = this.updateContainerChildSprite(
      this.headSprite,
      "head-chill-guy"
    );
    this.headSprite!.setDepth(7);

    // Set default hat and gun when new player character is spawned
    this.equipHat(0);
    this.equipGun(0);

    // Set level, this will set max health, xp, etc.
    this.updateLevel(5, true);

    // Set default name, or load from localStorage if available
    const storedName = localStorage.getItem("cowpokePlayerName");
    if (storedName) {
      this.updateName(storedName);
    } else {
      // If no name is stored, set a default name
      this.updateName("Shaner");
    }

    // Set visible since player characters are set invisible on death
    this.graphic!.setVisible(true);
    this.dead = false;

    // Reset some parameters that can be changed during anims
    this.isShooting = false;
    this.graphic!.rotation = 0;

    // Send a lil dialog on spawn
    sendFeedMessage(
      this.getRandomMsgFromList(PLAYER_DIALOG_QUIPS),
      this.name,
      this.getFeedMessageAlignment()
    );
  }

  spawnNewRandomCharacter() {
    // Add body
    this.bodySprite = this.updateContainerChildSprite(
      this.bodySprite,
      "body-default"
    );
    this.bodySprite!.setDepth(6);

    // Set random head
    const randomHeadSpriteName = this.getRandomSprite(
      "head-",
      this.scene.textures.getTextureKeys(),
      this.scene.random
    );
    this.headSprite = this.updateContainerChildSprite(
      this.headSprite,
      randomHeadSpriteName as string
    );
    this.headSprite!.setDepth(7);

    // Set random hat/gun
    this.equipHat(-1); // -1 means random
    this.equipGun(-1);

    // Set a random level for enemy characters, this will
    // set max health, xp, etc.
    if (this.scene.gameRound < 5) {
      this.updateLevel(this.scene.random.getRandomInt(1, 4), true);
    } else if (this.scene.gameRound < 10) {
      this.updateLevel(this.scene.random.getRandomInt(3, 8), true);
    } else {
      this.updateLevel(
        this.scene.random.getRandomInt(
          this.scene.gameRound - 5,
          this.scene.gameRound
        ),
        true
      );
    }

    // Set a random name for enemy characters
    const randomTitleOptions = [
      "Bandito",
      "Outlaw",
      "Desperado",
      "Gunslinger",
      "Cowpoke",
      "Ranger",
    ];
    const randomTitleIndex = this.scene.random.getRandomInt(
      0,
      randomTitleOptions.length - 1
    );
    const randomNameOptions = ["Bob", "Sally", "Rick", "Dan", "Gus"];
    const randomNameIndex = this.scene.random.getRandomInt(
      0,
      randomNameOptions.length - 1
    );
    this.updateName(
      `${randomTitleOptions[randomTitleIndex]} ${randomNameOptions[randomNameIndex]}`
    );

    // Set visible since enemy characters are set invisible on death
    this.graphic!.setVisible(true);
    this.dead = false;

    // Send a lil dialog on spawn
    sendFeedMessage(
      this.getRandomMsgFromList(ENEMY_DIALOG_QUIPS),
      this.name,
      this.getFeedMessageAlignment()
    );
  }

  equipHat(id: number) {
    // -1 means randomly select a hat
    if (id === -1) {
      id = this.getIdForRandomLoot(HAT_LOOT_MAP);
    }

    this.hatSprite = this.updateContainerChildSprite(
      this.hatSprite,
      HAT_LOOT_MAP[id].spriteName as string
    );
    this.hatSprite!.setDepth(8);

    if (HAT_LOOT_MAP[id].rarity === RARITY.COMMON) {
      this.hatStarSprite = this.updateContainerChildSprite(
        this.hatStarSprite,
        "rarity-star-1"
      );
    } else if (HAT_LOOT_MAP[id].rarity === RARITY.RARE) {
      this.hatStarSprite = this.updateContainerChildSprite(
        this.hatStarSprite,
        "rarity-star-2"
      );
    } else if (HAT_LOOT_MAP[id].rarity === RARITY.LEGENDARY) {
      this.hatStarSprite = this.updateContainerChildSprite(
        this.hatStarSprite,
        "rarity-star-3"
      );
    }
    this.hatStarSprite!.setDepth(9);

    // Initial position is relative to parent graphic container,
    // which is about 600px tall, but the hat doesnt stretch
    // that far.
    this.hatStarSprite!.x = 0;
    this.hatStarSprite!.y = (-520 / 600) * this.bodySprite!.displayHeight;
    this.hatStarSprite!.scaleX = 0.7;
    this.hatStarSprite!.scaleY = 0.7;

    this.equippedHatId = id;
    this.addNewOwnedHat(id);

    // Refresh health, since hats can add health
    this.updateMaxHealth();
  }

  equipGun(id: number) {
    // -1 means randomly select a gun
    if (id === -1) {
      id = this.getIdForRandomLoot(GUN_LOOT_MAP);
    }

    this.gunSprite = this.updateContainerChildSprite(
      this.gunSprite,
      GUN_LOOT_MAP[id].spriteName as string
    );
    this.gunSprite!.setDepth(10);

    if (GUN_LOOT_MAP[id].rarity === RARITY.COMMON) {
      this.gunStarSprite = this.updateContainerChildSprite(
        this.gunStarSprite,
        "rarity-star-1"
      );
    } else if (GUN_LOOT_MAP[id].rarity === RARITY.RARE) {
      this.gunStarSprite = this.updateContainerChildSprite(
        this.gunStarSprite,
        "rarity-star-2"
      );
    } else if (GUN_LOOT_MAP[id].rarity === RARITY.LEGENDARY) {
      this.gunStarSprite = this.updateContainerChildSprite(
        this.gunStarSprite,
        "rarity-star-3"
      );
    }
    this.gunStarSprite!.setDepth(11);

    // Initial position is relative to parent graphic container,
    // which is about 600px tall, but the gun is about halfway.
    this.gunStarSprite!.x = (220 / 600) * this.bodySprite!.displayWidth;
    this.gunStarSprite!.y = (-290 / 600) * this.bodySprite!.displayHeight;
    this.gunStarSprite!.scaleX = 0.6;
    this.gunStarSprite!.scaleY = 0.6;

    this.equippedGunId = id;
    this.addNewOwnedGun(id);

    // Refresh health, since guns can add health
    this.updateMaxHealth();
  }

  getIdForRandomLoot(LOOT_MAP: typeof HAT_LOOT_MAP | typeof GUN_LOOT_MAP) {
    const commonLoot = LOOT_MAP.filter((item) => item.rarity === RARITY.COMMON);
    const rareLoot = LOOT_MAP.filter((item) => item.rarity === RARITY.RARE);
    const legendaryLoot = LOOT_MAP.filter(
      (item) => item.rarity === RARITY.LEGENDARY
    );

    // Set chances for each rarity
    let commonChance = 0;
    let rareChance = 0;
    let legendaryChance = 0;

    if (this.scene.gameRound >= 40) {
      commonChance = 0.7;
      rareChance = 0.2;
      legendaryChance = 0.1;
    } else if (this.scene.gameRound >= 20) {
      commonChance = 0.8;
      rareChance = 0.15;
      legendaryChance = 0.05;
    } else {
      commonChance = 0.86;
      rareChance = 0.12;
      legendaryChance = 0.02;
    }

    // Normalize in case of rounding errors
    const total = commonChance + rareChance + legendaryChance;
    commonChance /= total;
    rareChance /= total;
    legendaryChance /= total;

    const roll = this.scene.random.getRandomFloat(0, 1);

    if (roll < commonChance) {
      // Common
      return commonLoot[
        this.scene.random.getRandomInt(0, commonLoot.length - 1)
      ].id;
    } else if (roll < commonChance + rareChance) {
      // Rare
      return rareLoot[this.scene.random.getRandomInt(0, rareLoot.length - 1)]
        .id;
    } else {
      // Legendary
      return legendaryLoot[
        this.scene.random.getRandomInt(0, legendaryLoot.length - 1)
      ].id;
    }
  }

  getRandomMsgFromList(msgList: string[]) {
    if (msgList.length === 0) {
      console.warn("getRandomMsgFromList: msgList is empty.");
    }

    const randomIndex = this.scene.random.getRandomInt(0, msgList.length - 1);
    return msgList[randomIndex];
  }

  getFeedMessageAlignment() {
    // Player is left, enemy is right
    return this.type === CHARACTER_TYPES.PLAYER ? "left" : "right";
  }

  addNewOwnedHat(id: number) {
    if (!this.ownedHatIds.includes(id)) {
      this.ownedHatIds.push(id);
    }
  }

  addNewOwnedGun(id: number) {
    if (!this.ownedGunIds.includes(id)) {
      this.ownedGunIds.push(id);
    }
  }

  getCombatIncreaseFromLoot() {
    // +10% win chance per addCombat bonus from gun and hat
    return (
      0.1 *
      (GUN_LOOT_MAP[this.equippedGunId].addCombat +
        HAT_LOOT_MAP[this.equippedHatId].addCombat)
    );
  }

  getElementIncreaseFromLoot() {
    // +10% win chance per addElement bonus from gun and hat
    return (
      0.1 *
      (GUN_LOOT_MAP[this.equippedGunId].addElement +
        HAT_LOOT_MAP[this.equippedHatId].addElement)
    );
  }

  getDamageAmount() {
    // base dmg + gun and hat bonuses
    const baseDmg = 1 + this.level * 0.6;
    return (
      baseDmg +
      GUN_LOOT_MAP[this.equippedGunId].addDmg +
      HAT_LOOT_MAP[this.equippedHatId].addDmg
    );
  }

  handleDamage(damage: number) {
    this.updateHealth(this.health - damage);
    this.showHealDmgFloatingText(-1 * damage);
  }

  handleHeal(healthAdded: number) {
    // Only heal if health is not already at max
    if (this.health !== this.maxHealth) {
      this.updateHealth(this.health + healthAdded);
      this.showHealDmgFloatingText(healthAdded);
    }
  }

  showHealDmgFloatingText(healthChangeAmount: number) {
    // Init the text object if it doesn't exist yet
    if (!this.floatingText) {
      this.floatingText = this.scene.add
        .text(0, 0, "", {
          font: "bold 36px Arial",
          color: "#fff",
          align: "center",
        })
        .setOrigin(0.5, 1); // bottom middle pivot point
      (this.graphic as Phaser.GameObjects.Container).add(this.floatingText!);
    }

    // If a previous tween is running, stop it
    if (this.floatingTextTween) {
      this.floatingTextTween.stop();
    }

    // Set text and color
    const color = healthChangeAmount > 0 ? "#22c55e" : "#ef4444";
    const sign = healthChangeAmount > 0 ? "+" : "-";
    this.floatingText!.setText(`${sign}${Math.abs(healthChangeAmount)}`);
    this.floatingText!.setColor(color);
    this.floatingText!.setAlpha(1);
    this.floatingText!.setScale(
      1.2,
      // Flip text on enemy across y
      this.type === CHARACTER_TYPES.PLAYER ? 1.2 : -1.2
    );
    this.floatingText!.y = -1 * this.bodySprite!.displayHeight * 1.1;
    this.floatingText!.setVisible(true);

    // Animate: grow, shrink, then fade out
    this.floatingTextTween = this.scene.tweens.add({
      targets: this.floatingText,
      // Flip text on enemy
      scale: this.type === CHARACTER_TYPES.PLAYER ? 1 : -1,
      alpha: 0,
      y: this.floatingText!.y * 1.05,
      duration: this.scene.combatDuration * 2,
      ease: "Cubic.easeOut",
      onComplete: () => {
        this.floatingText?.setVisible(false);
      },
    });
  }

  updateName(newName: string) {
    if (newName.length === 0) {
      newName = "Shaner";
    }
    this.name = newName;

    document.dispatchEvent(
      new CustomEvent("characterNameUpdate", {
        detail: { characterType: this.type, name: newName },
      })
    );
  }

  updateHealth(newHealth: number) {
    if (newHealth < 0) {
      newHealth = 0;
    } else if (newHealth > this.maxHealth) {
      newHealth = this.maxHealth;
    }
    this.health = newHealth;

    // Ensure health is an int
    this.health = Math.round(this.health);

    document.dispatchEvent(
      new CustomEvent("characterHealthUpdate", {
        detail: { characterType: this.type, health: this.health },
      })
    );
  }

  updateMaxHealth() {
    this.maxHealth = 10 + this.level * 1.2;

    this.maxHealth +=
      HAT_LOOT_MAP[this.equippedHatId].addHealth +
      GUN_LOOT_MAP[this.equippedGunId].addHealth;

    // Ensure max health is an int
    this.maxHealth = Math.round(this.maxHealth);

    document.dispatchEvent(
      new CustomEvent("characterMaxHealthUpdate", {
        detail: { characterType: this.type, maxHealth: this.maxHealth },
      })
    );
  }

  updateLevel(newLevel: number, skipMsg: boolean = false) {
    if (newLevel < 0) {
      newLevel = 0;
    }
    this.level = newLevel;
    document.dispatchEvent(
      new CustomEvent("characterLevelUpdate", {
        detail: { characterType: this.type, level: newLevel },
      })
    );

    // Update max health on level up, then restore health
    this.updateMaxHealth();
    this.handleHeal(this.maxHealth - this.health); // Restore health to max

    // Reset xp on level up, and add to max xp
    this.updateMaxXp();
    this.updateXp(0);

    // Send a level up message
    if (!skipMsg) {
      sendFeedMessage(
        "Good goin', son. You've reached level " + this.level,
        "Cowpoke Jack's Ghost",
        "center"
      );
    }
  }

  updateXp(newXp: number) {
    if (newXp < 0) {
      newXp = 0;
    }
    this.xp = newXp;
    document.dispatchEvent(
      new CustomEvent("characterXpUpdate", {
        detail: { characterType: this.type, xp: newXp },
      })
    );

    // Level up!
    if (this.xp >= this.maxXp) {
      this.updateLevel(this.level + 1);
    }
  }

  updateMaxXp() {
    this.maxXp = 10 + this.level * 2;
    document.dispatchEvent(
      new CustomEvent("characterMaxXpUpdate", {
        detail: { characterType: this.type, maxXp: this.maxXp },
      })
    );
  }

  handleKill(otherCharacter: Character) {
    this.kills += 1;

    if (this.type === CHARACTER_TYPES.PLAYER) {
      const addXp = Math.floor(otherCharacter.level * 1.2);

      // Player says a quip when killing enemy
      sendFeedMessage(
        this.getRandomMsgFromList(CHARACTER_KILL_QUIPS) +
          ` <b>(+${addXp} XP)</b>`,
        this.name,
        this.getFeedMessageAlignment()
      );

      // Gain xp
      this.updateXp(this.xp + addXp);

      // Random chance to get enemy's loot
      // FIXME: add this...
    } else {
      // Enemy says a quip when killing player
      sendFeedMessage(
        this.getRandomMsgFromList(CHARACTER_KILL_QUIPS),
        this.name,
        this.getFeedMessageAlignment()
      );
    }
  }

  handleDeath() {
    this.graphic!.setVisible(false);
    this.dead = true;
  }

  destroy() {
    super.destroy();

    // Unsubscribe from events
    this.unsubscribeFromEvents();
  }
}
