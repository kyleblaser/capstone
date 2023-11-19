/** @format */

import React, { useState, useEffect, useRef } from "react";
import Player from "./Player";
import Monster from "./Monster";
import Shop from "./Shop";
import GameOver from "./Gameover";
import Scoreboard from "./Scoreboard";
import "./Game.scss";

function Game() {
  const [player, setPlayer] = useState({
    health: 100,
    maxHealth: 100,
    strength: 10,
    leech: 0,
    armor: 0,
    gold: 0,
  });

  const [monster, setMonster] = useState({
    health: 50,
    maxHealth: 50,
    damage: 5,
  });

  const [monsterCount, setMonsterCount] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [combatLog, setCombatLog] = useState([]);

  const keyPressState = useRef({ 1: false, 2: false, 3: false, 4: false });
  const actionInterval = useRef(null);

  useEffect(() => {
    if (monsterCount > highScore) {
      setHighScore(monsterCount);
    }
  }, [monsterCount, highScore]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (keyPressState.current[event.key]) return;
      keyPressState.current[event.key] = true;

      switch (event.key) {
        case "1":
          actionInterval.current = setInterval(handleAttack, 500);
          break;
        case "2":
          actionInterval.current = setInterval(
            () => handleBuyItem("strength"),
            500
          );
          break;
        case "3":
          actionInterval.current = setInterval(
            () => handleBuyItem("armor"),
            500
          );
          break;
        case "4":
          actionInterval.current = setInterval(
            () => handleBuyItem("leech"),
            500
          );
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      keyPressState.current[event.key] = false;
      clearInterval(actionInterval.current);
      actionInterval.current = null;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(actionInterval.current);
    };
  }, []);

  function generateNewMonster() {
    let baseHealth = 50;
    let baseDamage = 5;
    const healthIncrement = 10;
    const damageIncrement = 2;
    const incrementMultiplier = Math.floor(monsterCount / 5);
    let newMaxHealth = baseHealth + healthIncrement * incrementMultiplier;

    return {
      health: newMaxHealth,
      maxHealth: newMaxHealth,
      damage: baseDamage + damageIncrement * incrementMultiplier,
    };
  }

  const rewardPlayerWithGold = (amount) => {
    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      gold: prevPlayer.gold + amount,
    }));
  };

  const logCombatEvent = async (event) => {
    try {
      await fetch(`${process.env.REACT_APP_SERVER_URL}/api/log-combat-event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error("Error logging combat event:", error);
    }
  };

  const handleAttack = () => {
    if (gameOver) {
      return;
    }

    const newMonsterHealth = monster.health - player.strength;
    const leechHealthGain = player.leech;
    const newPlayerHealth = Math.min(
      player.health - monster.damage + leechHealthGain,
      player.maxHealth
    );

    setPlayer({ ...player, health: newPlayerHealth });

    const combatEvent = {
      type: "attack",
      playerHealth: newPlayerHealth,
      monsterHealth: newMonsterHealth,
      damageDealt: player.strength,
      damageTaken: monster.damage,
    };

    setCombatLog((prevLog) => {
      const updatedLog = [...prevLog, combatEvent];
      return updatedLog.slice(-4);
    });

    logCombatEvent(combatEvent);

    if (newPlayerHealth <= 0) {
      setGameOver(true);
      return;
    }

    if (newMonsterHealth <= 0) {
      const rewardGold = 10;
      rewardPlayerWithGold(rewardGold);
      setMonster(generateNewMonster());
      setMonsterCount(monsterCount + 1);
    } else {
      setMonster({ ...monster, health: newMonsterHealth });
    }
  };

  const handleBuyItem = (item) => {
    if (player.gold >= 10) {
      let updatedPlayer = { ...player, gold: player.gold - 10 };

      let itemEffect = {};
      if (item === "strength") {
        updatedPlayer.strength = player.strength + 1;
        updatedPlayer.health = player.health + 5;
        updatedPlayer.maxHealth = player.maxHealth + 5;
        itemEffect = { strength: 1, health: 5, maxHealth: 5 };
      } else {
        updatedPlayer[item] = player[item] + 1;
        itemEffect = { [item]: 1 };
      }

      const shopEvent = {
        type: "shop",
        action: `Bought ${item}`,
        cost: 10,
        itemEffect: itemEffect,
      };

      setCombatLog((prevLog) => {
        const updatedLog = [...prevLog, shopEvent];
        return updatedLog.slice(-4);
      });

      logCombatEvent(shopEvent);

      setPlayer(updatedPlayer);
    }
  };

  const clearCombatLog = async () => {
    try {
      await fetch(`${process.env.REACT_APP_SERVER_URL}/api/clear-combat-log`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error clearing combat log:", error);
    }
  };

  const fetchCombatLog = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/combat-log`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCombatLog(data);
    } catch (error) {
      console.error("Error fetching combat log:", error);
    }
  };

  const onRestart = () => {
    clearCombatLog();
    setPlayer({
      health: 100,
      maxHealth: 100,
      strength: 10,
      leech: 0,
      armor: 0,
      gold: 0,
    });
    setMonster({
      health: 50,
      maxHealth: 50,
      damage: 5,
    });
    setMonsterCount(0);
    setGameOver(false);
  };

  return (
    <div
      className="game-container"
      style={{
        backgroundImage: `url(${process.env.REACT_APP_SERVER_URL}/images/backgrounds/background1.gif)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Scoreboard monsterCount={monsterCount} highScore={highScore} />
      {gameOver ? (
        <GameOver score={monsterCount} onRestart={onRestart} />
      ) : (
        <>
          <div className="middle">
            <Player player={player} />
            <Monster monster={monster} />
          </div>
          <div className="bottom">
            <button className="attack-button" onClick={handleAttack}>
              Attack
            </button>
            <div className="combat-log">
              <h3>Combat Log:</h3>
              <ul>
                {combatLog.map((entry, index) => (
                  <li key={index}>
                    {entry.type === "attack" && (
                      <>
                        Dmg: {entry.damageDealt}, Taken: {entry.damageTaken}
                      </>
                    )}
                    {entry.type === "shop" && (
                      <>
                        Shop: {entry.action}. Effects:{" "}
                        {Object.entries(entry.itemEffect)
                          .map(([key, value]) => `${key} +${value}`)
                          .join(", ")}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <Shop onBuyItem={handleBuyItem} />
          </div>
        </>
      )}
    </div>
  );
}

export default Game;
