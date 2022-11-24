import React from "react";
import { GameOver } from "./components/GameOver";
import { InGameMenu } from "./components/InGameMenu";
import { InGameOverlay } from "./components/InGameOverlay";
import { LobbyMenu } from "./components/LobbyMenu";
import { LoggedInMenu } from "./components/LoggedInMenu";
import { GameStateWrapper } from "./contexts/GameStateContext";

export function GameUI({ game }: { game: Phaser.Game }) {
  return (
    <GameStateWrapper game={game}>
      <LoggedInMenu />
      <LobbyMenu />
      <GameOver />
      <InGameMenu />
      <InGameOverlay />
    </GameStateWrapper>
  );
}
