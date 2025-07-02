"use client";

import React from "react";
import { StoryParagraphElementProps } from "@/src/components/StoryParagraphElement";

/**
 * A wrapper component that groups multiple StoryParagraphElement components
 * and automatically assigns isFirst and isLast props to them.
 */
const StoryParagraphGroup = ({ children }: { children: React.ReactNode }) => {
  const childArray = React.Children.toArray(children);
  return (
    <>
      {childArray.map((child, idx) => {
        return React.cloneElement(
          child as React.ReactElement<StoryParagraphElementProps>,
          {
            isFirst: idx === 0,
            isLast: idx === childArray.length - 1,
          }
        );
      })}
    </>
  );
};

export default StoryParagraphGroup;
