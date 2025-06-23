import React, { useEffect, useRef, useState } from "react";
import { SeededRandom, randomType } from "@/src/utils/seedable-random";

const random: SeededRandom = new SeededRandom(randomType.UNSEEDED_RANDOM);

type MovingSliderBarProps = {
  sliderId: string;
  speed?: number;
};

export default function MovingSliderBar({
  sliderId,
  speed = 0.9, // percent distance traveled per second
}: MovingSliderBarProps) {
  const [targetPos, setTargetPos] = useState(random.getRandomFloat(0.5, 0.8)); // 0-1, as percent of width
  const [moving, setMoving] = useState(false);
  const [barPos, setBarPos] = useState(random.getRandomFloat(0.1, 0.4)); // 0-1, as percent of width
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const animationRef = useRef<number | null>(null);

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
      setBarPos((prev) => {
        let next = prev + direction * speed * dt;
        if (next > 1) {
          next = 1;
          setDirection(-1);
        } else if (next < 0) {
          next = 0;
          setDirection(1);
        }
        return next;
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [moving, direction, speed]);

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
