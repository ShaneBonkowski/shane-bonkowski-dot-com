import React, { useState, useEffect, useRef } from "react";

interface GameMessagePopupProps {
  message: string;
}

const GameMessagePopup: React.FC<GameMessagePopupProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // When game starts, reveal the msg and then fade out the message after 5 seconds.
  const handleGameStarted = () => {
    // Add a 2-second delay before showing the message
    delayTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);

      // Start the timer to fade out the message
      timeoutRef.current = setTimeout(() => {
        setIsFading(true);

        // Start the timer to hide the message after fade-out
        fadeTimeoutRef.current = setTimeout(() => {
          setIsVisible(false); // Hide the message after fade
          setIsFading(false); // Reset fading state
        }, 1000); // Match the fade-out duration in CSS
      }, 5000); // Message stays visible for 5 seconds before fading
    }, 2000); // 2-second delay before showing the message
  };

  useEffect(() => {
    document.addEventListener("gameStarted", handleGameStarted);

    return () => {
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
        delayTimeoutRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }
      document.removeEventListener("gameStarted", handleGameStarted);
    };
  }, []);

  // Don't render anything if the message is not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`pointer-events-none fixed bottom-0 flex justify-center w-full transition-opacity duration-1000 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      style={{ zIndex: 1000 }}
    >
      <p className="w-[65vw] text-center my-0 py-5 text-outline-light dark:text-outline-dark">
        {message}
      </p>
    </div>
  );
};

export default GameMessagePopup;
