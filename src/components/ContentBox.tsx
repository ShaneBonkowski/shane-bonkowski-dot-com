"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaGamepad, FaPenNib, FaPaintBrush } from "react-icons/fa";
import { ContentBoxProps } from "@/src/types/content-props";

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
    default:
      return null;
  }
};

const ContentBox: React.FC<ContentBoxProps> = ({
  imageUrl,
  linkUrl,
  title,
  description,
  contentType,
  openInNewTab,
}) => {
  /* Only allow hover on hover-supported devices */
  const [isHovered, setIsHovered] = useState(false);
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    setIsHoverable(window.matchMedia("(hover: hover)").matches);
  }, []);

  return (
    <div
      className="
      flex flex-col items-stretch mx-auto bg-button-color-light dark:bg-button-color 
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
      {/* Image on the Left */}
      <Link
        href={linkUrl}
        target={openInNewTab ? "_blank" : "_self"}
        rel="noopener noreferrer"
        className="link flex-shrink-0"
        id="content-box-image-link"
        aria-label={`View more about ${title}`}
      >
        <Image
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

      {/* Content Box on the Right */}
      <div
        className="flex flex-col flex-grow items-start justify-start my-3 h-auto p-3 sm:p-5 space-y-2 sm:space-y-3"
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
