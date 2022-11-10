import React, { useContext } from "react";
import { GameStateContext } from "../../contexts/GameStateContext";
import { useAnonAuth } from "../../hooks/useAnonAuth";

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
  const { leaveGame } = useContext(GameStateContext);
  return (
    <div>
      <label>
        gameId
        <input readOnly value={gameId} />
      </label>
      <button onClick={leaveGame}>leave game</button>
    </div>
  );
}

export function MainMenu() {
  const { localState } = useContext(GameStateContext);
  const { isLoading } = useAnonAuth();
  const { gameId, uid, isAuthenticated } = localState;
  return (
    <div style={{ position: "absolute" }}>
      <h1>Placeholder Game Title</h1>
      {isLoading && <div>loading...</div>}
      {!isLoading && !gameId && isAuthenticated && <LoggedInMenu uid={uid} />}
      {gameId && <LobbyMenu gameId={gameId} />}
    </div>
  );
}
