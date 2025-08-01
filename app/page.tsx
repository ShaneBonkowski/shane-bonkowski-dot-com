"use client"; // need this since this component uses useState

import React, { useState, useCallback, useEffect } from "react";
import ContentSearchBar from "@/src/components/ContentSearchBar";
import ContentBox from "@/src/components/ContentBox";
import { ContentBoxProps } from "@/src/types/content-props";
import Pagination from "@/src/components/Pagination";

const contentBoxData: ContentBoxProps[] = [
  // ADD NEW CONTENT BOXES AT THE TOP! TRY TO KEEP THEM IN DESCENDING ORDER BY
  // DATE! THAT WAY THERE IS NOT A FLICKER WHEN IT SORTS!
  {
    imageUrl: "/webps/games/perlin-noise-cover.webp",
    linkUrl: "/games/perlin-noise",
    title: "Perlin Noise",
    dateISO: "2025/07/21",
    description:
      "Explore the complex world of procedural generation with Perlin Noise.",
    searchTags: "game, perlin, noise, procedural, generation, world",
    contentType: "games",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/games/cowpoke-cover.webp",
    linkUrl: "/games/cowpoke",
    title: "Cowpoke",
    dateISO: "2025/06/07",
    description:
      "Endless wild west side-scroller with turn-based combat. Face ruthless outlaws, scavenge powerful loot, and grow stronger with every showdown.",
    searchTags:
      "cowpoke, cow, poke, western, wild, west, side-scroller, fighting, fight",
    contentType: "games",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/games/game-of-life-cover.webp",
    linkUrl: "/games/game-of-life",
    title: "Game of Life",
    dateISO: "2025/01/22",
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
    dateISO: "2025/01/11",
    description:
      "Deep within the hidden corridors of Genesis Labs, two scientists are developing what may go down as mankind's final invention.",
    searchTags:
      "Love, Lovers, Bible, Adam, Eve, Universe, Nova, Lux, Mammon, Barachiel, Dr, Dr., Doctor, Scientist, AI, Artificial, Intelligence",
    contentType: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/writing/my-final-thought.webp",
    linkUrl: "/writing/my-final-thought",
    title: "My Final Thought",
    dateISO: "2024/12/08",
    description:
      "As I sit here and watch the unforgiving grains of sand trickle down from my hourglass, there is nothing left to do but ponder.",
    searchTags: "Death, Bible, Hunting, Deer, Life, Universe, dad",
    contentType: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/writing/death.webp",
    linkUrl: "/writing/death",
    title: "Death",
    dateISO: "2024/09/10",
    description:
      "A man sits alone at a rundown bar after a long day of work, his soulless eyes projecting a heavy, lingering despair. Deep in the mind of the troubled man, a war is brewing.",
    searchTags:
      "Tarot, Death, Revelation, Card, Revelations, Bible, Space, Goddess, God, Horse",
    contentType: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/writing/the-sun.webp",
    linkUrl: "/writing/the-sun",
    title: "The Sun",
    dateISO: "2024/08/25",
    description:
      "To my firstborn: Do you ever stop and wonder, if the wind did not blow, would the wilted flowers remain in frozen perfection for all eternity?",
    searchTags:
      "Tarot, Sun, Stars, Star, Sun, Card, Shimmer, Glitter, Space, Crow, Crows, Bird, Birds, Flowers, Flower, tree, forest",
    contentType: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/writing/the-star.webp",
    linkUrl: "/writing/the-star",
    title: "The Star",
    dateISO: "2024/08/12",
    description:
      "She was the healer. The silent observer. The glue that held it all together until the very end. Great fires would rage and she would drag the ocean down from the heavens.",
    searchTags:
      "Tarot, Stars, Star, Card, Shimmer, Glitter, Space, Goddess, God",
    contentType: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/games/flip-tile-cover.webp",
    linkUrl: "/games/flip-tile",
    title: "Flip Tile",
    dateISO: "2024/07/14",
    description:
      "Classic 'lights out' style puzzle game. Flipping one tile causes neighboring tiles to flip as well. Match them all to advance further!",
    searchTags: "flip, flop, tile, matrix",
    contentType: "games",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/writing/the-moon.webp",
    linkUrl: "/writing/the-moon",
    title: "The Moon",
    dateISO: "2024/07/13",
    description:
      "Step by step, I trudge on through the long night. My body aches and my bones tremble under the weight of her gaze, a constant reminder of my imprisonment.",
    searchTags: "Tarot, Moon, Stars, Star, Sun, Card, Shimmer, Glitter, Space",
    contentType: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/writing/before-the-world-dried-up.webp",
    linkUrl: "/writing/before-the-world-dried-up",
    title: "Before the World Dried Up",
    dateISO: "2024/06/20",
    description:
      "They ask me why I plan on sticking around this place. Why I haven't jumped ship with the rest of them. I let out a sigh as I gaze off across the lifeless desertscape.",
    searchTags:
      "earth, world, universe, boat, water, ocean, existential, spooky, eerie, sci-fi, science, fiction",
    contentType: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/games/abyssal-descent.webp",
    linkUrl: "https://store.steampowered.com/app/2506740/Abyssal_Descent/",
    title: "Abyssal Descent",
    dateISO: "2024/06/06",
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
    dateISO: "2024/05/25",
    description:
      "A unique twist to the classic Boids algorithm. Player controlled Boid, predator-prey relationships, customizable toggles & more.",
    searchTags: "birds, bird, boid, flying, simulation",
    contentType: "games",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/writing/I-am-immortal.webp",
    linkUrl: "/writing/I-am-immortal",
    title: "I am Immortal",
    dateISO: "2024/03/16",
    description:
      "If you ask me, I'm at least 13.8 billion years old. Born in the aftermath of the Big Bang. My life began the same way it will end: Scattered across Infinity.",
    searchTags:
      "life, death, universe, immortal, live, forever, spooky, eerie, sci-fi, science, fiction",
    contentType: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/webps/games/save-our-solar-system.webp",
    linkUrl:
      "https://store.steampowered.com/app/2061040/Save_Our_Solar_System/",
    title: "Save Our Solar System",
    dateISO: "2023/03/28",
    description:
      "(Steam Game) Stave off countless waves of asteroids as you fight to protect the Solar System from extinction. A fresh look on the tower defense genre!",
    searchTags: "SOSS, SOS, radiohead, radio, head, asteroid",
    contentType: "games",
    openInNewTab: true,
  },
  {
    imageUrl: "/webps/art/strange-love-cover-art.webp",
    linkUrl: "/art/strange-love",
    title: "Strange Love",
    dateISO: "2022/04/06",
    description:
      "Bone of my bones, flesh of my flesh. A piece of me, now a piece of you.",
    searchTags: "art, scifi, science, fiction, strange, love, heart",
    contentType: "art",
    openInNewTab: false,
  },
];

