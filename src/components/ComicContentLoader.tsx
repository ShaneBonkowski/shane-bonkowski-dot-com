"use client";

import React, { useState, useMemo, useEffect } from "react";
import WrittenContentLoader from "@/src/components/WrittenContentLoader";
import WrittenContentParagraphElement from "@/src/components/WrittenContentParagraphElement";
import WrittenContentParagraphGroup from "@/src/components/WrittenContentParagraphGroup";
import { ComicMetadataProps } from "@/src/types/data-props";
import { ComicDataProps } from "@/src/types/content-props";
import { SeededRandom, randomType } from "@/src/utils/seedable-random";

const random: SeededRandom = new SeededRandom(randomType.UNSEEDED_RANDOM);

const ComicSelectorButton: React.FC<{
  disabled: boolean;
  onClick: () => void;
  buttonLabel: string;
}> = ({ disabled, onClick, buttonLabel }) => (
  <button
    onClick={onClick}
    className={`p-4 rounded min-w-[40px] text-sm  ${
      disabled
        ? "text-secondary-text-color-light dark:text-secondary-text-color"
        : "bg-button-color-light dark:bg-button-color text-primary-text-color-light dark:text-primary-text-color hover:bg-secondary-hover-color-light dark:hover:bg-secondary-hover-color hover:text-primary-text-color-light dark:hover:text-primary-text-color"
    }`}
    aria-label={`${buttonLabel} comic`}
    disabled={disabled}
  >
    {buttonLabel}
  </button>
);

interface ComicContentLoaderProps {
  comicData: ComicMetadataProps;
  childrenComicsData: ComicDataProps[];
}

const ComicContentLoader: React.FC<ComicContentLoaderProps> = ({
  comicData,
  childrenComicsData,
}) => {
  // Sort comics first to last (which is the same as oldest to newest, but it keeps order even if two comics share the same date)
  const sortedComics = useMemo(
    () => [...childrenComicsData].sort((a, b) => a.comicNum - b.comicNum),
    [childrenComicsData]
  );

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

    const firstComicNum = Math.min(
      ...childrenComicsData.map((c) => c.comicNum)
    );
    /* eslint-disable no-restricted-syntax */
    const seenFirstComic =
      localStorage.getItem(`${comicData.title}-${firstComicNum}-seen`) ==
      "true";
    /* eslint-enable no-restricted-syntax */

    // Decide initial index of comic to show user at first
    let newIndex = 0;

    switch (comicData.firstComicShown) {
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
          `Unexpected firstComicShown value: ${comicData.firstComicShown}`
        );
    }

    setCurrentIndex(newIndex);
    setInitialized(true);
  }, [
    comicData.firstComicShown,
    comicData.title,
    childrenComicsData,
    sortedComics.length,
    initialized,
  ]);

  useEffect(() => {
    // Return early during SSR/static generation.
    // This is needed to prevent errors when using localStorage in a server-side
    // rendered environment.
    if (typeof window === "undefined") return;

    // Only update "mark comic as seen" effect after initialization.
    if (!initialized || currentIndex == null) return;

    const currentComicNum = sortedComics[currentIndex]?.comicNum;
    if (currentComicNum == null) return;

    /* eslint-disable no-restricted-syntax */
    localStorage.setItem(`${comicData.title}-${currentComicNum}-seen`, "true");
    /* eslint-enable no-restricted-syntax */
  }, [currentIndex, sortedComics, comicData.title, initialized]);

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
      title={comicData.title}
      subtitle={comicData.subtitle}
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
          <ComicSelectorButton
            onClick={goOldest}
            disabled={currentIndex === 0}
            buttonLabel="Oldest"
          />
          <ComicSelectorButton
            onClick={goPrevious}
            disabled={currentIndex === 0}
            buttonLabel="Previous"
          />
          <ComicSelectorButton
            onClick={goRandom}
            disabled={false}
            buttonLabel="Random"
          />
          <ComicSelectorButton
            onClick={goNext}
            disabled={currentIndex === sortedComics.length - 1}
            buttonLabel="Next"
          />
          <ComicSelectorButton
            onClick={goNewest}
            disabled={currentIndex === sortedComics.length - 1}
            buttonLabel="Newest"
          />
        </div>
      )}
    </WrittenContentLoader>
  );
};

export default ComicContentLoader;
