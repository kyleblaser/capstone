/** @format */

import React from "react";
import "./Monster.scss";
import HealthBar from "./Healthbar";

function Monster({ monster }) {
  const monsterImage = `${process.env.REACT_APP_SERVER_URL}/images/monster/monster1.gif`;

  return (
    <div className="monster-stats">
      <HealthBar currentHealth={monster.health} maxHealth={monster.maxHealth} />
      <img
        src={monsterImage}
        alt="Monster"
        style={{ width: "200px", height: "200px" }}
      />
      <li>Health: {monster.health}</li>
      <li>Damage: {monster.damage}</li>
    </div>
  );
}

export default Monster;
