"use client";

import React from "react";

export interface StoryParagraphElementProps {
  textAlign?: "left" | "center" | "right" | "justify";
  fontStyle?: "normal" | "italic" | "bold";
  className?: string;
  isFirst?: boolean;
  isLast?: boolean;
  children: React.ReactNode;
}

/**
 * A paragraph element for story content with customizable text alignment,
 * font style, and margin adjustments for first and last paragraphs.
 */
const StoryParagraphElement: React.FC<StoryParagraphElementProps> = ({
  textAlign = "left",
  fontStyle,
  className = "",
  isFirst = false,
  isLast = false,
  children,
}) => {
  return (
    <p
      className={`leading-relaxed ${
        textAlign === "justify"
          ? "text-justify hyphens-auto"
          : `text-${textAlign}`
      } ${isFirst ? "mt-0" : ""} ${isLast ? "mb-0" : ""} ${className}`}
      style={{ fontStyle: fontStyle }}
    >
      {children}
    </p>
  );
};

export default StoryParagraphElement;
