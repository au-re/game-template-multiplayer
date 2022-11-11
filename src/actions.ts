import { getAuth } from "firebase/auth";
import { deleteField, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { GameState, GameStatus, PlayerState } from "./typings";

export const gameCollectionId = "games";

export function listenToGameStateUpdates(gameId: string, onChange: (gameState: GameState) => void) {
  const unsub = onSnapshot(doc(db, gameCollectionId, gameId), (doc) => {
    onChange(doc.data() as GameState);
  });
  return unsub;
}

export async function createGame(gameId: string) {
  const uid = getAuth().currentUser?.uid;
  if (!uid || !gameId) return;
  await setDoc(doc(db, gameCollectionId, gameId), {
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
  });
}

export async function joinGame(gameId: string) {
  const uid = getAuth().currentUser?.uid;
  if (!uid || !gameId) return;

  // TODO: check if the game already exists

  await setDoc(
    doc(db, gameCollectionId, gameId),
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
}

export async function leaveGame(gameId: string) {
  const uid = getAuth().currentUser?.uid;
  if (!uid || !gameId) return;
  console.log("leaveGame");
  await setDoc(doc(db, gameCollectionId, gameId), { players: { [uid]: deleteField() } }, { merge: true });
}

export async function startGame(gameId: string) {
  const uid = getAuth().currentUser?.uid;
  if (!uid || !gameId) return;
  await setDoc(doc(db, gameCollectionId, gameId), { status: GameStatus.IN_GAME }, { merge: true });
}

export async function updatePlayerState(gameId: string, player: PlayerState) {
  const uid = getAuth().currentUser?.uid;
  if (!uid || !gameId) return;
  await setDoc(doc(db, gameCollectionId, gameId), { players: { [uid]: player } }, { merge: true });
}

export async function updateTimerState(gameId: string, timer: number) {
  await setDoc(doc(db, gameCollectionId, gameId), { timer }, { merge: true });
}
