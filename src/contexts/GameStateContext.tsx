import React from "react";
import { doc, setDoc, onSnapshot, deleteField } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { GameState, GameStatus } from "../typings";
import { db } from "../firebase";

interface LocalState {
  isAuthenticated: boolean;
  gameId: string;
  uid: string;
}

const initialLocalState = {
  isAuthenticated: false,
  uid: "",
  gameId: "",
};

export const GameStateContext = React.createContext({
  localState: initialLocalState,
  gameState: { players: {} },
  createGame: () => {},
  joinGame: (gameId: string) => {},
  leaveGame: () => {},
  startGame: () => {},
});

export function GameStateWrapper({ children, game }: any) {
  const [localState, setLocalState] = React.useState<LocalState>(initialLocalState);
  const [gameState, setGameState] = React.useState<GameState>({
    host: "",
    players: {},
    timer: 20000,
    status: GameStatus.IN_GAME,
  });

  // subscribe to auth events
  React.useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLocalState({ ...localState, uid: user.uid, isAuthenticated: true });
      } else {
        setLocalState({ ...localState, uid: "", isAuthenticated: false });
      }
    });
    return () => unsub();
  }, []);

  // if we have joined a game, subscribe to the game state
  React.useEffect(() => {
    if (localState.gameId) {
      const unsub = onSnapshot(doc(db, "games", localState.gameId), (doc) => {
        setGameState(doc.data() as GameState);
      });
      return () => unsub();
    }
  }, [localState.gameId]);

  // we pass the game state down to phaser
  React.useEffect(() => {
    if (!game) return;
    const payload = {
      uid: localState.uid,
      gameId: localState.gameId,
      players: gameState.players || {},
      timer: gameState.timer,
    };
    game?.scene.keys.Lobby?.events.emit("game_data", payload);
  }, [game, gameState, localState.gameId]);

  // actions
  async function createGame() {
    const uid = getAuth().currentUser?.uid;
    if (!uid) return;
    const initialGameState: GameState = {
      host: uid,
      timer: 20000,
      status: GameStatus.LOBBY,
      players: {
        [uid]: {
          xPos: 140,
          yPos: 140,
          isInverted: false,
        },
      },
    };
    await setDoc(doc(db, "games", uid), initialGameState);
    setLocalState({ ...localState, gameId: uid });
  }

  async function joinGame(gameId: string) {
    const uid = getAuth().currentUser?.uid;
    if (uid) {
      await setDoc(
        doc(db, "games", gameId),
        {
          players: {
            [uid]: {
              xPos: 140,
              yPos: 140,
              isInverted: false,
            },
          },
        },
        { merge: true }
      );
      setLocalState({ ...localState, gameId });
    }
  }

  async function leaveGame() {
    const uid = getAuth().currentUser?.uid;
    if (uid) {
      await setDoc(
        doc(db, "games", localState.gameId),
        {
          players: { [uid]: deleteField() },
        },
        { merge: true }
      );
      setLocalState({ ...localState, gameId: "" });
    }
  }

  async function startGame() {
    const uid = getAuth().currentUser?.uid;
    if (uid) {
      await setDoc(
        doc(db, "games", localState.gameId),
        {
          status: GameStatus.IN_GAME,
        },
        { merge: true }
      );
    }
  }

  return (
    <GameStateContext.Provider
      value={{
        localState,
        gameState,
        createGame,
        leaveGame,
        joinGame,
        startGame,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}
