import { MoreMath } from "@/src/utils/more-math";

export class GestureManager {
  public activePointers: Record<number, { x: number; y: number }> = {};
  public pointerCount: number = 0;
  public dragRate: number = 0;
  public zoomRate: number = 0;
  public dragOffsetX: number = 0;
  public dragOffsetY: number = 0;
  public zoomOffset: number = 0;
  public isDragging: boolean = false;
  public isZooming: boolean = false;
  public dragBlocked: boolean = false;
  public zoomBlocked: boolean = false;
  public dragStartX: number = 0;
  public dragStartY: number = 0;
  public initialPinchDistance: number | null = null;
  private rafId: number | null = null;
  private lastFrameTime: number = 0;
  private minInterval: number = 50; // ~20 FPS

  // eslint-disable-next-line no-restricted-syntax
  constructor(dragRate = 0.75, zoomRate = 0.05) {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    this.activePointers = {};
    this.pointerCount = 0;
    this.dragRate = dragRate;
    this.zoomRate = zoomRate;

    // init drag
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;

    this.isDragging = false;
    this.dragBlocked = false;
    this.dragStartX = 0;
    this.dragStartY = 0;

    // init zoom
    this.zoomOffset = 1;

    this.isZooming = false;
    this.zoomBlocked = false;
    this.initialPinchDistance = null;

    this.subscribeToEvents();
  }

  setDragRate(rate: number) {
    this.dragRate = rate;
  }

  setZoomRate(rate: number) {
    this.zoomRate = rate;
  }

  resetDrag() {
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;

    this.isDragging = false;
    this.dragBlocked = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
  }

  resetZoom() {
    this.zoomOffset = 1;

    this.isZooming = false;
    this.zoomBlocked = false;
    this.initialPinchDistance = null;
  }

  subscribeToEvents() {
    /* eslint-disable no-restricted-syntax */
    window.addEventListener("wheel", this.handleWheel);
    window.addEventListener("pointerdown", this.handlePointerDown);
    window.addEventListener("pointermove", this.handlePointerMove);
    window.addEventListener("pointerup", this.handlePointerUp);
    window.addEventListener("pointercancel", this.handlePointerUp);
    /* eslint-enable no-restricted-syntax */
  }

  unsubscribeFromEvents() {
    /* eslint-disable no-restricted-syntax */
    window.removeEventListener("wheel", this.handleWheel);
    window.removeEventListener("pointerdown", this.handlePointerDown);
    window.removeEventListener("pointermove", this.handlePointerMove);
    window.removeEventListener("pointerup", this.handlePointerUp);
    window.removeEventListener("pointercancel", this.handlePointerUp);
    /* eslint-enable no-restricted-syntax */
  }

  handlePointerDown = (event: PointerEvent) => {
    // Add to active pointers
    this.activePointers[event.pointerId] = {
      x: event.clientX,
      y: event.clientY,
    };
    this.pointerCount++;

    // 1 finger down, then pointer down means drag
    if (this.pointerCount == 1) {
      this.startDrag();
    }
    // Otherwise, 2 fingers down means zoom
    else if (this.pointerCount == 2) {
      this.startZoom();
    }
  };

  handlePointerMove = (event: PointerEvent) => {
    // If this is a pointer in the pointer dictionary, update it's location
    if (this.activePointers[event.pointerId]) {
      this.activePointers[event.pointerId].x = event.clientX;
      this.activePointers[event.pointerId].y = event.clientY;

      // Only try to handle zoom/drag if not already scheduled and enough
      // time has passed since the last frame
      const now = performance.now();
      if (this.rafId === null && now - this.lastFrameTime > this.minInterval) {
        this.lastFrameTime = performance.now();
        this.rafId = requestAnimationFrame(() => {
          if (this.isZooming) {
            this.handleZoom();
          } else if (this.isDragging) {
            this.handleDrag();
          }
          this.rafId = null;
        });
      }
    }
  };

