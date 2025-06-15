import React, { useEffect, useState } from "react";
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

export default function Feed({
  initialFeedList = [],
  maxFeedLength = 100,
}: FeedProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [feedList, setFeedList] = useState<FeedMsg[]>(initialFeedList);
  const [viewIndex, setViewIndex] = useState(0); // 0 = bottom (most recent)

  useEffect(() => {
    function updateFeed(item: FeedMsg) {
      setFeedList((prev) => {
        const newFeed = [...prev, item].slice(-maxFeedLength);
        return newFeed;
      });
      setViewIndex(0); // Jump to bottom on new message
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

    window.addEventListener("newMessage", handleNewMessage);
    document.addEventListener("uiMenuOpen", handleUiMenuOpen);
    document.addEventListener("uiMenuClose", handleUiMenuClose);
    return () => {
      window.removeEventListener("newMessage", handleNewMessage);
      document.removeEventListener("uiMenuOpen", handleUiMenuOpen);
      document.removeEventListener("uiMenuClose", handleUiMenuClose);
    };
  }, [maxFeedLength]);

  // Show the 3 most recent messages based on viewIndex
  const start = Math.max(0, feedList.length - 3 - viewIndex);
  const end = Math.max(0, feedList.length - viewIndex);
  const visibleFeedRaw = feedList.slice(start, end);

  // Pad with empty messages if less than 3
  const missing = 3 - visibleFeedRaw.length;
  const visibleFeed =
    missing > 0
      ? visibleFeedRaw.concat(
          Array(missing).fill({ msg: "", sender: "", align: "left" })
        )
      : visibleFeedRaw;

  // Allow/disallow scrolling if on top or bottom of feed
  const canScrollUp = viewIndex < feedList.length - 3;
  const canScrollDown = viewIndex > 0;

  function handleScrollUp() {
    if (canScrollUp) setViewIndex((i) => Math.min(i + 1, feedList.length - 3));
  }
  function handleScrollDown() {
    if (canScrollDown) setViewIndex((i) => Math.max(i - 1, 0));
  }

  return (
    <>
      {isVisible && (
        <div
          className="z-40 fixed bottom-1 left-1/2 -translate-x-1/2 w-[80vw] max-w-3xl p-2 flex flex-row gap-2 items-center border-2 border-black"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
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
                      ? `${DOMPurify.sanitize(
                          item.msg
                        )}<b> — ${DOMPurify.sanitize(item.sender)}</b>`
                      : `<b>${DOMPurify.sanitize(
                          item.sender
                        )} — </b>${DOMPurify.sanitize(item.msg)}`,
                }}
              />
            ))}
          </div>
          <div
            className="flex flex-col justify-end mb-1 gap-2"
            aria-label="Feed Scroll Buttons Container"
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
      )}
    </>
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
  window.dispatchEvent(
    new CustomEvent("newMessage", { detail: { msg, sender, align } })
  );
}
