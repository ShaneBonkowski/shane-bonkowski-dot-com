"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const currentPageName = useRef(pageName);

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

    // Set up handler to save scroll progress to localStorage on scroll
    const handleScroll = debounce(() => {
      // Only save position if user is ON this specific page.
      // Prevents the debouncing from causing the scroll position to be saved
      // on other pages if a user clicks out before the debounce is complete.
      if (
        document.visibilityState === "visible" &&
        currentPageName.current === pageName
      ) {
        /* eslint-disable no-restricted-syntax */
        const scrollPosition = window.scrollY;
        localStorage.setItem(
          `${pageName}-scrollProgress`,
          scrollPosition.toString()
        );
        /* eslint-enable no-restricted-syntax */
      }
    }, 200);
    // eslint-disable-next-line no-restricted-syntax
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to call when the component is unloaded...
    return () => {
      // eslint-disable-next-line no-restricted-syntax
      window.removeEventListener("scroll", handleScroll);
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
