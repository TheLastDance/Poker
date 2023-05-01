import React from "react";
import { observer } from "mobx-react-lite";
import rootStore from "../../../mobX";
import './form.scss';

const Form: React.FC = observer(() => {
  const { formStore: { changeName, name, start, opponents, chooseOpponents, playerBank, chooseBank } } = rootStore;

  return (
    <div className="form_container">
      <h1>{`Texas Hold'em Poker`}</h1>
      <form onSubmit={(e) => start(e)}>
        <div className="form_inputs">
          <label htmlFor="players_name">Enter your name:</label>
          <input
            maxLength={15}
            id="players_name"
            placeholder="Anonymous"
            type="text"
            required={true}
            value={name}
            onChange={(e) => changeName(e)}
          />
          <label htmlFor="players_bank">Select players stack: {playerBank}$</label>
          <input
            id="players_bank"
            type="range"
            min={'100'}
            max={'10000'}
            value={playerBank}
            onChange={(e) => chooseBank(e)}
          />
          <label htmlFor="players_number">Number of opponents:</label>
          <select
            name="players_number"
            id="players_number"
            value={opponents}
            onChange={(e) => chooseOpponents(e)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>
        <button type="submit">START</button>
      </form>
    </div>
  );
})

export default Form;