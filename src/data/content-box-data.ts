// REMINDER: /data/*.ts files need to have a corresponding implementation in `generate-rss.ts` so that the rss feed works as intended
import { ContentBoxProps } from "@/src/types/content-props";
import { comicData } from "@/src/data/comic-data";

export const contentBoxData: ContentBoxProps[] = [
  // ADD NEW CONTENT BOXES AT THE TOP! TRY TO KEEP THEM IN DESCENDING ORDER BY
  // DATE! THAT WAY THERE IS NOT A FLICKER WHEN IT SORTS!
  {
    imageUrl: "/webps/writing/wheel-of-fortune.webp",
    linkUrl: "/writing/wheel-of-fortune",
    title: "Wheel of Fortune",
    dateISO: "2026/02/10",
    description:
      "At the end of a long, mundane, tedious life of ups, downs, hope, happiness, sorrow, and regret, the man of fortune found himself slumped across his deathbed, looking back at his life to figure out exactly where it all went wrong.",
    searchTags:
      "Tarot, Wheel, Fortune, Card, Fox, Cloud, Clouds, Gold, Golden, Disc",
    contentType: "writing",
    openInNewTab: false,
    childDataKey: null,
  },
  {
    imageUrl: "/webps/comics/SF-comic-cover-art.webp",
    linkUrl: "/comics/southward-falls",
    title: "Southward Falls",
    // Date of the comic content box is the newest date of it's children comics.
    // That way new entries cause this to pop up at the top of the main page.
    dateISO: comicData["southward_falls"].sort((a, b) => {
      const dateA = new Date(a.dateISO);
      const dateB = new Date(b.dateISO);
      return dateB.getTime() - dateA.getTime();
    })[0].dateISO,
    description:
      "What whacky adventures lie ahead for the man who fell into a giant hole one day?",
    searchTags:
      "art, comic, comics, south, southward, fall, falls, hole, underground, webcomic",
    contentType: "comics",
    openInNewTab: false,
    childDataKey: "southward_falls", // IMPORTANT! Provide this field for comics!
  },
  {
    imageUrl: "/webps/writing/the-devil.webp",
    linkUrl: "/writing/the-devil",
    title: "The Devil",
    dateISO: "2025/10/11",
    description:
      "In the time of flourishing, man stood on the precipice of endless prosperity. When all that lay between him and his goals were mere questions, he sought to create the answer.",
    searchTags:
      "Tarot, Devil, Revelation, Card, Revelations, Bible, Goddess, God, Golem, Demon",
    contentType: "writing",
    openInNewTab: false,
    childDataKey: null,
  },
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
    childDataKey: null,
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
    childDataKey: null,
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
    childDataKey: null,
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
    childDataKey: null,
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
    childDataKey: null,
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
    childDataKey: null,
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
    childDataKey: null,
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
    childDataKey: null,
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
    childDataKey: null,
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
    childDataKey: null,
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
    childDataKey: null,
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
    childDataKey: null,
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
    childDataKey: null,
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
    childDataKey: null,
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
    childDataKey: null,
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
    childDataKey: null,
  },
];
