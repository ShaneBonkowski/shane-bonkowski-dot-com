"use client";

import React, { useState, useEffect } from "react";
import YesNoBox from "@/src/components/YesNoBox";
import { debounce } from "@/src/utils/debounce";
import { installTouchThroughBlocker } from "@/src/utils/touch-through-blocker";

interface ResumeScrollProgressProps {
  pageName: string;
  threshold: number;
}

const ResumeScrollProgress: React.FC<ResumeScrollProgressProps> = ({
  pageName,
  threshold,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  useEffect(() => {
    // Return early during SSR/static generation.
    // This is needed to prevent errors when using localStorage in a server-side
    // rendered environment.
    if (typeof window === "undefined") return;

    // Code to call when the component loads in...
    // If the user has scrolled past a given threshold on a previous site visit,
    // show the popup asking if they would like to pick up where they left off.

    // eslint-disable-next-line no-restricted-syntax
    const savedScrollProgress = localStorage.getItem(
      `${pageName}-scrollProgress`
    );

    if (savedScrollProgress) {
      const scrollValue = parseInt(savedScrollProgress, 10);
      if (scrollValue > threshold) {
        setScrollProgress(scrollValue);

        // Prevent touch-through on mobile devices when window is toggled.
        installTouchThroughBlocker();
        setIsVisible(true);
      }
    }

    let scrollPosition = 0;
    const saveScrollProgress = debounce(() => {
      // eslint-disable-next-line no-restricted-syntax
      localStorage.setItem(`${pageName}-scrollProgress`, scrollPosition.toString());
    }, 200);
    const handleScroll = () => {
      if (document.visibilityState !== "visible") return;
      // Capture the position before navigation so cleanup cannot save the next page's scroll.
      // eslint-disable-next-line no-restricted-syntax
      scrollPosition = window.scrollY;
      saveScrollProgress();
    };
    // eslint-disable-next-line no-restricted-syntax
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to call when the component is unloaded...
    return () => {
      // eslint-disable-next-line no-restricted-syntax
      window.removeEventListener("scroll", handleScroll);
      saveScrollProgress.flush();
    };
  }, [pageName, threshold]);

  const handleYes = () => {
    // eslint-disable-next-line no-restricted-syntax
    window.scrollTo({ top: scrollProgress, behavior: "smooth" });

    // Prevent touch-through on mobile devices when window is toggled.
    installTouchThroughBlocker();
    setIsVisible(false);
  };

  const handleNo = () => {
    // Prevent touch-through on mobile devices when window is toggled.
    installTouchThroughBlocker();
    setIsVisible(false);
  };

  return (
    isVisible && (
      <YesNoBox
        yesButtonText="Yes"
        noButtonText="No"
        onYes={handleYes}
        onNo={handleNo}
        id="resume-scroll-progress"
        bottomRight={true}
        aria-labelledby="resume-scroll-progress-title"
        aria-describedby="resume-scroll-progress-description"
      >
        <p
          id="resume-scroll-progress-description"
          className="text-left py-2 my-0"
        >
          Pick up where you left off?
        </p>
      </YesNoBox>
    )
  );
};

export default ResumeScrollProgress;
