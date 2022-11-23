import React from "react";
import { GameOver } from "./components/GameOver";
import { LoggedInMenu } from "./components/LoggedInMenu";
import { InGameMenu } from "./components/InGameMenu";
import { GameStateWrapper } from "./contexts/GameStateContext";
import { LobbyMenu } from "./components/LobbyMenu";

export function GameUI({ game }: { game: Phaser.Game }) {
  return (
    <GameStateWrapper game={game}>
      <LoggedInMenu />
      <LobbyMenu />
      <GameOver />
      <InGameMenu />
    </GameStateWrapper>
  );
}
