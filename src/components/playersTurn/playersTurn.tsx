import React from "react";
import rootStore from "../../mobX";
import { IPlayer } from "../../types";

interface IItem {
  item: IPlayer;
  maxBet: number;
  playerRaiseAmount: number;
}

const PlayersTurn: React.FC<IItem> = ({ item, maxBet, playerRaiseAmount }) => {
  const { gameStore: { handleCall, handleCheck, handleFold, handleRaiseInput, handleRaise } } = rootStore;
  console.log(item.bet === maxBet);

  return (
    <div className="turn_buttons">
      <div>
        <button type="button" onClick={handleFold}>fold</button>
        {item.bet === maxBet ? <button type="button" onClick={handleCheck}>check</button> :
          <button type="button" onClick={handleCall}>call</button>}
        <label htmlFor="raise">{playerRaiseAmount}$</label>
        <input
          id="raise"
          type="range"
          min={maxBet + 1}
          max={item.stack}
          value={playerRaiseAmount}
          onChange={(e) => handleRaiseInput(e)}
        />
        <button type="button" onClick={handleRaise} >raise</button>
      </div>
    </div>
  );
}

export default PlayersTurn;