"use client";

import React, { useState, useMemo } from "react";
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
  // Sort comics OLDEST to NEWEST
  const sortedComics = useMemo(
    () =>
      [...childrenComicsData].sort(
        (a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()
      ),
    [childrenComicsData]
  );

  // Track currently displayed comic index (defaults to the newest one to start)
  const [currentIndex, setCurrentIndex] = useState(sortedComics.length - 1);
  const currentChildComicData = sortedComics[currentIndex];
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
