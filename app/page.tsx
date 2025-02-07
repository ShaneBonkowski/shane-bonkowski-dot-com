"use client";

import React, { useState } from "react";
import ContentSearchBar from "@/components/layout/ContentSearchBar";
import { contentBoxData } from "@/data/main/content-box-data";
import ContentBox from "@/components/layout/ContentBox";
import { ContentBoxProps } from "@/types/layout/Content";

export default function Home() {
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
          <p className="text-secondary-text-color text-center">
            No results found.
          </p>
        )}
      </div>
    </div>
  );
}
