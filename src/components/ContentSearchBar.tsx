"use client";

import React, { useState, useEffect, useRef } from "react";
import Dropdown from "@/src/components/Dropdown";
import { ContentBoxProps } from "@/src/types/content-props";
import { isMobileDevice } from "@/src/utils/heuristics";

const contentTypeOptions = [
  { value: "all", label: "All" },
  { value: "games", label: "Games" },
  { value: "writing", label: "Writing" },
  { value: "art", label: "Art" },
];

interface ContentSearchBarProps {
  contentData: ContentBoxProps[];
  setFilteredContent: (content: ContentBoxProps[]) => void;
}

const ContentSearchBar: React.FC<ContentSearchBarProps> = ({
  contentData,
  setFilteredContent,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchContentType, setSearchContentType] = useState("all");

  // This will trigger search when either searchTerm or searchContentType changes
  useEffect(() => {
    const filteredResults = contentData
      .filter((box) => {
        const matchesType =
          searchContentType === "all" || box.contentType === searchContentType;

        const matchesQuery =
          searchTerm === "" ||
          box.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          box.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          box.searchTags.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesType && matchesQuery;
      })
      .sort((a, b) => {
        // Sort by date, newest first
        const dateA = new Date(a.dateISO);
        const dateB = new Date(b.dateISO);
        return dateB.getTime() - dateA.getTime();
      });

    setFilteredContent(filteredResults);
  }, [searchTerm, searchContentType, contentData, setFilteredContent]);

  return (
    <div
      className="flex items-stretch px-common-p sm:px-common-p-sm space-x-2 rounded-lg"
      id="content-search-bar"
      role="search"
      aria-label="Content search bar"
    >
      {/* Dropdown for Content Type */}
      <Dropdown
        options={contentTypeOptions}
        selected={searchContentType}
        setSelected={setSearchContentType}
        aria-label="Filter by content type"
        title="Filter by Content Type"
      />
      {/* Search Input */}
      {/* eslint-disable-next-line no-restricted-syntax */}
      <input
        type="text"
        ref={inputRef}
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // Update the search term on submit
            setSearchTerm((e.target as HTMLInputElement).value);

            // On mobile, we want to prevent the default behavior of the Enter
            // key which may submit a form or cause unwanted side effects.
            if (isMobileDevice()) {
              e.preventDefault();
              inputRef.current?.blur(); // Hide keyboard
            }
          }
        }}
        className="
        p-2 w-full bg-button-color-light dark:bg-button-color  
        text-primary-text-color-light dark:text-primary-text-color rounded-sm focus:outline-none 
        placeholder:text-secondary-text-color-light dark:placeholder:text-secondary-text-color
        "
        style={{ fontSize: "16px" }} // Font size >= 16px on mobile prevents zooming
        aria-label="Search content"
        title="Search content"
      />
    </div>
  );
};

export default ContentSearchBar;
