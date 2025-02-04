"use client"; // Enables client-side rendering.. Required for using useState

import React, { useState, useEffect } from "react";
import Link from "next/link";

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

    // Reload the page to ensure changes take effect and Google Analytics
    // can be re-initialized with the latest changes to localStorage.cookiesEnabled.
    window.location.reload();
  };

  return (
    isVisible && (
      <div className="fixed bottom-0 left-0 right-0 bg-info-banner-background-color text-body text-text-color p-4 flex justify-between items-center z-50">
        <p className="flex-1">
          This website uses cookies to ensure you get the best experience. By
          continuing to use this site, you accept our use of cookies.{" "}
          <Link href="/cookie-policy" className="link">
            Learn more about our cookie policy here.
          </Link>
        </p>
        <div className="flex space-x-4">
          <button
            onClick={enableCookies}
            className="bg-button-color px-4 py-2 rounded hover:bg-hover-color"
          >
            Enable Cookies
          </button>
          <button
            onClick={disableCookies}
            className="bg-button-color px-4 py-2 rounded hover:bg-hover-color"
          >
            Disable Cookies
          </button>
        </div>
      </div>
    )
  );
};

export default CookieAgreement;
