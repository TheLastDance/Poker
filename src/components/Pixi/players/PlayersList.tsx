import React from "react";
import rootStore from "../../../mobX";
import Player from "./Player";

const PlayerList: React.FC = () => {
  const { gameStore } = rootStore;
  const { players } = gameStore

  return (
    <>
      {players && players.map(item => <Player key={item.id} item={item} />)}
    </>
  )
}

export default PlayerList;