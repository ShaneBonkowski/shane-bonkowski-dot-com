"use client"; // need this since this component uses useState

import React, { useState, useCallback, useEffect } from "react";
import ContentSearchBar from "@/src/components/ContentSearchBar";
import ContentBox from "@/src/components/ContentBox";
import { ContentBoxProps } from "@/src/types/content-props";
import { contentBoxData } from "@/src/data/content-box-data";
import Pagination from "@/src/components/Pagination";

const ITEMS_PER_PAGE = 12; // divisible by 2 and 3, so full pg looks nice w/ all grid layouts

// Sort content boxes from NEWEST to OLDEST, so that there is not a flicker when
// loading the boxes in then sorting them
const sortedContentBoxData = [...contentBoxData].sort(
  (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
);

export default function Home() {
  const [filteredContent, setFilteredContent] =
    useState<ContentBoxProps[]>(sortedContentBoxData);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredContent.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageContent = filteredContent.slice(startIndex, endIndex);

  const handleFilteredContentChange = useCallback(
    (newContent: ContentBoxProps[]) => {
      setFilteredContent(newContent);
      // Try to reset to first page when search changes
      tryToChangePage(1);
    },
    []
  );

  const tryToChangePage = (page: number) => {
    // Changes to provided page number if user is not already on that page.
    // Pauses for a couple anim frames and updates render state so that there
    // is time for the old page content to clear prior to re-rendering. Was
    // previously getting weird bugs where images lingered when changing.
    setCurrentPage((prevPage) => {
      if (prevPage !== page) {
        setIsPageChanging(true);
        setRenderKey((prev) => prev + 1);

        // Get 2 full frames to clear the DOM prior to setting "changing" state
        // back to false.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsPageChanging(false);
          });
        });

        return page; // Update to new page
      }

      return prevPage; // No change needed
    });
  };

  const handlePageChange = (page: number) => {
    tryToChangePage(page);
  };

  // useEffect to handle scrolling back to top after currentPage changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    // eslint-disable-next-line no-restricted-syntax
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // do NOT smoothly scroll here
    });
  }, [currentPage]);

  return (
    <>
      <ContentSearchBar
        contentData={sortedContentBoxData}
        setFilteredContent={handleFilteredContentChange}
      />

      <div
        key={`${currentPage}-${renderKey}`}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-common-p sm:mt-common-p-sm px-common-p sm:px-common-p-sm gap-common-p sm:gap-common-p-sm"
        id="content-boxes"
      >
        {isPageChanging ? (
          // Render an empty div to clear the DOM. This is so that all images
          // etc. get cleared from the DOM and re-rendered on page change.
          <div />
        ) : currentPageContent.length > 0 ? (
          currentPageContent.map((box, index) => (
            <ContentBox
              key={`page-${currentPage}-${index}-${box.linkUrl}`}
              {...box}
            />
          ))
        ) : (
          // Make the message span all columns so that it is centered!
          <p className="col-span-1 sm:col-span-2 lg:col-span-3 text-small sm:text-small-sm text-secondary-text-color-light dark:text-secondary-text-color text-center">
            No results found.
          </p>
        )}
      </div>

      {/* Spacer to push pagination to bottom of viewport if few content boxes */}
      <div className="flex-grow" />

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
