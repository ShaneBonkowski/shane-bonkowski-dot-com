"use client";

import React, { useState, useEffect } from "react";
import { ContentSearchBarProps } from "@/types/Content";
import Dropdown from "@/components/Dropdown";

const contentTypeOptions = [
  { value: "all", label: "All" },
  { value: "games", label: "Games" },
  { value: "writing", label: "Writing" },
  { value: "art", label: "Art" },
];

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
    <div className="flex items-center w-content-box-w mx-auto space-x-3 bg-button-color p-4 rounded-lg">
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
        className="p-2 flex-grow bg-secondary-color text-primary-text-color rounded-md focus:outline-none placeholder-text-secondary-text-color"
      />
    </div>
  );
};

export default ContentSearchBar;
