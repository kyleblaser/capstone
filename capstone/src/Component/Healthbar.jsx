/** @format */

import React from "react";
import "./Healthbar.scss";

function HealthBar({ currentHealth, maxHealth }) {
  const healthPercentage = Math.max(0, (currentHealth / maxHealth) * 100);

  return (
    <div className="health-bar-container">
      <div
        className="health-bar"
        style={{ width: `${healthPercentage}%` }}
      ></div>
    </div>
  );
}

export default HealthBar;
