"use client";

import React, { useState } from "react";
import ContentSearchBar from "@/src/components/ContentSearchBar";
import ContentBox from "@/src/components/ContentBox";
import { ContentBoxProps } from "@/src/types/content-props";

const contentBoxData: ContentBoxProps[] = [
  {
    imageUrl: "/webps/games/save-our-solar-system.webp",
    linkUrl:
      "https://store.steampowered.com/app/2061040/Save_Our_Solar_System/",
    title: "Save Our Solar System",
    description:
      "(Steam Game) Stave off countless waves of asteroids as you fight to protect the Solar System from extinction. A fresh look on the tower defense genre!",
    searchTags: "SOSS, SOS, radiohead, radio, head, asteroid",
    contentType: "games",
    openInNewTab: true,
  },
  {
    imageUrl: "/webps/games/abyssal-descent.webp",
    linkUrl: "https://store.steampowered.com/app/2506740/Abyssal_Descent/",
    title: "Abyssal Descent",
    description:
      "(Steam Game) Embark on an epic platformer adventure through procedurally generated caves, solving intricate puzzles, and battling fearsome enemies!",
    searchTags: "ghost, boi, boy, jump, endless",
    contentType: "games",
    openInNewTab: true,
  },
  {
    imageUrl: "/webps/games/better-boids-cover.webp",
    linkUrl: "/games/better-boids",
    title: "Better Boids",
    description:
      "A unique twist to the classic Boids algorithm. Player controlled Boid, predator-prey relationships, customizable toggles & more.",
    searchTags: "birds, bird, boid, flying, simulation",
    contentType: "games",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/games/cowpoke-game-cover.webp",
    linkUrl: "/games/cowpoke",
    title: "Cowpoke",
    description:
      "Wild west side-scroller with turn-based combat. Battle endless enemies, find rare loot, and level up forever.",
    searchTags:
      "cowpoke, cow, poke, western, wild, west, side-scroller, fighting, fight",
    contentType: "games",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/games/flip-tile-cover.webp",
    linkUrl: "/games/flip-tile",
    title: "Flip Tile",
    description:
      "Classic 'lights out' style puzzle game. Flipping one tile causes neighboring tiles to flip as well. Match them all to advance further!",
    searchTags: "flip, flop, tile, matrix",
    contentType: "games",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/games/game-of-life-cover.webp",
    linkUrl: "/games/game-of-life",
    title: "Game of Life",
    description:
      "Experience the emergent world of cellular automata. Classic Conway's Game of Life with advanced customization options to create your own.",
    searchTags:
      "conway, conways, conway's, game, of, life, cell, cellular, automata",
    contentType: "games",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/writing/the-lovers.webp",
    linkUrl: "/writing/the-lovers",
    title: "The Lovers",
    description:
      "Deep within the hidden corridors of Genesis Labs, two scientists are developing what may go down as mankind’s final invention.",
    searchTags:
      "Love, Lovers, Bible, Adam, Eve, Universe, Nova, Lux, Mammon, Barachiel, Dr, Dr., Doctor, Scientist, AI, Artificial, Intelligence",
    contentType: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/writing/death.webp",
    linkUrl: "/writing/death",
    title: "Death",
    description:
      "A man sits alone at a rundown bar after a long day of work, his soulless eyes projecting a heavy, lingering despair. Deep in the mind of the troubled man, a war is brewing.",
    searchTags:
      "Tarot, Death, Revelation, Card, Revelations, Bible, Space, Goddess, God, Horse",
    contentType: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/writing/the-star.webp",
    linkUrl: "/writing/the-star",
    title: "The Star",
    description:
      "She was the healer. The silent observer. The glue that held it all together until the very end. Great fires would rage and she would drag the ocean down from the heavens.",
    searchTags:
      "Tarot, Stars, Star, Card, Shimmer, Glitter, Space, Goddess, God",
    contentType: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/writing/the-sun.webp",
    linkUrl: "/writing/the-sun",
    title: "The Sun",
    description:
      "To my firstborn: Do you ever stop and wonder, if the wind did not blow, would the wilted flowers remain in frozen perfection for all eternity?",
    searchTags:
      "Tarot, Sun, Stars, Star, Sun, Card, Shimmer, Glitter, Space, Crow, Crows, Bird, Birds, Flowers, Flower, tree, forest",
    contentType: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/writing/the-moon.webp",
    linkUrl: "/writing/the-moon",
    title: "The Moon",
    description:
      "Step by step, I trudge on through the long night. My body aches and my bones tremble under the weight of her gaze, a constant reminder of my imprisonment.",
    searchTags: "Tarot, Moon, Stars, Star, Sun, Card, Shimmer, Glitter, Space",
    contentType: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/writing/my-final-thought.webp",
    linkUrl: "/writing/my-final-thought",
    title: "My Final Thought",
    description:
      "As I sit here and watch the unforgiving grains of sand trickle down from my hourglass, there is nothing left to do but ponder.",
    searchTags: "Death, Bible, Hunting, Deer, Life, Universe, dad",
    contentType: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/writing/I-am-immortal.webp",
    linkUrl: "/writing/I-am-immortal",
    title: "I am Immortal",
    description:
      "If you ask me, I’m at least 13.8 billion years old. Born in the aftermath of the Big Bang. My life began the same way it will end: Scattered across Infinity.",
    searchTags:
      "life, death, universe, immortal, live, forever, spooky, eerie, sci-fi, science, fiction",
    contentType: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/writing/before-the-world-dried-up.webp",
    linkUrl: "/writing/before-the-world-dried-up",
    title: "Before the World Dried Up",
    description:
      "They ask me why I plan on sticking around this place. Why I haven't jumped ship with the rest of them. I let out a sigh as I gaze off across the lifeless desertscape.",
    searchTags:
      "earth, world, universe, boat, water, ocean, existential, spooky, eerie, sci-fi, science, fiction",
    contentType: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/art/strange-love-cover-art.webp",
    linkUrl: "/art/strange-love",
    title: "Strange Love",
    description:
      "Bone of my bones, flesh of my flesh. A piece of me, now a piece of you.",
    searchTags: "art, scifi, science, fiction, strange, love, heart",
    contentType: "art",
    openInNewTab: false,
  },
];

export default function Home() {
  const [filteredContent, setFilteredContent] =
    useState<ContentBoxProps[]>(contentBoxData);

  return (
    <div className="mt-3 sm:mt-4" id="content-search-bar-and-boxes">
      <ContentSearchBar
        contentData={contentBoxData}
        setFilteredContent={setFilteredContent}
      />

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 m-6 sm:m-8 gap-6 sm:gap-8"
        id="content-boxes"
      >
        {filteredContent.length > 0 ? (
          filteredContent.map((box, index) => (
            <ContentBox key={index} {...box} />
          ))
        ) : (
          // Make the message span all columns so that it is centered!
          <p className="col-span-1 sm:col-span-2 lg:col-span-3 text-small sm:text-small-sm text-secondary-text-color-light dark:text-secondary-text-color text-center">
            No results found.
          </p>
        )}
      </div>
    </div>
  );
}
