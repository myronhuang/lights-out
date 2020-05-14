import React, { Component } from "react";
import Board from "./Board";
import shortid from 'shortid';
import "./App.css";

/** Simple app that just shows the LightsOut game. */

class App extends Component {
  render() {
    return (
      <div className='App'>
        <div className='App-board'>
          <Board key={shortid.generate()}/>
        </div>
      </div>
    );
  }
}

export default App;
