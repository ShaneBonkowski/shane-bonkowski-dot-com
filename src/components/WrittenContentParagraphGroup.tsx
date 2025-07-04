"use client";

import React from "react";
import { WrittenContentParagraphElementProps } from "@/src/components/WrittenContentParagraphElement";

/**
 * A wrapper component that groups multiple WrittenContentParagraphElement components
 * and automatically assigns isFirst and isLast props to them.
 */
const WrittenContentParagraphGroup = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const childArray = React.Children.toArray(children);
  return (
    <>
      {childArray.map((child, idx) => {
        return React.cloneElement(
          child as React.ReactElement<WrittenContentParagraphElementProps>,
          {
            isFirst: idx === 0,
            isLast: idx === childArray.length - 1,
          }
        );
      })}
    </>
  );
};

export default WrittenContentParagraphGroup;
