/** @format */

import React from "react";
import "./Player.scss";
import HealthBar from "./Healthbar";

function Player({ player }) {
  const playerImage = `${process.env.REACT_APP_SERVER_URL}/images/player/player1.gif`;

  return (
    <div className="player-stats">
      <HealthBar currentHealth={player.health} maxHealth={player.maxHealth} />
      <img
        src={playerImage}
        alt="Player"
        style={{ width: "200px", height: "200px" }}
      />
      <li>Health: {player.health}</li>
      <li>Strength: {player.strength}</li>
      <li>Leech: {player.leech}</li>
      <li>Armor: {player.armor}</li>
      <li>Gold: {player.gold}</li>
    </div>
  );
}

export default Player;
