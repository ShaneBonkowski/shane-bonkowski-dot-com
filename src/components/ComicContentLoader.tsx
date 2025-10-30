"use client";

import React, { useState, useMemo, useEffect } from "react";
import WrittenContentLoader from "@/src/components/WrittenContentLoader";
import WrittenContentParagraphElement from "@/src/components/WrittenContentParagraphElement";
import WrittenContentParagraphGroup from "@/src/components/WrittenContentParagraphGroup";
import { ComicMetadataProps } from "@/src/types/data-props";
import { ComicDataProps } from "@/src/types/content-props";
import { SeededRandom, randomType } from "@/src/utils/seedable-random";
import {
  FaStepBackward,
  FaBackward,
  FaRandom,
  FaForward,
  FaStepForward,
} from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";

const random: SeededRandom = new SeededRandom(randomType.UNSEEDED_RANDOM);

const ComicIconButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  ariaLabel: string;
  isHoverable: boolean;
}> = ({ onClick, disabled = false, icon, ariaLabel, isHoverable }) => (
  <button
    onClick={onClick}
    className={`px-[6px] py-[10px] text-primary-text-color-light dark:text-primary-text-color ${
      disabled
        ? "text-secondary-text-color-light dark:text-secondary-text-color cursor-not-allowed"
        : `cursor-pointer ${
            isHoverable
              ? "hover:text-secondary-text-color-light dark:hover:text-secondary-hover-color"
              : ""
          }`
    } active:text-secondary-text-color-light dark:active:text-secondary-text-color`}
    aria-label={ariaLabel}
    disabled={disabled}
  >
    {icon}
  </button>
);

interface ComicContentLoaderProps {
  comicMetadata: ComicMetadataProps;
  childrenComicsData: ComicDataProps[];
}

