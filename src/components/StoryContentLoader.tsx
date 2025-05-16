"use client";

import React from "react";
import Image from "next/image";
import { StoryDataProps, StoryDataContentProps } from "@/src/types/data-props";

// Avg WPM source https://www.sciencedirect.com/science/article/abs/pii/S0749596X19300786#:~:text=Based%20on%20the%20analysis%20of,and%20260%20wpm%20for%20fiction.
const avgWPMReading = 238;

const StoryContentLoader: React.FC<StoryDataProps> = ({
  title,
  subtitle,
  date,
  imageUrl,
  imageWidth = 500,
  imageHeight = 422,
  artContent = false,
  body,
}) => {
  // Calculate total word count from all paragraphs
  const totalWordCount = body.reduce((sum, paragraph) => {
    return sum + paragraph.content.split(/\s+/).length;
  }, 0);
  const totalReadDurationMinutes =
    Math.ceil(totalWordCount / avgWPMReading) + 1;

  function renderParagraph(paragraph: StoryDataContentProps, pIndex: number) {
    // No margin top on first index, no margin bottom on the last
    const isFirst = pIndex === 0;
    const isLast = pIndex === body.length - 1;

    if (paragraph.splitParagraphs) {
      // If splitParagraphs is true, split by newline into separate <p> tags
      return paragraph.content
        .split("\n")
        .map((paraContent, paraIndex) => (
          <p
            key={`${pIndex}-${paraIndex}`}
            className={`leading-relaxed ${
              paragraph.textAlign === "justify"
                ? "text-justify hyphens-auto"
                : `text-${paragraph.textAlign}`
            } ${isFirst ? "mt-0" : ""} ${isLast ? "mb-0" : ""}`}
            style={{ fontStyle: paragraph.fontStyle }}
            dangerouslySetInnerHTML={{ __html: paraContent }}
          />
        ));
    } else {
      // If splitParagraphs is false, replace newlines with <br /> in one <p> tag
      const contentWithBr = paragraph.content.replace(/\n/g, "<br />");
      return (
        <p
          key={pIndex}
          className={`leading-relaxed ${
            paragraph.textAlign === "justify"
              ? "text-justify hyphens-auto"
              : `text-${paragraph.textAlign}`
          } ${isFirst ? "mt-0" : ""} ${isLast ? "mb-0" : ""}`}
          style={{ fontStyle: paragraph.fontStyle }}
          dangerouslySetInnerHTML={{ __html: contentWithBr }}
        />
      );
    }
  }

  return (
    <div
      className={`flex flex-col max-w-3xl mx-auto p-common-p sm:p-common-p-sm text-left`}
      id="story-content-loader"
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
        } ${artContent && body.length > 0 ? "mb-0" : ""}`}
      >
        <Image
          src={imageUrl}
          alt={title}
          width={imageWidth}
          height={imageHeight}
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
      {body.length > 0 && (
        <>
          <hr />
          <div id="story-content-body">
            {body.map((paragraph, index) => renderParagraph(paragraph, index))}
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
