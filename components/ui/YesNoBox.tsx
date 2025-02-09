import React from "react";

export interface YesNoBoxProps {
  children: React.ReactNode;
  yesButtonText: string;
  noButtonText: string;
  onYes: () => void;
  onNo: () => void;
  bottomRight?: boolean;
}

const YesNoBox: React.FC<YesNoBoxProps> = ({
  children,
  yesButtonText,
  noButtonText,
  onYes,
  onNo,
  bottomRight = false,
}) => {
  return (
    <div
      className={`fixed ${
        bottomRight ? "bottom-0 right-0" : "bottom-0 left-0 right-0"
      } bg-info-banner-bkg-color text-body text-primary-text-color p-common-p sm:p-common-p-sm z-50 ${
        bottomRight ? "w-full sm:w-auto" : "w-full"
      }`}
    >
      <div
        className={`flex flex-col gap-x-4 sm:flex-row justify-between items-center`}
      >
        <div>{children}</div>
        <div className="flex justify-center sm:justify-end space-x-2">
          <button
            onClick={onYes}
            className="bg-button-color text-body px-6 py-2 rounded hover:bg-secondary-hover-color active:bg-secondary-hover-color"
          >
            {yesButtonText}
          </button>
          <button
            onClick={onNo}
            className="bg-button-color text-body px-6 py-2 rounded hover:bg-secondary-hover-color active:bg-secondary-hover-color"
          >
            {noButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default YesNoBox;
