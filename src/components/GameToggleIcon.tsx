/* eslint-disable no-restricted-syntax -- Presentational component without browser APIs. */
import React from "react";

interface GameToggleIconProps {
  icon: React.ReactNode;
  isActive: boolean;
}

const GameToggleIcon: React.FC<GameToggleIconProps> = ({ icon, isActive }) => (
  <span className={`inline-flex ${isActive ? "text-link-color" : ""}`}>
    {icon}
  </span>
);

export default GameToggleIcon;
