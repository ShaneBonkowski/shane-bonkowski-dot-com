"use client"; // Enables client-side rendering.. Required for using useState

import React, { useState, useEffect } from "react";
import Link from "next/link";

import YesNoBox from "@/src/components/YesNoBox";

const CookieAgreement: React.FC = () => {
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
    // Remove existing tracking scripts (e.g., Google Analytics)
    document
      .querySelectorAll('script[src^="https://www.google-analytics.com"]')
      .forEach((script) => {
        script.remove();
      });

    // Remove all existing cookies
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  };

  return (
    isVisible && (
      <YesNoBox
        yesButtonText="Enable"
        noButtonText="Disable"
        onYes={enableCookies}
        onNo={disableCookies}
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
