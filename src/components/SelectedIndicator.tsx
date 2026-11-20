/* eslint-disable no-restricted-syntax -- Presentational component without browser APIs. */
import React from "react";

interface SelectedIndicatorProps {
  className?: string;
}

const SelectedIndicator: React.FC<SelectedIndicatorProps> = ({
  className = "",
}) => (
  <span
    aria-hidden="true"
    className={`absolute bg-green-500 text-white ${className}`}
  >
    &#10003;
  </span>
);

export default SelectedIndicator;
