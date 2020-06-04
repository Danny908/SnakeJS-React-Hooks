import React, { useState } from "react";

import "./App.scss";
import Menu from "./menu/Menu";
import GameBoard from "./game-board/GameBoard";

function App() {
  const [screen, setScreen] = useState("menu");
  const [score, setScore] = useState(0);

  // Menu options
  const screens = {
    MENU: "MENU",
    NEW_GAME: "NEW GAME",
  };
  // Update score
  const updateScore = (s) => {
    setScore((score) => score + s);
  };

  const updateScreen = (val) => {
    setScreen(val);
  };

  const getScreen = () => {
    switch (screen) {
      case screens.MENU:
        return <Menu onUpdateScreen={updateScreen} idMenu={screens.NEW_GAME} />;
      case screens.NEW_GAME:
        return (
          <GameBoard
            onScore={updateScore}
            onUpdateScreen={updateScreen}
            idMenu={screens.MENU}
          />
        );
      default:
        return <Menu onUpdateScreen={updateScreen} idMenu={screens.NEW_GAME} />;
    }
  };

  return (
    <div className="App">
      <h1>{screen === screens.NEW_GAME ? `SCORE: ${score}` : "SNAKE JS"}</h1>
      {getScreen()}
    </div>
  );
}

export default App;
