"use client";

import React, { useEffect, useRef, useState } from "react";

interface FadeProps {
  isFading: boolean; // When true, start the fade anim
  fadeType: "in" | "out"; // Direction of fade
  duration?: number; // milliseconds, default 1000
  onFadeComplete?: (() => void) | null;
  className?: string;
  id?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}

/**
 * Component that fades its children in or out based on `isFading` and `fadeType`.
 * Calls `onFadeComplete` after the fade finishes.
 * @example
 * <Fade isFading={true} fadeType="out" duration={500} onFadeComplete={() => ...}>
 *   <div>Your content here</div>
 * </Fade>
 */
const Fade: React.FC<FadeProps> = ({
  isFading,
  fadeType,
  duration = 1000,
  onFadeComplete,
  className = "",
  id = "fade-component",
  ariaLabel = "Fade component",
  children,
}) => {
  const [visible, setVisible] = useState(fadeType === "in" ? false : true);
  const [show, setShow] = useState(fadeType === "in" ? false : true);
  const timeoutShowRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutCompleteRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isFading) {
      if (fadeType === "in") {
        setVisible(true);
        timeoutShowRef.current = setTimeout(() => setShow(true), 10); // trigger fade-in pretty much immediately
        timeoutCompleteRef.current = setTimeout(() => {
          if (onFadeComplete) onFadeComplete();
        }, duration);
      } else {
        setShow(false);
        timeoutCompleteRef.current = setTimeout(() => {
          setVisible(false);
          if (onFadeComplete) onFadeComplete();
        }, duration);
      }
    }
    return () => {
      if (timeoutShowRef.current) {
        clearTimeout(timeoutShowRef.current);
        timeoutShowRef.current = null;
      }
      if (timeoutCompleteRef.current) {
        clearTimeout(timeoutCompleteRef.current);
        timeoutCompleteRef.current = null;
      }
    };
  }, [isFading, fadeType, duration, onFadeComplete]);

  // If not fading in/out, don't show the component (or if done fading out)
  if (!visible && fadeType === "out") return null;
  if (!visible && fadeType === "in" && !isFading) return null;

  return (
    <div
      className={`
        transition-opacity
        ${show ? "opacity-100" : "opacity-0 pointer-events-none"}
        ${className}
      `}
      style={{ transitionDuration: `${duration}ms` }}
      id={id}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};

export default Fade;
