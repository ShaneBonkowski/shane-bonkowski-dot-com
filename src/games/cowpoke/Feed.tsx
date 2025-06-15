import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";

type FeedMsg = {
  msg: string;
  sender: string;
  align?: "left" | "right";
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
  const visibleFeed = feedList.slice(start, end);

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
        <div className="z-40 fixed bottom-5 left-1/2 -translate-x-1/2 w-[80vw] max-w-3xl bg-white p-2 flex flex-col items-center border-2 border-black">
          <div className="flex flex-row w-full justify-end mb-1 gap-2">
            <button
              className={`px-2 py-1 rounded text-lg font-bold ${
                canScrollUp
                  ? "bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              onClick={handleScrollUp}
              disabled={!canScrollUp}
              aria-label="Scroll up"
            >
              ▲
            </button>
            <button
              className={`px-2 py-1 rounded text-lg font-bold ${
                canScrollDown
                  ? "bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              onClick={handleScrollDown}
              disabled={!canScrollDown}
              aria-label="Scroll down"
            >
              ▼
            </button>
          </div>
          <div className="flex flex-col w-full gap-1">
            {visibleFeed.length === 0 && (
              <div className="text-primary-text-color-light text-center">
                No messages yet.
              </div>
            )}
            {visibleFeed.map((item, i) => (
              <div
                key={start + i}
                className={`text-primary-text-color-light text-sm ${
                  item.align === "right" ? "text-right" : "text-left"
                }`}
                // eslint-disable-next-line no-restricted-syntax
                dangerouslySetInnerHTML={{
                  __html:
                    item.align === "right"
                      ? `${DOMPurify.sanitize(
                          item.msg
                        )}: <b>${DOMPurify.sanitize(item.sender)}</b>`
                      : `<b>${DOMPurify.sanitize(
                          item.sender
                        )}:</b> ${DOMPurify.sanitize(item.msg)}`,
                }}
              />
            ))}
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
  align: "left" | "right" = "left"
) {
  window.dispatchEvent(
    new CustomEvent("newMessage", { detail: { msg, sender, align } })
  );
}
