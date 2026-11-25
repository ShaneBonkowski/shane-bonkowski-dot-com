"use client";

/* eslint-disable no-restricted-syntax -- window/document are only touched inside useEffect (client-only) */

import { useEffect } from "react";

const ZOOM_KEYS = new Set(["+", "=", "-", "_", "0"]);

const isGamePageActive = () =>
  document.documentElement.classList.contains("game-page-active");

// Check the class at event time so zoom prevention follows client-side route
// changes. The touch handler supplements touch-action on mobile browsers.
const GameZoomLock = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey && isGamePageActive()) event.preventDefault();
    };

    const handleGesture = (event: Event) => {
      if (isGamePageActive()) event.preventDefault();
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 1 && isGamePageActive()) {
        event.preventDefault();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        ZOOM_KEYS.has(event.key) &&
        isGamePageActive()
      ) {
        event.preventDefault();
      }
    };

    const options = { passive: false };
    window.addEventListener("wheel", handleWheel, options);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("gesturestart", handleGesture, options);
    document.addEventListener("gesturechange", handleGesture, options);
    document.addEventListener("gestureend", handleGesture, options);
    document.addEventListener("touchmove", handleTouchMove, options);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("gesturestart", handleGesture);
      document.removeEventListener("gesturechange", handleGesture);
      document.removeEventListener("gestureend", handleGesture);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return null;
};

export default GameZoomLock;
