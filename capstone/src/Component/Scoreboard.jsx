/** @format */

import React from "react";
import "./Scoreboard.scss";

function Scoreboard({ monsterCount, highScore }) {
  return (
    <div className="scoreboard-container">
      <h2>BrainPower</h2>
      <p>Monsters Defeated: {monsterCount}</p>
      <p>High Score: {highScore}</p>
    </div>
  );
}

export default Scoreboard;
