import React, { useContext, useState } from "react";
import { startGame } from "../../actions";
import { gameTitle } from "../../constants";
import { GameStatus } from "../../typings";
import { GameStateContext } from "../contexts/GameStateContext";
import { useKeypress } from "../hooks/useKeypress";
import { Button } from "./Button";
import { GameTitle, Label, Menu, Spacer } from "./Menu";

export function LobbyMenu() {
  const [showMenu, setMenuVisible] = useState(true);
  const { leaveGame, localState, gameState } = useContext(GameStateContext);
  const { host, status } = gameState;
  const { gameId, uid } = localState;
  const isHost = uid === host;
  const showLobbyMenu = showMenu && gameId && status === GameStatus.LOBBY;
  
  useKeypress("Escape", () => {
    setMenuVisible(!showMenu)
  })
  
  if (!showLobbyMenu) return null;
  
  return (
    <Menu>
      <GameTitle>{gameTitle}</GameTitle>
      <Spacer />
      <h3>LOBBY</h3>
      <Spacer />
      <Label>Game ID</Label>
      <div style={{ textAlign: "left" }}>{gameId}</div>
      <Spacer />
      <Button onClick={leaveGame}>leave game</Button>
      {isHost && <Button onClick={() => startGame(gameId)}>Start game</Button>}
    </Menu>
  );
}
