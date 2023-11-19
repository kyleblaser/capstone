/** @format */

import React from "react";
import "./Gameover.scss";

function GameOver({ score, onRestart }) {
  return (
    <div className="game-over-screen">
      <h1>Game Over</h1>
      <p>You defeated {score} monsters!</p>
      <button onClick={onRestart}>Try Again</button>
    </div>
  );
}

export default GameOver;
