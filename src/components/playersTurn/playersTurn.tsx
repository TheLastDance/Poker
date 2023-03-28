import React from "react";
import { observer } from "mobx-react-lite";
import rootStore from "../../mobX";
import { IBot } from "../../types";

interface IItem {
  item: IBot;
}


const PlayersTurn: React.FC<IItem> = observer(({ item }) => {
  const { gameStore: { handleCall, handleCheck, handleFold } } = rootStore;

  return (
    <div className="turn_buttons">
      <div>
        <button type="button" onClick={handleCall}>call</button>
        <button type="button" onClick={handleFold}>fold</button>
        <button type="button" onClick={handleCheck}>check</button>
      </div>
    </div>
  );
})

export default PlayersTurn;