const ComicContentLoader: React.FC<ComicContentLoaderProps> = ({
  comicMetadata,
  childrenComicsData,
}) => {
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    // eslint-disable-next-line no-restricted-syntax
    setIsHoverable(window.matchMedia("(hover: hover)").matches);
  }, []);

  // Sort comics first to last (which is the same as oldest to newest, but it keeps order even if two comics share the same date)
  const sortedComics = useMemo(
    () => [...childrenComicsData].sort((a, b) => a.comicNum - b.comicNum),
    [childrenComicsData]
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const urlComicNum = searchParams.get("comic");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Return early during SSR/static generation.
    // This is needed to prevent errors when using localStorage in a server-side
    // rendered environment.
    if (typeof window === "undefined") return;

    // This should only run once at first on on initialization
    if (initialized) return;
    if (sortedComics.length === 0) return;

    // Decide initial index of comic to show user at first
    let newIndex = 0;

    // If URL contains ?comic=, prefer that. So that users can send eachother links to exact comics.
    if (urlComicNum) {
      console.log("Using '?comic=' to determine which comic to view");

      const urlIndex = sortedComics.findIndex(
        (c) => c.comicNum === Number(urlComicNum)
      );
      if (urlIndex >= 0) {
        newIndex = urlIndex;
      }
    } else {
      // Otherwise, determine it based on user local storage and the comic preferences
      console.log(
        "Using local storage + comic preferences to determine which comic to view"
      );

      const firstComicNum = Math.min(
        ...childrenComicsData.map((c) => c.comicNum)
      );
      /* eslint-disable no-restricted-syntax */
      const seenFirstComic =
        localStorage.getItem(`${comicMetadata.title}-${firstComicNum}-seen`) ==
        "true";
      /* eslint-enable no-restricted-syntax */

      switch (comicMetadata.firstComicShown) {
        case "FIRST":
          newIndex = 0;
          break;
        case "LAST":
          newIndex = sortedComics.length - 1;
          break;
        case "FIRST_IF_NOT_SEEN_THEN_LAST":
          // If user has seen the first already, then default to showing the last
          // (most recent), since it assumes that means the user is ready to see the
          // most recent one.
          newIndex = seenFirstComic ? sortedComics.length - 1 : 0;
          break;
        default:
          console.error(
            `Unexpected firstComicShown value: ${comicMetadata.firstComicShown}`
          );
      }
    }

    setCurrentIndex(newIndex);
    setInitialized(true);
  }, [
    comicMetadata.firstComicShown,
    comicMetadata.title,
    childrenComicsData,
    sortedComics,
    initialized,
    urlComicNum,
  ]);

  useEffect(() => {
    // Return early during SSR/static generation.
    // This is needed to prevent errors when using localStorage in a server-side
    // rendered environment.
    if (typeof window === "undefined") return;

    // Only update "mark comic as seen" effect after initialization. This will
    // save to local storage.
    if (!initialized || currentIndex == null) return;

    const currentComicNum = sortedComics[currentIndex]?.comicNum;
    if (currentComicNum == null) return;

    // eslint-disable-next-line no-restricted-syntax
    localStorage.setItem(
      `${comicMetadata.title}-${currentComicNum}-seen`,
      "true"
    );

    // Update the url to reflect the current comic shown
    // eslint-disable-next-line no-restricted-syntax
    const currentParams = new URLSearchParams(window.location.search);
    if (currentParams.get("comic") !== String(currentComicNum)) {
      router.replace(`?comic=${currentComicNum}`, { scroll: false });
    }
  }, [currentIndex, sortedComics, comicMetadata.title, initialized, router]);

  const currentChildComicData = useMemo(
    () => sortedComics[currentIndex],
    [sortedComics, currentIndex]
  );
  const hasMultiple = sortedComics.length > 1;

  const goOldest = () => setCurrentIndex(0);
  const goNewest = () => setCurrentIndex(sortedComics.length - 1);
  const goPrevious = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const goNext = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, sortedComics.length - 1));
  const goRandom = () => {
    if (sortedComics.length <= 1) return;
    let randomIndex = currentIndex;
    while (randomIndex === currentIndex) {
      randomIndex = random.getRandomInt(0, sortedComics.length);
    }
    setCurrentIndex(randomIndex);
  };

  return (
    <WrittenContentLoader
      title={comicMetadata.title}
      subtitle={comicMetadata.subtitle}
      date={new Date(currentChildComicData.dateISO).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      )}
      contentImageUrl={currentChildComicData.imageUrl}
      contentImageWidth={currentChildComicData.contentImageWidth}
      contentImageHeight={currentChildComicData.contentImageHeight}
      artContent={true} // comic is art-esque
    >
      <WrittenContentParagraphGroup>
        <WrittenContentParagraphElement fontStyle="italic" textAlign="center">
          {currentChildComicData.captionOrTitle}
        </WrittenContentParagraphElement>
      </WrittenContentParagraphGroup>
      {/* Buttons to cycle through comics if there are multiple */}
      {hasMultiple && (
        <div className="flex gap-2 justify-center mt-4">
          <ComicIconButton
            onClick={goOldest}
            icon={<FaStepBackward size={24} />}
            disabled={currentIndex === 0}
            ariaLabel="Oldest"
            isHoverable={isHoverable}
          />
          <ComicIconButton
            onClick={goPrevious}
            icon={<FaBackward size={24} />}
            disabled={currentIndex === 0}
            ariaLabel="Previous"
            isHoverable={isHoverable}
          />
          <ComicIconButton
            onClick={goRandom}
            icon={<FaRandom size={24} />}
            disabled={false}
            ariaLabel="Random"
            isHoverable={isHoverable}
          />
          <ComicIconButton
            onClick={goNext}
            icon={<FaForward size={24} />}
            disabled={currentIndex === sortedComics.length - 1}
            ariaLabel="Next"
            isHoverable={isHoverable}
          />
          <ComicIconButton
            onClick={goNewest}
            icon={<FaStepForward size={24} />}
            disabled={currentIndex === sortedComics.length - 1}
            ariaLabel="Newest"
            isHoverable={isHoverable}
          />
        </div>
      )}
    </WrittenContentLoader>
  );
};

export default ComicContentLoader;
