import React, { useContext } from "react";
import styled from "styled-components";
import { GameStatus } from "../../typings";
import { GameStateContext } from "../contexts/GameStateContext";

const Timer = styled.div`
  margin-top: 2rem;
  font-size: 1.4rem;
  color: white;
  position: absolute;
  text-align: center;
  width: 280px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
`;

export function InGameOverlay() {
  const { gameState, localState } = useContext(GameStateContext);
  const { status } = gameState;
  const { gameId } = localState;
  const showInGameOverlay = gameId && status === GameStatus.IN_GAME;

  if (!showInGameOverlay) return null;

  return (
    <>
      <Timer>{gameState.timer}</Timer>
    </>
  );
}
