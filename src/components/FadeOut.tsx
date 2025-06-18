import React, { useEffect, useRef, useState } from "react";

interface FadeOutProps {
  isFadingOut: boolean;
  duration?: number; // milliseconds, default 1000
  onFadeOutComplete?: () => void;
  children: React.ReactNode;
  className?: string;
  id?: string;
  ariaLabel?: string;
}

/**
 * Component that fades out its children when `isFadingOut` is true.
 * Uses CSS transitions to animate the opacity and can optionally call a callback
 * when the fade-out is complete.
 * @example
 * <FadeOut isFadingOut={true} duration={500} onFadeOutComplete={() => console.log('Fade out complete')}>
 *   <div>Your content here</div>
 * </FadeOut>
 */
const FadeOut: React.FC<FadeOutProps> = ({
  isFadingOut,
  duration = 1000,
  onFadeOutComplete,
  children,
  className = "",
  id = "fade-out-component",
  ariaLabel = "Fade out component",
}) => {
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isFadingOut) {
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
        if (onFadeOutComplete) onFadeOutComplete();
      }, duration);
    } else {
      setVisible(true);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isFadingOut, duration, onFadeOutComplete]);

  if (!visible) return null;

  return (
    <div
      className={`
        transition-opacity
        ${isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"}
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

export default FadeOut;
