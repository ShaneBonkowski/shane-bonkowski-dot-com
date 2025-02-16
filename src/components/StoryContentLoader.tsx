"use client";

import React from "react";
import Image from "next/image";

export interface StoryContentProps {
  content: string;
  fontStyle: "normal" | "italic" | "bold";
  textAlign: "left" | "center" | "right" | "justify";
  splitParagraphs?: boolean;
}

export interface StoryProps {
  title: string;
  subtitle: string;
  date: string;
  imageUrl: string;
  body: StoryContentProps[];
}

// Avg WPM source https://www.sciencedirect.com/science/article/abs/pii/S0749596X19300786#:~:text=Based%20on%20the%20analysis%20of,and%20260%20wpm%20for%20fiction.
const avgWPMReading = 238;

const StoryContentLoader: React.FC<StoryProps> = ({
  title,
  subtitle,
  date,
  imageUrl,
  body,
}) => {
  // Calculate total word count from all paragraphs
  const totalWordCount = body.reduce((sum, paragraph) => {
    return sum + paragraph.content.split(/\s+/).length;
  }, 0);
  const totalReadDurationMinutes =
    Math.ceil(totalWordCount / avgWPMReading) + 1;

  function renderParagraph(paragraph: StoryContentProps, pIndex: number) {
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
            }`}
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
          }`}
          style={{ fontStyle: paragraph.fontStyle }}
          dangerouslySetInnerHTML={{ __html: contentWithBr }}
        />
      );
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-common-p sm:p-common-p-sm text-left">
      {/* Story Header */}
      <h1 className="text-center">{title}</h1>
      <h3 className="italic text-center">{subtitle}</h3>

      {/* Story Image */}
      <div className="my-8 w-3/4 h-3/4 sm:w-1/2 sm:h-1/2 mx-auto">
        <Image
          src={imageUrl}
          alt={title}
          width={500}
          height={422}
          className="object-contain mx-auto"
          // Google Firebase does not support optimizations
          unoptimized={true}
        />
      </div>

      {/* Read Duration */}
      <p className="text-center">{totalReadDurationMinutes} minute read</p>
      <hr />

      {/* Story Body */}
      <div className="mt-6 space-y-4">
        {body.map((paragraph, index) => renderParagraph(paragraph, index))}
      </div>

      <hr />
      <p className="text-center text-secondary-text-color">{date}</p>
    </div>
  );
};

export default StoryContentLoader;
