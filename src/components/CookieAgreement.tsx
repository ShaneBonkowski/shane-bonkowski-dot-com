"use client"; // Enables client-side rendering.. Required for using useState

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import YesNoBox from "@/src/components/YesNoBox";

const CookieAgreement: React.FC = () => {
  const pathname = usePathname();
  const isGamesPath = pathname.startsWith("/games");
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // Hide the popup if cookie consent is already given
  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (cookieConsent === "true") {
      setIsVisible(false);
    }
  }, []);

  const enableCookies = () => {
    console.log("Cookies enabled");
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  const disableCookies = () => {
    console.log("Cookies disabled");
    localStorage.setItem("cookieConsent", "false");
    setIsVisible(false);
    disableTracking();
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
