"use client";

import { useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { flipTileData } from "@/data/games/flip-tile-data";

const gameData = flipTileData;

const FlipTile = () => {
  useEffect(() => {
    const loadPhaser = async () => {
      if (typeof window !== "undefined" && window.Phaser) {
        try {
          const { default: FlipTileScene } = await import(
            "@/app/games/flip-tile/scenes/flip-tile-scene"
          );

          const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            scene: FlipTileScene,
            parent: "phaser-game",
          };

          new window.Phaser.Game(config);
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
