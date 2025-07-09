"use client";

import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const PageButton: React.FC<{
  pageNum: number;
  isActive: boolean;
  onClick: (page: number) => void;
}> = ({ pageNum, isActive, onClick }) => (
  <button
    onClick={() => onClick(pageNum)}
    className={`p-4 rounded min-w-[40px] text-sm hover:bg-secondary-hover-color-light dark:hover:bg-secondary-hover-color hover:text-primary-text-color-light dark:hover:text-primary-text-color ${
      isActive
        ? "bg-button-color-light dark:bg-button-color text-primary-text-color-light dark:text-primary-text-color"
        : "text-secondary-text-color-light dark:text-secondary-text-color"
    }`}
    aria-label={`Go to page ${pageNum}`}
    aria-current={isActive ? "page" : undefined}
  >
    {pageNum}
  </button>
);

const PageArrowButton: React.FC<{
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}> = ({ direction, disabled, onClick }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-4 rounded ${
      disabled
        ? "cursor-not-allowed text-secondary-text-color-light dark:text-secondary-text-color"
        : "text-primary-text-color-light dark:text-primary-text-color hover:bg-secondary-hover-color-light dark:hover:bg-secondary-hover-color"
    }`}
    aria-label={direction === "left" ? "Previous page" : "Next page"}
  >
    {direction === "left" ? (
      <FaChevronLeft size={16} />
    ) : (
      <FaChevronRight size={16} />
    )}
  </button>
);

const PageEllipsis: React.FC = () => (
  <span className="p-2 text-secondary-text-color-light dark:text-secondary-text-color">
    ...
  </span>
);

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  const [isWideScreen, setIsWideScreen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkScreenWidth = () => {
      // eslint-disable-next-line no-restricted-syntax
      setIsWideScreen(window.innerWidth > 500);
    };

    // Check initial width
    checkScreenWidth();

    // Add resize listener
    // eslint-disable-next-line no-restricted-syntax
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      // eslint-disable-next-line no-restricted-syntax
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  if (totalPages <= 1) return null; // Don't show pg selector if only 1 page

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div
      className={`flex justify-center items-center py-common-p sm:py-common-p-sm mx-auto gap-1 ${className}`}
    >
      {/* Previous Arrow */}
      <PageArrowButton
        direction="left"
        disabled={currentPage === 1}
        onClick={handlePrevious}
      />

      {/* Page nummbers */}
      {(() => {
        // Show neighbors and current
        const neighbors = [
          currentPage - 1,
          currentPage,
          currentPage + 1,
        ].filter((page) => page >= 1 && page <= totalPages);

        const pages = [];

        // Add "1 ..." if we're far from start AND this is a wide screen
        if (neighbors[0] > 1 && isWideScreen) {
          // Always add the first page button
          pages.push(
            <PageButton
              key={1}
              pageNum={1}
              isActive={currentPage === 1}
              onClick={onPageChange}
            />
          );

          // Add ellipsis only if there's a gap
          if (neighbors[0] > 2) {
            pages.push(<PageEllipsis key="start-ellipsis" />);
          }
        }

        // Add the neighbor pages
        neighbors.forEach((pageNum) => {
          pages.push(
            <PageButton
              key={pageNum}
              pageNum={pageNum}
              isActive={currentPage === pageNum}
              onClick={onPageChange}
            />
          );
        });

        // Add "... end" if we're far from end AND this is a wide screen
        if (neighbors[neighbors.length - 1] < totalPages && isWideScreen) {
          // Add ellipsis only if there's a gap
          if (neighbors[neighbors.length - 1] < totalPages - 1) {
            pages.push(<PageEllipsis key="end-ellipsis" />);
          }

          // Always add the last page button
          pages.push(
            <PageButton
              key={totalPages}
              pageNum={totalPages}
              isActive={currentPage === totalPages}
              onClick={onPageChange}
            />
          );
        }

        return pages;
      })()}

      {/* Next Arrow */}
      <PageArrowButton
        direction="right"
        disabled={currentPage === totalPages}
        onClick={handleNext}
      />
    </div>
  );
};

export default Pagination;
