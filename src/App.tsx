import React from "react";
import { MainMenu } from "./components/MainMenu/MainMenu";
import Lobby from "./scenes/Lobby";
import { phaserConfig } from "./config";
import { GameStateWrapper } from "./contexts/GameStateContext";

export function App() {
  return (
    <GameStateWrapper config={{ ...phaserConfig, scene: [Lobby] }}>
      <MainMenu />
    </GameStateWrapper>
  );
}
