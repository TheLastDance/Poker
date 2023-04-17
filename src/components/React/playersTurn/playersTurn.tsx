import React from "react";
import rootStore from "../../../mobX";
import { IPlayer, TurnsEnum } from "../../../types";
import gameStore from "../../../mobX/gameStore";
import { action } from "mobx";

interface IItem {
  item: IPlayer;
  maxBet: number;
  playerRaiseAmount: number;
}

const { allIn } = TurnsEnum;

const PlayersTurn: React.FC<IItem> = ({ item, maxBet, playerRaiseAmount }) => {
  const { gameStore: { handleCall, handleCheck, handleFold, handleRaiseInput, handleRaise, handleAllIn } } = rootStore;
  console.log(item.bet === maxBet);

  return (
    <div className="turn_buttons">
      <div>
        <button type="button" onClick={handleFold}>fold</button>
        {item.bet === maxBet && item.turn !== allIn ?
          <button type="button" onClick={handleCheck}>check</button> :
          item.stack + item.bet > gameStore.maxBet ? <button type="button" onClick={handleCall}>call</button> : null}
        {item.stack + item.bet > gameStore.maxBet + 1 ? <> <label htmlFor="raise">{playerRaiseAmount}$</label>
          <input
            id="raise"
            type="range"
            min={maxBet - item.bet + 1}
            max={item.stack}
            value={playerRaiseAmount}
            onChange={(e) => handleRaiseInput(e)}
          />
          <button type="button" onClick={handleRaise} >raise</button></> :
          <button type="button" onClick={handleAllIn}>All-In</button>}
      </div>
    </div>
  );
}

export default PlayersTurn;