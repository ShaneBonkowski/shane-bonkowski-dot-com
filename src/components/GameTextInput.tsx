"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import GameVirtualKeyboard from "@/src/components/GameVirtualKeyboard";
import { isMobileDevice } from "@/src/utils/heuristics";

interface GameTextInputProps {
  label: string;
  placeholder: string;
  value: string;
  maxLength: number;
  className: string;
  onChange: (value: string) => void;
  onVirtualKeyboardOpenChange?: (isOpen: boolean) => void;
  keyboardWidth?: React.CSSProperties["width"];
  keyboardHeight?: React.CSSProperties["height"];
}

const GameTextInput: React.FC<GameTextInputProps> = ({
  label,
  placeholder,
  value,
  maxLength,
  className,
  onChange,
  onVirtualKeyboardOpenChange,
  keyboardWidth,
  keyboardHeight,
}) => {
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const keyboardInputRef = useRef<HTMLInputElement>(null);
  const selectionRef = useRef({ start: value.length, end: value.length });

  useEffect(() => {
    setIsTouchDevice(isMobileDevice());
  }, []);

  useEffect(() => {
    if (!isKeyboardOpen || !keyboardInputRef.current) return;

    const input = keyboardInputRef.current;
    input.focus({ preventScroll: true });
    input.setSelectionRange(
      selectionRef.current.start,
      selectionRef.current.end,
    );
  }, [isKeyboardOpen, value]);

  const openKeyboard = () => {
    selectionRef.current = { start: value.length, end: value.length };
    setIsKeyboardOpen(true);
    onVirtualKeyboardOpenChange?.(true);
  };

  const closeKeyboard = () => {
    setIsKeyboardOpen(false);
    onVirtualKeyboardOpenChange?.(false);
  };

  const updateSelection = (input: HTMLInputElement) => {
    selectionRef.current = {
      start: input.selectionStart ?? value.length,
      end: input.selectionEnd ?? value.length,
    };
  };

  const replaceSelection = (insertedText: string) => {
    const { start, end } = selectionRef.current;
    const availableLength = Math.max(
      0,
      maxLength - (value.length - (end - start)),
    );
    const inserted = insertedText.slice(0, availableLength);
    const nextValue = `${value.slice(0, start)}${inserted}${value.slice(end)}`;
    const nextCursor = start + inserted.length;

    selectionRef.current = { start: nextCursor, end: nextCursor };
    onChange(nextValue);
  };

  const deleteBeforeCursor = () => {
    const { start, end } = selectionRef.current;
    if (start === 0 && end === 0) return;

    const deleteStart = start === end ? Math.max(0, start - 1) : start;
    const nextValue = `${value.slice(0, deleteStart)}${value.slice(end)}`;
    selectionRef.current = { start: deleteStart, end: deleteStart };
    onChange(nextValue);
  };

  if (!isTouchDevice) {
    return (
      // eslint-disable-next-line no-restricted-syntax
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        className={className}
        style={{ fontSize: "16px" }}
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            if (isMobileDevice()) {
              event.preventDefault();
              event.currentTarget.blur();
            }
          }
        }}
      />
    );
  }

  return (
    <>
      <button
        type="button"
        className={`game-text-input-trigger ${className}`}
        aria-haspopup="dialog"
        aria-expanded={isKeyboardOpen}
        aria-label={label}
        onClick={openKeyboard}
      >
        {value || (
          <span className="game-text-input-placeholder">{placeholder}</span>
        )}
      </button>
      {isKeyboardOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              className="game-virtual-entry-screen"
              role="dialog"
              aria-modal="true"
              aria-label={label}
              onClick={(event) => {
                if (event.target === event.currentTarget) closeKeyboard();
              }}
            >
              <div
                className="game-virtual-entry-field"
                onClick={(event) => {
                  if (event.target === event.currentTarget) closeKeyboard();
                }}
              >
                {/* eslint-disable-next-line no-restricted-syntax */}
                <input
                  id="game-virtual-entry-input"
                  ref={keyboardInputRef}
                  className="game-virtual-entry-input"
                  type="text"
                  value={value}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  readOnly
                  inputMode="none"
                  aria-label={label}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      event.currentTarget.blur();
                      closeKeyboard();
                    }
                  }}
                  onSelect={(event) => updateSelection(event.currentTarget)}
                  onClick={(event) => updateSelection(event.currentTarget)}
                />
              </div>
              <GameVirtualKeyboard
                width={keyboardWidth}
                height={keyboardHeight}
                onCharacter={replaceSelection}
                onBackspace={deleteBeforeCursor}
                onDone={closeKeyboard}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
};

export default GameTextInput;