const ITEMS_PER_PAGE = 12; // divisible by 2 and 3, so full pg looks nice w/ all grid layouts

export default function Home() {
  const [filteredContent, setFilteredContent] =
    useState<ContentBoxProps[]>(contentBoxData);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredContent.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageContent = filteredContent.slice(startIndex, endIndex);

  const handleFilteredContentChange = useCallback(
    (newContent: ContentBoxProps[]) => {
      setFilteredContent(newContent);
      // Try to reset to first page when search changes
      tryToChangePage(1);
    },
    []
  );

  const tryToChangePage = (page: number) => {
    // Changes to provided page number if user is not already on that page.
    // Pauses for a couple anim frames and updates render state so that there
    // is time for the old page content to clear prior to re-rendering. Was
    // previously getting weird bugs where images lingered when changing.
    setCurrentPage((prevPage) => {
      if (prevPage !== page) {
        setIsPageChanging(true);
        setRenderKey((prev) => prev + 1);

        // Get 2 full frames to clear the DOM prior to setting "changing" state
        // back to false.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsPageChanging(false);
          });
        });

        return page; // Update to new page
      }

      return prevPage; // No change needed
    });
  };

  const handlePageChange = (page: number) => {
    tryToChangePage(page);
  };

  // useEffect to handle scrolling back to top after currentPage changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    // eslint-disable-next-line no-restricted-syntax
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // do NOT smoothly scroll here
    });
  }, [currentPage]);

  return (
    <>
      <ContentSearchBar
        contentData={contentBoxData}
        setFilteredContent={handleFilteredContentChange}
      />

      <div
        key={`${currentPage}-${renderKey}`}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-common-p sm:mt-common-p-sm px-common-p sm:px-common-p-sm gap-common-p sm:gap-common-p-sm"
        id="content-boxes"
      >
        {isPageChanging ? (
          // Render an empty div to clear the DOM. This is so that all images
          // etc. get cleared from the DOM and re-rendered on page change.
          <div />
        ) : currentPageContent.length > 0 ? (
          currentPageContent.map((box, index) => (
            <ContentBox
              key={`page-${currentPage}-${index}-${box.linkUrl}`}
              {...box}
            />
          ))
        ) : (
          // Make the message span all columns so that it is centered!
          <p className="col-span-1 sm:col-span-2 lg:col-span-3 text-small sm:text-small-sm text-secondary-text-color-light dark:text-secondary-text-color text-center">
            No results found.
          </p>
        )}
      </div>

      {/* Spacer to push pagination to bottom of viewport if few content boxes */}
      <div className="flex-grow" />

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
