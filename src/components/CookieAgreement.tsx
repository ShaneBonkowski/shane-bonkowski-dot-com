"use client"; // Enables client-side rendering.. Required for using useState

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import YesNoBox from "@/src/components/YesNoBox";
import useIsGamesPath from "@/src/hooks/useIsGamesPath";

const CookieAgreement: React.FC = () => {
  const isGamesPath = useIsGamesPath();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const enableCookies = () => {
    console.log("Cookies enabled");
    localStorage.setItem("cookieConsent", "true");

    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  const disableCookies = () => {
    console.log("Cookies disabled");
    localStorage.setItem("cookieConsent", "false");
    disableTracking();

    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  // GitHub actions has injection for each page that ensures that Google
  // Analytics knows to enable/disable tracking based on the state of
  // localStorage.cookiesEnabled.
  const disableTracking = () => {
    // Remove all existing cookies
    document.cookie.split(";").forEach(function (c) {
      const cookieName = c.split("=")[0].trim();
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    });
  };

  // Hide the popup if cookie consent is already given
  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (cookieConsent === "true") {
      setIsVisible(false);
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
      >
        <p className="text-left">
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
