"use client";

import React, { useState, useEffect } from "react";
import Dropdown from "@/src/components/Dropdown";
import { ContentBoxProps } from "@/src/types/content-props";

const contentTypeOptions = [
  { value: "all", label: "All" },
  { value: "games", label: "Games" },
  { value: "writing", label: "Writing" },
  { value: "art", label: "Art" },
];

interface ContentSearchBarProps {
  contentData: ContentBoxProps[];
  setFilteredContent: (filtered: ContentBoxProps[]) => void;
}

const ContentSearchBar: React.FC<ContentSearchBarProps> = ({
  contentData,
  setFilteredContent,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchContentType, setSearchContentType] = useState("all");

  // This will trigger search when either searchTerm or searchContentType changes
  useEffect(() => {
    const filteredResults = contentData.filter((box) => {
      const matchesType =
        searchContentType === "all" || box.contentType === searchContentType;

      const matchesQuery =
        searchTerm === "" ||
        box.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        box.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        box.searchTags.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesType && matchesQuery;
    });

    setFilteredContent(filteredResults);
  }, [searchTerm, searchContentType, contentData, setFilteredContent]);

  return (
    <div
      className="
      flex text-small sm:text-small-sm items-center mx-6 sm:mx-8 space-x-2 rounded-lg"
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
      />
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" &&
          setSearchTerm((e.target as HTMLInputElement).value)
        }
        className="
        p-2 text-small sm:text-small-sm flex-grow bg-button-color-light dark:bg-button-color  
        text-primary-text-color-light dark:text-primary-text-color rounded-sm focus:outline-none 
        placeholder:text-secondary-text-color-light dark:placeholder:text-secondary-text-color
        "
        aria-label="Search content"
      />
    </div>
  );
};

export default ContentSearchBar;
