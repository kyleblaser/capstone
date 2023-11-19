/** @format */

import React from "react";
import "./Shop.scss";

function Shop({ onBuyItem }) {
  return (
    <div className="shop-container">
      <div className="shop-container__shoptitle">
        <h2>Shop</h2>
        <div>
          <button onClick={() => onBuyItem("strength")}>Strength</button>
          <button onClick={() => onBuyItem("armor")}>Armor</button>
          <button onClick={() => onBuyItem("leech")}>Leech</button>
        </div>
      </div>
    </div>
  );
}

export default Shop;
