import React, { useContext } from "react";
import { GameStateContext } from "../../contexts/GameStateContext";
import { useAnonAuth } from "../../hooks/useAnonAuth";
import { GameStatus } from "../../../typings";
import { startGame } from "../../../actions";

export function LoggedInMenu() {
  const { createGame, joinGame, localState } = useContext(GameStateContext);
  const { uid } = localState;
  const [gameIdInput, setGameIdInput] = React.useState("");
  return (
    <div>
      <label>
        player name
        <input readOnly value={uid} />
      </label>
      <label>
        <input onChange={(e) => setGameIdInput(e.target.value)} />
        <button onClick={() => joinGame(gameIdInput)}>join game</button>
      </label>
      <button onClick={createGame}>create game</button>
    </div>
  );
}

export function LobbyMenu() {
  const { leaveGame, localState } = useContext(GameStateContext);
  const { gameId } = localState;
  return (
    <div>
      <label>LOBBY</label>
      <label>
        gameId
        <input readOnly value={gameId} />
      </label>
      <button onClick={leaveGame}>leave game</button>
      <button onClick={() => startGame(gameId)}>Start game</button>
    </div>
  );
}

export function InGameMenu() {
  const { leaveGame, gameState, localState } = useContext(GameStateContext);
  const { gameId } = localState;
  return (
    <>
      <label>IN GAME</label>
      <label>
        gameId
        <input readOnly value={gameId} />
      </label>
      <label>{gameState.timer}</label>
      <button onClick={leaveGame}>leave game</button>
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
    <div style={{ position: "absolute" }}>
      <h1>Placeholder Game Title</h1>
      {isLoading && <div>loading...</div>}
      {showLoggedInMenu && <LoggedInMenu />}
      {showLobbyMenu && <LobbyMenu />}
      {showInGameMenu && <InGameMenu />}
    </div>
  );
}
