// REMINDER: /data/*.ts files need to have a corresponding implementation in `generate-rss.ts` so that the rss feed works as intended
import { ComicDataProps } from "@/src/types/content-props";

export const comicData: Record<string, ComicDataProps[]> = {
  // ADD NEW COMICS AT THE TOP! TRY TO KEEP THEM IN DESCENDING ORDER BY
  // DATE! THAT WAY THERE IS NOT A FLICKER WHEN IT SORTS!
  southward_falls: [
    {
      imageUrl: "/webps/comics/SF-comic-3.webp",
      captionOrTitle: "Southward Falls #3: A Hollow Earth?",
      dateISO: "2025/10/27",
      contentImageWidth: 1280,
      contentImageHeight: 1080,
      comicNum: 3,
    },
    {
      imageUrl: "/webps/comics/SF-comic-2.webp",
      captionOrTitle: "Southward Falls #2: Into the abyss.",
      dateISO: "2025/10/25",
      contentImageWidth: 1280,
      contentImageHeight: 1080,
      comicNum: 2,
    },
    {
      imageUrl: "/webps/comics/SF-comic-1.webp",
      captionOrTitle: "Southward Falls #1: Look out. Hole!",
      dateISO: "2025/10/23",
      contentImageWidth: 1280,
      contentImageHeight: 1080,
      comicNum: 1,
    },
  ],
};
