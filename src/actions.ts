import { doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "./firebase";
import { PlayerState } from "./typings";

export async function updatePlayerState(gameId: string, player: PlayerState) {
  const uid = getAuth().currentUser?.uid;
  if (!uid || !gameId) return;
  await setDoc(doc(db, "games", gameId), { players: { [uid]: player } }, { merge: true });
}

export async function updateTimerState(gameId: string, timer: number) {
  await setDoc(doc(db, "games", gameId), { timer: timer }, { merge: true });
}
