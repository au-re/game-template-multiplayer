import React from "react";
import { MainMenu } from "./components/MainMenu/MainMenu";
import Lobby from "./scenes/Lobby";
import { phaserConfig } from "./config";
import { GameStateWrapper } from "./contexts/GameStateContext";

const game = new Phaser.Game({ ...phaserConfig, scene: [Lobby] });

export function App() {
  return (
    <GameStateWrapper game={game}>
      <MainMenu />
    </GameStateWrapper>
  );
}
