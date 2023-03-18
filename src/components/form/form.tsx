import React from "react";
import { observer } from "mobx-react-lite";
import rootStore from "../../mobX";
import './form.scss';

const Form: React.FC = observer(() => {
  const { formStore: { changeName, name, start, opponents, chooseOpponents } } = rootStore;

  return (
    <div className="form">
      <h1>Welcome to texas holdem poker</h1>
      <form onSubmit={(e) => start(e)}>
        <label htmlFor="players_name">Enter your name:</label>
        <input
          id="players_name"
          placeholder="Anonymous"
          type="text"
          required={true}
          value={name}
          onChange={(e) => changeName(e)}
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
        </select>
        <button type="submit">START</button>
      </form>
    </div>
  );
})

export default Form;