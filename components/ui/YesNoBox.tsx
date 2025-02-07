import React from "react";

import { YesNoBoxProps } from "@/types/YesNoBox";

const YesNoBox: React.FC<YesNoBoxProps> = ({
  children,
  yesButtonText,
  noButtonText,
  onYes,
  onNo,
}) => {
  return (
    <div className="fixed flex justify-center items-center gap-4 bottom-0 left-0 right-0 bg-info-banner-bkg-color text-body text-primary-text-color p-common-p sm:p-common-p-sm z-50">
      <div className="flex flex-col">
        <div className="flex">{children}</div>
        <div className="flex justify-center space-x-2">
          <button
            onClick={onYes}
            className="bg-button-color px-4 py-2 rounded hover:bg-secondary-hover-color"
          >
            {yesButtonText}
          </button>
          <button
            onClick={onNo}
            className="bg-button-color px-4 py-2 rounded hover:bg-secondary-hover-color"
          >
            {noButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default YesNoBox;
