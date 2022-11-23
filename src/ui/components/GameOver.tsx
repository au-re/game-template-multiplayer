import React, { useContext } from "react";
import { GameStateContext } from "../contexts/GameStateContext";
import { Button } from "./Button";
import { GameTitle, Menu, Spacer } from "./Menu";

export function GameOver() {
  const { leaveGame, gameState, localState } = useContext(GameStateContext);
  const { gameId } = localState;
  const { gameOver } = gameState;
  if (!gameId || !gameOver) return null;
  return (
    <Menu>
      <GameTitle>Game Over!</GameTitle>
      <Spacer />
      <Button onClick={leaveGame}>leave game</Button>
    </Menu>
  );
}
