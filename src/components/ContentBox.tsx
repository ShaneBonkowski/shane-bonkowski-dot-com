"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaGamepad,
  FaPenNib,
  FaPaintBrush,
  FaRegNewspaper,
} from "react-icons/fa";
import { ComicDataProps, ContentBoxProps } from "@/src/types/content-props";
import { comicData } from "@/src/data/comic-data";
import {
  getComicSeenStorageKey,
  getPageSeenStorageKey,
  hasSeenContent,
  isContentRecentlyCreated,
} from "@/src/utils/content-seen";

const getNewestComic = (comics: ComicDataProps[] = []): ComicDataProps | null =>
  comics.reduce<ComicDataProps | null>((newestComic, comic) => {
    if (!newestComic) return comic;

    const comicDate = new Date(comic.dateISO).getTime();
    const newestComicDate = new Date(newestComic.dateISO).getTime();

    if (
      comicDate > newestComicDate ||
      (comicDate === newestComicDate && comic.comicNum > newestComic.comicNum)
    ) {
      return comic;
    }

    return newestComic;
  }, null);

const getIcon = (contentType: string) => {
  switch (contentType) {
    case "games":
      return (
        <FaGamepad className="text-primary-text-color-light dark:text-primary-text-color text-1xl sm:text-2xl" />
      );
    case "writing":
      return (
        <FaPenNib className="text-primary-text-color-light dark:text-primary-text-color text-1xl sm:text-2xl" />
      );
    case "art":
      return (
        <FaPaintBrush className="text-primary-text-color-light dark:text-primary-text-color text-1xl sm:text-2xl" />
      );
    case "comics":
      return (
        <FaRegNewspaper className="text-primary-text-color-light dark:text-primary-text-color text-1xl sm:text-2xl" />
      );
    default:
      return null;
  }
};

const ContentBox: React.FC<ContentBoxProps> = ({
  imageUrl,
  linkUrl,
  title,
  dateISO,
  description,
  contentType,
  openInNewTab,
  childDataKey,
}) => {
  /* Only allow hover on hover-supported devices */
  const [isHovered, setIsHovered] = useState(false);
  const [isHoverable, setIsHoverable] = useState(false);
  const [hasSeen, setHasSeen] = useState<boolean | null>(null);

  const newestComic =
    childDataKey === null
      ? null
      : getNewestComic(comicData[childDataKey] ?? []);
  const seenStorageKey = newestComic
    ? getComicSeenStorageKey(linkUrl, newestComic.comicNum)
    : getPageSeenStorageKey(linkUrl);

  useEffect(() => {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    // eslint-disable-next-line no-restricted-syntax
    setIsHoverable(window.matchMedia("(hover: hover)").matches);
  }, []);

  useEffect(() => {
    const updateSeenStatus = () => setHasSeen(hasSeenContent(seenStorageKey));
    const handleStorage = (event: StorageEvent) => {
      if (event.key === seenStorageKey) updateSeenStatus();
    };

    if (typeof window === "undefined") return;

    updateSeenStatus();
    // eslint-disable-next-line no-restricted-syntax
    window.addEventListener("storage", handleStorage);
    // eslint-disable-next-line no-restricted-syntax
    window.addEventListener("pageshow", updateSeenStatus);

    return () => {
      // eslint-disable-next-line no-restricted-syntax
      window.removeEventListener("storage", handleStorage);
      // eslint-disable-next-line no-restricted-syntax
      window.removeEventListener("pageshow", updateSeenStatus);
    };
  }, [seenStorageKey]);

  const isNew = isContentRecentlyCreated(dateISO) && hasSeen === false;

  return (
    <div
      className="
      w-full flex flex-col items-stretch mx-auto bg-button-color-light dark:bg-button-color 
      text-primary-text-color-light dark:text-primary-text-color rounded-lg overflow-hidden"
      id={`content-box-${title.replace(/\s+/g, "-").toLowerCase()}`}
      role="region"
      aria-labelledby={`content-box-title-${title
        .replace(/\s+/g, "-")
        .toLowerCase()}`}
      aria-describedby={`content-box-description-${title
        .replace(/\s+/g, "-")
        .toLowerCase()}`}
    >
      <div className="relative">
        {/* Image on the Top */}
        <Link
          href={linkUrl}
          target={openInNewTab ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className="link flex-shrink-0"
          id="content-box-image-link"
          aria-label={`View more about ${title}`}
        >
          <Image
            key={`${imageUrl}-${title}`} // Unique key to prevent caching issues
            src={imageUrl}
            alt={`Image for ${title}`}
            width={500}
            height={422}
            className={`w-full h-full object-cover transform transition-transform duration-0 ${
              isHoverable && isHovered ? "scale-105" : "scale-100"
            } cursor-pointer`}
            onPointerEnter={() => isHoverable && setIsHovered(true)}
            onPointerLeave={() => isHoverable && setIsHovered(false)}
          />
        </Link>

        {/* New Content Indicator */}
        {isNew && (
          <div className="absolute top-0 right-0 bg-red-500 text-white text-sm px-1 rounded-bl">
            New
          </div>
        )}
      </div>

      {/* Content Box on the Bottom */}
      <div
        className="w-full flex flex-col flex-grow items-start justify-start my-3 h-auto p-3 sm:p-5 space-y-2 sm:space-y-3"
        id="content-box-description-container"
      >
        {/* Icon + Title */}
        <div
          className="flex items-center space-x-2 sm:space-x-3"
          id="content-box-title-container"
        >
          {getIcon(contentType)}
          <Link
            href={linkUrl}
            target={openInNewTab ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="link"
            onPointerEnter={() => isHoverable && setIsHovered(true)}
            onPointerLeave={() => isHoverable && setIsHovered(false)}
            aria-labelledby={`content-box-title-${title
              .replace(/\s+/g, "-")
              .toLowerCase()}`}
          >
            <h3
              id={`content-box-title-${title
                .replace(/\s+/g, "-")
                .toLowerCase()}`}
              className={`font-bold m-0 text-content-box-title sm:text-content-box-title-sm ${
                isHoverable && isHovered
                  ? "text-primary-text-color-light dark:text-primary-text-color underline decoration-inherit"
                  : "text-primary-text-color-light dark:text-primary-text-color no-underline"
              } active:decoration-inherit active:underline`}
            >
              {title}
            </h3>
          </Link>
        </div>

        {/* Description */}
        <p
          id={`content-box-description-${title
            .replace(/\s+/g, "-")
            .toLowerCase()}`}
          className="text-secondary-text-color-light dark:text-secondary-text-color text-content-box-subtitle sm:text-content-box-subtitle-sm leading-relaxed"
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default ContentBox;
