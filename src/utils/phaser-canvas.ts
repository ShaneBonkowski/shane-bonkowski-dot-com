/* * Utility function to resize a Phaser game canvas to fit the parent.
 * @param {Phaser.Game} game - The Phaser game instance.
 * */
export function resizeCanvasToParent(game: Phaser.Game) {
  const canvas = game.canvas;
  const parent = canvas?.parentElement;
  if (!canvas || !parent) return;

  const width = parent.clientWidth;
  const height = parent.clientHeight;
  if (width === 0 || height === 0) return; // skip if parent has no size yet

  const dpr = window.devicePixelRatio || 1;

  const cssWidth = Math.floor(width);
  const cssHeight = Math.floor(height);
  const pixelWidth = Math.floor(cssWidth * dpr);
  const pixelHeight = Math.floor(cssHeight * dpr);

  if (canvas.width === pixelWidth && canvas.height === pixelHeight) return;

  canvas.width = pixelWidth;
  canvas.height = pixelHeight;
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;

  game.renderer.resize(pixelWidth, pixelHeight);
  game.scale.resize(cssWidth, cssHeight);
}
