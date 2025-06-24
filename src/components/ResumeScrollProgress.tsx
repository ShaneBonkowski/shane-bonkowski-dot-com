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

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

        // Add a small delay before revealing.
        // This is a hack b/c phones sometimes double click.
        timeoutRef.current = setTimeout(() => {
          setIsVisible(true);
        }, 150);
      }
    }

    // Set up handler to save scroll progress to localStorage on scroll
    const handleScroll = debounce(() => {
      // Return early during SSR/static generation.
      // This is needed to prevent errors when using localStorage in a server-side
      // rendered environment.
      if (typeof window === "undefined") return;

      // Only save position if user is ON this specific page.
      // Prevents the debouncing from causing the scroll position to be saved
      // on other pages if a user clicks out before the debounce is complete.
      if (
        document.visibilityState === "visible" &&
        currentPageName.current === pageName
      ) {
        const scrollPosition = window.scrollY;
        // eslint-disable-next-line no-restricted-syntax
        localStorage.setItem(
          `${pageName}-scrollProgress`,
          scrollPosition.toString()
        );
      }
    }, 200);
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to call when the component is unloaded...
    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [pageName, threshold]);

  const handleYes = () => {
    window.scrollTo({ top: scrollProgress, behavior: "smooth" });

    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);
  };

  const handleNo = () => {
    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);
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
