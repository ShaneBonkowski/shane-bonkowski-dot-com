"use client";
import React, { useEffect, useState, useCallback } from "react";
import DOMPurify from "dompurify";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";

type FeedMsg = {
  msg: string;
  sender: string;
  align?: "left" | "right" | "center";
};

type FeedProps = {
  initialFeedList?: FeedMsg[];
  maxFeedLength?: number;
};

// // EDIT: I removed this since it doesnt look super good.
// // Top of floor is about at 225 px on the unscaled background.
// // Try to make feed the height of the floor, so it looks like it is on the floor nicely.
// const heightVh = (228 / REFERENCE_BKG_SIZE.y) * 100; // 100vh is the full viewport height

export default function Feed({
  initialFeedList = [],
  maxFeedLength = 100,
}: FeedProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [feedList, setFeedList] = useState<FeedMsg[]>(initialFeedList);
  const [viewIndex, setViewIndex] = useState(0); // 0 = bottom (most recent)

  // Show the x most recent messages based on viewIndex
  const feedViewLength = 4;
  const start = Math.max(0, feedList.length - feedViewLength - viewIndex);
  const end = Math.max(0, feedList.length - viewIndex);
  const visibleFeedRaw = feedList.slice(start, end);

  // Pad with empty messages if less than feedViewLength
  const missing = feedViewLength - visibleFeedRaw.length;
  const visibleFeed =
    missing > 0
      ? visibleFeedRaw.concat(
          Array(missing).fill({ msg: "", sender: "", align: "left" })
        )
      : visibleFeedRaw;

  // Allow/disallow scrolling if on top or bottom of feed
  const canScrollUp = viewIndex < feedList.length - feedViewLength;
  const canScrollDown = viewIndex > 0;

  const handleScrollUp = useCallback(() => {
    if (canScrollUp)
      setViewIndex((i) => Math.min(i + 1, feedList.length - feedViewLength));
  }, [canScrollUp, feedList.length, feedViewLength]);

  const handleScrollDown = useCallback(() => {
    if (canScrollDown) setViewIndex((i) => Math.max(i - 1, 0));
  }, [canScrollDown]);

  useEffect(() => {
    function updateFeed(item: FeedMsg) {
      setFeedList((prev) => {
        const newFeed = [...prev, item].slice(-maxFeedLength);
        return newFeed;
      });
      setViewIndex(0); // Jump to bottom on new message
    }

    function handleClearFeed() {
      setFeedList([]);
      setViewIndex(0);
    }

    function handleNewMessage(e: Event) {
      const custom = e as CustomEvent;
      if (
        typeof custom.detail?.msg === "string" &&
        typeof custom.detail?.sender === "string"
      ) {
        updateFeed({
          msg: custom.detail.msg,
          sender: custom.detail.sender,
          align: custom.detail.align || "left",
        });
      }
    }

    const handleUiMenuOpen = () => {
      setIsVisible(false);
    };
    const handleUiMenuClose = () => {
      setIsVisible(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        handleScrollUp();
      } else if (e.key === "ArrowDown") {
        handleScrollDown();
      }
    };

    document.addEventListener("newMessage", handleNewMessage);
    document.addEventListener("clearFeed", handleClearFeed);
    document.addEventListener("uiMenuOpen", handleUiMenuOpen);
    document.addEventListener("uiMenuClose", handleUiMenuClose);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("newMessage", handleNewMessage);
      document.removeEventListener("clearFeed", handleClearFeed);
      document.removeEventListener("uiMenuOpen", handleUiMenuOpen);
      document.removeEventListener("uiMenuClose", handleUiMenuClose);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [maxFeedLength, handleScrollUp, handleScrollDown]);

  return (
    <div
      className={`z-20 w-full 
            ${
              isVisible ? "" : "hidden"
            } p-2 flex flex-row gap-2 items-center cowpoke-panel-white border border-black`}
      aria-label="Feed Container"
    >
      <div className="flex flex-col w-full gap-1" aria-label="Feed Content">
        {visibleFeed.map((item, i) => (
          <div
            key={start + i}
            className={`text-primary-text-color-light text-sm ${
              item.align === "right"
                ? "text-right"
                : item.align === "center"
                ? "text-center"
                : "text-left"
            }`}
            // eslint-disable-next-line no-restricted-syntax
            dangerouslySetInnerHTML={{
              __html:
                item.msg === ""
                  ? "&nbsp;" // Use non-breaking space for empty messages
                  : item.align === "right"
                  ? `${DOMPurify.sanitize(item.msg, {
                      ADD_ATTR: ["target", "rel"],
                    })}<b> — ${DOMPurify.sanitize(item.sender, {
                      ADD_ATTR: ["target", "rel"],
                    })}</b>`
                  : `<b>${DOMPurify.sanitize(item.sender, {
                      ADD_ATTR: ["target", "rel"],
                    })} — </b>${DOMPurify.sanitize(item.msg, {
                      ADD_ATTR: ["target", "rel"],
                    })}`,
            }}
          />
        ))}
      </div>
      <div
        className="flex flex-col justify-end mb-1 gap-2"
        aria-label="Feed Scroll Buttons Container"
        title="Shortcut: Press UP/DOWN Arrows" // tooltip
      >
        <GameIconButton
          onPointerDown={handleScrollUp}
          icon={<FaArrowUp size={30} />}
          ariaLabel="Scroll up"
          darkModeLight={true} // Use light mode colors even in dark mode since it looks better on the bkg
          disabled={!canScrollUp}
        />
        <GameIconButton
          onPointerDown={handleScrollDown}
          icon={<FaArrowDown size={30} />}
          ariaLabel="Scroll down"
          darkModeLight={true} // Use light mode colors even in dark mode since it looks better on the bkg
          disabled={!canScrollDown}
        />
      </div>
    </div>
  );
}

/**
 * Dispatch a custom event to send a message to the feed.
 * @param {string} msg - The message to send to the feed.
 * @param {string} sender - Name to display in feed.
 * @param {"left"|"right"} [align] - Alignment of the message.
 */
export function sendFeedMessage(
  msg: string,
  sender: string,
  align: "left" | "right" | "center" = "left"
) {
  document.dispatchEvent(
    new CustomEvent("newMessage", { detail: { msg, sender, align } })
  );
}
