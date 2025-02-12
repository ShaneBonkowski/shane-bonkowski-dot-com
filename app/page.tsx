"use client";

import React, { useState } from "react";
import ContentSearchBar from "@/src/components/ContentSearchBar";
import { contentBoxData } from "@/src/data/main/content-box-data";
import ContentBox from "@/src/components/ContentBox";
import { ContentBoxProps } from "@/src/components/ContentSearchBar";

export default function Home() {
  const [filteredContent, setFilteredContent] =
    useState<ContentBoxProps[]>(contentBoxData);

  return (
    <div className="mt-3 sm:mt-4">
      <ContentSearchBar
        contentData={contentBoxData}
        setFilteredContent={setFilteredContent}
      />

      <div className="grid mt-6 sm:mt-8 gap-6 sm:gap-8">
        {filteredContent.length > 0 ? (
          filteredContent.map((box, index) => (
            <ContentBox key={index} {...box} />
          ))
        ) : (
          <p className="text-small sm:text-small-sm text-secondary-text-color text-center">
            No results found.
          </p>
        )}
      </div>
    </div>
  );
}
