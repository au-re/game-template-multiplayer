import { getAuth } from "firebase/auth";
import { deleteField, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { DanceFloorState, GameState, GameStatus, PlayerDirection, PlayerState } from "./typings";

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
    grid: { players: {} },
    players: {
      [uid]: {
        xPos: 140,
        yPos: 140,
        direction: PlayerDirection.RIGHT,
      },
    },
  } as Partial<GameState>);
}

export async function joinGame(gameId: string) {
  const uid = getAuth().currentUser?.uid;
  if (!uid || !gameId) return;

  // only join a game if the game exists and is currently in the lobby
  const game = await getDoc(doc(db, gameCollectionId, gameId));
  if (!game.exists() || !game.data()?.status || game.data().status != GameStatus.LOBBY) {
    throw new Error("CANNOT_CONNECT_TO_GAME");
  }

  await setDoc(
    doc(db, gameCollectionId, gameId),
    {
      players: {
        [uid]: {
          xPos: 140,
          yPos: 140,
          direction: PlayerDirection.RIGHT,
        },
      },
    } as Partial<GameState>,
    { merge: true }
  );
}

export async function leaveGame(gameId: string) {
  const uid = getAuth().currentUser?.uid;
  if (!uid || !gameId) return;
  // TODO: reset the game if the host left
  await setDoc(
    doc(db, gameCollectionId, gameId),
    { grid: { players: { [uid]: deleteField() } }, players: { [uid]: deleteField() } },
    { merge: true }
  );
}

export async function startGame(gameId: string) {
  const uid = getAuth().currentUser?.uid;
  if (!uid || !gameId) return;
  await setDoc(doc(db, gameCollectionId, gameId), { status: GameStatus.IN_GAME }, { merge: true });
}

export async function syncPlayerState(gameId: string, player: Partial<PlayerState>) {
  const uid = getAuth().currentUser?.uid;
  if (!uid || !gameId) return;
  await setDoc(doc(db, gameCollectionId, gameId), { players: { [uid]: player } }, { merge: true });
}

export async function updateTimerState(gameId: string, timer: number) {
  await setDoc(doc(db, gameCollectionId, gameId), { timer }, { merge: true });
}

export async function updatePlayerGridPos(gameId: string, playerId: string, xPos: number, yPos: number) {
  const uid = getAuth().currentUser?.uid;
  if (!uid || !gameId) return;
  await setDoc(
    doc(db, gameCollectionId, gameId),
    { grid: { players: { [playerId]: { xPos, yPos } } } },
    { merge: true }
  );
}

export async function setGameOver(gameId: string) {
  await setDoc(doc(db, gameCollectionId, gameId), { gameOver: true }, { merge: true });
}

export async function setDanceFloor(gameId: string, danceFloor: DanceFloorState) {
  await setDoc(doc(db, gameCollectionId, gameId), { danceFloor }, { merge: true });
}
