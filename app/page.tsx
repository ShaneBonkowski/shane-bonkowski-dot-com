"use client";

import React, { useState } from "react";
import ContentSearchBar from "@/components/layout/ContentSearchBar";
import { contentBoxData } from "@/data/main/content-box-data";
import ContentBox from "@/components/layout/ContentBox";
import { ContentBoxProps } from "@/types/Content";

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
