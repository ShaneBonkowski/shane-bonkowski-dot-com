"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import YesNoBox from "@/src/components/YesNoBox";
import useIsGamesPath from "@/src/hooks/useIsGamesPath";

const CookieAgreement: React.FC = () => {
  const isGamesPath = useIsGamesPath();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const enableCookies = () => {
    console.log("Cookies enabled");
    // eslint-disable-next-line no-restricted-syntax
    localStorage.setItem("cookieConsent", "true");

    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);
  };

  const disableCookies = () => {
    console.log("Cookies disabled");
    // eslint-disable-next-line no-restricted-syntax
    localStorage.setItem("cookieConsent", "false");
    disableTracking();

    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);
  };

  const disableTracking = () => {
    // Remove all existing cookies
    document.cookie.split(";").forEach(function (c) {
      const cookieName = c.split("=")[0].trim();
      // eslint-disable-next-line no-restricted-syntax
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    });
  };

  useEffect(() => {
    // Return early during SSR/static generation.
    // This is needed to prevent errors when using localStorage in a server-side
    // rendered environment.
    if (typeof window === "undefined") return;

    // eslint-disable-next-line no-restricted-syntax
    const cookieConsent = localStorage.getItem("cookieConsent");

    // Reveal the popup if cookie consent is not already given
    if (cookieConsent !== "true" && cookieConsent !== "false") {
      setIsVisible(true);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return (
    !isGamesPath &&
    isVisible && (
      <YesNoBox
        yesButtonText="Enable"
        noButtonText="Disable"
        onYes={enableCookies}
        onNo={disableCookies}
        id="cookie-agreement"
        aria-labelledby="cookie-agreement-title"
        aria-describedby="cookie-agreement-description"
      >
        <p id="cookie-agreement-description" className="text-left">
          This website uses cookies to ensure you get the best experience. By
          continuing to use this site, you accept our use of cookies.{" "}
          <Link href="/main/cookie-policy" className="link">
            See our cookie policy for more information
          </Link>
          .
        </p>
      </YesNoBox>
    )
  );
};

export default CookieAgreement;
