"use client";

import React, { useState, useRef, useEffect } from "react";
import { DropdownProps } from "@/types/Dropdown";

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
    <div className="relative" ref={dropdownRef}>
      {/* Selected Value */}
      <button
        className="p-2 bg-secondary-color text-text-color rounded-md w-32 flex justify-between items-center cursor-pointer hover:bg-secondary-color-hover"
        onClick={() => setIsOpen(!isOpen)}
      >
        {options.find((option) => option.value === selected)?.label || "Select"}
        <span className="ml-2">▼</span>
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <ul className="absolute p-2 list-none mt-1 w-32 bg-secondary-color rounded-md shadow-lg overflow-hidden z-50">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                setSelected(option.value);
                setIsOpen(false);
              }}
              className="cursor-pointer hover:bg-secondary-color-hover w-full block p-2"
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
