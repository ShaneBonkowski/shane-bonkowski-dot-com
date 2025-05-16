"use client";

import React, { useState, useRef, useEffect } from "react";

interface DropdownProps {
  options: { value: string; label: string }[];
  selected: string;
  setSelected: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selected,
  setSelected,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* Only allow hover on hover-supported devices */
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
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
        timeoutRef.current = setTimeout(() => {
          setIsOpen(false);
        }, 100);
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
      className="relative w-content-box-dropdown-w sm:w-content-box-dropdown-w-sm h-content-box-dropdown-h sm:h-content-box-dropdown-h"
      ref={dropdownRef}
      id="dropdown"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
    >
      {/* Selected Value */}
      <button
        className={`w-full p-2 bg-button-color-light dark:bg-button-color 
          text-small sm:text-small-sm text-primary-text-color-light dark:text-primary-text-color rounded-sm 
          flex justify-between items-center cursor-pointer ${
            isHoverable
              ? "hover:bg-secondary-hover-color-light dark:hover:bg-secondary-hover-color"
              : ""
          } active:bg-secondary-hover-color-light dark:active:bg-secondary-hover-color`}
        onPointerDown={() => {
          // Add a small delay before hiding the dropdown (since it can double click on phone sometimes and click behind it)
          timeoutRef.current = setTimeout(() => {
            setIsOpen(!isOpen);
          }, 100);
        }}
        aria-controls="dropdown-list"
        aria-label="Select an option"
      >
        {options.find((option) => option.value === selected)?.label || "Select"}
        <span className="ml-2">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <ul
          id="dropdown-list"
          className="w-full absolute p-2 list-none mt-1 bg-button-color-light dark:bg-button-color 
        rounded-sm shadow-lg overflow-hidden z-50"
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option.value}
              onPointerDown={() => {
                setSelected(option.value);
                // Add a small delay before hiding the dropdown (since it can double click on phone sometimes and click behind it)
                timeoutRef.current = setTimeout(() => {
                  setIsOpen(false);
                }, 100);
              }}
              className={`text-small sm:text-small-sm cursor-pointer ${
                isHoverable
                  ? "hover:bg-secondary-hover-color-light dark:hover:bg-secondary-hover-color"
                  : ""
              } active:bg-secondary-hover-color-light dark:active:bg-secondary-hover-color w-full block p-2`}
              role="option"
              aria-selected={selected === option.value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
