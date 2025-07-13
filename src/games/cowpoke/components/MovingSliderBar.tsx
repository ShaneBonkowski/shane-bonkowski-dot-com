"use client";

import React, { useEffect, useRef, useState } from "react";
import { SeededRandom, randomType } from "@/src/utils/seedable-random";

const random: SeededRandom = new SeededRandom(randomType.UNSEEDED_RANDOM);

type AutoModeOption = {
  name: string;
  execute: () => void;
};

type MovingSliderBarProps = {
  sliderId: string;
  speed?: number;
  autoMode?: boolean;
  autoModeOptions?: AutoModeOption[];
};

export default function MovingSliderBar({
  sliderId,
  speed = 0.9, // percent distance traveled per second
  autoMode = false,
  autoModeOptions = [],
}: MovingSliderBarProps) {
  const [targetPos, setTargetPos] = useState(random.getRandomFloat(0.5, 0.8)); // 0-1, as percent of width
  const [autoThreshold, setAutoThreshold] = useState(0.3);
  const [moving, setMoving] = useState(false);
  const [barPos, setBarPos] = useState(random.getRandomFloat(0.1, 0.4)); // 0-1, as percent of width
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const animationRef = useRef<number | null>(null);

  // Use a ref for bar position to avoid React batching issues
  const barPosRef = useRef(barPos);
  barPosRef.current = barPos;

  // Handle start/stop slider bar
  useEffect(() => {
    const startMovingSlider = () => {
      setMoving(true);
      setBarPos(0);
      setDirection(1);
    };

    const stopMovingSlider = () => {
      setMoving(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Calculate the distance to the target as percent and dispatch it as result
      const distance = Math.abs(barPos - targetPos);
      document.dispatchEvent(
        new CustomEvent("movingSliderResult", {
          detail: { sliderId, distance },
        })
      );
    };

    const handleStartMovingSlider = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.sliderId === sliderId) {
        // Pick a random target position (10% to 90%) to place the target bar
        setTargetPos(random.getRandomFloat(0.1, 0.9));
        setAutoThreshold(random.getRandomFloat(0.2, 0.5));
        startMovingSlider();
      }
    };
    const handleStopMovingSlider = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.sliderId === sliderId) {
        stopMovingSlider();
      }
    };

    document.addEventListener("startMovingSlider", handleStartMovingSlider);
    document.addEventListener("stopMovingSlider", handleStopMovingSlider);
    return () => {
      document.removeEventListener(
        "startMovingSlider",
        handleStartMovingSlider
      );
      document.removeEventListener("stopMovingSlider", handleStopMovingSlider);
    };
  }, [sliderId, barPos, targetPos]);

  // Animate the moving slider bar
  useEffect(() => {
    if (!moving) return;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      let next = barPosRef.current + direction * speed * dt;
      let newDirection = direction;
      if (next > 1) {
        next = 1;
        newDirection = -1;
      } else if (next < 0) {
        next = 0;
        newDirection = 1;
      }
      barPosRef.current = next;
      setBarPos(next); // Only for rendering
      setDirection(newDirection);

      // If in auto mode, "stop" the slider by randomly picking one of the
      // options when the bar is within threshold of the target.
      if (autoMode && autoModeOptions.length > 0) {
        const distanceToTarget = Math.abs(barPosRef.current - targetPos);
        if (distanceToTarget <= autoThreshold) {
          // Pick a random option to execute
          const option =
            autoModeOptions[random.getRandomInt(0, autoModeOptions.length)];
          option.execute();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };

    // Only re-run when moving starts/stops or speed changes
  }, [
    moving,
    direction,
    speed,
    autoMode,
    autoModeOptions,
    targetPos,
    autoThreshold,
  ]);

  // Position the moving and target bars
  const barLeft = `calc(${barPos * 100}% - 2px)`;
  const targetLeft = `calc(${targetPos * 100}% - 2px)`;

  return (
    <div className="relative w-full h-full cowpoke-panel-white border border-black overflow-hidden">
      {/* Green target bar */}
      <div
        className="absolute top-0 h-full w-1 bg-green-500"
        style={{ left: targetLeft }}
      />
      {/* Black moving bar */}
      <div
        className="absolute top-0 h-full w-1 bg-black"
        style={{ left: barLeft, transition: moving ? "none" : "left 0.2s" }}
      />
    </div>
  );
}
