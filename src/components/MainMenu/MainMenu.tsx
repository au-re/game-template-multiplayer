import React, { useContext } from "react";
import { GameStateContext } from "../../contexts/GameStateContext";
import { useAnonAuth } from "../../hooks/useAnonAuth";
import { GameStatus } from "../../typings";

export function LoggedInMenu({ uid }: { uid: string }) {
  const { createGame, joinGame } = useContext(GameStateContext);
  const [gameIdInput, setGameIdInput] = React.useState();
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

export function LobbyMenu({ gameId }: { gameId: string }) {
  const { leaveGame, startGame, gameState } = useContext(GameStateContext);
  const { status } = gameState;
  return (
    <div>
      <label>LOBBY</label>
      <label>
        gameId
        <input readOnly value={gameId} />
      </label>
      <button onClick={leaveGame}>leave game</button>
      {status === GameStatus.LOBBY && <button onClick={startGame}>Start game</button>}
    </div>
  );
}

export function InGameMenu({ gameId }: { gameId: string }) {
  const { gameState } = useContext(GameStateContext);
  return (
    <>
      <label>IN GAME</label>
      <label>
        gameId
        <input readOnly value={gameId} />
      </label>
      <label>{gameState.timer}</label>
    </>
  );
}

export function MainMenu() {
  const { localState, gameState } = useContext(GameStateContext);
  const { isLoading } = useAnonAuth();
  const { gameId, uid, isAuthenticated } = localState;
  const { status } = gameState;
  return (
    <div style={{ position: "absolute" }}>
      <h1>Placeholder Game Title</h1>
      {isLoading && <div>loading...</div>}
      {!isLoading && !gameId && isAuthenticated && <LoggedInMenu uid={uid} />}
      {gameId && status === GameStatus.LOBBY && <LobbyMenu gameId={gameId} />}
      {gameId && status === GameStatus.IN_GAME && <InGameMenu gameId={gameId} />}
    </div>
  );
}
