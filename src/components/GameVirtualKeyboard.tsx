"use client";

import React, { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { FaArrowUp, FaBackspace } from "react-icons/fa";

interface GameVirtualKeyboardProps {
  onCharacter: (character: string) => void;
  onBackspace: () => void;
  onDone: () => void;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
}

const letterRows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
const symbolRows = ["1234567890", "@#$%&*-+/", "=()!?;:"];

const GameVirtualKeyboard: React.FC<GameVirtualKeyboardProps> = ({
  onCharacter,
  onBackspace,
  onDone,
  width = "100%",
  height,
}) => {
  const [isShifted, setIsShifted] = useState(false);
  const [isCapsLocked, setIsCapsLocked] = useState(false);
  const [isShowingSymbols, setIsShowingSymbols] = useState(false);
  const keyboardRef = useRef<HTMLDivElement>(null);
  const lastShiftTapRef = useRef(0);
  const onBackspaceRef = useRef(onBackspace);
  const backspaceDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backspaceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const rows = isShowingSymbols ? symbolRows : letterRows;

  onBackspaceRef.current = onBackspace;

  const stopBackspaceRepeat = () => {
    if (backspaceDelayRef.current !== null) {
      clearTimeout(backspaceDelayRef.current);
      backspaceDelayRef.current = null;
    }
    if (backspaceIntervalRef.current !== null) {
      clearInterval(backspaceIntervalRef.current);
      backspaceIntervalRef.current = null;
    }
  };

  useEffect(
    () => () => {
      if (backspaceDelayRef.current !== null) {
        clearTimeout(backspaceDelayRef.current);
      }
      if (backspaceIntervalRef.current !== null) {
        clearInterval(backspaceIntervalRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const keyboard = keyboardRef.current;
    if (!keyboard) return;

    const preventTouchSelection = (event: TouchEvent) => {
      event.preventDefault();
    };

    keyboard.addEventListener("touchstart", preventTouchSelection, {
      passive: false,
    });

    return () => {
      keyboard.removeEventListener("touchstart", preventTouchSelection);
    };
  }, []);

  const startBackspaceRepeat = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (event.button !== 0) return;

    event.preventDefault();
    stopBackspaceRepeat();
    event.currentTarget.setPointerCapture(event.pointerId);
    onBackspaceRef.current();
    backspaceDelayRef.current = setTimeout(() => {
      backspaceIntervalRef.current = setInterval(
        () => onBackspaceRef.current(),
        80,
      );
    }, 400);
  };

  const pressOnPointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    action: () => void,
  ) => {
    if (event.button !== 0) return;

    event.preventDefault();
    action();
  };

  const pressOnKeyboardClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    action: () => void,
  ) => {
    if (event.detail === 0) action();
  };

  const toggleShift = () => {
    if (isCapsLocked) {
      setIsCapsLocked(false);
      setIsShifted(false);
      lastShiftTapRef.current = 0;
      return;
    }

    const now = Date.now();
    if (lastShiftTapRef.current && now - lastShiftTapRef.current <= 350) {
      setIsCapsLocked(true);
      setIsShifted(true);
      lastShiftTapRef.current = 0;
      return;
    }

    lastShiftTapRef.current = now;
    setIsShifted((shifted) => !shifted);
  };

  const pressCharacter = (character: string) => {
    const shouldCapitalize = !isShowingSymbols && (isShifted || isCapsLocked);
    const output = shouldCapitalize ? character.toUpperCase() : character;
    onCharacter(output);
    lastShiftTapRef.current = 0;
    if (isShifted && !isCapsLocked) setIsShifted(false);
  };

  const renderCharacters = (characters: string, rowIndex: number) =>
    Array.from(characters).map((character, characterIndex) => (
      <button
        key={`${rowIndex}-${characterIndex}`}
        type="button"
        className="game-virtual-key"
        onPointerDown={(event) =>
          pressOnPointerDown(event, () => pressCharacter(character))
        }
        onClick={(event) =>
          pressOnKeyboardClick(event, () => pressCharacter(character))
        }
      >
        {!isShowingSymbols && (isShifted || isCapsLocked)
          ? character.toUpperCase()
          : character}
      </button>
    ));

  return (
    <div
      ref={keyboardRef}
      className="game-virtual-keyboard bg-button-color-light dark:bg-button-color"
      style={{ width, ...(height ? { height } : {}) }}
      role="group"
      aria-label="Virtual keyboard"
      onContextMenu={(event) => event.preventDefault()}
    >
      {rows.map((characters, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className={`game-virtual-keyboard-row ${
            rowIndex === 1 ? "game-virtual-keyboard-row-inset" : ""
          }`}
        >
          {rowIndex === 2 && !isShowingSymbols && (
            <button
              type="button"
              className="game-virtual-key game-virtual-key-modifier"
              aria-label={isCapsLocked ? "Caps lock" : "Shift"}
              aria-pressed={isShifted || isCapsLocked}
              title={isCapsLocked ? "Caps lock" : "Shift"}
              onPointerDown={(event) => pressOnPointerDown(event, toggleShift)}
              onClick={(event) => pressOnKeyboardClick(event, toggleShift)}
            >
              <FaArrowUp className="game-virtual-key-icon" aria-hidden="true" />
            </button>
          )}
          {renderCharacters(characters, rowIndex)}
          {rowIndex === 2 && (
            <button
              type="button"
              className="game-virtual-key game-virtual-key-modifier"
              aria-label="Backspace"
              title="Backspace"
              onPointerDown={startBackspaceRepeat}
              onPointerUp={stopBackspaceRepeat}
              onPointerCancel={stopBackspaceRepeat}
              onLostPointerCapture={stopBackspaceRepeat}
              onBlur={stopBackspaceRepeat}
              onClick={(event) =>
                pressOnKeyboardClick(event, () => onBackspaceRef.current())
              }
            >
              <FaBackspace
                className="game-virtual-key-icon"
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      ))}

      <div className="game-virtual-keyboard-row">
        <button
          type="button"
          className="game-virtual-key game-virtual-key-modifier"
          onPointerDown={(event) =>
            pressOnPointerDown(event, () => {
              setIsShowingSymbols((showingSymbols) => !showingSymbols);
              setIsShifted(false);
              lastShiftTapRef.current = 0;
            })
          }
          onClick={(event) =>
            pressOnKeyboardClick(event, () => {
              setIsShowingSymbols((showingSymbols) => !showingSymbols);
              setIsShifted(false);
              lastShiftTapRef.current = 0;
            })
          }
        >
          {isShowingSymbols ? "ABC" : "?123"}
        </button>
        <button
          type="button"
          className="game-virtual-key game-virtual-key-modifier"
          onPointerDown={(event) =>
            pressOnPointerDown(event, () => pressCharacter(","))
          }
          onClick={(event) =>
            pressOnKeyboardClick(event, () => pressCharacter(","))
          }
        >
          ,
        </button>
        <button
          type="button"
          className="game-virtual-key game-virtual-key-space"
          aria-label="Space"
          onPointerDown={(event) =>
            pressOnPointerDown(event, () => onCharacter(" "))
          }
          onClick={(event) =>
            pressOnKeyboardClick(event, () => onCharacter(" "))
          }
        >
          space
        </button>
        <button
          type="button"
          className="game-virtual-key game-virtual-key-modifier"
          onPointerDown={(event) =>
            pressOnPointerDown(event, () => pressCharacter("."))
          }
          onClick={(event) =>
            pressOnKeyboardClick(event, () => pressCharacter("."))
          }
        >
          .
        </button>
        <button
          type="button"
          className="game-virtual-key game-virtual-key-done"
          onPointerDown={(event) => pressOnPointerDown(event, onDone)}
          onClick={(event) => pressOnKeyboardClick(event, onDone)}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default GameVirtualKeyboard;
