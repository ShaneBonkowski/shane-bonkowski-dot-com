"use client";

import React, { useEffect, useState, useRef } from "react";
import { sanitizeHtml } from "@/src/utils/sanitize";

type FeedMsg = {
  msg: string;
  sender: string;
  align?: "left" | "right" | "center";
};

type FeedProps = {
  maxFeedLength?: number;
  heightClass?: string;
};

export default function Feed({
  maxFeedLength = 100,
  heightClass = "h-[200px]", // e.g. "max-h-32", "h-[200px]", "h-full", etc.
}: FeedProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [feedList, setFeedList] = useState<FeedMsg[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when feedList changes
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [feedList]);

  useEffect(() => {
    function updateFeed(item: FeedMsg) {
      setFeedList((prev) => {
        const newFeed = [...prev, item].slice(-maxFeedLength);
        return newFeed;
      });
    }

    function handleClearFeed() {
      setFeedList([]);
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

    document.addEventListener("newMessage", handleNewMessage);
    document.addEventListener("clearFeed", handleClearFeed);
    document.addEventListener("uiMenuOpen", handleUiMenuOpen);
    document.addEventListener("uiMenuClose", handleUiMenuClose);
    return () => {
      document.removeEventListener("newMessage", handleNewMessage);
      document.removeEventListener("clearFeed", handleClearFeed);
      document.removeEventListener("uiMenuOpen", handleUiMenuOpen);
      document.removeEventListener("uiMenuClose", handleUiMenuClose);
    };
  }, [maxFeedLength]);

  return (
    <div
      ref={feedRef}
      className={`z-20 w-full ${
        isVisible ? "" : "hidden"
      } p-2 flex flex-col gap-1 cowpoke-panel-white border border-black overflow-y-auto ${heightClass}`}
      aria-label="Feed Container"
    >
      {feedList.map((item, i) =>
        // Render a horizontal line for "LINE" messages, otherwise render the message
        // with the appropriate alignment and sender.
        item.msg === "LINE" ? (
          <hr
            key={i}
            className="my-2 border-t border-gray-500 dark:border-gray-500"
            aria-hidden="true"
          />
        ) : (
          <div
            key={i}
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
                  ? `${sanitizeHtml(item.msg)}<b> — ${sanitizeHtml(
                      item.sender
                    )}</b>`
                  : `<b>${sanitizeHtml(item.sender)} — </b>${sanitizeHtml(
                      item.msg
                    )}`,
            }}
          />
        )
      )}
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
  sender: string = "Cowpoke Jack's Ghost",
  align: "left" | "right" | "center" = "left"
) {
  document.dispatchEvent(
    new CustomEvent("newMessage", { detail: { msg, sender, align } })
  );
}
