"use client";

import React, { useState, useEffect, useRef } from "react";
import YesNoBox from "@/src/components/YesNoBox";
import { debounce } from "@/src/utils/debounce";

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
    // Code to call when the component loads in...
    // If the user has scrolled past a given threshold on a previous site visit,
    // show the popup asking if they would like to pick up where they left off.
    const savedScrollProgress = localStorage.getItem(
      `${pageName}-scroll-progress`
    );

    if (savedScrollProgress) {
      const scrollValue = parseInt(savedScrollProgress, 10);
      if (scrollValue > threshold) {
        setScrollProgress(scrollValue);
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
        const scrollPosition = window.scrollY;
        localStorage.setItem(
          `${pageName}-scroll-progress`,
          scrollPosition.toString()
        );
      }
    }, 200);
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to call when the component is unloaded...
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pageName, threshold]);

  const handleYes = () => {
    window.scrollTo({ top: scrollProgress, behavior: "smooth" });
    setIsVisible(false);
  };

  const handleNo = () => {
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
      >
        <p className="text-left py-2 my-0">Pick up where you left off?</p>
      </YesNoBox>
    )
  );
};

export default ResumeScrollProgress;
