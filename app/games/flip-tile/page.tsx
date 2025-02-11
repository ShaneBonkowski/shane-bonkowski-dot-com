"use client";

import { useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { flipTileData } from "@/data/games/flip-tile-data";
import styles from "@/styles/games/flip-tile.module.css";

const gameData = flipTileData;

const FlipTile = () => {
  useEffect(() => {
    const loadPhaser = async () => {
      if (typeof window !== "undefined" && window.Phaser) {
        try {
          const { default: FlipTileScene } = await import(
            "@/src/games/flip-tile/scenes/flip-tile-scene"
          );

          const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: true,
            scale: {
              mode: Phaser.Scale.RESIZE,
              autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            scene: FlipTileScene,
            parent: "phaser-game",
          };

          const game = new window.Phaser.Game(config);
          game.canvas.classList.add(styles.canvas);
        } catch (error) {
          console.error("Failed to load Game Scene:", error);
        }
      } else {
        console.error("Phaser is not loaded");
      }
    };

    // Wait for the Phaser library to load before starting the game
    const script = document.createElement("script");
    script.src = "/js/phaser.min.js";
    script.onload = loadPhaser;
    script.onerror = () => {
      console.error("Failed to load Phaser script");
    };
    document.head.appendChild(script);

    // Update body size on window resize
    function updateBodySize() {
      const viewportWidth = window.innerWidth;
      const viewportHeight =
        window.innerHeight > document.documentElement.clientHeight
          ? document.documentElement.clientHeight
          : window.innerHeight;

      document.body.style.width = `${viewportWidth}px`;
      document.body.style.height = `${viewportHeight}px`;
    }

    updateBodySize();
    window.addEventListener("resize", updateBodySize);
    window.addEventListener("orientationchange", updateBodySize);

    return () => {
      // Cleanup event listeners on component unmount
      window.removeEventListener("resize", updateBodySize);
      window.removeEventListener("orientationchange", updateBodySize);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{gameData.title}</title>
        <meta name="description" content={gameData.description} />
        <meta property="og:title" content={gameData.title} />
        <meta property="og:description" content={gameData.description} />
        <meta property="og:image" content={gameData.imageUrl} />
        <meta property="og:image:alt" content={gameData.imageAlt} />
      </Head>
      <div id="phaser-game" />
    </>
  );
};

export default dynamic(() => Promise.resolve(FlipTile), { ssr: false });
