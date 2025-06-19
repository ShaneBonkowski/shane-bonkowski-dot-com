import React, { useEffect, useState } from "react";
import Image from "next/image";
import Fade from "@/src/components/Fade";

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
        const trimmed = prev.trim();
        if (trimmed === "...") return ".  ";
        return (trimmed + ".").padEnd(3, " ");
      });
    }, 250);

    const handleCloseLoadingScreen = () => {
      setIsFadingOut(true);
    };

    document.addEventListener("closeLoadingScreen", handleCloseLoadingScreen);

    return () => {
      clearInterval(interval);
      document.removeEventListener(
        "closeLoadingScreen",
        handleCloseLoadingScreen
      );
      setIsFadingOut(false);
    };
  }, [onFadeOutComplete, fadeDuration]);

  return (
    <Fade
      isFading={isFadingOut}
      fadeType="out"
      duration={fadeDuration}
      onFadeComplete={onFadeOutComplete}
      // z-50 so its all the way in the front
      className="fixed z-50 inset-0 flex items-center justify-center bg-black"
      id="game-loading-screen"
      aria-label="Game loading screen"
    >
      {/* Background Image */}
      <Image
        src="/webps/sky-starry-bkg.webp"
        alt="Background Image"
        className="relative inset-0 w-full h-full object-cover z-0"
        fill
        priority
        id="game-loading-screen-background-image"
        aria-hidden="true"
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
        className="z-20 absolute text-left m-0 bottom-5 right-5 text-primary-text-color"
        style={{ width: "10ch", textAlign: "left" }} // Fixed width for consistent alignment
        aria-live="polite"
      >
        Loading{loadingDots}
      </p>
    </Fade>
  );
};

export default GameLoadingScreen;
