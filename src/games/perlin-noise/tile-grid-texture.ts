import { GameObject } from "@/src/utils/game-object";
import { Vec2 } from "@/src/utils/vector";
import { MainGameScene } from "@/src/games/perlin-noise/scenes/main-game-scene";

export class TileGridTexture extends GameObject {
  public scene: MainGameScene | null = null;
  private canvasTexture: Phaser.Textures.CanvasTexture | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private imageData: ImageData | null = null;
  private pixelWidth: number = 0;
  private pixelHeight: number = 0;

  // eslint-disable-next-line no-restricted-syntax
  constructor(scene: MainGameScene, pixelWidth: number, pixelHeight: number) {
    super(
      "TileGridTexture",
      new Vec2(1, 1),
      // has physics body
      true,
      false
    );

    // Return early during SSR/static generation (need to call super first)
    if (typeof window === "undefined") return;

    this.scene = scene;
    this.pixelWidth = pixelWidth;
    this.pixelHeight = pixelHeight;

    this.initializeTexture();
    this.updateScale();

    this.physicsBody2D!.position.x = 0;
    this.physicsBody2D!.position.y = this.scene.screenInfo.height;
  }

  private initializeTexture(): void {
    if (!this.scene) return;

    const textureKey = `tileGridTexture_${this.id}`; // Use GameObject's unique ID

    this.canvasTexture = this.scene.textures.createCanvas(
      textureKey,
      this.pixelWidth,
      this.pixelHeight
    );
    this.canvas = this.canvasTexture!.getCanvas();
    this.context = this.canvas.getContext("2d");

    if (this.context) {
      this.context.clearRect(0, 0, this.pixelWidth, this.pixelHeight);
      this.imageData = this.context.createImageData(
        this.pixelWidth,
        this.pixelHeight
      );
    }

    // Use GameObject's graphic property instead of separate sprite
    this.graphic = this.scene.add.image(
      0,
      0,
      textureKey
    ) as Phaser.GameObjects.Image;
    this.graphic.setOrigin(0, 1); // bottom left pivot point
    this.graphic.setDepth(0);
  }

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
    // Scale to fit entire viewport
    this.scale = new Vec2(
      this.scene!.screenInfo.width / this.pixelWidth,
      this.scene!.screenInfo.height / this.pixelHeight
    );
  }

  setPixel(
    x: number,
    y: number,
    r: number,
    g: number,
    b: number,
    a: number = 255
  ): void {
    if (
      !this.imageData ||
      x < 0 ||
      x >= this.pixelWidth ||
      y < 0 ||
      y >= this.pixelHeight
    ) {
      return;
    }

    const index = (y * this.pixelWidth + x) * 4;
    this.imageData.data[index] = r;
    this.imageData.data[index + 1] = g;
    this.imageData.data[index + 2] = b;
    this.imageData.data[index + 3] = a;
  }

  setPixelHex(x: number, y: number, color: number, alpha: number = 255): void {
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;
    this.setPixel(x, y, r, g, b, alpha);
  }

  clear(): void {
    if (!this.imageData) return;

    for (let i = 0; i < this.imageData.data.length; i += 4) {
      this.imageData.data[i] = 0;
      this.imageData.data[i + 1] = 0;
      this.imageData.data[i + 2] = 0;
      this.imageData.data[i + 3] = 0;
    }
  }

  refresh(): void {
    if (!this.context || !this.imageData || !this.canvasTexture) return;

    this.context.putImageData(this.imageData, 0, 0);
    this.canvasTexture.refresh();
  }

  destroy(): void {
    super.destroy();

    // Destroy the canvas texture and its resources
    if (this.canvasTexture) {
      this.canvasTexture.destroy();
      this.canvasTexture = null;
    }

    this.canvas = null;
    this.context = null;
    this.imageData = null;
  }
}
