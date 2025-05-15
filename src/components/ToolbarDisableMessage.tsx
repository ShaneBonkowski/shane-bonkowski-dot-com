import React, { useState, useEffect } from "react";

const ToolbarDisableMessage: React.FC = () => {
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);

  useEffect(() => {
    const checkToolbarVisibility = () => {
      if (window.visualViewport) {
        setIsToolbarVisible(window.innerHeight > window.visualViewport.height);
      }
    };

    // Check on load
    checkToolbarVisibility();

    // Listen for resize events to detect changes
    window.visualViewport?.addEventListener("resize", checkToolbarVisibility);

    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        checkToolbarVisibility
      );
    };
  }, []);

  // Don't render anything if the toolbar is not visible
  if (!isToolbarVisible) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 flex justify-center w-full"
      style={{ zIndex: 1000 }}
    >
      <p className="w-[60vw] text-center my-0 py-5">
        The toolbar is visible! Disable it to fully experience the app.
      </p>
    </div>
  );
};

export default ToolbarDisableMessage;
