"use client";

import React, { useState, useEffect } from "react";
import Dropdown from "@/src/components/Dropdown";

const contentTypeOptions = [
  { value: "all", label: "All" },
  { value: "games", label: "Games" },
  { value: "writing", label: "Writing" },
  { value: "art", label: "Art" },
];

export interface ContentBoxProps {
  imageUrl: string;
  linkUrl: string;
  title: string;
  description: string;
  searchTags: string;
  contentType: "games" | "writing" | "art";
  openInNewTab: boolean;
}

export interface ContentSearchBarProps {
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
      className="flex text-small sm:text-small-sm items-center w-content-box-w sm:content-box-w-sm mx-auto space-x-3 bg-button-color p-2 sm:p-3 rounded-lg"
      id="content-search-bar"
    >
      {/* Dropdown for Content Type */}
      <Dropdown
        options={contentTypeOptions}
        selected={searchContentType}
        setSelected={setSearchContentType}
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
        className="p-2 text-small sm:text-small-sm flex-grow bg-secondary-color text-primary-text-color rounded-sm focus:outline-none placeholder-text-secondary-text-color"
      />
    </div>
  );
};

export default ContentSearchBar;
