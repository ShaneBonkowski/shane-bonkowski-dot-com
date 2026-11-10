"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  getPageSeenStorageKey,
  markContentAsSeen,
} from "@/src/utils/content-seen";

const PageVisitTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    markContentAsSeen(getPageSeenStorageKey(pathname));
  }, [pathname]);

  return null;
};

export default PageVisitTracker;
