"use client";

import React, { useState } from "react";
import ContentSearchBar from "@/src/components/ContentSearchBar";
import { contentBoxData } from "@/src/data/main/content-box-data";
import ContentBox from "@/src/components/ContentBox";
import { ContentBoxProps } from "@/src/types/content-props";

export default function Home() {
  const [filteredContent, setFilteredContent] =
    useState<ContentBoxProps[]>(contentBoxData);

  return (
    <div className="mt-3 sm:mt-4" id="content-search-bar-and-boxes">
      <ContentSearchBar
        contentData={contentBoxData}
        setFilteredContent={setFilteredContent}
      />

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 m-6 sm:m-8 gap-6 sm:gap-8"
        id="content-boxes"
      >
        {filteredContent.length > 0 ? (
          filteredContent.map((box, index) => (
            <ContentBox key={index} {...box} />
          ))
        ) : (
          // Make the message span all columns so that it is centered!
          <p className="col-span-1 sm:col-span-2 lg:col-span-3 text-small sm:text-small-sm text-secondary-text-color-light dark:text-secondary-text-color text-center">
            No results found.
          </p>
        )}
      </div>
    </div>
  );
}
