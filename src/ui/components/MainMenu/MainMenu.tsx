import React, { useContext } from "react";
import { GameStateContext } from "../../contexts/GameStateContext";
import { useAnonAuth } from "../../hooks/useAnonAuth";
import { GameStatus } from "../../../typings";
import { startGame } from "../../../actions";
import { Button } from "../Button/Button";
import styled from "styled-components";
import { Input } from "../Input/Input";
import { Menu } from "../Menu/Menu";

export const GameTitle = styled.h1`
  text-align: center;
  font-size: 48px;
  font-weight: 600;
  font-family: "Rubik", sans-serif;
`;

export const Label = styled.label`
  font-size: 12px;
  display: flex;
  font-weight: 600;
`;

export const Spacer = styled.div`
  height: 2rem;
`;

export function LoggedInMenu() {
  const { createGame, joinGame, localState } = useContext(GameStateContext);
  const { uid } = localState;
  const [gameIdInput, setGameIdInput] = React.useState("");
  return (
    <div>
      <Label>player name</Label>
      <div style={{ textAlign: "left" }}>{uid}</div>
      <Spacer />
      <Label>
        <Input placeholder="enter gamecode" onChange={(e) => setGameIdInput(e.target.value)} />
        <Button disabled={!gameIdInput} onClick={() => joinGame(gameIdInput)}>
          join game
        </Button>
      </Label>
      <Spacer />
      <Button style={{ width: "100%" }} onClick={createGame}>
        create game
      </Button>
    </div>
  );
}

export function LobbyMenu() {
  const { leaveGame, localState, gameState } = useContext(GameStateContext);
  const { host } = gameState;
  const { gameId, uid } = localState;
  const isHost = uid === host;
  return (
    <div>
      <h3>LOBBY</h3>
      <Spacer />
      <Label>Game ID</Label>
      <div style={{ textAlign: "left" }}>{gameId}</div>
      <Spacer />
      <Button onClick={leaveGame}>leave game</Button>
      {isHost && <Button onClick={() => startGame(gameId)}>Start game</Button>}
    </div>
  );
}

export function InGameMenu() {
  const { leaveGame, gameState, localState } = useContext(GameStateContext);
  const { gameId } = localState;
  return (
    <>
      <h3>IN GAME</h3>
      <Spacer />
      <Label>Game ID</Label>
      <div style={{ textAlign: "left" }}>{gameId}</div>
      <Spacer />
      <div>{gameState.timer}</div>
      <Button onClick={leaveGame}>leave game</Button>
    </>
  );
}

export function MainMenu() {
  const { localState, gameState } = useContext(GameStateContext);
  const { isLoading } = useAnonAuth();
  const { gameId, isAuthenticated } = localState;
  const { status } = gameState;
  const showLoggedInMenu = !isLoading && !gameId && isAuthenticated;
  const showLobbyMenu = gameId && status === GameStatus.LOBBY;
  const showInGameMenu = gameId && status === GameStatus.IN_GAME;
  return (
    <Menu style={{ height: "100%" }}>
      <GameTitle>Game Template</GameTitle>
      <Spacer />
      {isLoading && <div>loading...</div>}
      {showLoggedInMenu && <LoggedInMenu />}
      {showLobbyMenu && <LobbyMenu />}
      {showInGameMenu && <InGameMenu />}
    </Menu>
  );
}
