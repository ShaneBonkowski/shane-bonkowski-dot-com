"use client";

import React from "react";
import Image from "next/image";
import { StoryProps } from "@/types/Story";

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

  return (
    <div className="max-w-3xl mx-auto p-common-p text-left">
      {/* Story Header */}
      <h1 className="text-center">{title}</h1>
      <h2 className="italic text-center">{subtitle}</h2>

      {/* Story Image */}
      <div className="my-4">
        <Image
          src={imageUrl}
          alt={title}
          width={355}
          height={300}
          className="object-contain mx-auto"
        />
      </div>

      {/* Read Duration */}
      <p className="text-center">{totalReadDurationMinutes} minute read</p>
      <hr />

      {/* Story Body */}
      <div className="mt-6 space-y-4">
        {body.map((paragraph, index) =>
          // Split content by newlines and map over them to create multiple <p> tags
          paragraph.content.split("\n").map((paraContent, paraIndex) => (
            <p
              key={`${index}-${paraIndex}`} // Unique key for each paragraph
              className={`leading-relaxed text-${paragraph.textAlign} ${
                paragraph.textAlign === "justify" ? "hyphens-auto" : ""
              }`}
              style={{ fontStyle: paragraph.fontStyle }}
              dangerouslySetInnerHTML={{ __html: paraContent }}
            />
          ))
        )}
      </div>

      <hr />
      <p className="text-center text-secondary-text-color">{date}</p>
    </div>
  );
};

export default StoryContentLoader;
