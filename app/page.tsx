"use client";

import React, { useState } from "react";
import ContentSearchBar from "@/components/ContentSearchBar";
import { contentBoxData } from "@/data/content-box-data";
import ContentBox from "@/components/ContentBox";
import { ContentBoxProps } from "@/types/Content";

export default function HomePage() {
  const [filteredContent, setFilteredContent] =
    useState<ContentBoxProps[]>(contentBoxData);

  return (
    <div className="p-6">
      <ContentSearchBar
        contentData={contentBoxData}
        setFilteredContent={setFilteredContent}
      />

      <div className="mt-6 grid gap-6">
        {filteredContent.length > 0 ? (
          filteredContent.map((box, index) => (
            <ContentBox key={index} {...box} />
          ))
        ) : (
          <p className="text-text-secondary-color text-center">
            No results found.
          </p>
        )}
      </div>
    </div>
  );
}
