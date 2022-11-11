import React from "react";
import { MainMenu } from "./components/MainMenu/MainMenu";
import { GameStateWrapper } from "./contexts/GameStateContext";

export function GameUI({ game }: { game: Phaser.Game }) {
  return (
    <GameStateWrapper game={game}>
      <MainMenu />
    </GameStateWrapper>
  );
}
