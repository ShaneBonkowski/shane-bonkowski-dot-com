import React from "react";
import Image from "next/image";

interface GameLogoImageWithBackgroundProps {
  coverImage: string;
}

const GameLogoImageWithBackground: React.FC<
  GameLogoImageWithBackgroundProps
> = ({ coverImage }) => {
  return (
    <>
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
    </>
  );
};

export default GameLogoImageWithBackground;
