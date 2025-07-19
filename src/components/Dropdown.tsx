"use client";

import React, { useState, useRef, useEffect } from "react";
import { isMobileDevice } from "@/src/utils/heuristics";

interface DropdownProps {
  options: { value: string; label: string }[];
  selected: string;
  setSelected: (value: string) => void;
  title?: string | undefined;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selected,
  setSelected,
  title = undefined,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* Only allow hover on hover-supported devices */
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    // eslint-disable-next-line no-restricted-syntax
    setIsHoverable(window.matchMedia("(hover: hover)").matches);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // Add a small delay before hiding the dropdown (since it can double click on phone sometimes and click behind it)
        timeoutRef.current = setTimeout(
          () => {
            setIsOpen(false);
          },
          isMobileDevice() ? 220 : 150
        );
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className="relative"
      ref={dropdownRef}
      id="dropdown"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      title={title}
    >
      {/* Selected Value */}
      <button
        // w-[11ch] is used to ensure the button is wide enough for the longest
        // option allowed of 10 char, then adds 1 since the arrow takes up 1 char
        className={`w-[11ch] h-full p-2 bg-button-color-light dark:bg-button-color 
          text-small sm:text-small-sm text-primary-text-color-light dark:text-primary-text-color rounded-sm 
          flex justify-between items-center cursor-pointer ${
            isHoverable
              ? "hover:bg-secondary-hover-color-light dark:hover:bg-secondary-hover-color"
              : ""
          } active:bg-secondary-hover-color-light dark:active:bg-secondary-hover-color`}
        onPointerDown={() => {
          // Add a small delay before hiding the dropdown (since it can double click on phone sometimes and click behind it)
          timeoutRef.current = setTimeout(
            () => {
              setIsOpen(!isOpen);
            },
            isMobileDevice() ? 220 : 150
          );
        }}
        aria-controls="dropdown-list"
        aria-label="Select an option"
      >
        <span className="truncate">
          {(
            options.find((option) => option.value === selected)?.label ||
            "Select"
          )
            .slice(0, 10)
            .padEnd(10, " ")}
        </span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <ul
          id="dropdown-list"
          className="w-full z-40 absolute mt-2 p-0 flex flex-col gap-2 list-none bg-button-color-light dark:bg-button-color 
        rounded-sm shadow-lg overflow-hidden"
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option.value}
              onPointerDown={() => {
                setSelected(option.value);
                // Add a small delay before hiding the dropdown (since it can double click on phone sometimes and click behind it)
                timeoutRef.current = setTimeout(
                  () => {
                    setIsOpen(false);
                  },
                  isMobileDevice() ? 220 : 150
                );
              }}
              className={`p-2 my-0 text-small sm:text-small-sm cursor-pointer ${
                isHoverable
                  ? "hover:bg-secondary-hover-color-light dark:hover:bg-secondary-hover-color"
                  : ""
              } active:bg-secondary-hover-color-light dark:active:bg-secondary-hover-color`}
              role="option"
              aria-selected={selected === option.value}
            >
              {option.label.slice(0, 10).padEnd(10, " ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
