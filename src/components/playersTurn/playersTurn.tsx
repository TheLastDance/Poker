import React from "react";
import { observer } from "mobx-react-lite";
import rootStore from "../../mobX";
import { IBot } from "../../types";

interface IItem {
  item: IBot;
  maxBet: number;
}


const PlayersTurn: React.FC<IItem> = ({ item, maxBet }) => {
  const { gameStore: { handleCall, handleCheck, handleFold, handleRaise } } = rootStore;
  const { gameStore } = rootStore;
  console.log(item.bet === maxBet);

  return (
    <div className="turn_buttons">
      <div>
        <button type="button" onClick={handleFold}>fold</button>
        {item.bet === maxBet ? <button type="button" onClick={handleCheck}>check</button> :
          <button type="button" onClick={handleCall}>call</button>}
      </div>
    </div>
  );
}

export default PlayersTurn;