import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import React from "react";
import { createGame, joinGame, leaveGame } from "../../actions";
import { GameEvents } from "../../constants";
import { db } from "../../firebase";
import { GameState, GameStatus, LocalState } from "../../typings";

const initialLocalState = {
  isAuthenticated: false,
  uid: "",
  gameId: "",
};

const initialGameState = {
  host: "",
  players: {},
  timer: 0,
  status: GameStatus.LOBBY,
};

const initalContext = {
  localState: initialLocalState,
  gameState: initialGameState,
  createGame: () => {},
  joinGame: (gameId: string) => {},
  leaveGame: () => {},
};

/**
 * Keep track of the game and auth states for the UI
 *
 */
export const GameStateContext = React.createContext(initalContext);

export function GameStateWrapper({ children, game }: any) {
  const [localState, setLocalState] = React.useState<LocalState>(initialLocalState);
  const [gameState, setGameState] = React.useState<GameState>(initialGameState);

  // subscribe to auth events
  React.useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      setLocalState({ ...localState, uid: user ? user.uid : "", isAuthenticated: !!user });
    });
    return () => unsub();
  }, []);

  // subscribe to the game state
  React.useEffect(() => {
    if (localState.gameId) {
      const unsub = onSnapshot(doc(db, "games", localState.gameId), (doc) => {
        setGameState(doc.data() as GameState);
      });
      return () => unsub();
    }
  }, [localState.gameId]);

  // on local state changes, pass the state down to phaser
  React.useEffect(() => {
    game?.scene.keys.Lobby?.events.emit(GameEvents.LOCAL_STATE_UPDATE, localState);
  }, [game, localState]);

  // actions that update the local state
  async function _createGame() {
    const uid = getAuth().currentUser?.uid;
    if (!uid) return;
    setLocalState({ ...localState, gameId: uid });
    await createGame(uid);
  }

  async function _joinGame(gameId: string) {
    setLocalState({ ...localState, gameId });
    await joinGame(gameId);
  }

  async function _leaveGame() {
    setLocalState({ ...localState, gameId: "" });
    await leaveGame(localState.gameId);
  }
  // --

  return (
    <GameStateContext.Provider
      value={{
        localState,
        gameState,
        createGame: _createGame,
        leaveGame: _leaveGame,
        joinGame: _joinGame,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}
