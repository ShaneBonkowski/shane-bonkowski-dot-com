"use client";

/* eslint-disable no-restricted-syntax -- window/document are only touched inside useEffect (client-only) */

import { useEffect } from "react";

const ZOOM_KEYS = new Set(["+", "=", "-", "_", "0"]);

const isGamePageActive = () =>
  document.documentElement.classList.contains("game-page-active");

// CSS touch-action only covers touchscreens. Trackpad pinch (ctrl+wheel in
// Chromium/Firefox, gesture events in Safari) and keyboard zoom shortcuts
// can only be stopped in JS. Checks the class at event time so it follows
// client-side route changes.
const GameZoomLock = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey && isGamePageActive()) event.preventDefault();
    };

    const handleGesture = (event: Event) => {
      if (isGamePageActive()) event.preventDefault();
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

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("gesturestart", handleGesture);
      document.removeEventListener("gesturechange", handleGesture);
      document.removeEventListener("gestureend", handleGesture);
    };
  }, []);

  return null;
};

export default GameZoomLock;
