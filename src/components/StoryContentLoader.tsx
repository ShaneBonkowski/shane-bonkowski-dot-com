"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { StoryMetadataProps } from "@/src/types/data-props";

// Avg WPM source https://www.sciencedirect.com/science/article/abs/pii/S0749596X19300786#:~:text=Based%20on%20the%20analysis%20of,and%20260%20wpm%20for%20fiction.
const avgWPMReading = 238;

const StoryContentLoader: React.FC<StoryMetadataProps> = ({
  title,
  subtitle,
  date,
  coverImageUrl,
  coverImageWidth = 500,
  coverImageHeight = 422,
  artContent = false,
  children = null,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [totalReadDurationMinutes, setTotalReadDurationMinutes] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      const text = contentRef.current?.textContent || "";
      setWordCount(text.trim().split(/\s+/).length);
      setTotalReadDurationMinutes(Math.ceil(wordCount / avgWPMReading) + 1);
    }
  }, [children, wordCount]);

  return (
    <div
      className={`flex flex-col max-w-3xl mx-auto p-common-p sm:p-common-p-sm text-left`}
      id={title.toLowerCase().replace(/\s+/g, "-")}
      aria-labelledby="story-content-title"
      aria-describedby="story-content-body"
    >
      {/* Header */}
      <h1 id="story-content-title" className="text-center my-2">
        {title}
      </h1>
      <h3 className="italic text-center my-2">{subtitle}</h3>

      {/* Image */}
      {/* NOTE: mb-0 on artwork with body text since there is no date to serve as a buffer */}
      <div
        className={`my-8 mx-auto flex justify-center ${
          artContent ? "max-h-[90vh] w-auto" : "w-3/4 h-3/4 sm:w-1/2 sm:h-1/2"
        } ${artContent && children !== null ? "mb-0" : ""}`}
      >
        <Image
          src={coverImageUrl}
          alt={title}
          width={coverImageWidth}
          height={coverImageHeight}
          className="object-contain"
        />
      </div>

      {/* Read Duration */}
      {!artContent && (
        <>
          <p className="text-center mt-0 mb-0">
            {totalReadDurationMinutes} minute read
          </p>
        </>
      )}

      {/* Body */}
      {children !== null && (
        <>
          <hr />
          <div ref={contentRef} id="story-content-body">
            {children}
          </div>
          <hr />
        </>
      )}

      {/* Date */}
      <p className="text-center text-secondary-text-color-light dark:text-secondary-text-color mt-0">
        {date}
      </p>
    </div>
  );
};

export default StoryContentLoader;
