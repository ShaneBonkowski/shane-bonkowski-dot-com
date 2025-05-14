import React, { useEffect, useState } from "react";
import Image from "next/image";

interface LoadingScreenProps {
  coverImage: string;
  onFadeOutComplete: () => void;
}

const GameLoadingScreen: React.FC<LoadingScreenProps> = ({
  coverImage,
  onFadeOutComplete,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [loadingDots, setLoadingDots] = useState("");
  const fadeDuration = 1000; // milliseconds

  useEffect(() => {
    // Animate the dots
    const interval = setInterval(() => {
      setLoadingDots((prev) => {
        const trimmed = prev.trim(); // Remove trailing spaces
        if (trimmed === "...") return ".  "; // Reset to ".  "
        return (trimmed + ".").padEnd(3, " ");
      });
    }, 250);

    const handleGameStarted = () => {
      // Once game is started, play fade-out animation after a small delay
      setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          onFadeOutComplete();
        }, fadeDuration);
      }, fadeDuration);
    };

    document.addEventListener("gameStarted", handleGameStarted);

    return () => {
      clearInterval(interval);
      document.removeEventListener("gameStarted", handleGameStarted);
    };
  }, [onFadeOutComplete, fadeDuration]);

  return (
    <div
      className={`fixed z-50 inset-0 flex items-center justify-center bg-black transition-opacity duration-1000 ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      id="game-loading-screen"
    >
      {/* Background Image */}
      <Image
        src="/webps/sky-starry-bkg.webp"
        alt="Background Image"
        className="absolute inset-0 w-full h-full object-cover z-0"
        fill
        priority
        id="game-loading-screen-background-image"
      />

      {/* Main Cover Image */}
      <div
        className="relative z-10 w-full h-full max-w-[75%] max-h-[75%]"
        id="game-loading-screen-cover-image-container"
      >
        <Image
          src={coverImage}
          alt="Game Cover Image"
          className="object-contain"
          fill
          id="game-loading-screen-cover-image"
        />
      </div>

      {/* Loading Text */}
      <p
        className="absolute text-left m-0 bottom-5 right-5 text-primary-text-color z-20"
        style={{ width: "10ch", textAlign: "left" }} // Fixed width for consistent alignment
      >
        Loading{loadingDots}
      </p>
    </div>
  );
};

export default GameLoadingScreen;
