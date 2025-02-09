"use client";

import React, { useState, useRef, useEffect } from "react";

export interface DropdownProps {
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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative h-content-box-dropdown-h sm:h-content-box-dropdown-h"
      ref={dropdownRef}
    >
      {/* Selected Value */}
      <button
        className="p-2 bg-secondary-color text-small sm:text-small-sm text-primary-text-color rounded-sm w-content-box-dropdown-w sm:w-content-box-dropdown-w-sm flex justify-between items-center cursor-pointer hover:bg-secondary-hover-color active:bg-secondary-hover-color"
        onClick={() => setIsOpen(!isOpen)}
      >
        {options.find((option) => option.value === selected)?.label || "Select"}
        <span className="ml-2">▼</span>
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <ul className="absolute p-2 text-small sm:text-small-sm list-none mt-1 w-content-box-dropdown-w sm:w-content-box-dropdown-w-sm bg-secondary-color rounded-sm shadow-lg overflow-hidden z-50">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                setSelected(option.value);
                setIsOpen(false);
              }}
              className="cursor-pointer hover:bg-secondary-hover-color active:bg-secondary-hover-color w-full block p-2"
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