  handlePointerUp = (event: PointerEvent) => {
    // Remove pointer from the set of active pointers
    if (this.activePointers[event.pointerId]) {
      delete this.activePointers[event.pointerId];
      this.pointerCount = Math.max(0, this.pointerCount - 1); // Decrement pointerCount safely
    }

    // Only stop if there are 0 fingers on the screen!
    if (this.pointerCount === 0) {
      if (this.isZooming) {
        this.stopZoom();
      } else if (this.isDragging) {
        this.stopDrag();
      }
    }
  };

  startDrag() {
    // Only start drag if there's exactly 1 touch (finger).
    if (this.dragBlocked || this.pointerCount !== 1) return;

    this.isDragging = true;
    const { clientX, clientY } = this.getEventPosition();
    this.dragStartX = clientX;
    this.dragStartY = clientY;
  }

  handleDrag = () => {
    // Only handle drag if there's exactly 1 touch (finger).
    if (this.dragBlocked || !this.isDragging || this.pointerCount !== 1) return;

    const { clientX, clientY } = this.getEventPosition();
    const deltaX = (clientX - this.dragStartX) * this.dragRate;
    const deltaY = (clientY - this.dragStartY) * this.dragRate;

    this.dragOffsetX += deltaX;
    this.dragOffsetY += deltaY;

    // Update the drag start position
    this.dragStartX = clientX;
    this.dragStartY = clientY;
  };

  stopDrag() {
    this.isDragging = false;
  }

  blockDrag() {
    this.dragBlocked = true;
  }

  unblockDrag() {
    this.dragBlocked = false;
  }

  getEventPosition(): { clientX: number; clientY: number } {
    const pointerLocations = Object.values(this.activePointers);
    return {
      clientX: pointerLocations[0].x,
      clientY: pointerLocations[0].y,
    };
  }

  startZoom() {
    // Record initial distance between touches for pinch gesture
    if (this.zoomBlocked || this.pointerCount !== 2) {
      return;
    }

    this.isZooming = true;
    this.initialPinchDistance = this.getPinchDistance();
  }

  handleWheel = (event: WheelEvent) => {
    // Wheel does not care if it "isZooming" because it doesnt rely on pointer events
    if (this.zoomBlocked) {
      return;
    }

    const delta = event.deltaY > 0 ? -1 : 1; // Scroll down is negative, up is positive
    this.updateZoom(delta * this.zoomRate);
  };

  handleZoom = () => {
    // Handle pinch gesture (calculate zoom based on pinch distance change)
    if (
      this.zoomBlocked ||
      !this.isZooming ||
      this.initialPinchDistance == null ||
      this.pointerCount !== 2
    ) {
      return;
    }

    const currentDistance = this.getPinchDistance();
    const deltaDistance = currentDistance - this.initialPinchDistance;

    // If the pinch distance changes above some threshold, update zoom
    if (Math.abs(deltaDistance) > 2) {
      const zoomDelta = deltaDistance > 0 ? 1 : -1;
      this.updateZoom(zoomDelta * this.zoomRate);
      this.initialPinchDistance = currentDistance; // Update initial pinch distance
    }
  };

  updateZoom(delta: number) {
    if (this.zoomBlocked) return;

    this.zoomOffset += delta;
    this.zoomOffset = MoreMath.clamp(this.zoomOffset, 0.1, 5);

    // console.log(`Zoom Offset: ${this.zoomOffset}`);
  }

  stopZoom() {
    this.isZooming = false;
    this.initialPinchDistance = null;
  }

  getPinchDistance(): number {
    const pointerLocations = Object.values(this.activePointers);
    const dx = pointerLocations[1].x - pointerLocations[0].x;
    const dy = pointerLocations[1].y - pointerLocations[0].y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  blockZoom() {
    this.zoomBlocked = true;
  }

  unblockZoom() {
    this.zoomBlocked = false;
  }

  destroy() {
    this.unsubscribeFromEvents();
    this.activePointers = {};
    this.resetDrag();
    this.resetZoom();
  }
}
